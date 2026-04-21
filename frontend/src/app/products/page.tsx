import { prisma, withDbTimeout } from "@/lib/db";
import ProductsClient from "./ProductsClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

function LoadingSkeleton() {
    return (
        <main className="min-h-screen bg-rich-black pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-[1600px]">
                <div className="flex flex-col items-center mb-16 space-y-4">
                    <div className="h-3 w-28 bg-ivory/[0.04] rounded-full animate-pulse" />
                    <div className="h-10 w-72 bg-ivory/[0.06] rounded-2xl animate-pulse" />
                    <div className="h-px w-20 bg-gold-500/20 animate-pulse" />
                </div>
                <div className="flex gap-12">
                    <div className="hidden lg:flex flex-col gap-6 w-64 shrink-0">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className="h-10 bg-ivory/[0.03] rounded-2xl animate-pulse" />
                        ))}
                    </div>
                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/5] bg-ivory/[0.03] rounded-2xl mb-4 border border-ivory/[0.04]" />
                                <div className="h-4 bg-ivory/[0.03] rounded-full mb-2 w-3/4" />
                                <div className="h-4 bg-ivory/[0.03] rounded-full w-1/2" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default async function ProductsPage() {
    return (
        <Suspense fallback={<LoadingSkeleton />}>
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
