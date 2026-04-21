import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function GET() {
    const config = {
        SMTP_HOST: process.env.SMTP_HOST || "MISSING",
        SMTP_PORT: process.env.SMTP_PORT || "MISSING",
        SMTP_USER: process.env.SMTP_USER || "MISSING",
        SMTP_PASS: process.env.SMTP_PASS ? "SET (" + process.env.SMTP_PASS.length + " chars)" : "MISSING",
    };

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: process.env.SMTP_PORT === "465",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Verify connection
        await transporter.verify();

        // Send test email
        const info = await transporter.sendMail({
            from: `"Nine1Luxury Test" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: "✅ Nine1Luxury - اختبار الإيميل",
            html: `<div dir="rtl" style="font-family:sans-serif;padding:20px;background:#000;color:#fff;border:2px solid #ae8439;border-radius:10px;">
                <h2 style="color:#ae8439;">✅ الإيميل شغال بنجاح!</h2>
                <p>وصلتك الرسالة دي يعني إعدادات SMTP صح.</p>
                <p>الوقت: ${new Date().toLocaleString('ar-EG')}</p>
            </div>`,
        });

        return NextResponse.json({
            success: true,
            message: "✅ Email sent successfully!",
            messageId: info.messageId,
            config,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            code: error.code,
            config,
        }, { status: 500 });
    }
}
