// Blog API for managing blog stories
import { supabase } from './lib/supabase.js';
import { z } from 'zod';

// Blog Story Validation Schema
const blogStorySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 chars"),
  description: z.string().min(10, "Description must be at least 10 chars"),
  image_url: z.string().url("Invalid image URL"),
  category: z.string().optional(),
  id: z.string().optional(), // For updates
  is_featured: z.boolean().optional(),
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
        // Fetch all active blog stories
        const { data: blogStories, error: getError } = await supabase
          .from('blog_stories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (getError) throw getError;
        return res.status(200).json(blogStories);

      case 'POST':
        // VALIDATE INPUT
        const resultPost = blogStorySchema.safeParse(req.body);
        if (!resultPost.success) {
          return res.status(400).json({ error: resultPost.error.errors[0].message });
        }

        // Create new blog story
        const { data: newStory, error: postError } = await supabase
          .from('blog_stories')
          .insert([resultPost.data])
          .select()
          .single();

        if (postError) throw postError;
        return res.status(201).json(newStory);

      case 'PUT':
        // VALIDATE INPUT
        if (!req.body.id) return res.status(400).json({ error: 'Blog story ID required' });

        const resultPut = blogStorySchema.partial().safeParse(req.body);
        if (!resultPut.success) {
          return res.status(400).json({ error: resultPut.error.errors[0].message });
        }

        // Update existing blog story
        const { id, ...updateData } = resultPut.data;
        const { data: updatedStory, error: putError } = await supabase
          .from('blog_stories')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (putError) throw putError;
        return res.status(200).json(updatedStory);

      case 'DELETE':
        // DELETE blog story
        const { id: deleteId } = req.query;
        if (!deleteId) return res.status(400).json({ error: 'Blog story ID required' });

        const { error: deleteError } = await supabase
          .from('blog_stories')
          .delete()
          .eq('id', deleteId);

        if (deleteError) throw deleteError;
        return res.status(200).json({ message: 'Blog story deleted successfully' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Blog API error:', error);
    return res.status(500).json({ error: error.message });
  }
}