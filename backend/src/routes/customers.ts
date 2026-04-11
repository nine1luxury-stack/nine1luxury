import { Router } from 'express';
import { prisma } from '../config/db';

const router = Router();

// GET /customers
router.get('/', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

// GET /customers/:id
router.get('/:id', async (req, res) => {
    try {
        const customer = await prisma.customer.findUnique({ where: { id: req.params.id } });
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customer' });
    }
});

export default router;
