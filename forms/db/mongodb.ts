import { MongoClient } from 'mongodb'
import { unstable_noStore as noStore } from 'next/cache';

function getUri(): string {
    noStore()
    if (!process.env.MONGODB_URI) {
        throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
    }
    return process.env.MONGODB_URI
}

const options = {}

let clientPromise: Promise<MongoClient> | null = null;

function getClientPromise() {
    if (!clientPromise) {
        const client = new MongoClient(getUri(), options);
        clientPromise = client.connect();
    }
    return clientPromise;
}

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
        globalWithMongo._mongoClientPromise = getClientPromise();
    }
    clientPromise = globalWithMongo._mongoClientPromise
} else {
    // In production mode, it's best to not use a global variable.
    clientPromise = getClientPromise();
}

export const dynamic = 'force-dynamic'
export default function getMongoClientPromise() {
    noStore()
    if (!clientPromise) {
        clientPromise = getClientPromise();
    }
    return clientPromise;
}