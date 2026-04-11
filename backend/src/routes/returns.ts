import { Router } from 'express';
import { prisma } from '../config/db';

const router = Router();

// GET /returns
router.get('/', async (req, res) => {
    try {
        const returns = await prisma.returnrequest.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(returns);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch returns' });
    }
});

// POST /returns
router.post('/', async (req, res) => {
    try {
        const returnReq = await prisma.returnrequest.create({ data: req.body });
        res.status(201).json(returnReq);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create return request' });
    }
});

// PATCH /returns/:id
router.patch('/:id', async (req, res) => {
    try {
        const returnReq = await prisma.returnrequest.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(returnReq);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update return request' });
    }
});

export default router;
