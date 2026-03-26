import { AdminProductsClient } from "./AdminProductsClient";
import { prisma } from "@/lib/db";

// Force dynamic fetch on admin routes to prevent caching outdated info
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
    const productsData = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            images: true,
            variants: true,
        }
    });

    const categoryData = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });

    return <AdminProductsClient initialProducts={productsData} initialCategories={categoryData} />;
}
