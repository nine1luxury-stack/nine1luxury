
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function sendTestOrderDirect() {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    console.log("🚀 Starting direct test email to:", user);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
    });

    const html = `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; max-width: 600px; margin: auto; border: 1px solid #ae8439; padding: 20px;">
            <h2 style="color: #ae8439; border-bottom: 2px solid #ae8439; padding-bottom: 10px;">طلب تجريبي من Nine1Luxury</h2>
            <p><strong>الاسم:</strong> عميل تجريبي</p>
            <p><strong>الهاتف:</strong> 01234567890</p>
            <p><strong>المحافظة:</strong> القاهرة</p>
            <p><strong>العنوان:</strong> شارع التجربة، المعادي</p>
            
            <h3>المنتجات:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f8f8f8;">
                        <th style="padding: 10px; text-align: right;">المنتج</th>
                        <th style="padding: 10px; text-align: right;">الكمية</th>
                        <th style="padding: 10px; text-align: right;">السعر</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">T-Shirt Luxury Gold</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">2</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">750 ج.م</td>
                    </tr>
                </tbody>
            </table>
            
            <p style="font-size: 1.2em; font-weight: bold; margin-top: 20px;">
                <strong>الإجمالي التجريبي:</strong> <span style="color: #ae8439;">1550 ج.م</span>
            </p>
        </div>
    `;

    try {
        const info = await transporter.sendMail({
            from: `"Nine1Luxury Test" <${user}>`,
            to: user,
            subject: "إشعار طلب تجريبي - Nine1Luxury",
            html: html
        });
        console.log("✅ Order email sent successfully! ID:", info.messageId);
    } catch (error) {
        console.error("❌ Failed to send order email:", error);
    }
}

sendTestOrderDirect();
