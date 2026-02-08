import { NextResponse } from 'next/server';

// export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
// import { OrderStatus } from '@prisma/client';

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await context.params;
        const id = Number(idStr);
        const body = await request.json();

        if (body.status) {
            const newStatus = body.status;

            // Fetch current order to check transition
            const currentOrder = await prisma.order.findUnique({
                where: { id },
                include: { items: true }
            });

            if (!currentOrder) {
                return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            }

            const oldStatus = currentOrder.status;
            const committedStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

            const updatedOrder = await prisma.$transaction(async (tx) => {
                const updated = await tx.order.update({
                    where: { id },
                    data: { status: newStatus as any },
                    include: { items: true, user: true }
                });

                const isNewCommitted = committedStatuses.includes(newStatus);
                const isOldCommitted = committedStatuses.includes(oldStatus);

                // 1. If moving FROM non-committed TO committed, decrement stock
                if (isNewCommitted && !isOldCommitted) {
                    for (const item of currentOrder.items) {
                        if (item.variantId) {
                            await tx.productvariant.update({
                                where: { id: item.variantId },
                                data: { stock: { decrement: item.quantity } }
                            });
                        }
                    }
                }

                // 2. If moving FROM committed TO non-committed, increment stock back
                if (!isNewCommitted && isOldCommitted) {
                    for (const item of currentOrder.items) {
                        if (item.variantId) {
                            await tx.productvariant.update({
                                where: { id: item.variantId },
                                data: { stock: { increment: item.quantity } }
                            });
                        }
                    }
                }

                return updated;
            });

            return NextResponse.json(updatedOrder);
        }

        return NextResponse.json({ error: 'No update data provided' }, { status: 400 });

    } catch (error) {
        console.error(`PATCH /api/orders/[id] - Error:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await context.params;
        const id = Number(idStr);

        const order = await prisma.order.findUnique({
            where: { id },
            include: { items: true }
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const committedStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

        await prisma.$transaction(async (tx) => {
            // Restore stock if the order was in a committed status
            if (committedStatuses.includes(order.status)) {
                for (const item of order.items) {
                    if (item.variantId) {
                        await tx.productvariant.update({
                            where: { id: item.variantId },
                            data: { stock: { increment: item.quantity } }
                        });
                    }
                }
            }

            await tx.order.delete({ where: { id } });
        });

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error(`DELETE /api/orders/[id] - Error:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
