import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

// Diagnostic check
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("⚠️ SMTP Credentials are missing in environment variables!");
}

interface OrderItem {
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
}

interface OrderData {
    guestName: string;
    guestPhone: string;
    guestCity: string;
    guestAddress: string;
    totalAmount: number;
    items: OrderItem[];
}

interface ReservationData {
    name: string;
    phone: string;
    city?: string | null;
    productModel?: string | null;
    productSize?: string | null;
    notes?: string | null;
    shippingAmount: number;
}

export async function sendOrderNotification(orderData: OrderData) {
    const { guestName, guestPhone, guestCity, guestAddress, totalAmount, items } = orderData;
    
    const itemsHtml = items.map((item: OrderItem) => `
        <tr style="background-color: #080808;">
            <td style="padding: 25px 20px; border-bottom: 2px solid #1a1a1a; color: #fff; font-size: 24px; font-weight: 500;">${item.productId || 'منتج'}</td>
            <td style="padding: 25px 20px; border-bottom: 2px solid #1a1a1a; color: #fff; text-align: center; font-size: 24px;">${item.quantity}</td>
            <td style="padding: 25px 20px; border-bottom: 2px solid #1a1a1a; color: #ae8439; text-align: left; font-weight: bold; font-size: 26px;">${item.price} ج.م</td>
        </tr>
    `).join('');

    const html = `
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
        </head>
        <div style="font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; direction: rtl; text-align: right; max-width: 800px; margin: auto; background-color: #000; border: 3px solid #ae8439; padding: 60px 40px; color: #fff; border-radius: 20px;">
            <div style="text-align: center; margin-bottom: 60px;">
                <h1 style="font-family: 'Playfair Display', serif; color: #ae8439; margin: 0; font-size: 56px; letter-spacing: 4px; border-bottom: 4px solid #ae8439; padding-bottom: 20px; display: inline-block; font-weight: 900;">NINE1LUXURY</h1>
                <p style="color: #888; margin-top: 20px; text-transform: uppercase; font-size: 18px; letter-spacing: 5px; font-weight: 600;">NEW ORDER RECEIVED</p>
            </div>
            
            <div style="background-color: #0a0a0a; padding: 45px; border-radius: 15px; margin-bottom: 50px; border-right: 8px solid #ae8439; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
                <h3 style="color: #ae8439; margin: 0 0 30px 0; font-size: 36px; font-weight: 700;">بيانات العميل</h3>
                <p style="margin: 20px 0; font-size: 26px; line-height: 1.6;"><strong>👤 الاسم:</strong> <span style="color: #fff; margin-right: 15px;">${guestName}</span></p>
                <p style="margin: 20px 0; font-size: 26px; line-height: 1.6;"><strong>📞 الهاتف:</strong> <span style="color: #fff; margin-right: 15px;">${guestPhone}</span></p>
                <p style="margin: 20px 0; font-size: 26px; line-height: 1.6;"><strong>📍 المحافظة:</strong> <span style="color: #fff; margin-right: 15px;">${guestCity}</span></p>
                <p style="margin: 20px 0; font-size: 26px; line-height: 1.6;"><strong>🏠 العنوان:</strong> <span style="color: #fff; margin-right: 15px;">${guestAddress}</span></p>
            </div>
            
            <h3 style="color: #ae8439; margin: 0 0 25px 0; font-size: 36px; font-weight: 700;">تفاصيل الطلب</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 50px;">
                <thead>
                    <tr style="background-color: #ae8439; color: #000;">
                        <th style="padding: 22px 20px; text-align: right; font-size: 24px; font-weight: 900; border-radius: 0 12px 0 0;">المنتج</th>
                        <th style="padding: 22px 20px; text-align: center; font-size: 24px; font-weight: 900;">الكمية</th>
                        <th style="padding: 22px 20px; text-align: left; font-size: 24px; font-weight: 900; border-radius: 12px 0 0 0;">السعر</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            
            <div style="background-color: #ae8439; color: #000; padding: 40px; border-radius: 15px; text-align: center; box-shadow: 0 8px 25px rgba(174, 132, 57, 0.4);">
                <p style="font-size: 42px; font-weight: 900; margin: 0; letter-spacing: 1px;">
                    الإجمالي المستحق: ${totalAmount} ج.م
                </p>
            </div>
        </div>
    `;

    try {
        const info = await transporter.sendMail({
            from: `"Nine1Luxury Store" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: `🔥 طلب جديد: ${guestName} - ${totalAmount} ج.م`,
            html: html
        });
        console.log("✅ Order email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Failed to send order email:", error);
        throw error;
    }
}

export async function sendReservationNotification(reservationData: ReservationData) {
    const { name, phone, city, productModel, productSize, notes, shippingAmount } = reservationData;

    const html = `
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
        </head>
        <div style="font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; direction: rtl; text-align: right; max-width: 800px; margin: auto; background-color: #000; border: 3px solid #ae8439; padding: 60px 40px; color: #fff; border-radius: 20px;">
            <div style="text-align: center; margin-bottom: 60px;">
                <h1 style="font-family: 'Playfair Display', serif; color: #ae8439; margin: 0; font-size: 56px; letter-spacing: 4px; border-bottom: 4px solid #ae8439; padding-bottom: 20px; display: inline-block; font-weight: 900;">NINE1LUXURY</h1>
                <p style="color: #888; margin-top: 20px; text-transform: uppercase; font-size: 18px; letter-spacing: 5px; font-weight: 600;">NEW BOOKING RECEIVED</p>
            </div>
            
            <div style="background-color: #0a0a0a; padding: 50px; border-radius: 15px; border-right: 10px solid #ae8439; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
                <h3 style="color: #ae8439; margin: 0 0 40px 0; font-size: 38px; font-weight: 700; border-bottom: 2px solid #1a1a1a; padding-bottom: 20px;">بيانات الحجز</h3>
                <p style="margin: 25px 0; font-size: 28px; line-height: 1.6;"><strong>👤 الاسم:</strong> <span style="color: #fff; margin-right: 15px;">${name}</span></p>
                <p style="margin: 25px 0; font-size: 28px; line-height: 1.6;"><strong>📞 الهاتف:</strong> <span style="color: #fff; margin-right: 15px;">${phone}</span></p>
                <p style="margin: 25px 0; font-size: 28px; line-height: 1.6;"><strong>📍 المحافظة:</strong> <span style="color: #fff; margin-right: 15px;">${city}</span></p>
                <p style="margin: 25px 0; font-size: 28px; line-height: 1.6;"><strong>🏷️ الموديل:</strong> <span style="color: #ae8439; margin-right: 15px; font-weight: bold;">${productModel}</span></p>
                <p style="margin: 25px 0; font-size: 28px; line-height: 1.6;"><strong>📏 المقاس:</strong> <span style="color: #fff; margin-right: 15px;">${productSize || 'غير محدد'}</span></p>
                <p style="margin: 25px 0; font-size: 28px; line-height: 1.6;"><strong>📝 ملاحظات:</strong> <span style="color: #bbb; margin-right: 15px;">${notes || 'لا يوجد'}</span></p>
                <div style="margin-top: 40px; padding: 30px; background-color: #080808; border-radius: 12px; text-align: center; border: 1px solid #ae8439;">
                    <p style="font-size: 34px; color: #ae8439; margin: 0;"><strong>💰 رسوم الحجز (الشحن):</strong> <span style="margin-right: 15px; font-weight: 900; color: #fff;">${shippingAmount} ج.م</span></p>
                </div>
            </div>
        </div>
    `;

    try {
        const info = await transporter.sendMail({
            from: `"Nine1Luxury Booking" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: `✨ حجز جديد: ${name} - ${productModel}`,
            html: html
        });
        console.log("✅ Booking email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Failed to send booking email:", error);
        throw error;
    }
}

