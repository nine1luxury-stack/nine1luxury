import { NextResponse } from 'next/server';
import { prisma, withDbTimeout } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const all = searchParams.get('all') === 'true';

        const testimonials = await withDbTimeout(() => prisma.testimonial.findMany({
            where: all ? {} : { isActive: true },
            orderBy: { createdAt: 'desc' }
        }));
        return NextResponse.json(testimonials);
    } catch (error: any) {
        console.error('Error fetching testimonials:', error);
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        if (!data.name || !data.content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const testimonial = await prisma.testimonial.create({
            data: {
                name: data.name,
                content: data.content,
                rating: parseInt(data.rating) || 5,
                role: data.role || "عميل"
            }
        });

        return NextResponse.json(testimonial);
    } catch (error: any) {
        console.error('Error creating testimonial:', error);
        return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const data = await request.json();
        if (!data.id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const updated = await prisma.testimonial.update({
            where: { id: data.id },
            data: { isActive: data.isActive }
        });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const data = await request.json();
        if (!data.id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        await prisma.testimonial.delete({
            where: { id: data.id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
