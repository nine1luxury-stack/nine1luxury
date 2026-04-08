const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Checking a single image from DB...');
  try {
    const images = await prisma.productimage.findMany({
      take: 1
    });
    
    if (images.length === 0) {
        console.log('No images found');
    } else {
        const img = images[0];
        console.log(`Image ID: ${img.id}`);
        console.log(`URL Length: ${img.url.length}`);
        console.log(`Starts with: ${img.url.substring(0, 100)}...`);
        console.log(`Ends with: ...${img.url.substring(img.url.length - 100)}`);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
