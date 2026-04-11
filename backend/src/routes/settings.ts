import { Router } from 'express';
import { prisma } from '../config/db';

const router = Router();

// GET /settings
router.get('/', async (req, res) => {
    try {
        const settings = await prisma.setting.findMany();
        const obj: Record<string, string> = {};
        settings.forEach(s => { obj[s.key] = s.value; });
        res.json(obj);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// PUT /settings
router.put('/', async (req, res) => {
    try {
        const updates = req.body as Record<string, string>;
        for (const [key, value] of Object.entries(updates)) {
            await prisma.setting.upsert({
                where: { key },
                update: { value },
                create: { key, value }
            });
        }
        res.json({ message: 'Settings saved' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

export default router;
