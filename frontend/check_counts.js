const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  console.log('Checking counts...');
  try {
    const productsCount = await prisma.product.count();
    const imagesCount = await prisma.productimage.count();
    const variantsCount = await prisma.productvariant.count();
    
    console.log('Products:', productsCount);
    console.log('Images:', imagesCount);
    console.log('Variants:', variantsCount);
    
    if (productsCount > 0) {
        const products = await prisma.product.findMany({ 
            take: 5,
            include: { _count: { select: { images: true, variants: true } } } 
        });
        products.forEach(p => {
            console.log(`- ${p.name}: ${p._count.images} images, ${p._count.variants} variants`);
        });
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
