import { prisma } from '@/lib/db';
import AdminProductsClient from './AdminProductsClient';

// Ensure this page is always dynamic and fetched fresh from DB
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function AdminProductsPage() {
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

    // Handle mapping/formatting if needed (Prisma dates are Objects, but Next 15+ handles them better now)
    // We pass them to the client component for instant hydration
    return (
        <AdminProductsClient 
            initialProducts={JSON.parse(JSON.stringify(products))} 
            initialCategories={JSON.parse(JSON.stringify(categories))} 
        />
    );
}
