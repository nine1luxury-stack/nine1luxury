import { Router } from 'express';
import { prisma } from '../config/db';

const router = Router();

// GET /expenses
router.get('/', async (req, res) => {
    try {
        const expenses = await prisma.expense.findMany({ orderBy: { date: 'desc' } });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

// POST /expenses
router.post('/', async (req, res) => {
    try {
        const expense = await prisma.expense.create({
            data: {
                ...req.body,
                amount: parseFloat(req.body.amount),
                date: req.body.date ? new Date(req.body.date) : undefined,
            }
        });
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create expense' });
    }
});

// DELETE /expenses/:id
router.delete('/:id', async (req, res) => {
    try {
        await prisma.expense.delete({ where: { id: req.params.id } });
        res.json({ message: 'Expense deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete expense' });
    }
});

export default router;
