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
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.productId || 'منتج'}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.variantId || '-'}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.price} ج.م</td>
        </tr>
    `).join('');

    // ... (rest of function unchanged)

    const html = `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; max-width: 600px; margin: auto; border: 1px solid #ae8439; padding: 20px;">
            <h2 style="color: #ae8439; border-bottom: 2px solid #ae8439; padding-bottom: 10px;">طلب جديد من Nine1Luxury</h2>
            <p><strong>الاسم:</strong> ${guestName}</p>
            <p><strong>الهاتف:</strong> ${guestPhone}</p>
            <p><strong>المحافظة:</strong> ${guestCity}</p>
            <p><strong>العنوان:</strong> ${guestAddress}</p>
            
            <h3>المنتجات:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f8f8f8;">
                        <th style="padding: 10px; text-align: right;">المنتج</th>
                        <th style="padding: 10px; text-align: right;">المواصفات</th>
                        <th style="padding: 10px; text-align: right;">الكمية</th>
                        <th style="padding: 10px; text-align: right;">السعر</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            
            <p style="font-size: 1.2em; font-weight: bold; margin-top: 20px;">
                <strong>الإجمالي (بالشحن):</strong> <span style="color: #ae8439;">${totalAmount} ج.م</span>
            </p>
            
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 0.8em; color: #666;">تم إرسال هذا البريد تلقائياً من موقع Nine1Luxury.</p>
        </div>
    `;

    console.log(`📧 Sending order notification email to: ${process.env.SMTP_USER}`);
    
    try {
        const info = await transporter.sendMail({
            from: `"Nine1Luxury Shop" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: `طلب جديد: ${guestName} - ${totalAmount} ج.م`,
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
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; max-width: 600px; margin: auto; border: 1px solid #ae8439; padding: 20px;">
            <h2 style="color: #ae8439; border-bottom: 2px solid #ae8439; padding-bottom: 10px;">حجز جديد من Nine1Luxury</h2>
            <p><strong>الاسم:</strong> ${name}</p>
            <p><strong>الهاتف:</strong> ${phone}</p>
            <p><strong>المحافظة:</strong> ${city}</p>
            <p><strong>الموديل:</strong> ${productModel}</p>
            <p><strong>المقاس:</strong> ${productSize}</p>
            <p><strong>ملاحظات:</strong> ${notes || 'لا يوجد'}</p>
            <p><strong>سعر الشحن:</strong> ${shippingAmount} ج.م</p>
            
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 0.8em; color: #666;">تم إرسال هذا البريد تلقائياً من موقع Nine1Luxury.</p>
        </div>
    `;

    console.log(`📧 Sending reservation notification email to: ${process.env.SMTP_USER}`);

    try {
        const info = await transporter.sendMail({
            from: `"Nine1Luxury Reservations" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: `حجز جديد: ${name} - ${productModel}`,
            html: html
        });
        console.log("✅ Reservation email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Failed to send reservation email:", error);
        throw error;
    }
}
