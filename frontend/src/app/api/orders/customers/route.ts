import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

export async function GET() {
    try {
        const response = await fetch(`${BACKEND_URL}/orders/customers`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch customers' }, { status: response.status });
        }

        const customers = await response.json();
        return NextResponse.json(customers);
    } catch (error) {
        console.error("GET /api/orders/customers - Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
