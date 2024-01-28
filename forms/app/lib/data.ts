'use server'

import getMongoClientPromise from '@/db/mongodb'
import { ObjectId } from 'mongodb'
import { unstable_noStore as noStore, revalidatePath } from 'next/cache'
import { UserWithForm, Form, InputResponse, Response, isInputsPage, InputsPage, isTextAreaPage, TextAreaPage, User, ResponseWithId, UserWithForms, isMultipleChoicePage } from "@/app/lib/types"
import sendMail from '@/app/lib/mailer'
import { responseToCsv, responseToText, responseToHtml } from '@/app/lib/convert'
import { redirect } from 'next/navigation'
import { auth } from "@/auth"
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { DEFAULT_FORM } from '@/app/lib/default'
import http from 'http'

type FormsTotal = {
    FormsTotal: number
}

type ResponsesTotal = {
    ResponsesTotal: number
}

const dbName = process.env.DB_NAME

export async function fetchForm(id: string): Promise<Form | undefined> {
    noStore()
    const userId = (await auth())?.user.id

    try {
        const client = await getMongoClientPromise()
        const form = await client.db(dbName).collection("forms").aggregate<Form>([
            {
                $match: {
                    _id: new ObjectId(id),
                    $or: [{ user_id: new ObjectId(userId) }, { published: true }]
                }
            },
            {
                $addFields: {
                    id: { $toString: "$_id" },
                    user_id: { $toString: "$user_id" }
                },
            },
            { $project: { _id: 0 } },
        ]).next()

        return form || undefined

    } catch (err) {
        throw new Error("Failed to fetch form.")
    }
}

export async function fetchFilteredForms(
    itemsPerPage: number,
    query: string,
    currentPage: number,
): Promise<UserWithForm[]> {
    noStore()
    const offset = (currentPage - 1) * itemsPerPage
    const userId = (await auth())?.user.id

    try {
        const client = await getMongoClientPromise();
        const forms = await client.db(dbName).collection("users").aggregate<UserWithForm>([
            { $match: { _id: new ObjectId(userId) } },
            {
                $lookup: {
                    from: "forms",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "form"
                }
            },
            { $unwind: { path: "$form" } },
            { $match: { "form.title": { $regex: query, $options: 'i' } } },
            { $skip: offset },
            { $limit: itemsPerPage },
            {
                $lookup: {
                    from: "responses",
                    localField: "form._id",
                    foreignField: "form_id",
                    as: "responses",
                }
            },
            {
                $addFields: {
                    id: { $toString: "$_id" },
                    "form.id": { $toString: "$form._id" },
                    "form.user_id": { $toString: "$form.user_id" },
                    "form.responses": { $size: "$responses" },
                }
            },
            { $project: { _id: 0, "form._id": 0 } },
        ]).toArray()

        return forms
    } catch (err) {
        console.error("Database Error", err)
        throw new Error("Failed to fetch forms.")
    }
}

export async function fetchFormsTotal(
    query: string,
): Promise<number> {
    noStore()
    const userId = (await auth())?.user.id

    try {
        const client = await getMongoClientPromise()
        const forms = await client.db(dbName).collection("users").aggregate<FormsTotal>([
            { $match: { _id: new ObjectId(userId) } },
            {
                $lookup: {
                    from: "forms",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "form"
                }
            },
            { $unwind: { path: "$form" } },
            { $match: { "form.title": { $regex: query, $options: 'i' } } },
            { $count: "FormsTotal" }
        ]).next()

        return forms?.FormsTotal || 0
    } catch (err) {
        console.error("Database Error", err)
        throw new Error("Failed to fetch forms.")
    }
}

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

function parseResponseForm(form: Form): Response {
    const parseInputsPage = (id: number, attr: InputsPage["attributes"]): InputResponse[] =>
        attr.inputs.map((inp, index) => {
            return {
                page: id + 1,
                input: index + 1,
                question: attr.title?.text || "",
                label: inp.label?.text || "",
                response: inp.response || "",
            }
        })


    const parseTextAreaPage = (id: number, attr: TextAreaPage["attributes"]): InputResponse[] => [
        {
            page: id + 1,
            input: 1,
            question: attr.title?.text || "",
            label: "",
            response: attr.response || "",
        }
    ]

    return {
        title: form.title,
        user_id: form.user_id,
        form_id: form.id,
        timestamp: new Date().getTime(),
        responses: form.pages.flatMap((page, index) => {
            if (isInputsPage(page)) {
                return parseInputsPage(index, page.attributes)
            }
            else if (isTextAreaPage(page)) {
                return parseTextAreaPage(index, page.attributes)
            }
            return []
        })
    }
}

export async function handleResponse(form: Form) {
    noStore()

    const response = parseResponseForm(form)
    const client = await getMongoClientPromise()
    try {
        await client.db(dbName).collection("responses").insertOne(
            {
                ...response,
                user_id: new ObjectId(response.user_id),
                form_id: new ObjectId(response.form_id)
            }
        )
        revalidatePath(`/forms/${form.id}/view-responses`);

        revalidatePath(`/forms`);

    } catch (err) {
        console.error("Database Error", err)
        throw new Error("Failed to insert response.")
    }

    const urlRegex = /^https?:\/\/[^\s$.?#].[^\s]*$/;
    if (form.webhook_url && form.webhook_url.length < 512 && urlRegex.test(form.webhook_url)) {
        try {
            const url = new URL(encodeURI(decodeURI(form.webhook_url)))
            const body = JSON.stringify(response)
            const path = `${url.pathname}${url.search}`
            let req = http.request({
                method: "POST",
                path: path,
                hostname: url.hostname,
                port: url.port,
                headers: {
                    "connection": "close",
                    "content-type": "application/json",
                    "content-length": body.length,
                    "sec-fetch-mode": "cors",
                },
                search: url.search,
                hash: url.hash,
            })
            req.setNoDelay(true)
            req.write(body)
            req.end()
        } catch (err) {
            // Ignore errors
        }
    }

    try {
        const email = (await client.db(dbName).collection("users").aggregate<User>([
            { $match: { _id: new ObjectId(response.user_id) } },
            { $project: { _id: 0, email: 1 } },
        ]).next())

        if (email && form.send_email) {

            let mail = {
                to: email["email"],
                subject: `New '${response.title}' Form Response`,
                text: responseToText(response),
                html: responseToHtml(response),
                attachment: {
                    filename: "response.csv",
                    content: responseToCsv(response),
                },
            }

            await sendMail(mail)
        }
    } catch (err) {
        console.error("Database Error", err)
        throw new Error("Failed to find user.")
    }
}

export async function updateForm(
    form: Form
) {
    noStore()
    const userId = (await auth())?.user.id

    try {
        const client = await getMongoClientPromise()
        await client.db(dbName).collection("forms").updateOne(
            {
                _id: new ObjectId(form.id),
                user_id: new ObjectId(userId)
            },
            {
                $set: {
                    title: form.title,
                    pages: form.pages,
                    published: form.published,
                    send_email: form.send_email,
                    background_url: form.background_url,
                    background_color: form.background_color,
                    webhook_url: form.webhook_url,
                }
            }
        )

    } catch (err) {
        console.error("Database Error", err)
        throw new Error("Failed to update form.")
    }
}


export async function createForm() {
    noStore()
    const userId = (await auth())?.user.id

    const form = {
        ...DEFAULT_FORM,
        user_id: new ObjectId(userId)
    }

    let res: { insertedId: ObjectId | undefined } = { insertedId: undefined }

    try {
        const client = await getMongoClientPromise()
        res = await client.db(dbName).collection("forms").insertOne(form)

    } catch (err) {
        throw new Error("Failed to create form.")
    }

    revalidatePath(`/forms`)
    if (res.insertedId) {
        redirect(`/forms/${res.insertedId}/edit`)
    }
}



export async function deleteForm(
    id: string
) {
    noStore()
    const userId = (await auth())?.user.id
    try {
        const client = await getMongoClientPromise()
        await client.db(dbName).collection("forms").deleteOne(
            { _id: new ObjectId(id), user_id: new ObjectId(userId) }
        )
    } catch (err) {
        throw new Error("Failed to delete form.")
    }

    revalidatePath(`/forms`);
}


export async function fetchResponses(
    formId: string,
    itemsPerPage: number,
    currentPage: number,
): Promise<ResponseWithId[]> {
    noStore()
    const offset = (currentPage - 1) * itemsPerPage
    const userId = (await auth())?.user.id

    try {
        const client = await getMongoClientPromise();
        const forms = await client.db(dbName).collection("responses").aggregate<ResponseWithId>([
            { $match: { form_id: new ObjectId(formId), user_id: new ObjectId(userId) } },
            { $sort: { _id: -1 } },
            { $skip: offset },
            { $limit: itemsPerPage },
            {
                $addFields: {
                    id: { $toString: "$_id" },
                }
            },
            { $project: { _id: 0, user_id: 0, form_id: 0 } },
        ]).toArray()

        return forms
    } catch (err) {
        console.error("Database Error", err)
        throw new Error("Failed to fetch forms.")
    }
}

export async function fetchTotalResponses(
    formId: string,
): Promise<number> {
    noStore()
    const userId = (await auth())?.user.id

    try {
        const client = await getMongoClientPromise();

        const responses = await client.db(dbName).collection("responses").aggregate<ResponsesTotal>([
            { $match: { form_id: new ObjectId(formId), user_id: new ObjectId(userId) } },
            { $count: "ResponsesTotal" }
        ]).next()

        return responses?.ResponsesTotal || 0
    } catch (err) {
        console.error("Database Error", err)
        throw new Error("Failed to fetch forms.")
    }
}

export async function downloadUserData(): Promise<UserWithForms> {

    noStore()
    const userId = (await auth())?.user.id

    try {
        const client = await getMongoClientPromise();

        const userData = await client.db(dbName).collection("users").aggregate<UserWithForms>([
            { $match: { _id: new ObjectId(userId) } },
            {
                $lookup: {
                    from: "forms",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "form"
                }
            },
            { $unwind: { path: "$form" } },
            {
                $lookup: {
                    from: "responses",
                    localField: "form._id",
                    foreignField: "form_id",
                    as: "form.responses",
                }
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    email: { $first: "$email" },
                    password: { $first: "$password" },
                    first_name: { $first: "$first_name" },
                    last_name: { $first: "$last_name" },
                    forms: {
                        $push: {
                            _id: { $toString: "$form._id" }, // Convert form ObjectId to string
                            user_id: { $toString: "$form.user_id" }, // Convert user_id ObjectId to string
                            title: "$form.title",
                            published: "$form.published",
                            pages: "$form.pages",
                            background_url: "$form.background_url",
                            background_color: "$form.background_color",
                            responses: {
                                $map: {
                                    input: "$form.responses",
                                    as: "response",
                                    in: {
                                        _id: { $toString: "$$response._id" }, // Convert response ObjectId to string
                                        title: "$$response.title",
                                        user_id: { $toString: "$$response._id" },
                                        responses: "$$response.responses",
                                        form_id: { $toString: "$$response.form_id" },
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: { $toString: "$_id" }, // Convert user _id ObjectId to string
                    name: 1,
                    email: 1,
                    first_name: 1,
                    last_name: 1,
                    forms: 1
                }
            }
        ]).next()

        if (!userData) {
            throw new Error("Failed to fetch user data.")
        }

        return userData
    } catch (err) {
        console.error("Database Error", err)
        throw new Error("Failed to fetch user data.")
    }
}

export async function getUser(): Promise<User> {
    noStore()
    const userId = (await auth())?.user.id
    try {
        const client = await getMongoClientPromise()
        const user = await client.db(dbName).collection("users").aggregate<User>([
            { $match: { _id: new ObjectId(userId) } },
            { $addFields: { id: { $toString: "$_id" } } },
            { $project: { _id: 0, email: 1, first_name: 1, last_name: 1 } }
        ]).toArray()
        return user[0]
    } catch (err) {
        console.error("Database Error", err)
        throw new Error("Failed to update form.")
    }
}

export async function updateUser(
    prevState: string | undefined,
    formData: FormData,
) {
    const parsed = z
        .object({
            email: z.string().email(),
            first_name: z.string(),
            last_name: z.string(),
            current_password: z.string().min(6),
            new_password: z.string().min(6).or(z.string().length(0)),
            new_password_check: z.string().min(6).or(z.string().length(0)),
        })
        .safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return "parsing-error"
    }

    noStore()
    const userId = (await auth())?.user.id

    try {

        const client = await getMongoClientPromise()

        const user = await client.db(dbName).collection("users").aggregate<User>([
            { $match: { _id: new ObjectId(userId) } }
        ]).toArray()

        const passwordMatches = await bcrypt.compare(parsed.data.current_password, user[0].password)
        if (!passwordMatches) {
            return "wrong-password"
        }

        if (user[0].email !== parsed.data.email ||
            user[0].first_name !== parsed.data.first_name ||
            user[0].last_name !== parsed.data.last_name) {
            await client.db(dbName).collection("users").updateOne(
                {
                    _id: new ObjectId(userId)
                },
                {
                    $set: {
                        email: parsed.data.email,
                        first_name: parsed.data.first_name,
                        last_name: parsed.data.last_name,
                    }
                }
            )
        }

        if (parsed.data.new_password && parsed.data.new_password !== parsed.data.new_password_check) {
            return "new-password-not-matching"
        }

        if (parsed.data.new_password) {
            const newPasswordHash = await bcrypt.hash(parsed.data.new_password, 10)
            await client.db(dbName).collection("users").updateOne(
                {
                    _id: new ObjectId(userId)
                },
                {
                    $set: {
                        password: newPasswordHash,
                    }
                }
            )
        }

        revalidatePath(`/account`)
    } catch (err) {
        console.error("Database Error", err)
        throw new Error("Failed to update form.")
    }

}

export async function createUser(
    prevState: string | undefined,
    formData: FormData,
) {
    const parsed = z
        .object({
            email: z.string().email(),
            first_name: z.string().min(2),
            last_name: z.string().min(2),
            password: z.string().min(6),
        })
        .safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return "parsing-error"
    }

    noStore()
    try {

        const client = await getMongoClientPromise()

        const user = await client.db(dbName).collection("users").aggregate<User>([
            { $match: { email: parsed.data.email } }
        ]).toArray()

        if (user.length > 0) {
            return "email-already-taken"
        }

        const newPasswordHash = await bcrypt.hash(parsed.data.password, 10)
        await client.db(dbName).collection("users").insertOne(
            {
                email: parsed.data.email,
                first_name: parsed.data.first_name,
                last_name: parsed.data.last_name,
                password: newPasswordHash,
            }
        )
        return "success"
    } catch (err) {
        console.error("Database Error", err)
        throw new Error("Failed to create user.")
    }

}


