import { supabase } from './lib/supabase.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 1. Authenticate User
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return res.status(401).json({ error: 'Invalid Token' });
    }

    // 2. Fetch Orders for User
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id) // Filter by User ID
            .order('created_at', { ascending: false });

        if (error) throw error;

        return res.status(200).json(orders);

    } catch (err) {
        console.error('Fetch orders error:', err);
        return res.status(500).json({ error: err.message });
    }
}
