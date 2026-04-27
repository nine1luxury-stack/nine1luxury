import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendOrderNotification } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                images: { select: { url: true } }
                            }
                        },
                        variant: {
                            select: {
                                color: true,
                                colorHex: true,
                                size: true,
                                sku: true
                            }
                        }
                    }
                },
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
        
        // ═══ Stock Validation — Prevent overselling ═══
        const stockErrors: string[] = [];
        for (const item of data.items as OrderItemInput[]) {
            if (!item.variantId) continue;
            const variant = await prisma.productvariant.findUnique({
                where: { id: item.variantId },
                include: { product: { select: { name: true } } }
            });
            if (!variant) {
                stockErrors.push(`المنتج غير موجود (${item.name || item.productId})`);
                continue;
            }
            if (variant.stock < item.quantity) {
                stockErrors.push(
                    `الكمية المطلوبة من "${variant.product.name}" (${item.size || ''} / ${item.color || ''}) = ${item.quantity}، والمتاح فقط ${variant.stock}`
                );
            }
        }
        if (stockErrors.length > 0) {
            return NextResponse.json(
                { error: 'الكمية المطلوبة تتجاوز المخزون المتاح', details: stockErrors },
                { status: 400 }
            );
        }

        // ═══ Create order ═══
        const order = await prisma.order.create({
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

        // ═══ Decrement stock for each variant ═══
        for (const item of data.items as OrderItemInput[]) {
            if (!item.variantId) continue;
            await prisma.productvariant.update({
                where: { id: item.variantId },
                data: { stock: { decrement: item.quantity } }
            });
        }

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
