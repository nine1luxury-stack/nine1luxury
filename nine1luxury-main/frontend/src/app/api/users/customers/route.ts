import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        
        let where: any = {};
        
        if (search) {
            where = {
                OR: [
                    { name: { contains: search } },
                    { email: { contains: search } },
                    { guestName: { contains: search } },
                    { guestPhone: { contains: search } }
                ]
            };
        }

        // Fetch registered users
        const users = await prisma.user.findMany({
            where: search ? {
                 OR: [
                    { name: { contains: search } },
                    { email: { contains: search } }
                 ]
            } : undefined,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                _count: {
                    select: { orders: true }
                }
            }
        });

        // Also fetch "Guest" customers from Orders who don't have IDs or match search
        // This is complex in Prisma without raw SQL for grouping unique guests. 
        // For now, let's just return Users and maybe basic Guest aggregation if needed.
        // User wants "Customers". Typically this means User model + Guests.
        // Let's simplified approach: Get Users, and separately get unique Guest info from Orders.
        
        const guests = await prisma.order.findMany({
            where: {
                userId: null,
                ...(search ? {
                     OR: [
                        { guestName: { contains: search } },
                        { guestPhone: { contains: search } }
                     ]
                } : {})
            },
            select: {
                guestName: true,
                guestPhone: true,
                totalAmount: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        // Group guests manually
        const guestMap = new Map();
        guests.forEach(order => {
             const key = order.guestPhone || order.guestName || 'Unknown';
             if (!guestMap.has(key)) {
                 guestMap.set(key, {
                     id: `guest-${key}`,
                     name: order.guestName || 'زائر',
                     phone: order.guestPhone,
                     type: 'Guest',
                     totalOrders: 0,
                     totalSpent: 0,
                     lastOrderDate: order.createdAt
                 });
             }
             const entry = guestMap.get(key);
             entry.totalOrders += 1;
             entry.totalSpent += order.totalAmount;
             if (new Date(order.createdAt) > new Date(entry.lastOrderDate)) {
                 entry.lastOrderDate = order.createdAt;
             }
        });

        // Calculate totals for Users
        const usersWithStats = await Promise.all(users.map(async (user) => {
             const aggregations = await prisma.order.aggregate({
                 where: { userId: user.id },
                 _sum: { totalAmount: true },
                 _max: { createdAt: true }
             });
             
             return {
                 id: user.id,
                 name: user.name,
                 email: user.email,
                 type: 'User',
                 totalOrders: user._count.orders,
                 totalSpent: aggregations._sum.totalAmount || 0,
                 lastOrderDate: aggregations._max.createdAt || new Date() // Fallback if no orders
             };
        }));

        const combined = [...usersWithStats, ...Array.from(guestMap.values())];

        // Sort by last order date desc
        combined.sort((a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime());

        return NextResponse.json(combined);
    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }
}
