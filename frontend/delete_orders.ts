import http from 'http';

const ids: string[] = [
    'c2e76d9d-00ed-4c43-99c7-738d13b964c7',
    'bcac8bbd-b61a-4c1c-9474-56ce5a7bc04b',
    'cdfa36b1-9b9b-4a38-a526-2b49aaec314a',
    '79bf61f9-a0bf-42c7-9a54-ce1470552e30'
];

function deleteOrder(id: string): Promise<void> {
    return new Promise((resolve) => {
        const options = {
            hostname: '127.0.0.1',
            port: 3001,
            path: `/orders/${id}`,
            method: 'DELETE'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    console.log(`Deleted Order ${id}: Success`);
                    resolve();
                } else {
                    console.log(`Deleted Order ${id}: Failed (${res.statusCode}) - ${data}`);
                    resolve();
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Request Error: ${e.message}`);
            resolve();
        });

        req.end();
    });
}

async function run(): Promise<void> {
    for (const id of ids) {
        await deleteOrder(id);
    }
}

run();
