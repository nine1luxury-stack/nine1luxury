import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const featured = searchParams.get('featured');
        const limitParam = searchParams.get('limit');
        const all = searchParams.get('all');

        const where: Record<string, string | boolean> = {};
        if (category) where.category = category;
        if (featured === 'true') where.featured = true;

        const limit = limitParam ? parseInt(limitParam) : (all === 'true' ? undefined : 24);

        const products = await prisma.product.findMany({
            where,
            select: {
                id: true,
                name: true,
                price: true,
                discount: true,
                category: true,
                isActive: true,
                createdAt: true,
                images: {
                    take: 1, // Only need the first image for the list
                    select: { id: true, url: true }
                },
                variants: {
                    select: { id: true, size: true, color: true, stock: true }
                }
                // Specifically EXCLUDED: description, sizeChartImage, model
            },
            take: limit || 12,
            orderBy: {
                createdAt: 'desc',
            }
        });

        console.log(`API: Fast fetch returned ${products.length} products`);

        const formattedProducts = products.map((product) => ({
            ...product,
            images: product.images || [],
            variants: product.variants || [],
            // Set defaults for UI compatibility
            description: "",
            model: "",
            sizeChartImage: null
        }));

        return NextResponse.json(formattedProducts);

        console.log(`API: Returning ${formattedProducts.length} formatted products`);
        return NextResponse.json(formattedProducts);

        return NextResponse.json(formattedProducts);
    } catch (error: any) {
        console.error('Error fetching products:', error);
        return NextResponse.json({
            error: 'Failed to fetch products',
            details: error.message
        }, { status: 500 });
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
                sizeChartImage: data.sizeChartImage || null,
                images: {
                    create: data.images?.map((img: { url: string, color?: string }) => ({
                        url: img.url,
                        color: img.color || null
                    })) || []
                },
                variants: {
                    create: data.variants?.map((v: { color: string, colorHex?: string, size: string, stock: string | number, sku?: string }) => ({
                        color: v.color,
                        colorHex: v.colorHex || '#000000',
                        size: v.size,
                        stock: typeof v.stock === 'string' ? parseInt(v.stock) : (v.stock || 0),
                        sku: v.sku || null
                    })) || []
                }
            },
            include: {
                images: true,
                variants: true
            }
        });


        const formattedProduct = {
            ...product,
            images: (product as any).images || (product as any).productimage,
            variants: (product as any).variants || (product as any).productvariant,
        };

        return NextResponse.json(formattedProduct);
    } catch (error: any) {
        console.error('Error creating product:', error);
        return NextResponse.json({
            error: 'Failed to create product',
            details: error.message
        }, { status: 500 });
    }
}
