const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to database...');
  try {
    const products = await prisma.product.findMany();
    console.log('Product query finished.');
    console.log('Found', products.length, 'products');
    if (products.length > 0) {
        console.log('First product:', products[0].name);
    }
  } catch (err) {
    console.error('Error during query:', err);
  } finally {
    await prisma.$disconnect();
    console.log('Disconnected.');
  }
}

main();
