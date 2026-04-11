import { Router } from 'express';
import { prisma } from '../config/db';

const router = Router();

// GET /orders
router.get('/', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: true,
                user: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        console.error('GET /orders Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /orders/:id
router.get('/:id', async (req, res) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: req.params.id },
            include: { items: true, user: { select: { name: true, email: true } } }
        });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /orders
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const order = await prisma.order.create({
            data: {
                userId: data.userId || undefined,
                guestName: data.guestName,
                guestPhone: data.guestPhone,
                guestAddress: data.guestAddress,
                guestCity: data.guestCity,
                totalAmount: parseFloat(data.totalAmount),
                status: 'PENDING',
                paymentMethod: data.paymentMethod || 'CASH_ON_DELIVERY',
                items: {
                    create: data.items.map((item: any) => ({
                        productId: item.productId,
                        variantId: item.variantId,
                        quantity: item.quantity,
                        price: parseFloat(item.price.toString())
                    }))
                }
            },
            include: { items: true }
        });

        await prisma.notification.create({
            data: {
                title: 'طلب جديد',
                description: `طلب جديد من ${data.guestName} بقيمة ${data.totalAmount} ج.م`,
                type: 'order',
            }
        });

        res.status(201).json(order);
    } catch (error) {
        console.error('POST /orders Error:', error);
        res.status(500).json({ error: 'Order creation failed' });
    }
});

// PATCH /orders/:id/status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: { status }
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update status' });
    }
});

export default router;
