import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

interface BookingDetails {
    name: string;
    phone: string;
    city: string | null;
    productModel: string | null;
    productSize: string | null;
    shippingAmount: number;
    notes: string | null;
    id: string;
}

export async function sendNewBookingEmail(bookingDetails: BookingDetails) {
    const { name, phone, city, productModel, productSize, shippingAmount, notes, id } = bookingDetails;
    
    // Send to the admin/owner
    const adminEmail = process.env.SMTP_USER;
    if (!adminEmail) {
        console.error("❌ SMTP_USER is not defined in environment variables.");
        return;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    try {
        await transporter.sendMail({
            from: `"Nine1Luxury Booking" <${adminEmail}>`,
            to: adminEmail,
            subject: `🔔 حجز جديد: ${productModel} - ${name}`,
html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; text-align: right; background-color: #000000; padding: 40px 20px; border-radius: 0px; min-height: 100%;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #333; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(212, 175, 55, 0.1);">
                        
                        <!-- Header -->
                        <div style="background-color: #111111; padding: 30px; border-bottom: 1px solid #222; text-align: center;">
                            <h2 style="color: #D4AF37; margin: 0; font-size: 24px; letter-spacing: 1px;">Nine1Luxury</h2>
                            <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">طلب حجز جديد 🛍️</p>
                        </div>

                        <div style="padding: 30px;">
                            <!-- Booking ID -->
                            <div style="background-color: #1a1a1a; padding: 15px; border-radius: 8px; border: 1px solid #222; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: #888; font-size: 13px;">رقم الحجز</span>
                                <span style="color: #D4AF37; font-family: monospace; letter-spacing: 1px; font-weight: bold;">#${id.slice(-6).toUpperCase()}</span>
                            </div>

                            <!-- Customer Info -->
                            <h3 style="color: #fff; margin-bottom: 15px; font-size: 18px; border-right: 3px solid #D4AF37; padding-right: 10px;">👤 بيانات العميل</h3>
                            <div style="background-color: #1a1a1a; padding: 20px; border-radius: 12px; border: 1px solid #222; margin-bottom: 30px;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #888; width: 80px;">الاسم:</td>
                                        <td style="padding: 8px 0; color: #fff; font-weight: 500;">${name}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #888;">الهاتف:</td>
                                        <td style="padding: 8px 0;">
                                            <a href="tel:${phone}" style="color: #fff; text-decoration: none; border-bottom: 1px dotted #D4AF37;">${phone}</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #888;">العنوان:</td>
                                        <td style="padding: 8px 0; color: #fff;">${city}</td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Product Info -->
                            <h3 style="color: #fff; margin-bottom: 15px; font-size: 18px; border-right: 3px solid #D4AF37; padding-right: 10px;">📦 تفاصيل الطلب</h3>
                            <div style="background-color: #1a1a1a; border-radius: 12px; border: 1px solid #222; overflow: hidden;">
                                <div style="padding: 20px; border-bottom: 1px solid #2a2a2a;">
                                    <span style="display: block; color: #888; font-size: 12px; margin-bottom: 6px;">اسم الموديل</span>
                                    <span style="display: block; color: #fff; font-size: 18px; font-weight: bold; letter-spacing: 0.5px;">${productModel}</span>
                                </div>
                                <div style="display: flex; width: 100%;">
                                    <div style="flex: 1; padding: 15px; border-left: 1px solid #2a2a2a; text-align: center; background-color: #1f1f1f;">
                                        <span style="display: block; color: #888; font-size: 12px; margin-bottom: 5px;">المقاس</span>
                                        <span style="display: block; color: #D4AF37; font-size: 16px; font-weight: bold;">${productSize || '-'}</span>
                                    </div>
                                    <div style="flex: 1; padding: 15px; text-align: center; background-color: #1f1f1f;">
                                        <span style="display: block; color: #888; font-size: 12px; margin-bottom: 5px;">الشحن</span>
                                        <span style="display: block; color: #D4AF37; font-size: 16px; font-weight: bold;">${shippingAmount} ج.م</span>
                                    </div>
                                </div>
                                ${notes ? `
                                <div style="padding: 15px 20px; border-top: 1px solid #2a2a2a; background-color: #1a1a1a;">
                                    <span style="display: block; color: #888; font-size: 12px; margin-bottom: 6px;">ملاحظات إضافية</span>
                                    <p style="margin: 0; color: #ccc; font-size: 14px; line-height: 1.5;">${notes}</p>
                                </div>
                                ` : ''}
                            </div>
                        </div>

                        <!-- Footer / CTA -->
                        <div style="padding: 30px; text-align: center; background-color: #1a1a1a; border-top: 1px solid #222;">
                            <a href="${appUrl}/admin/bookings" style="display: inline-block; background-color: #D4AF37; color: #000; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; transition: all 0.2s;">
                                عرض في لوحة التحكم ←
                            </a>
                            <p style="margin-top: 20px; color: #444; font-size: 11px;">تم الإرسال تلقائياً من نظام Nine1Luxury</p>
                        </div>
                    </div>
                </div>
            `,
        });
        console.log(`📧 Notification email sent successfully for booking ${id}`);
    } catch (error) {
        console.error("❌ Failed to send email:", error);
    }
}
