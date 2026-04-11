import { Router } from 'express';
import { prisma } from '../config/db';

const router = Router();

// GET /notifications
router.get('/', async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// PATCH /notifications/:id/read
router.patch('/:id/read', async (req, res) => {
    try {
        const notification = await prisma.notification.update({
            where: { id: req.params.id },
            data: { read: true }
        });
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark as read' });
    }
});

export default router;
