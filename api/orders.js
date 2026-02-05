import { supabase } from '../lib/supabase.js';
import { z } from 'zod';

// Define Validation Schema for Orders
const orderSchema = z.object({
    customer_name: z.string().min(1, "Name is required"),
    customer_email: z.string().email("Invalid email address"),
    customer_phone: z.string().min(1, "Phone number is required"),
    customer_country: z.string().min(1, "Country is required"),
    customer_address: z.string().min(1, "Address is required"),
    customer_city: z.string().optional().nullable(),
    customer_state: z.string().optional().nullable(),
    customer_zip: z.string().optional().nullable(),
    special_requests: z.string().optional().nullable(),
    items: z.string().min(1, "Items are required"), // JSON string
    subtotal: z.number().nonnegative("Invalid subtotal"),
    shipping_cost: z.number().nonnegative("Invalid shipping cost"),
    tax: z.number().nonnegative("Invalid tax"),
    total_amount: z.number().positive("Total must be greater than 0"),
    status: z.string().optional().default('pending')
});

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        // Get orders (requires authentication)
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader) {
                // Return empty if no auth provided
                return res.status(200).json([]);
            }

            const token = authHeader.replace('Bearer ', '');
            const { data: { user }, error: authError } = await supabase.auth.getUser(token);

            if (authError || !user) {
                return res.status(200).json([]);
            }

            // Fetch user's orders
            const { data: orders, error } = await supabase
                .from('orders')
                .select('*')
                .eq('customer_email', user.email)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return res.status(200).json(orders || []);

        } catch (error) {
            console.error('Fetch orders error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Validate input
        const validationResult = orderSchema.safeParse(req.body);

        if (!validationResult.success) {
            const errorMessage = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
            return res.status(400).json({ error: errorMessage });
        }

        const validatedData = validationResult.data;

        // Parse items JSON
        let items = [];
        try {
            items = JSON.parse(validatedData.items);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid items format' });
        }

        // Verify items array
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Order must contain at least one item' });
        }

        // Create order record
        const orderData = {
            customer_name: validatedData.customer_name,
            customer_email: validatedData.customer_email,
            customer_phone: validatedData.customer_phone,
            customer_country: validatedData.customer_country,
            customer_address: validatedData.customer_address,
            customer_city: validatedData.customer_city,
            customer_state: validatedData.customer_state,
            customer_zip: validatedData.customer_zip,
            special_requests: validatedData.special_requests,
            items: validatedData.items,
            subtotal: validatedData.subtotal,
            shipping_cost: validatedData.shipping_cost,
            tax: validatedData.tax,
            total_amount: validatedData.total_amount,
            status: 'pending',
            order_date: new Date().toISOString()
        };

        // Insert into Supabase
        const { data, error } = await supabase
            .from('orders')
            .insert([orderData])
            .select();

        if (error) throw error;

        console.log('✓ Order created successfully:', data);

        // Send success response
        return res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            orderId: data[0]?.id,
            order: data[0]
        });

    } catch (error) {
        console.error('Order creation error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to create order: ' + error.message
        });
    }
}
