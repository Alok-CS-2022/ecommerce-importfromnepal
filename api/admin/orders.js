import { supabase } from '../lib/supabase.js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // auth checks removed

    // 2. HANDLE ORDERS

    // 2. HANDLE ORDERS
    // Lazy import mailer to avoid circular deps
    let sendOrderEmail;
    try {
        sendOrderEmail = (await import('../lib/mailer.js')).sendOrderEmail;
    } catch (e) {}

    try {
        switch (req.method) {
            case 'GET': {
                const { data: orders, error: getError } = await supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (getError) throw getError;
                return res.status(200).json(orders);
            }
            case 'POST': {
                // Insert new order and send email
                const order = req.body;
                const { data, error } = await supabase.from('orders').insert([order]).select().single();
                if (error) throw error;
                // Send email to admins
                if (sendOrderEmail) {
                    const orderJson = JSON.stringify(data, null, 2);
                    await sendOrderEmail({
                        to: ['alok.kharel.nepal@gmail.com', 'sujanadhikari1111@gmail.com'],
                        subject: 'New Order Received',
                        text: 'A new order has been placed. See attached for details.',
                        html: '<p>A new order has been placed. See attached for details.</p>',
                        attachmentName: `order-${data.id}.json`,
                        attachmentContent: orderJson
                    });
                }
                return res.status(201).json(data);
            }
            case 'PUT': {
                // Update order status
                const { id, status } = req.body;
                if (!id || !status) return res.status(400).json({ error: 'Missing id or status' });
                const { data: updated, error: putError } = await supabase
                    .from('orders')
                    .update({ status, updated_at: new Date().toISOString() })
                    .eq('id', id)
                    .select()
                    .single();
                if (putError) throw putError;
                return res.status(200).json(updated);
            }
            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
    }
}