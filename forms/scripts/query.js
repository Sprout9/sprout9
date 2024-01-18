const { MongoClient, ObjectId } = require("mongodb")
require('dotenv').config()

// Replace the uri string with your MongoDB deployment's connection string
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

async function run() {
    try {

        const db = client.db("test")

        const res = await db.collection("responses").aggregate().toArray()
        // console.log(res)

        const userId = "65632e0f9140911cb850c33c"
        const offset = 0
        const itemsPerPage = 5

        const forms = await db.collection("users").aggregate([
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
                            responses: "$form.responses",
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
                    password: 1,
                    first_name: 1,
                    last_name: 1,
                    forms: 1
                }
            }
        ]).next()

        console.log(forms)

    } finally {
        // Close the database connection on completion or error
        await client.close();
    }
}
run().catch(console.dir);
