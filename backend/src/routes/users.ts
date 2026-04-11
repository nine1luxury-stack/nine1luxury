import { Router } from 'express';
import { prisma } from '../config/db';

const router = Router();

// GET /users
router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, createdAt: true }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// GET /users/customers - Aggregated customers view
router.get('/customers', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true, name: true, email: true, role: true,
                _count: { select: { order: true } }
            }
        });

        const guests = await prisma.order.findMany({
            where: { userId: null },
            select: { guestName: true, guestPhone: true, totalAmount: true, createdAt: true },
            orderBy: { createdAt: 'desc' }
        });

        // Group guests
        const guestMap = new Map<string, any>();
        guests.forEach(order => {
            const key = order.guestPhone || order.guestName || 'Unknown';
            if (!guestMap.has(key)) {
                guestMap.set(key, { id: `guest-${key}`, name: order.guestName || 'زائر', phone: order.guestPhone, type: 'Guest', totalOrders: 0, totalSpent: 0, lastOrderDate: order.createdAt });
            }
            const entry = guestMap.get(key);
            entry.totalOrders += 1;
            entry.totalSpent += order.totalAmount;
        });

        const usersWithStats = await Promise.all(users.map(async (user) => {
            const agg = await prisma.order.aggregate({
                where: { userId: user.id },
                _sum: { totalAmount: true },
                _max: { createdAt: true }
            });
            return {
                id: user.id, name: user.name, email: user.email, type: 'User',
                totalOrders: user._count.order,
                totalSpent: agg._sum.totalAmount || 0,
                lastOrderDate: agg._max.createdAt || new Date()
            };
        }));

        const combined = [...usersWithStats, ...Array.from(guestMap.values())];
        combined.sort((a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime());
        res.json(combined);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

export default router;
