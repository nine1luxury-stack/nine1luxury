import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Attempting to connect to database...');
    const [products, categories] = await Promise.all([
      prisma.product.findMany(),
      prisma.category.findMany()
    ]);
    console.log('Success!');
    console.log('Found ' + products.length + ' products.');
    console.log('Found ' + categories.length + ' categories.');
  } catch (error) {
    console.error('Database connection failed:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
