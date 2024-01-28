import { MongoClient } from 'mongodb'

export function getDbName(): string {
    if (!process.env.DB_NAME) {
        throw new Error('Invalid/Missing environment variable: "DB_NAME"')
    }
    return process.env.DB_NAME
}

function getUri(): string {
    if (!process.env.MONGODB_URI) {
        throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
    }
    return process.env.MONGODB_URI
}

const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(getUri(), options)
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(getUri(), options)
    clientPromise = client.connect();
}


export default clientPromise