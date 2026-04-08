import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Fetch manual customers
        const manualCustomers = await prisma.customer.findMany();

        // 2. Fetch all orders to aggregate "Automatic" customers
        const allOrders = await prisma.order.findMany({
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        });

        // 3. Map for merging
        const customerMap = new Map();

        // Initial populate from manual table
        manualCustomers.forEach(c => {
            customerMap.set(c.phone, {
                id: c.id,
                name: c.name,
                phone: c.phone,
                totalOrders: c.totalOrders || 0,
                totalSpent: c.totalSpent || 0,
                lastOrderDate: c.lastOrderDate,
                type: 'Manual'
            });
        });

        // Aggregate from orders
        allOrders.forEach(order => {
            const phone = order.guestPhone || ''; // Guest phone
            // If it's a registered user, we might want to group by ID or phone if they have one. 
            // For simplicity and matching user request "Customers who bought from me", phone is the most common denominator.
            const identifier = phone || (order.userId ? `user-${order.userId}` : `guest-${order.id}`);
            
            if (!customerMap.has(identifier)) {
                customerMap.set(identifier, {
                    id: identifier,
                    name: order.guestName || order.user?.name || 'عميل مجهول',
                    phone: phone,
                    totalOrders: 0,
                    totalSpent: 0,
                    lastOrderDate: order.createdAt,
                    type: order.userId ? 'User' : 'Guest'
                });
            }

            const entry = customerMap.get(identifier);
            entry.totalOrders += 1;
            entry.totalSpent += order.totalAmount;
            if (new Date(order.createdAt) > new Date(entry.lastOrderDate)) {
                entry.lastOrderDate = order.createdAt;
            }
        });

        const combined = Array.from(customerMap.values());
        
        // Sort by last activity
        combined.sort((a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime());

        return NextResponse.json(combined);
    } catch (error) {
        console.error("GET /api/customers - Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        if (!data.name || !data.phone) {
            return NextResponse.json({ error: 'Name and Phone are required' }, { status: 400 });
        }

        const customer = await prisma.customer.create({
            data: {
                name: data.name,
                phone: data.phone,
                totalOrders: 0,
                totalSpent: 0,
                lastOrderDate: new Date(),
            }
        });

        return NextResponse.json(customer);
    } catch (error) {
        console.error("POST /api/customers - Error:", error);
        // Check for unique constraint violation
        if ((error as any).code === 'P2002') {
            return NextResponse.json({ error: 'رقم الهاتف مسجل بالفعل' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
