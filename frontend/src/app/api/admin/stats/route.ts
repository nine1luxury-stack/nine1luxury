import { NextResponse } from 'next/server';
import { prisma, withDbTimeout } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const now = new Date();
        const last30Days = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const last60Days = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

        const stats = await withDbTimeout(async () => {
            // 1. Current Metrics
            const totalOrders = await prisma.order.count();
            const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } });
            
            const salesAggregate = await prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: { status: { not: 'CANCELLED' } }
            });
            const totalSales = salesAggregate._sum.totalAmount || 0;

            const newCustomers = await prisma.customer.count({
                where: { createdAt: { gte: last30Days } }
            });

            // 2. Previous Window Metrics (for trends)
            const prevTotalOrders = await prisma.order.count({
                where: { createdAt: { lt: last30Days, gte: last60Days } }
            });
            
            const prevSalesAggregate = await prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: { 
                    status: { not: 'CANCELLED' },
                    createdAt: { lt: last30Days, gte: last60Days }
                }
            });
            const prevSales = prevSalesAggregate._sum.totalAmount || 0;

            const prevCustomers = await prisma.customer.count({
                where: { createdAt: { lt: last30Days, gte: last60Days } }
            });

            // 3. Recent Orders
            const recentOrders = await prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true } }
                }
            });

            return {
                metrics: {
                    totalOrders: {
                        value: totalOrders,
                        trend: calculateTrend(totalOrders, prevTotalOrders)
                    },
                    totalSales: {
                        value: totalSales,
                        trend: calculateTrend(totalSales, prevSales)
                    },
                    newCustomers: {
                        value: newCustomers,
                        trend: calculateTrend(newCustomers, prevCustomers)
                    },
                    pendingOrders: {
                        value: pendingOrders,
                        // For pending, maybe we don't show a trend or show vs last window
                        trend: calculateTrend(pendingOrders, await prisma.order.count({ where: { status: 'PENDING', createdAt: { lt: last30Days, gte: last60Days } } }))
                    }
                },
                recentOrders
            };
        });

        return NextResponse.json(stats);
    } catch (error: any) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
    }
}

function calculateTrend(current: number, previous: number): string {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const trend = ((current - previous) / previous) * 100;
    const sign = trend >= 0 ? "+" : "";
    return `${sign}${Math.round(trend)}%`;
}
