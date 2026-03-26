import { ProductsClient } from "./ProductsClient";
import { prisma } from "@/lib/db";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// Cache duration for the static generation (revalidate every 60 seconds)
export const revalidate = 60;

export default async function ProductsPage() {
    // Determine categories using Server-side fetch.
    const dbCategories = await prisma.category.findMany({
        select: { name: true },
        orderBy: { name: 'asc' }
    });

    // Fetch products optimized via Prisma select
    // Fetching only what is strictly necessary for listing and filtering
    const productsData = await prisma.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            model: true,
            price: true,
            discount: true,
            category: true,
            images: {
                select: {
                    url: true,
                    color: true
                }
            },
            variants: {
                select: {
                    size: true,
                    color: true,
                    stock: true
                }
            }
        }
    });

    return (
        <Suspense fallback={<div className="min-h-screen bg-rich-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-gold-500 animate-spin" /></div>}>
            <ProductsClient initialProducts={productsData} initialCategories={dbCategories} />
        </Suspense>
    );
}
