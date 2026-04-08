import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const returns = await prisma.returnrequest.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(returns);
    } catch (error) {
        console.error("GET /api/returns - Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        // Basic validation
        if (!data.orderId || !data.productId || !data.quantity) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newReturn = await prisma.returnrequest.create({
            data: {
                orderId: data.orderId,
                productId: data.productId,
                variantId: data.variantId || null,
                quantity: parseInt(data.quantity),
                type: data.type || 'VALID',
                status: 'PENDING',
                notes: data.notes || ''
            }
        });

        return NextResponse.json(newReturn);
    } catch (error) {
        console.error("POST /api/returns - Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
