import nodemailer from 'nodemailer';

async function testSMTP() {
    console.log("🔍 Checking SMTP Credentials...");
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS?.trim();

    if (!user || !pass) {
        console.error("❌ Credentials missing in .env.local!");
        process.exit(1);
    }

    console.log("📧 Attempting to connect to Gmail for:", user);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: pass
        }
    });

    try {
        console.log("⏳ Verifying connection...");
        await transporter.verify();
        console.log("✅ Connection verified! Transporter is ready.");

        console.log("📤 Sending test email...");
        const info = await transporter.sendMail({
            from: `"Antigravity AI" <${user}>`,
            to: user,
            subject: "Test from AI Assistant",
            text: "This is a direct test of your SMTP settings. If you see this, it works!",
            html: "<b>This is a direct test of your SMTP settings. If you see this, it works!</b>"
        });

        console.log("🎉 Email sent! Message ID:", info.messageId);
    } catch (error) {
        console.error("❌ SMTP Error:", error);
    }
}

testSMTP();
