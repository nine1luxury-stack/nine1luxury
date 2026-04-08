import http from 'http';

function testUrl(url: string): Promise<void> {
    return new Promise((resolve) => {
        console.log(`Testing ${url}...`);
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`${url} Status: ${res.statusCode}`);
                console.log(`${url} Body: ${data.substring(0, 500)}`); // First 500 chars
                resolve();
            });
        }).on('error', (err) => {
            console.error(`${url} Error: ${err.message}`);
            resolve();
        });
    });
}

async function run(): Promise<void> {
    await testUrl('http://127.0.0.1:3001/foobar');
    // await testUrl('http://127.0.0.1:3001/products');
    // await testUrl('http://localhost:3000/api/products');
}

run();
