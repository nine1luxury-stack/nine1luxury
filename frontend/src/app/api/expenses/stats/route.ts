import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const expenses = await prisma.expense.findMany();
        
        const byCategory = expenses.reduce((acc: any, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {});

        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        return NextResponse.json({
            total,
            byCategory,
            count: expenses.length
        });
    } catch (error) {
        console.error("GET /api/expenses/stats - Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
