import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const productsCount = await prisma.product.count()
  const products = await prisma.product.findMany({ take: 5 })
  console.log('--- DB CHECK ---')
  console.log('Total Products:', productsCount)
  console.log('Samples:', products.map(p => p.name))
  console.log('----------------')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
