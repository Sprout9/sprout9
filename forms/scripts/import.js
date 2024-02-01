const { MongoClient, ObjectId } = require("mongodb")
require('dotenv').config()
const fs = require('fs')

// Replace the uri string with your MongoDB deployment's connection string
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

async function run() {
    try {

        const db = client.db("forms")

        await db.dropCollection("users")
        await db.dropCollection("forms")
        await db.dropCollection("responses")

        try {
            const usersData = fs.readFileSync("users.json");
            let users = JSON.parse(usersData);
            users = users.map(u => {
                return {
                    ...u,
                    _id: new ObjectId(u._id),
                }
            })

            await db.collection("users").insertMany(users)
        } catch (error) {
            console.log("users write error")
        }

        const submit = {
            type: "submit",
            attributes: {
                title: { text: "Bedankt voor het invullen" },
                description: { text: "Je kunt deze pagina nu sluiten" }
            }
        }


        try {
            const formsData = fs.readFileSync("forms.json");
            let forms = JSON.parse(formsData);
            forms = forms.map(f => {
                return {
                    ...f,
                    _id: new ObjectId(f._id),
                    user_id: new ObjectId(f.user_id),
                    pages: [
                        ...f.pages,
                        submit
                    ],
                    send_email: true,
                }
            })

            await db.collection("forms").insertMany(forms)
        } catch (error) {
            console.log("forms write error")
        }

        const now = new Date().getTime()

        try {
            const responsesData = fs.readFileSync("responses.json");
            let responses = JSON.parse(responsesData);
            responses = responses.map(r => {
                return {
                    ...r,
                    _id: new ObjectId(r._id),
                    user_id: new ObjectId(r.user_id),
                    form_id: new ObjectId(r.form_id),
                    timestamp: now,
                }
            })

            await db.collection("responses").insertMany(responses)
        } catch (error) {
            console.log("responses write error")
        }


    } finally {
        // Close the database connection on completion or error
        await client.close();
    }
}
run().catch(console.dir);
