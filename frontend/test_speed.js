const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Fetching products WITHOUT images...');
  const start = Date.now();
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true
      }
    });
    const end = Date.now();
    console.log(`Fetched ${products.length} products in ${end - start}ms`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
