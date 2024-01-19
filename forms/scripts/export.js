const { MongoClient, ObjectId } = require("mongodb")
require('dotenv').config()
const fs = require('fs')

// Replace the uri string with your MongoDB deployment's connection string
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

async function run() {
    try {

        const db = client.db("test")

        const users = await db.collection("users").find().toArray()
        const usersString = JSON.stringify(users);
        fs.writeFile("users.json", usersString, (error) => {
            if (error) {
                console.log("users write error")
            }
            console.log("users.json written correctly");
        });

        const forms = await db.collection("forms").find().toArray()
        const formsString = JSON.stringify(forms);
        fs.writeFile("forms.json", formsString, (error) => {
            if (error) {
                console.log("forms write error")
            }
            console.log("forms.json written correctly");
        });



        const responses = await db.collection("responses").find().toArray()
        const responsesString = JSON.stringify(responses);
        fs.writeFile("responses.json", responsesString, (error) => {
            if (error) {
                console.log("responses write error")
            }
            console.log("responses.json written correctly");
        });

    } finally {
        // Close the database connection on completion or error
        await client.close();
    }
}
run().catch(console.dir);
