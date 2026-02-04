import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import nodemailer from 'nodemailer';

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

export async function POST(request: Request) {
    console.error("🔥 API ROUTE HIT: /api/orders");
    try {
        const data = await request.json();
        
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
                    create: data.items.map((item: any) => ({
                        productId: item.productId,
                        variantId: item.variantId,
                        quantity: item.quantity,
                        price: parseFloat(item.price)
                    }))
                }
            },
            include: { items: true }
        });

        // 📨 Email Notification Logic - Nine1Luxury Professional Template
        const smtpUser = process.env.SMTP_USER?.trim();
        const smtpPass = process.env.SMTP_PASS?.trim();

        if (smtpUser && smtpPass) {
            console.error("🚀 Credentials found! Sending email from:", smtpUser);
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: smtpUser,
                        pass: smtpPass
                    }
                });

                const itemsListHtml = data.items.map((item: any) => `
                    <div style="padding: 15px; background-color: #1a1a1a; border-radius: 8px; margin-bottom: 10px; border: 1px solid #333;">
                        <table width="100%" dir="rtl">
                            <tr>
                                <td>
                                    <div style="font-weight: bold; color: #ffffff; font-size: 16px; margin-bottom: 5px;">${item.name}</div>
                                    <div style="font-size: 13px; color: #888;">
                                        الكمية: <span style="color: #c5a059;">${item.quantity}</span> | 
                                        المقاس: <span style="color: #c5a059;">${item.size || 'N/A'}</span> | 
                                        اللون: <span style="color: #c5a059;">${item.color || 'N/A'}</span>
                                    </div>
                                </td>
                                <td style="text-align: left; vertical-align: middle;">
                                    <div style="color: #c5a059; font-weight: bold; font-size: 16px;">${item.price} ج.م</div>
                                </td>
                            </tr>
                        </table>
                    </div>
                `).join('');

                const mailOptions = {
                    from: `"Nine1Luxury" <${smtpUser}>`,
                    to: smtpUser,
                    subject: `🛍️ طلب جديد من: ${data.guestName} (#${order.id.slice(0, 6)})`,
                    html: `
                        <div style="direction: rtl; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #c5a059; padding: 30px; border-radius: 12px; color: #ffffff;">
                            <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #333; padding-bottom: 20px;">
                                <h1 style="color: #c5a059; margin: 0; font-size: 28px; letter-spacing: 2px;">NINE1LUXURY</h1>
                                <p style="color: #888; margin-top: 5px; font-size: 14px;">إشعار طلب جديد مـن المتجـر</p>
                            </div>
                            
                            <div style="background-color: #141414; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-right: 4px solid #c5a059;">
                                <h3 style="color: #c5a059; margin-top: 0; margin-bottom: 15px; font-size: 18px;">👤 بيانات العميل</h3>
                                <div style="line-height: 1.8; color: #e0e0e0;">
                                    <p style="margin: 5px 0;"><strong>الاسـم:</strong> ${data.guestName}</p>
                                    <p style="margin: 5px 0;"><strong>الهاتف:</strong> <span style="color: #c5a059;">${data.guestPhone}</span></p>
                                    <p style="margin: 5px 0;"><strong>العنوان:</strong> ${data.guestAddress}</p>
                                    <p style="margin: 5px 0;"><strong>المحافظة:</strong> ${data.guestCity}</p>
                                </div>
                            </div>

                            <div style="margin-bottom: 25px;">
                                <h3 style="color: #c5a059; border-bottom: 1px solid #333; padding-bottom: 10px; font-size: 18px;">🛒 تفاصيل المنتجات</h3>
                                ${itemsListHtml}
                            </div>

                            <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%); border: 1px solid #333; border-radius: 8px; margin-top: 30px;">
                                <p style="color: #888; margin-bottom: 5px; font-size: 14px;">إجمالي المبلـغ المستحق</p>
                                <h2 style="margin: 0; color: #c5a059; font-size: 32px;">${data.totalAmount} ج.م</h2>
                            </div>
                            
                            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
                                <p style="font-size: 12px; color: #666; margin: 0;">
                                    تم إرسال هذا التقرير آلياً • نظام Nine1Luxury السحابي
                                </p>
                            </div>
                        </div>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.error("✅ Premium Dark Email sent successfully to:", smtpUser);
            } catch (mailError) {
                console.error("❌ Email Error:", mailError);
            }
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
