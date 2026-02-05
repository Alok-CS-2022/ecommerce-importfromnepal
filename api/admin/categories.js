import { supabase } from '../lib/supabase.js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        switch (req.method) {
            case 'GET':
                const { data: categories, error: getError } = await supabase
                    .from('categories')
                    .select('*')
                    .order('display_order', { ascending: true });

                if (getError) throw getError;
                return res.status(200).json(categories);

            case 'POST':
                const { name, description, image_url, slug, display_order } = req.body;
                
                if (!name) {
                    return res.status(400).json({ error: 'Category name is required' });
                }

                const { data: newCategory, error: postError } = await supabase
                    .from('categories')
                    .insert([{
                        name,
                        description: description || null,
                        image_url: image_url || null,
                        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
                        display_order: display_order || 0
                    }])
                    .select()
                    .single();

                if (postError) throw postError;
                return res.status(200).json(newCategory);

            case 'PUT':
                const { id, ...updateData } = req.body;
                
                if (!id) {
                    return res.status(400).json({ error: 'Category ID is required for update' });
                }

                const { data: updatedCategory, error: putError } = await supabase
                    .from('categories')
                    .update(updateData)
                    .eq('id', id)
                    .select()
                    .single();

                if (putError) throw putError;
                return res.status(200).json(updatedCategory);

            case 'DELETE':
                const { id: deleteId } = req.query;
                
                if (!deleteId) {
                    return res.status(400).json({ error: 'Category ID is required for delete' });
                }

                // First, update any products that use this category to remove category_id
                await supabase
                    .from('products')
                    .update({ category_id: null })
                    .eq('category_id', deleteId);

                const { error: deleteError } = await supabase
                    .from('categories')
                    .delete()
                    .eq('id', deleteId);

                if (deleteError) throw deleteError;
                return res.status(200).json({ message: 'Category deleted successfully' });

            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (err) {
        console.error('Categories API error:', err);
        return res.status(500).json({ error: err.message });
    }
}