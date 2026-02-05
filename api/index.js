import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get Vercel config
const vercelConfigPath = join(__dirname, '../vercel.json');
let vercelConfig;

try {
    vercelConfig = JSON.parse(readFileSync(vercelConfigPath, 'utf8'));
} catch (err) {
    console.error('Error reading vercel.json:', err);
    process.exit(1);
}

// Simple server setup for local development
if (import.meta.url === `file://${process.argv[1]}`) {
    const port = process.env.PORT || 3000;
    
    console.log(`Starting development server on port ${port}...`);
    console.log('Available API endpoints:');
    
    // List available API files
    const fs = await import('fs');
    const path = await import('path');
    
    function listAPIFiles(dir, prefix = '/api') {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                listAPIFiles(fullPath, `${prefix}/${file}`);
            } else if (file.endsWith('.js') && !file.includes('lib')) {
                const route = fullPath.replace(__dirname, '').replace('.js', '').replace(/\\/g, '/');
                console.log(`  ${route}`);
            }
        });
    }
    
    listAPIFiles(__dirname);
    console.log(`\nServer would be running at: http://localhost:${port}`);
    console.log('\nNote: This is a placeholder server.');
    console.log('To run the full development server, use: npm run dev:vercel');
}