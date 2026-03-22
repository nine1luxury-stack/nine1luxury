import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                images: true,
                variants: true,
            },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const formattedProduct = {
            ...product,
            images: (product as any).images || (product as any).productimage,
            variants: (product as any).variants || (product as any).productvariant,
        };

        return NextResponse.json(formattedProduct);
    } catch (error: any) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Failed to fetch product', details: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const data = await request.json();

        // 1. Prepare update data - only include defined fields
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.price !== undefined) updateData.price = parseFloat(data.price);
        if (data.discount !== undefined) updateData.discount = data.discount === null ? null : parseFloat(data.discount);
        if (data.category !== undefined) updateData.category = data.category;
        if (data.featured !== undefined) updateData.featured = data.featured;
        if (data.isActive !== undefined) updateData.isActive = data.isActive;
        if (data.reorderPoint !== undefined) updateData.reorderPoint = Number(data.reorderPoint);
        if (data.sizeChartImage !== undefined) updateData.sizeChartImage = data.sizeChartImage || null;

        // 2. Update basic fields if any
        if (Object.keys(updateData).length > 0) {
            await prisma.product.update({
                where: { id },
                data: updateData
            });
        }

        // 3. Handle Variants update
        if (data.variants) {
            if (Array.isArray(data.variants)) {
                // Sync approach: Delete all and recreate
                await prisma.productvariant.deleteMany({ where: { productId: id } });
                await prisma.productvariant.createMany({
                    data: data.variants.map((v: any) => ({
                        color: v.color,
                        colorHex: v.colorHex || '#000000',
                        size: v.size,
                        stock: v.stock || 0,
                        damagedStock: v.damagedStock || 0,
                        sku: v.sku,
                        productId: id
                    }))
                });
            } else {
                // Specific update logic passed from frontend (smart update)
                if (data.variants.update) {
                    for (const variantUpdate of data.variants.update) {
                        try {
                            await prisma.productvariant.update({
                                where: { id: variantUpdate.where.id },
                                data: variantUpdate.data
                            });
                        } catch (e) {
                            console.error(`Failed to update variant ${variantUpdate.where.id}:`, e);
                        }
                    }
                }

                if (data.variants.create) {
                    for (const variantCreate of data.variants.create) {
                        await prisma.productvariant.create({
                            data: {
                                ...variantCreate,
                                productId: id
                            }
                        });
                    }
                }
            }
        }

        // 4. Handle Images sync if provided as array
        if (data.images && Array.isArray(data.images)) {
            await prisma.productimage.deleteMany({ where: { productId: id } });
            await prisma.productimage.createMany({
                data: data.images.map((img: any) => ({
                    url: img.url,
                    color: img.color,
                    productId: id
                }))
            });
        }

        const freshProduct = await prisma.product.findUnique({
            where: { id },
            include: { images: true, variants: true }
        });

        const formattedProduct = {
            ...freshProduct,
            images: (freshProduct as any).images || (freshProduct as any).productimage,
            variants: (freshProduct as any).variants || (freshProduct as any).productvariant,
        };

        return NextResponse.json(formattedProduct);
    } catch (error: any) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Failed to update product', details: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Failed to delete product', details: error.message }, { status: 500 });
    }
}
