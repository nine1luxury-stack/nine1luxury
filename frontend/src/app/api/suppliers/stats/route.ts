import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const suppliers = await prisma.supplier.findMany({
            orderBy: { name: 'asc' }
        });
        
        // Return dummy stats matching the UI's expectations
        const stats = suppliers.map(s => ({
            id: s.id,
            name: s.name,
            description: s.description,
            onTimeRate: 100, // Dummy
            totalSpent: s.manualTotalPurchases,
            totalPaid: s.manualTotalPaid
        }));

        return NextResponse.json(stats);
    } catch (error) {
        console.error("GET /api/suppliers/stats - Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
