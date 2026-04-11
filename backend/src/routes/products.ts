import { Router } from 'express';
import { prisma, withDbTimeout } from '../config/db';

const router = Router();

// GET /products
router.get('/', async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, featured } = req.query;

        let where: any = { isActive: true };

        if (search) {
            where.OR = [
                { name: { contains: search as string } },
                { description: { contains: search as string } }
            ];
        }

        if (category) {
            where.category = category;
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice as string);
            if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
        }

        if (featured === 'true') {
            where.featured = true;
        }

        const products = await withDbTimeout(() => 
            prisma.product.findMany({
                where,
                include: {
                    images: true,
                    variants: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        );

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET /products/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const product = await withDbTimeout(() =>
            prisma.product.findUnique({
                where: { id },
                include: {
                    images: true,
                    variants: true
                }
            })
        );

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
         console.error('Error fetching product:', error);
         res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// POST /products (Admin)
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        
        // Simplified creation
        const product = await prisma.product.create({
            data: {
                name: data.name,
                description: data.description || '',
                price: parseFloat(data.price),
                category: data.category,
                images: {
                    create: data.images?.map((url: string) => ({ url })) || []
                },
                variants: {
                    create: data.variants || []
                }
            }
        });
        
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

export default router;
