import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const data = await request.json();

        if (id.startsWith('guest-') || id.startsWith('user-')) {
            // "Promote" guest to manual customer or update existing manual record by phone
            const customer = await prisma.customer.upsert({
                where: { phone: data.phone },
                update: {
                    name: data.name,
                },
                create: {
                    name: data.name,
                    phone: data.phone,
                    totalOrders: 0,
                    totalSpent: 0,
                    lastOrderDate: new Date(),
                }
            });
            return NextResponse.json(customer);
        }

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
        const { id } = await context.params;

        if (id.startsWith('guest-') || id.startsWith('user-')) {
            return NextResponse.json({ error: 'Cannot delete automatic customers' }, { status: 400 });
        }

        await prisma.customer.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/customers/[id] - Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
