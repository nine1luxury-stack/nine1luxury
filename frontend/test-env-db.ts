import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

console.log('DATABASE_URL from process.env:', process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Attempting to connect to database...');
    const products = await prisma.product.findMany();
    console.log('Success! Found ' + products.length + ' products.');
  } catch (error) {
    console.error('Database connection failed:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
