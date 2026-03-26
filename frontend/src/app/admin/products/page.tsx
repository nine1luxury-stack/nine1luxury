import AdminProductsClient from './AdminProductsClient';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Page() {
    const productsFromDb = await prisma.product.findMany({
        include: {
            images: true,
            variants: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedProducts = productsFromDb.map((p) => ({
        ...p,
        images: (p as any).images || (p as any).productimage,
        variants: (p as any).variants || (p as any).productvariant,
    }));

    return <AdminProductsClient initialProducts={formattedProducts as any} />;
}
