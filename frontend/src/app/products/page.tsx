import { prisma } from "@/lib/db";
import ProductsClient from "./ProductsClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
    try {
        console.log("SERVER: Fetching public products...");
        // Fetch directly on server
        const [products, categories] = await Promise.all([
            prisma.product.findMany({
                where: {
                    isActive: true
                },
                include: {
                    images: {
                        take: 1
                    },
                    variants: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.category.findMany({
                orderBy: {
                    name: 'asc'
                }
            })
        ]);

        console.log(`SERVER FETCH: Found ${products.length} public products`);

        return (
            <Suspense fallback={<div className="min-h-screen bg-rich-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-gold-500 animate-spin" /></div>}>
                <ProductsClient 
                    initialProducts={JSON.parse(JSON.stringify(products))} 
                    initialCategories={JSON.parse(JSON.stringify(categories))} 
                />
            </Suspense>
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
