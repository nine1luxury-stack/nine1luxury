import { prisma, withDbTimeout } from "@/lib/db";
import ProductsClient from "./ProductsClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

function ProductsSkeletonGrid() {
    return (
        <div className="min-h-screen bg-rich-black pt-32 pb-24 container mx-auto px-4">
            <div className="flex flex-col items-center mb-12 space-y-3">
               <div className="h-10 skeleton w-64 rounded-xl" />
               <div className="h-4 skeleton w-48 rounded-xl" />
            </div>
            <div className="flex flex-col lg:flex-row gap-12">
               <div className="w-72 hidden lg:block space-y-8">
                  <div className="h-64 skeleton rounded-2xl" />
                  <div className="h-32 skeleton rounded-2xl" />
               </div>
               <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i}>
                          <div className="aspect-[3/4] skeleton rounded-2xl mb-3" />
                          <div className="h-4 skeleton rounded mb-2 w-3/4" />
                          <div className="h-4 skeleton rounded w-1/2" />
                      </div>
                  ))}
               </div>
            </div>
        </div>
    );
}

export default async function ProductsPage() {
    return (
        <Suspense fallback={<ProductsSkeletonGrid />}>
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
