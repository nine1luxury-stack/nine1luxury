import { Router } from 'express';
import { prisma } from '../config/db';

const router = Router();

// GET /bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// POST /bookings
router.post('/', async (req, res) => {
    try {
        const booking = await prisma.booking.create({ data: req.body });
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// PATCH /bookings/:id
router.patch('/:id', async (req, res) => {
    try {
        const booking = await prisma.booking.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update booking' });
    }
});

export default router;
