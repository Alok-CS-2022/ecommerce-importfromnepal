import { supabase } from '../lib/supabase.js';
import { z } from 'zod';

// Product Validation Schema
const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 chars"),
  description: z.string().min(10, "Description must be at least 10 chars"),
  price: z.number().min(0, "Price cannot be negative").nullable().optional(),
  category_id: z.string().min(1, "Category is required"),
  image_url: z.string().url("Invalid image URL"),
  id: z.string().optional(), // For updates
  is_featured: z.boolean().optional(),
  is_top_seller: z.boolean().optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().optional()
});

export default async function handler(req, res) {
  // Enable CORS
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://importfromnepal.com',
    'https://www.importfromnepal.com',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    'http://localhost:3000'
  ].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // auth checks removed

  // 2. HANDLE DIFFERENT OPERATIONS

  // 2. HANDLE DIFFERENT OPERATIONS
  try {
    switch (req.method) {
      case 'GET':
        // Fetch all products
        const { data: products, error: getError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (getError) throw getError;
        return res.status(200).json(products);

      case 'POST':
        // VALIDATE INPUT
        const resultPost = productSchema.safeParse(req.body);
        if (!resultPost.success) {
          return res.status(400).json({ error: resultPost.error.errors[0].message });
        }

        // Create new product with auto-generated slug
        const slug = (resultPost.data.name || 'product').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const productData = {
          ...resultPost.data,
          slug: slug
        };

        const { data: newProduct, error: postError } = await supabase
          .from('products')
          .insert([productData])
          .select();

        if (postError) throw postError;
        return res.status(201).json(newProduct[0] || newProduct);

      case 'PUT':
        // VALIDATE INPUT
        if (!req.body.id) return res.status(400).json({ error: 'Product ID required' });

        // Allow partial updates or full updates. 
        // We use partial() to allow updating just price or just name, etc.
        const resultPut = productSchema.partial().safeParse(req.body);
        if (!resultPut.success) {
          return res.status(400).json({ error: resultPut.error.errors[0].message });
        }

        // Update existing product
        const { id, ...updateData } = resultPut.data;

        const { data: updatedProduct, error: putError } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (putError) throw putError;
        return res.status(200).json(updatedProduct);

      case 'DELETE':
        // Delete product
        const productId = req.query.id;

        if (!productId) {
          return res.status(400).json({ error: 'Product ID required' });
        }

        const { error: deleteError } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);

        if (deleteError) throw deleteError;
        return res.status(200).json({ success: true, message: 'Product deleted' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('❌ Database error:', error);
    return res.status(500).json({ error: error.message });
  }
}