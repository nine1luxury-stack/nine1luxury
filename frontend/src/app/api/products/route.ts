import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const featured = searchParams.get('featured');

        const where: Record<string, string | boolean> = {};
        if (category) where.category = category;
        if (featured === 'true') where.featured = true;

        const products = await prisma.product.findMany({
            where,
            include: {
                productimage: true,
                productvariant: true,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        const formattedProducts = products.map((p: any) => ({
            ...p,
            images: p.productimage,
            variants: p.productvariant,
        }));

        return NextResponse.json(formattedProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Basic validation
        if (!data.name || !data.price || !data.category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name: data.name,
                model: data.model || '',
                description: data.description || '',
                price: parseFloat(data.price),
                discount: data.discount ? parseFloat(data.discount) : null,
                category: data.category,
                featured: data.featured || false,
                isActive: data.isActive !== false, // Default to true
                images: {
                    create: data.images?.map((img: { url: string, color?: string }) => ({
                        url: img.url,
                        color: img.color
                    })) || []
                },
                variants: {
                    create: data.variants?.map((v: { color: string, colorHex?: string, size: string, stock: string | number, sku?: string }) => ({
                        color: v.color,
                        colorHex: v.colorHex || '#000000',
                        size: v.size,
                        stock: typeof v.stock === 'string' ? parseInt(v.stock) : v.stock || 0,
                        sku: v.sku
                    })) || []
                }
            },
            include: {
                productimage: true,
                productvariant: true
            }
        });

        const formattedProduct = {
            ...product,
            images: (product as any).productimage,
            variants: (product as any).productvariant,
        };

        return NextResponse.json(formattedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
