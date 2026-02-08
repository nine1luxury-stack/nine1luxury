import http from 'http';

const ids: string[] = [
    '3e883177-4868-4f86-8e73-d532c929d657', // سويت بانس
    '0e21b305-6fca-4be4-a663-b35758c3dba0'  // 666
];

// Helper wrapper for native http.request
function deleteProduct(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 3001,
            path: `/products/${id}`,
            method: 'DELETE'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    console.log(`Deleted ${id}: Success`);
                    resolve();
                } else {
                    console.log(`Deleted ${id}: Failed (${res.statusCode}) - ${data}`);
                    resolve(); // Resolve anyway to continue
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
            resolve();
        });

        req.end();
    });
}

async function run(): Promise<void> {
    for (const id of ids) {
        await deleteProduct(id);
    }
}

run();
