import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.product.count();
    console.log('Product count:', count);
    
    if (count > 0) {
      const firstProduct = await prisma.product.findFirst();
      console.log('First product:', firstProduct?.name);
    }
  } catch (error) {
    console.error('Database connection failed:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
