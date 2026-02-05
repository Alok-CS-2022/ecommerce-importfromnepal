import { supabase } from './lib/supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    // Mimic exactly what api/products.js does
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ 
        status: 'supabase_error',
        error: error.message,
        code: error.code 
      });
    }

    return res.status(200).json({ 
      status: 'success',
      products_count: data.length,
      products: data.slice(0, 3) // First 3 products
    });
  } catch (err) {
    return res.status(500).json({ 
      status: 'server_error',
      error: err.message,
      stack: err.stack 
    });
  }
}
