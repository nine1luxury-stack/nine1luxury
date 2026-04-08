import http from 'http';

interface Product {
    id: string;
    name: string;
}

http.get('http://127.0.0.1:3001/products', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const products: Product[] = JSON.parse(data);
            console.log("Products in DB:");
            products.forEach(p => console.log(`- ${p.name} (ID: ${p.id})`));
        } catch (e: any) {
            console.error("Error parsing JSON:", e.message);
        }
    });
}).on('error', (err) => {
    console.error("Error:", err.message);
});
