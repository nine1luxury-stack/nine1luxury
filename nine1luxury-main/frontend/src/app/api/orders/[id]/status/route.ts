import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await context.params;
        const id = Number(idStr);
        const body = await request.json();

        if (!body.status) {
            return NextResponse.json({ message: 'Status is required' }, { status: 400 });
        }

        const newStatus = body.status;

        // Fetch current order to check transition
        const currentOrder = await prisma.order.findUnique({
            where: { id },
            include: { items: true }
        });

        if (!currentOrder) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        const oldStatus = currentOrder.status;

        // Use transaction to ensure both order status and stock are updated atomically
        const updatedOrder = await prisma.$transaction(async (tx) => {
            const updated = await tx.order.update({
                where: { id },
                data: { status: newStatus },
                include: { items: true }
            });

            // 1. If moving TO Delivered status, decrement stock
            if (newStatus === 'DELIVERED' && oldStatus !== 'DELIVERED') {
                for (const item of currentOrder.items) {
                    if (item.variantId) {
                        await tx.productvariant.update({
                            where: { id: item.variantId },
                            data: {
                                stock: {
                                    decrement: item.quantity
                                }
                            }
                        });
                    }
                }
            }

            // 2. If moving AWAY FROM Delivered status, increment stock back
            if (oldStatus === 'DELIVERED' && newStatus !== 'DELIVERED') {
                for (const item of currentOrder.items) {
                    if (item.variantId) {
                        await tx.productvariant.update({
                            where: { id: item.variantId },
                            data: {
                                stock: {
                                    increment: item.quantity
                                }
                            }
                        });
                    }
                }
            }

            return updated;
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error('PATCH /api/orders/[id]/status - Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
