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

        const expense = await prisma.expense.update({
            where: { id },
            data: {
                amount: parseFloat(data.amount),
                category: data.category,
                description: data.description || null,
                date: new Date(data.date),
            }
        });

        return NextResponse.json(expense);
    } catch (error) {
        console.error("PATCH /api/expenses/[id] - Error:", error);
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
        console.log(`[API] Deleting expense: ${id}`);

        // Use deleteMany to avoid throwing if not found, making it more robust
        const result = await prisma.expense.deleteMany({
            where: { id }
        });

        if (result.count === 0) {
            console.warn(`[API] Expense not found for deletion: ${id}`);
        }

        return NextResponse.json({ success: true, count: result.count });
    } catch (error) {
        console.error("DELETE /api/expenses/[id] - Error:", error);
        return NextResponse.json({
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
