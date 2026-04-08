const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const uri = process.env.DATABASE_URL;
if (!uri) {
    console.error('DATABASE_URL is missing');
    process.exit(1);
}

async function run() {
    console.log('Connecting to MongoDB directly...');
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
    try {
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db();
        const collection = db.collection('product');
        const count = await collection.countDocuments();
        console.log('Product count in "product" collection:', count);
        
        const products = await collection.find({}).limit(1).toArray();
        console.log('Sample product:', products[0] ? products[0].name : 'None');

    } catch (err) {
        console.error('Connection failed:', err.message);
    } finally {
        await client.close();
        console.log('Closed.');
    }
}

run();
