async function testOrder() {
    const orderData = {
        guestName: "Antigravity AI Test",
        guestPhone: "01012345678",
        guestAddress: "AI Lab - Test Street",
        guestCity: "Cairo",
        totalAmount: 2500,
        items: [
            {
                productId: "test-product-id",
                name: "Test Product Lux",
                quantity: 2,
                price: 1250,
                size: "L",
                color: "Black"
            }
        ]
    };

    console.log("🚀 Sending test order to http://localhost:3000/api/orders...");
    
    try {
        const response = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log("✅ Success! Order created:", (result as { id: string }).id);
            console.log("Check the 'npm run dev' terminal for SMTP logs.");
        } else {
            console.error("❌ Failed:", result);
        }
    } catch (error: unknown) {
        console.error("❌ Error connecting to API:", error instanceof Error ? error.message : 'Unknown error');
    }
}

testOrder();
