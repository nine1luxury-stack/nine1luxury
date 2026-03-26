import { prisma } from "@/lib/db";
import ProductsClient from "./ProductsClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
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

    return (
        <Suspense fallback={<div className="min-h-screen bg-rich-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-gold-500 animate-spin" /></div>}>
            <ProductsClient 
                initialProducts={JSON.parse(JSON.stringify(products))} 
                initialCategories={JSON.parse(JSON.stringify(categories))} 
            />
        </Suspense>
    );
}
