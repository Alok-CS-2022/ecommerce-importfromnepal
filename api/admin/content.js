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
                // Get all content types
                const [sliderItems, blogStories, featuredProducts] = await Promise.all([
                    supabase.from('slider_items').select('*').order('display_order', { ascending: true }),
                    supabase.from('blog_stories').select('*').order('display_order', { ascending: true }),
                    supabase.from('products').select('*').eq('is_featured', true).order('display_order', { ascending: true })
                ]);

                if (sliderItems.error) throw sliderItems.error;
                if (blogStories.error) throw blogStories.error;
                if (featuredProducts.error) throw featuredProducts.error;

                return res.status(200).json({
                    slider: sliderItems.data || [],
                    blogStories: blogStories.data || [],
                    featuredProducts: featuredProducts.data || []
                });

            case 'POST':
                const { type, data } = req.body;
                
                if (!type || !data) {
                    return res.status(400).json({ error: 'Content type and data are required' });
                }

                let result;
                if (type === 'slider') {
                    result = await supabase
                        .from('slider_items')
                        .insert([{
                            title: data.title,
                            description: data.description,
                            image_url: data.imageUrl,
                            button_text: data.buttonText,
                            button_link: data.buttonLink,
                            accent_pill: data.accentPill || 'Featured',
                            display_order: data.displayOrder || 0,
                            is_active: true
                        }])
                        .select()
                        .single();
                } else if (type === 'blog') {
                    result = await supabase
                        .from('blog_stories')
                        .insert([{
                            title: data.title,
                            description: data.description,
                            image_url: data.imageUrl,
                            category: data.category || 'Story',
                            is_featured: data.isFeatured || false,
                            display_order: data.displayOrder || 0,
                            is_active: true
                        }])
                        .select()
                        .single();
                } else {
                    return res.status(400).json({ error: 'Invalid content type' });
                }

                if (result.error) throw result.error;
                return res.status(200).json(result.data);

            case 'PUT':
                const { type: putType, id: putId, data: putData } = req.body;
                
                if (!putType || !putId || !putData) {
                    return res.status(400).json({ error: 'Content type, ID, and data are required for update' });
                }

                let updateResult;
                if (putType === 'slider') {
                    updateResult = await supabase
                        .from('slider_items')
                        .update({
                            title: putData.title,
                            description: putData.description,
                            image_url: putData.imageUrl,
                            button_text: putData.buttonText,
                            button_link: putData.buttonLink,
                            accent_pill: putData.accentPill,
                            display_order: putData.displayOrder,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', putId)
                        .select()
                        .single();
                } else if (putType === 'blog') {
                    updateResult = await supabase
                        .from('blog_stories')
                        .update({
                            title: putData.title,
                            description: putData.description,
                            image_url: putData.imageUrl,
                            category: putData.category,
                            is_featured: putData.isFeatured,
                            display_order: putData.displayOrder,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', putId)
                        .select()
                        .single();
                } else {
                    return res.status(400).json({ error: 'Invalid content type' });
                }

                if (updateResult.error) throw updateResult.error;
                return res.status(200).json(updateResult.data);

            case 'DELETE':
                const { type: delType, id: delId } = req.query;
                
                if (!delType || !delId) {
                    return res.status(400).json({ error: 'Content type and ID are required for delete' });
                }

                let deleteResult;
                if (delType === 'slider') {
                    deleteResult = await supabase
                        .from('slider_items')
                        .delete()
                        .eq('id', delId);
                } else if (delType === 'blog') {
                    deleteResult = await supabase
                        .from('blog_stories')
                        .delete()
                        .eq('id', delId);
                } else {
                    return res.status(400).json({ error: 'Invalid content type' });
                }

                if (deleteResult.error) throw deleteResult.error;
                return res.status(200).json({ message: 'Content deleted successfully' });

            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (err) {
        console.error('Content API error:', err);
        return res.status(500).json({ error: err.message });
    }
}