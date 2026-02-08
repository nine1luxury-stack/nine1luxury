import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await context.params;
        const id = Number(idStr);
        const data = await request.json();

        const customer = await prisma.customer.update({
            where: { id },
            data: {
                name: data.name,
                phone: data.phone,
            }
        });

        return NextResponse.json(customer);
    } catch (error) {
        console.error("PUT /api/customers/[id] - Error:", error);
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

        await prisma.customer.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/customers/[id] - Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
