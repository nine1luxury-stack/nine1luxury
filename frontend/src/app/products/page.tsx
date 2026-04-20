import { prisma, withDbTimeout } from "@/lib/db";
import ProductsClient from "./ProductsClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
    return (
        <Suspense fallback={null}>
            <ProductsDataWrapper />
        </Suspense>
    );
}

async function ProductsDataWrapper() {
    try {
        const [products, categories] = await withDbTimeout(() => Promise.all([
            prisma.product.findMany({
                where: { isActive: true },
                select: {
                    id: true, name: true, price: true, discount: true,
                    category: true, isActive: true, createdAt: true,
                    // Include images but limited to 1 for initial load efficiency
                    images: { take: 1, select: { url: true } },
                    variants: { select: { id: true, size: true, color: true, stock: true } }
                },
                // Removed take: 8 to show all products
                orderBy: { createdAt: 'desc' }
            }),
            prisma.category.findMany({ orderBy: { name: 'asc' } })
        ]));

        console.log(`[ProductsPage] Successfully fetched ${products.length} active products from database.`);

        return (
            <ProductsClient 
                initialProducts={JSON.parse(JSON.stringify(products))} 
                initialCategories={JSON.parse(JSON.stringify(categories))} 
            />
        );
    } catch (error) {
        console.error("[ProductsPage] Error fetching data:", error);
        // Fallback to empty lists if DB is down, rather than crashing
        return (
            <ProductsClient 
                initialProducts={[]} 
                initialCategories={[]} 
                error="Unable to load products. Please check your connection."
            />
        );
    }
}
