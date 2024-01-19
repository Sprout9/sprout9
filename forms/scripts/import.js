const { MongoClient, ObjectId } = require("mongodb")
require('dotenv').config()
const fs = require('fs')

// Replace the uri string with your MongoDB deployment's connection string
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

async function run() {
    try {

        const db = client.db("forms")

        try {
            const usersData = fs.readFileSync("users.json");
            const users = JSON.parse(usersData);

            await db.collection("users").insertMany(users)
        } catch (error) {
            console.log("users write error")
        }


        try {
            const formsData = fs.readFileSync("forms.json");
            const forms = JSON.parse(formsData);

            await db.collection("forms").insertMany(forms)
        } catch (error) {
            console.log("forms write error")
        }


        try {
            const responsesData = fs.readFileSync("responses.json");
            const responses = JSON.parse(responsesData);

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
