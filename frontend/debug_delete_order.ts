import http from 'http';

// 1. Create Order
function createOrder(): Promise<string> {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            guestName: "Debug User",
            guestPhone: "01000000000",
            guestAddress: "Test Address",
            guestCity: "Cairo",
            totalAmount: 100,
            paymentMethod: "CASH_ON_DELIVERY",
            items: [] // Assuming empty items allowed or minimal valid structure
        });

        const options = {
            hostname: '127.0.0.1',
            port: 3001,
            path: '/orders',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 201 || res.statusCode === 200) {
                    const order = JSON.parse(body);
                    console.log(`Created Order: ${order.id}`);
                    resolve(order.id);
                } else {
                    console.error(`Failed to create order: ${res.statusCode} ${body}`);
                    reject(new Error('Create failed'));
                }
            });
        });

        req.write(data);
        req.end();
    });
}

// 2. Delete Order via Proxy
function deleteOrderProxy(id: string): Promise<void> {
    return new Promise((resolve) => {
        console.log(`Attempting DELETE via Proxy: http://localhost:3000/api/orders/${id}`);
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: `/api/orders/${id}`,
            method: 'DELETE'
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                console.log(`Proxy DELETE Response: ${res.statusCode}`);
                console.log(`Body: ${body}`);
                resolve();
            });
        });

        req.on('error', (e) => console.error('Proxy Request Error:', e));
        req.end();
    });
}

async function run(): Promise<void> {
    try {
        const id = await createOrder();
        await deleteOrderProxy(id);
    } catch (e) {
        console.error(e);
    }
}

run();
