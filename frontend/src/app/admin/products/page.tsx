import { prisma } from '@/lib/db';
import AdminProductsClient from './AdminProductsClient';

// Ensure this page is always dynamic and fetched fresh from DB
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function AdminProductsPage() {
    try {
        console.log("SERVER: Fetching admin products...");
        // Fetch products and categories in parallel directly on the server
        const [products, categories] = await Promise.all([
            prisma.product.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    discount: true,
                    category: true,
                    isActive: true,
                    featured: true,
                    createdAt: true,
                    updatedAt: true,
                    model: true,
                    description: true, // Admin might need description for editing, but let's see. 
                    // Actually, if we want extreme speed, we should only fetch list fields and fetch details on demand.
                    // But Admin Client likely expects them.
                    images: {
                        select: {
                            id: true,
                            url: true,
                            color: true
                        }
                    },
                    variants: {
                        select: {
                            id: true,
                            size: true,
                            color: true,
                            colorHex: true,
                            stock: true,
                            damagedStock: true,
                            sku: true
                        }
                    }
                }
            }),
            prisma.category.findMany({
                orderBy: {
                    name: 'asc'
                }
            })
        ]);

        console.log(`SERVER FETCH: Found ${products.length} products and ${categories.length} categories`);

        const serializedProducts = JSON.parse(JSON.stringify(products));
        const serializedCategories = JSON.parse(JSON.stringify(categories));

        return (
            <AdminProductsClient 
                initialProducts={serializedProducts} 
                initialCategories={serializedCategories} 
            />
        );
    } catch (error) {
        console.error("SERVER ERROR in AdminProductsPage:", error);
        return (
            <div className="p-20 text-center">
                <h1 className="text-red-500 text-2xl font-bold">حدث خطأ أثناء تحميل المنتجات من السيرفر</h1>
                <p className="text-gray-400 mt-4">{(error as any).message}</p>
                <AdminProductsClient initialProducts={[]} initialCategories={[]} />
            </div>
        );
    }
}
