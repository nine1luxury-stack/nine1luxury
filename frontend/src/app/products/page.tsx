import { prisma } from "@/lib/db";
import ProductsClient from "./ProductsClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

function ProductsSkeletonGrid() {
    return (
        <div className="min-h-screen bg-rich-black pt-32 pb-24 container mx-auto px-4">
            <div className="flex flex-col items-center mb-12 space-y-3">
               <div className="h-10 bg-white/5 w-64 rounded-xl animate-pulse" />
               <div className="h-4 bg-white/5 w-48 rounded-xl animate-pulse" />
            </div>
            <div className="flex flex-col lg:flex-row gap-12">
               <div className="w-72 hidden lg:block space-y-8">
                  <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
                  <div className="h-32 bg-white/5 rounded-2xl animate-pulse" />
               </div>
               <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                          <div className="aspect-[3/4] bg-white/5 rounded-sm mb-3" />
                          <div className="h-4 bg-white/5 rounded mb-2 w-3/4" />
                          <div className="h-4 bg-white/5 rounded w-1/2" />
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
        const [products, categories] = await Promise.all([
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
        ]);

        return (
            <ProductsClient 
                initialProducts={JSON.parse(JSON.stringify(products))} 
                initialCategories={JSON.parse(JSON.stringify(categories))} 
            />
        );
    } catch (error) {
        console.error("SERVER ERROR in ProductsPage:", error);
        return (
            <div className="min-h-screen bg-rich-black p-20 text-center">
                <h1 className="text-gold-500 text-2xl font-bold">عذراً، حدث خطأ أثناء تحميل البيانات</h1>
                <p className="text-gray-400 mt-4">يرجى المحاولة مرة أخرى لاحقاً</p>
                <ProductsClient initialProducts={[]} initialCategories={[]} />
            </div>
        );
    }
}
