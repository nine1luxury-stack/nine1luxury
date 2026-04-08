const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching products to check payload size...');
  try {
    const products = await prisma.product.findMany({
      include: { images: true }
    });
    
    let totalSize = JSON.stringify(products).length;
    console.log('Total JSON size of all products:', (totalSize / (1024 * 1024)).toFixed(2), 'MB');
    console.log('Product count:', products.length);
    
    if (products.length > 0) {
        const avgSize = totalSize / products.length;
        console.log('Average size per product:', (avgSize / 1024).toFixed(2), 'KB');
        
        products.slice(0, 5).forEach(p => {
           const pSize = JSON.stringify(p).length;
           const isBase64 = p.images?.some(img => img.url?.startsWith('data:'));
           console.log(`- ${p.name}: ${(pSize/1024).toFixed(2)} KB, Has Base64: ${isBase64}`);
        });
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
