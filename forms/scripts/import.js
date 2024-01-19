const { MongoClient, ObjectId } = require("mongodb")
require('dotenv').config()
const fs = require('fs')

// Replace the uri string with your MongoDB deployment's connection string
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

async function run() {
    try {

        const db = client.db("test")

        try {
            const responsesData = fs.readFileSync("responses.json");
        } catch (error) {
            console.log("responses write error")
        }
        const responses = JSON.parse(responsesData);

        await db.collection("forms").insertMany()


    } finally {
        // Close the database connection on completion or error
        await client.close();
    }
}
run().catch(console.dir);
