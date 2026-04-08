const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Fetching products to check individual payload size...');
  try {
    const products = await prisma.product.findMany({
      include: { images: true }
    });
    
    products.forEach(p => {
        const pStr = JSON.stringify(p);
        console.log(`Product: ${p.name}`);
        console.log(`- Images count: ${p.images.length}`);
        console.log(`- Total JSON size (KB): ${(pStr.length / 1024).toFixed(2)}`);
        p.images.forEach((img, i) => {
           console.log(`  - Image ${i} size (KB): ${(JSON.stringify(img).length / 1024).toFixed(2)}`);
           if (img.url.startsWith('data:')) {
               console.log(`  - Image ${i} is BASE64 (Starts with ${img.url.substring(0, 30)}...)`);
           }
        });
    });
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
