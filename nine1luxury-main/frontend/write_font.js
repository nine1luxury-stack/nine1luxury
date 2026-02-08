const fs = require('fs');
try {
    const base64 = fs.readFileSync('amiri_base64_utf8.txt', 'utf8').trim();
    fs.writeFileSync('src/lib/fonts/amiri.ts', 'export const amiriFont = "' + base64 + '";');
    console.log('Success: File written with size ' + base64.length);
} catch (e) {
    console.error('Error: ' + e.message);
}
