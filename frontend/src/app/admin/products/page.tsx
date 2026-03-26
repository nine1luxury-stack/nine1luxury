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
                include: {
                    images: true,
                    variants: true
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
