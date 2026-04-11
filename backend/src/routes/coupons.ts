import { Router } from 'express';
import { prisma } from '../config/db';

const router = Router();

// GET /coupons
router.get('/', async (req, res) => {
    try {
        const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch coupons' });
    }
});

// POST /coupons
router.post('/', async (req, res) => {
    try {
        const coupon = await prisma.coupon.create({ data: req.body });
        res.status(201).json(coupon);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create coupon' });
    }
});

// POST /coupons/apply
router.post('/apply', async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await prisma.coupon.findUnique({ where: { code } });
        if (!coupon || !coupon.isActive) {
            return res.status(404).json({ error: 'Coupon not found or inactive' });
        }
        res.json(coupon);
    } catch (error) {
        res.status(500).json({ error: 'Failed to apply coupon' });
    }
});

// DELETE /coupons/:id
router.delete('/:id', async (req, res) => {
    try {
        await prisma.coupon.delete({ where: { id: req.params.id } });
        res.json({ message: 'Coupon deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete coupon' });
    }
});

export default router;
