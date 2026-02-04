import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendReservationNotification } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        // Validation
        if (!data.name || data.name.length < 3) {
            return NextResponse.json({ error: 'الاسم يجب أن يكون 3 أحرف على الأقل' }, { status: 400 });
        }

        const phoneRegex = /^01[0125][0-9]{8}$/;
        if (!data.phone || !phoneRegex.test(data.phone)) {
            return NextResponse.json({ error: 'رقم الهاتف غير صحيح. يجب أن يتكون من 11 رقم ويبدأ بـ 01' }, { status: 400 });
        }

        if (!data.city || !data.productModel) {
            return NextResponse.json({ error: 'جميع الحقول المطلوبة يجب ملؤها' }, { status: 400 });
        }

        const newBooking = await prisma.booking.create({
            data: {
                name: data.name,
                phone: data.phone,
                city: data.city,
                shippingAmount: data.shippingAmount || 0,
                productModel: data.productModel,
                productSize: data.productSize,
                notes: data.notes || '',
                type: 'RESERVATION',
                status: 'PENDING'
            }
        });

        // Send notification email
        try {
            await sendReservationNotification(newBooking);
        } catch (emailError) {
            console.error("Email notification failed:", emailError);
        }

        // Create in-app notification
        await prisma.notification.create({
            data: {
                title: 'حجز جديد',
                description: `تم استلام حجز جديد من ${data.name} للموديل ${data.productModel}`,
                type: 'system', // or specific booking type if needed
            }
        });

        return NextResponse.json(newBooking);
    } catch (error) {
        console.error("POST /api/bookings - Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const bookings = await prisma.booking.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(bookings);
    } catch (error) {
        console.error("GET /api/bookings - Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
