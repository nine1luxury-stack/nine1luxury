
import { sendOrderNotification } from './src/lib/email';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function sendTestOrder() {
    console.log("🚀 Starting test order email...");
    
    const testData = {
        guestName: "عميل تجريبي",
        guestPhone: "01234567890",
        guestCity: "القاهرة",
        guestAddress: "شارع التجربة، المعادي",
        totalAmount: 1550,
        items: [
            {
                productId: "سويت بانس",
                variantId: "L / رمادي",
                quantity: 1,
                price: 800
            }
        ]
    };

    try {
        await sendOrderNotification(testData);
        console.log("✅ Test order email sent successfully to " + process.env.SMTP_USER);
    } catch (error) {
        console.error("❌ Failed to send test order email:", error);
    }
}

sendTestOrder();
