const { MongoClient } = require("mongodb")
const { USERS, FORMS } = require("./data.js")
require('dotenv').config()
const bcrypt = require("bcrypt")

// Replace the uri string with your MongoDB deployment's connection string
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

async function run() {
    try {

        const db = client.db("test")

        // Reset users collection
        await db.dropCollection("users")
        let usersCollection = await db.collection("users")
        await usersCollection.createIndex("email")

        const users = await Promise.all(USERS.map(async user => {
            const password = await bcrypt.hash(user.password, 10)
            return {
                ...user,
                password: password
            }
        }))


        await usersCollection.insertMany(users)
        let userId = (await usersCollection.findOne({ "name": "sanne" }))._id

        // Reset forms collection
        FORMS.forEach(form => {
            form["user_id"] = userId
        });
        for (let i = 0; i < 30; i++) {
            FORMS.push({ ...FORMS[1] })
            FORMS[i + 2].title += ` ${i}`
        }
        await db.dropCollection("forms")
        let formsCollection = await db.collection("forms")
        await formsCollection.insertMany(FORMS)

        // Check lookup
        let userWithForm = await usersCollection.aggregate([
            { $match: { "name": "sanne" } },
            {
                $lookup: {
                    from: "forms",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "forms",
                }
            }
        ]).toArray()


        console.log(userWithForm[0]);
    } finally {
        // Close the database connection on completion or error
        await client.close();
    }
}
run().catch(console.dir);
