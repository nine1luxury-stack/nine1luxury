const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const productCount = await prisma.product.count();
  const variantCount = await prisma.productvariant.count();
  const imageCount = await prisma.productimage.count();
  console.log('Product Count:', productCount);
  console.log('Variant Count:', variantCount);
  console.log('Image Count:', imageCount);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
