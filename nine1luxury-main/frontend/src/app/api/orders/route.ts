import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendOrderNotification } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: true,
                user: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(orders);
    } catch (error) {
        console.error("GET /api/orders - Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

interface OrderItemInput {
    productId: string;
    variantId: string;
    quantity: number;
    price: number | string;
    name?: string;
    size?: string;
    color?: string;
}

export async function POST(request: Request) {
    console.error("🔥 API ROUTE HIT: /api/orders");
    try {
        const data = await request.json();

        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId: data.userId || undefined,
                    guestName: data.guestName,
                    guestPhone: data.guestPhone,
                    guestAddress: data.guestAddress,
                    guestCity: data.guestCity,
                    totalAmount: parseFloat(data.totalAmount),
                    status: 'PENDING',
                    paymentMethod: data.paymentMethod || 'CASH_ON_DELIVERY',
                    items: {
                        create: data.items.map((item: OrderItemInput) => ({
                            productId: item.productId,
                            variantId: item.variantId,
                            quantity: item.quantity,
                            price: parseFloat(item.price.toString())
                        }))
                    }
                },
                include: { items: true }
            });

            // Decrease stock for each item
            for (const item of data.items) {
                if (item.variantId) {
                    await tx.productvariant.update({
                        where: { id: item.variantId },
                        data: {
                            stock: {
                                decrement: item.quantity
                            }
                        }
                    });
                }
            }

            return newOrder;
        });

        // 📨 Email Notification Logic - Simplified through lib
        try {
            // Re-map items to include descriptive info for the email
            const emailItems = data.items.map((item: OrderItemInput) => ({
                productId: item.name || item.productId,
                variantId: `${item.size || ''} ${item.color || ''}`.trim(),
                quantity: item.quantity,
                price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
            }));

            await sendOrderNotification({
                ...data,
                items: emailItems
            });
            console.log("✅ Email sent successfully for order:", order.id);
        } catch (mailError) {
            console.error("❌ Email Error:", mailError);
        }

        // Create in-app notification
        await prisma.notification.create({
            data: {
                title: 'طلب جديد',
                description: `طلب جديد من ${data.guestName} بقيمة ${data.totalAmount} ج.م`,
                type: 'order',
            }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error("❌ POST /api/orders Error:", error);
        return NextResponse.json({ error: 'Order Creation Failed' }, { status: 500 });
    }
}
