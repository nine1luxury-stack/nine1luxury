import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await request.json();

        // fetch existing booking to check status transition
        const existingBooking = await prisma.booking.findUnique({
            where: { id }
        });

        if (!existingBooking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Handle Stock Updates
        if (data.status && data.status !== existingBooking.status) {
            // 1. If becoming CONFIRMED -> Decrease Stock
            if (data.status === 'CONFIRMED' && existingBooking.status !== 'CONFIRMED') {
                await updateStock(existingBooking.productModel, existingBooking.productSize, -1);
            }
            // 2. If it WAS CONFIRMED and is now CANCELLED (or PENDING) -> Increase Stock (Restock)
            else if (existingBooking.status === 'CONFIRMED' && data.status !== 'CONFIRMED') {
                await updateStock(existingBooking.productModel, existingBooking.productSize, 1);
            }
        }

        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: {
                status: data.status,
                notes: data.notes
            }
        });

        return NextResponse.json(updatedBooking);
    } catch (error) {
        console.error("PATCH /api/bookings/[id] - Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function updateStock(modelName: string | null, size: string | null, change: number) {
    if (!modelName || !size) return;

    try {
        // Find product by name to get its ID
        const product = await prisma.product.findFirst({
            where: { name: modelName }
        });

        if (!product) {
            console.warn(`Product not found for stock update: ${modelName}`);
            return;
        }

        // Find variant and update stock
        // We look for a variant that matches productId and size
        // Note: size might need normalization if case sensitivity is an issue
        const variant = await prisma.productvariant.findFirst({
            where: {
                productId: product.id,
                size: size // Assuming exact match. If logic is more complex, adjust here.
            }
        });

        if (variant) {
            await prisma.productvariant.update({
                where: { id: variant.id },
                data: {
                    stock: { increment: change }
                }
            });
            console.log(`Stock updated for ${modelName} (${size}): ${change > 0 ? '+' : ''}${change}`);
        } else {
             console.warn(`Variant not found for stock update: ${modelName} - ${size}`);
        }

    } catch (err) {
        console.error("Error updating stock:", err);
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.booking.delete({
            where: { id }
        });
        return NextResponse.json({ message: 'Booking deleted' });
    } catch (error) {
        console.error("DELETE /api/bookings/[id] - Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
