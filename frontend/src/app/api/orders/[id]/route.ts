import { NextResponse } from 'next/server';

// export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
// import { OrderStatus } from '@prisma/client';

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await request.json();

        if (body.status) {
             const updatedOrder = await prisma.order.update({
                 where: { id },
                 data: { status: body.status as any },
                 include: { items: true, user: true }
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
        const { id } = await context.params;
        await prisma.order.delete({ where: { id } });
        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error(`DELETE /api/orders/[id] - Error:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
