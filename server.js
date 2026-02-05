import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const app = express();
const port = process.env.PORT || 3006;

// Middleware - must be applied before routes
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Auth API route (for login/signup) - must be after app is initialized
app.post('/api/auth', async (req, res) => {
    try {
        console.log('API AUTH route hit:', req.method, req.url);
        const { default: authHandler } = await import('./api/auth.js');
        await authHandler(req, res);
    } catch (error) {
        console.error('Auth API Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// API routes
app.get('/api/products', async (req, res) => {
    try {
        const { default: productsHandler } = await import('./api/products.js');
        const mockReq = { method: 'GET', headers: {} };
        const mockRes = {
            json: (data) => res.json(data),
            status: (code) => ({ json: (data) => res.status(code).json(data) }),
            setHeader: () => {}
        };
        await productsHandler(mockReq, mockRes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/featured-products', async (req, res) => {
    try {
        const { default: featuredHandler } = await import('./api/featured-products.js');
        const mockReq = { method: 'GET', headers: {} };
        const mockRes = {
            json: (data) => res.json(data),
            status: (code) => ({ json: (data) => res.status(code).json(data) }),
            setHeader: () => {}
        };
        await featuredHandler(mockReq, mockRes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/categories', async (req, res) => {
    try {
        const { default: categoriesHandler } = await import('./api/categories.js');
        const mockReq = { method: 'GET', headers: {} };
        const mockRes = {
            json: (data) => res.json(data),
            status: (code) => ({ json: (data) => res.status(code).json(data) }),
            setHeader: () => {}
        };
        await categoriesHandler(mockReq, mockRes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/inquiry', async (req, res) => {
    try {
        const { default: inquiryHandler } = await import('./api/inquiry.js');
        const mockReq = { method: 'POST', headers: req.headers, body: req.body };
        const mockRes = {
            json: (data) => res.json(data),
            status: (code) => ({ json: (data) => res.status(code).json(data) }),
            setHeader: () => {}
        };
        await inquiryHandler(mockReq, mockRes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add orders API route
app.all('/api/orders', async (req, res) => {
    try {
        const { default: ordersHandler } = await import('./api/orders.js');
        await ordersHandler(req, res);
    } catch (error) {
        console.error('Orders API Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Add admin orders API route
app.all('/api/admin/orders', async (req, res) => {
    try {
        const { default: ordersHandler } = await import('./api/admin/orders.js');
        await ordersHandler(req, res);
    } catch (error) {
        console.error('Orders API Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Add categories API route
app.all('/api/admin/categories', async (req, res) => {
    try {
        const { default: categoriesHandler } = await import('./api/admin/categories.js');
        await categoriesHandler(req, res);
    } catch (error) {
        console.error('Categories API Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Add admin products API route
app.all('/api/admin/products', async (req, res) => {
    try {
        const { default: productsHandler } = await import('./api/admin/products.js');
        await productsHandler(req, res);
    } catch (error) {
        console.error('Admin Products API Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Add content API route
app.all('/api/admin/content', async (req, res) => {
    try {
        const { default: contentHandler } = await import('./api/admin/content.js');
        await contentHandler(req, res);
    } catch (error) {
        console.error('Content API Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Serve static files for admin routes
app.use('/admin', express.static(join(__dirname, 'public', 'admin')));

// Fallback to index.html for SPA-like behavior
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Development server running at http://localhost:${port}`);
    console.log(`API endpoints available at:`);
    console.log(`  - GET  http://localhost:${port}/api/products`);
    console.log(`  - GET  http://localhost:${port}/api/featured-products`);
    console.log(`  - GET  http://localhost:${port}/api/categories`);
    console.log(`  - POST http://localhost:${port}/api/inquiry`);
    console.log(`  - GET  http://localhost:${port}/api/admin/orders`);
});