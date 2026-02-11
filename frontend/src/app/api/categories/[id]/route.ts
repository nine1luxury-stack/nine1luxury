import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { name } = await request.json();
        const { id } = params;

        // Update all products with this category name to keep strings in sync
        const oldCategory = await prisma.category.findUnique({ where: { id } });

        const category = await prisma.category.update({
            where: { id },
            data: { name }
        });

        if (oldCategory && oldCategory.name !== name) {
            await prisma.product.updateMany({
                where: { category: oldCategory.name },
                data: { category: name }
            });
        }

        return NextResponse.json(category);
    } catch (error: any) {
        console.error('Error updating category:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        await prisma.category.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting category:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
