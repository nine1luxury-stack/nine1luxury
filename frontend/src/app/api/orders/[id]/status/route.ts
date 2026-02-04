import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await request.json();

        if (!body.status) {
            return NextResponse.json({ message: 'Status is required' }, { status: 400 });
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status: body.status },
            include: { items: true }
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
