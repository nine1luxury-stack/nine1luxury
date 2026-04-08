import http from 'http';

interface Order {
    id: string;
    status: string;
}

http.get('http://127.0.0.1:3001/orders', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const orders: Order[] = JSON.parse(data);
            console.log("Orders in DB:");
            orders.forEach(o => console.log(`- Order #${o.id} (Status: ${o.status})`));
        } catch (e: any) {
            console.error("Error parsing JSON:", e.message);
        }
    });
}).on('error', (err) => {
    console.error("Error:", err.message);
});
