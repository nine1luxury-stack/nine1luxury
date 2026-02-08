import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await context.params;
        const id = Number(idStr);
        const data = await request.json();

        const supplier = await prisma.supplier.update({
            where: { id },
            data: {
                name: data.name,
                phone: data.phone || null,
                email: data.email || null,
                description: data.description || null,
                manualTotalPurchases: parseFloat(data.manualTotalPurchases || 0),
                manualTotalPaid: parseFloat(data.manualTotalPaid || 0),
            }
        });

        return NextResponse.json(supplier);
    } catch (error) {
        console.error("PATCH /api/suppliers/[id] - Error:", error);
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

        // Check if supplier has linked items (Optional: handle cascade or restrict)
        await prisma.supplier.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/suppliers/[id] - Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
