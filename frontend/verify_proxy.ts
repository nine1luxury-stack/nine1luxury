import http from 'http';

function testUrl(url: string): Promise<void> {
    return new Promise((resolve) => {
        console.log(`\nTesting ${url}...`);
        const req = http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`Status: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    console.log(`Success! Data length: ${data.length}`);
                } else {
                    console.log(`Error Body: ${data.substring(0, 200)}`);
                }
                resolve();
            });
        });
        req.on('error', (e) => {
            console.error(`Request Error: ${e.message}`);
            resolve();
        });
    });
}

async function run(): Promise<void> {
    // 1. Specific Proxy (Products)
    await testUrl('http://localhost:3000/api/products');

    // 2. Specific Proxy (Orders)
    await testUrl('http://localhost:3000/api/orders');

    // 3. Catch-All Proxy (Non-existent)
    await testUrl('http://localhost:3000/api/foobar');
}

run();
