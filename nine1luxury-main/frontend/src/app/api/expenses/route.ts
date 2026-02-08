import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const expenses = await prisma.expense.findMany({
            orderBy: { date: 'desc' }
        });
        return NextResponse.json(expenses);
    } catch (error) {
        console.error("GET /api/expenses - Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        if (!data.amount || !data.category) {
            return NextResponse.json({ error: 'Amount and Category are required' }, { status: 400 });
        }

        const expense = await prisma.expense.create({
            data: {
                amount: parseFloat(data.amount),
                category: data.category,
                description: data.description || null,
                date: data.date ? new Date(data.date) : new Date(),
            }
        });

        return NextResponse.json(expense);
    } catch (error) {
        console.error("POST /api/expenses - Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
