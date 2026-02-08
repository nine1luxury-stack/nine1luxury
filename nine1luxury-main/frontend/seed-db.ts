import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data to avoid duplicates or stale bad data
  try {
      await prisma.orderitem.deleteMany();
      await prisma.order.deleteMany();
      await prisma.productimage.deleteMany();
      await prisma.productvariant.deleteMany();
      await prisma.product.deleteMany();
      console.log("Cleaned up old data.");
  } catch (e: any) {
      console.log("Cleanup failed or empty db:", e.message);
  }

  await prisma.product.create({
    data: {
      name: "تيشيرت كلاسيك فاخر",
      description: "تيشيرت قطني 100% بتصميم كلاسيكي ومريح.",
      price: 1200,
      category: "تيشيرتات",
      featured: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800" },
          { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800" }
        ]
      },
      variants: {
        create: [
            { color: "أسود", colorHex: "#000000", size: "M", stock: 10 },
            { color: "أسود", colorHex: "#000000", size: "L", stock: 10 },
            { color: "أبيض", colorHex: "#FFFFFF", size: "M", stock: 10 }
        ]
      }
    }
  });
  
   await prisma.product.create({
    data: {
      name: "بنطلون جينز سليم",
      description: "بنطلون جينز أزرق قصة سليم فت.",
      price: 1800,
      category: "بنطلونات",
      featured: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800" } 
        ]
      },
      variants: {
        create: [
            { color: "أزرق", colorHex: "#0000FF", size: "32", stock: 5 },
            { color: "أزرق", colorHex: "#0000FF", size: "34", stock: 5 }
        ]
      }
    }
  });

  await prisma.product.create({
    data: {
      name: "قميص كتان بيج",
      description: "قميص كتان صيفي خفيف.",
      price: 1500,
      category: "قمصان",
      featured: false,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800" }
        ]
      },
      variants: {
        create: [
            { color: "بيج", colorHex: "#F5F5DC", size: "M", stock: 8 },
            { color: "بيج", colorHex: "#F5F5DC", size: "L", stock: 8 }
        ]
      }
    }
  });

  console.log("Seeding finished.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
