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
        // Fetch only 8 products WITHOUT images for max speed on initial SSR
        const [products, categories] = await withDbTimeout(() => Promise.all([
            prisma.product.findMany({
                where: { isActive: true },
                select: {
                    id: true, name: true, price: true, discount: true,
                    category: true, isActive: true, createdAt: true,
                    // EXCLUDE images: true to avoid massive Base64 payload in SSR HTML
                    variants: { select: { id: true, size: true, color: true, stock: true } }
                },
                take: 8,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.category.findMany({ orderBy: { name: 'asc' } })
        ]));

        return (
            <ProductsClient 
                initialProducts={JSON.parse(JSON.stringify(products))} 
                initialCategories={JSON.parse(JSON.stringify(categories))} 
            />
        );
    } catch (error) {
        console.error("SERVER ERROR in ProductsPage:", error);
        return (
            <div className="min-h-screen bg-rich-black p-20 text-center pt-32">
                <div className="max-w-md mx-auto">
                    <h1 className="text-champagne text-2xl font-bold font-playfair mb-4">عذراً، حدث خطأ</h1>
                    <p className="text-ivory/25 mb-8 leading-relaxed">تعذر الاتصال بقاعدة البيانات. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.</p>
                </div>
                <ProductsClient initialProducts={[]} initialCategories={[]} />
            </div>
        );
    }
}
