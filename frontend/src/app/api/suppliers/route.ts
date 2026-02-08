import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const suppliers = await prisma.supplier.findMany({
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(suppliers);
    } catch (error) {
        console.error("GET /api/suppliers - Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        if (!data.name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const supplier = await prisma.supplier.create({
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
        console.error("POST /api/suppliers - Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
