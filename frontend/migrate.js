/**
 * Nine1Luxury - Database Migration Script
 * Migrates ALL collections from old Atlas DB → new Cluster0 DB
 * Run with: node migrate.js
 */

const { MongoClient } = require('mongodb');

const OLD_URI = "mongodb+srv://Vercel-Admin-atlas-coral-horizon:49bV5itnDRPyUe54@atlas-coral-horizon.saujeg2.mongodb.net/nine1luxury?retryWrites=true&w=majority";
const NEW_URI = "mongodb+srv://nine1luxury_db_user:P2Ti5Tj1PDwrEjJ7@cluster0.merelx7.mongodb.net/nine1luxury?retryWrites=true&w=majority";

const DB_NAME = "nine1luxury";

const COLLECTIONS = [
    "product",
    "productimage",
    "productvariant",
    "category",
    "order",
    "orderitem",
    "user",
    "booking",
    "coupon",
    "offer",
    "customer",
    "expense",
    "supplier",
    "returnrequest",
    "notification",
    "setting",
    "testimonial",
];

async function migrate() {
    console.log("🚀 Starting migration...\n");

    const oldClient = new MongoClient(OLD_URI);
    const newClient = new MongoClient(NEW_URI);

    try {
        await oldClient.connect();
        await newClient.connect();
        console.log("✅ Connected to both databases\n");

        const oldDb = oldClient.db(DB_NAME);
        const newDb = newClient.db(DB_NAME);

        for (const collectionName of COLLECTIONS) {
            try {
                const documents = await oldDb.collection(collectionName).find({}).toArray();

                if (documents.length === 0) {
                    console.log(`⚪ [${collectionName}] - Empty, skipping`);
                    continue;
                }

                // Clear existing data in new DB to avoid duplicates
                await newDb.collection(collectionName).deleteMany({});

                // Insert all documents
                await newDb.collection(collectionName).insertMany(documents);

                console.log(`✅ [${collectionName}] - Migrated ${documents.length} documents`);
            } catch (err) {
                console.error(`❌ [${collectionName}] - Error: ${err.message}`);
            }
        }

        console.log("\n🎉 Migration complete!");

    } catch (err) {
        console.error("❌ Connection error:", err.message);
    } finally {
        await oldClient.close();
        await newClient.close();
    }
}

migrate();
