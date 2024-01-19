const { MongoClient, ObjectId } = require("mongodb")
require('dotenv').config()

// Replace the uri string with your MongoDB deployment's connection string
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

async function run() {
    try {

        const db = client.db("test")

        const now = new Date().getTime()
        await db.collection("responses").updateMany({}, { $set: { timestamp: now } })

        await db.collection("forms").updateMany({}, { $set: { send_email: true } })

        const submit = {
            type: "submit",
            attributes: {
                title: { text: "Bedankt voor het invullen" },
                description: { text: "Je kunt deze pagina nu sluiten" }
            }
        }

        let fs = await db.collection("forms").aggregate().toArray()

        for (let i = 0; i < fs.length; i++) {
            let f = fs[i]


            f.pages = [
                ...f.pages,
                submit
            ]

            await db.collection("forms").updateOne(
                {
                    _id: f._id,
                },
                {
                    $set: {
                        pages: f.pages,
                    }
                }
            )
        }


        const res = await db.collection("responses").aggregate().toArray()
        console.log(res)

        fs = await db.collection("forms").aggregate().toArray()
        console.log(fs)


    } finally {
        // Close the database connection on completion or error
        await client.close();
    }
}
run().catch(console.dir);
