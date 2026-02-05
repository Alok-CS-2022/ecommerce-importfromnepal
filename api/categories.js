import { supabase } from './lib/supabase.js';
import { z } from 'zod';

// Categories API - Full CRUD for product categories
// Category Validation Schema
const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 chars"),
  image_url: z.string().url("Invalid image URL").optional(),
  id: z.string().optional(), // For updates
  display_order: z.number().optional(),
  is_active: z.boolean().optional()
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

  try {
    switch (req.method) {
      case 'GET':
        // Fetch all categories
        const { data: categories, error: getError } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });

        if (getError) throw getError;
        return res.status(200).json(categories);

      case 'POST':
        // VALIDATE INPUT
        const resultPost = categorySchema.safeParse(req.body);
        if (!resultPost.success) {
          return res.status(400).json({ error: resultPost.error.errors[0].message });
        }

        // Create new category
        const { data: newCategory, error: postError } = await supabase
          .from('categories')
          .insert([resultPost.data])
          .select()
          .single();

        if (postError) throw postError;
        return res.status(201).json(newCategory);

      case 'PUT':
        // VALIDATE INPUT
        if (!req.body.id) return res.status(400).json({ error: 'Category ID required' });

        const resultPut = categorySchema.partial().safeParse(req.body);
        if (!resultPut.success) {
          return res.status(400).json({ error: resultPut.error.errors[0].message });
        }

        // Update existing category
        const { id, ...updateData } = resultPut.data;
        const { data: updatedCategory, error: putError } = await supabase
          .from('categories')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (putError) throw putError;
        return res.status(200).json(updatedCategory);

      case 'DELETE':
        // DELETE category
        const { id: deleteId } = req.query;
        if (!deleteId) return res.status(400).json({ error: 'Category ID required' });

        const { error: deleteError } = await supabase
          .from('categories')
          .delete()
          .eq('id', deleteId);

        if (deleteError) throw deleteError;
        return res.status(200).json({ message: 'Category deleted successfully' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Categories API error:', error);
    return res.status(500).json({ error: error.message });
  }
}