import { Router } from 'express';
import { prisma } from '../config/db';

const router = Router();

// GET /offers
router.get('/', async (req, res) => {
    try {
        const { active } = req.query;
        const where = active === 'true' ? { isActive: true } : {};
        const offers = await prisma.offer.findMany({ where, orderBy: { createdAt: 'desc' } });
        res.json(offers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch offers' });
    }
});

// POST /offers
router.post('/', async (req, res) => {
    try {
        const offer = await prisma.offer.create({ data: req.body });
        res.status(201).json(offer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create offer' });
    }
});

// PATCH /offers/:id
router.patch('/:id', async (req, res) => {
    try {
        const offer = await prisma.offer.update({ where: { id: req.params.id }, data: req.body });
        res.json(offer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update offer' });
    }
});

// DELETE /offers/:id
router.delete('/:id', async (req, res) => {
    try {
        await prisma.offer.delete({ where: { id: req.params.id } });
        res.json({ message: 'Offer deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete offer' });
    }
});

export default router;
