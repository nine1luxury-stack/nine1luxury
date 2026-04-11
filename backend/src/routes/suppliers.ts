import { Router } from 'express';
import { prisma } from '../config/db';

const router = Router();

// GET /suppliers
router.get('/', async (req, res) => {
    try {
        const suppliers = await prisma.supplier.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch suppliers' });
    }
});

// POST /suppliers
router.post('/', async (req, res) => {
    try {
        const supplier = await prisma.supplier.create({ data: req.body });
        res.status(201).json(supplier);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create supplier' });
    }
});

// PATCH /suppliers/:id
router.patch('/:id', async (req, res) => {
    try {
        const supplier = await prisma.supplier.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update supplier' });
    }
});

// DELETE /suppliers/:id
router.delete('/:id', async (req, res) => {
    try {
        await prisma.supplier.delete({ where: { id: req.params.id } });
        res.json({ message: 'Supplier deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete supplier' });
    }
});

export default router;
