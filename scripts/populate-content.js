// Populate initial content for the website
// This script creates sample content for the admin panel to manage

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function populateContent() {
    console.log('🎨 Populating initial website content...')

    try {
        // 1. Initial Categories
        console.log('📁 Creating categories...')
        const categories = [
            { id: 'singing-bowls', name: 'Singing Bowls', display_order: 1, image_url: 'https://images.unsplash.com/photo-1599458319801-443b73259966?w=800&q=80', description: 'Ancient resonance for healing and meditation' },
            { id: 'thangkas', name: 'Thangka Art', display_order: 2, image_url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80', description: 'Intricate spiritual geometry and paintings' },
            { id: 'statues', name: 'Buddha Statues', display_order: 3, image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80', description: 'Hand-carved deities and spiritual figures' },
            { id: 'jewelry', name: 'Artisan Jewelry', display_order: 4, image_url: 'https://images.unsplash.com/photo-1626014303757-646637e90952?w=800&q=80', description: 'Handcrafted silver and turquoise heritage' }
        ]

        for (const category of categories) {
            const { error } = await supabase
                .from('categories')
                .upsert(category, { onConflict: 'id' })
            if (error) console.error(`❌ Category ${category.name}:`, error)
            else console.log(`✅ Category "${category.name}" created/updated`)
        }

        // 2. Initial Products (as samples)
        console.log('📦 Creating sample products...')
        const products = [
            {
                id: 'prod-001',
                name: 'Masterpiece Mandala Thangka',
                price: 1200,
                category_id: 'thangkas',
                description: 'Intricately hand-painted mandala thangka featuring sacred geometry and Buddhist symbolism. Each piece takes months to complete.',
                image_url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',
                is_featured: true,
                display_order: 1
            },
            {
                id: 'prod-002',
                name: 'Hand-Hammered Full Moon Singing Bowl',
                price: 450,
                category_id: 'singing-bowls',
                description: 'Authentic full moon singing bowl, hand-hammered by master artisans. Produces deep, resonant tones for meditation.',
                image_url: 'https://images.unsplash.com/photo-1599458319801-443b73259966?w=800&q=80',
                is_featured: true,
                display_order: 2
            },
            {
                id: 'prod-003',
                name: 'Gilded Shakyamuni Buddha Statue',
                price: 2800,
                category_id: 'statues',
                description: 'Hand-carved Shakyamuni Buddha statue with gold leaf accents. Traditional craftsmanship passed down through generations.',
                image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
                is_featured: true,
                display_order: 3
            },
            {
                id: 'prod-004',
                name: 'Turquoise Silver Ring',
                price: 150,
                category_id: 'jewelry',
                description: 'Ethnic silver ring with authentic Nepalese turquoise. Hand-crafted using traditional jewelry making techniques.',
                image_url: 'https://images.unsplash.com/photo-1626014303757-646637e90952?w=800&q=80',
                is_featured: false,
                display_order: 4
            }
        ]

        for (const product of products) {
            const { error } = await supabase
                .from('products')
                .upsert(product, { onConflict: 'id' })
            if (error) console.error(`❌ Product ${product.name}:`, error)
            else console.log(`✅ Product "${product.name}" created/updated`)
        }

        // 3. Homepage Slider Items
        console.log('🎠 Creating homepage slider content...')
        const sliderItems = [
            {
                id: 'slide-001',
                title: 'Authentic Himalayan Treasures',
                subtitle: 'Discover handcrafted masterpieces directly from the heart of Nepal. Each piece supports local artisan communities.',
                image_url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=1200&h=600&fit=crop&q=90',
                button_text: 'Explore Collection',
                button_url: 'products.html',
                display_order: 1,
                is_active: true
            },
            {
                id: 'slide-002',
                title: 'Centuries of Craftsmanship',
                subtitle: 'Ancient techniques passed down through generations. Every item tells a story of cultural heritage.',
                image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&h=600&fit=crop&q=90',
                button_text: 'View Artisans',
                button_url: 'about.html',
                display_order: 2,
                is_active: true
            }
        ]

        for (const slide of sliderItems) {
            const { error } = await supabase
                .from('slider_items')
                .upsert(slide, { onConflict: 'id' })
            if (error) console.error(`❌ Slide ${slide.title}:`, error)
            else console.log(`✅ Slide "${slide.title}" created/updated`)
        }

        // 4. Blog Stories
        console.log('📝 Creating blog stories...')
        const blogStories = [
            {
                id: 'blog-001',
                title: 'The Art of Singing Bowl Crafting',
                excerpt: 'Discover the ancient tradition of crafting singing bowls in the Himalayas.',
                content: 'Singing bowls have been crafted in the Himalayas for centuries...',
                author: 'Artisan Collective',
                image_url: 'https://images.unsplash.com/photo-1599458319801-443b73259966?w=800&q=80',
                publish_date: new Date().toISOString(),
                slug: 'art-singing-bowl-crafting',
                is_featured: true
            },
            {
                id: 'blog-002',
                title: 'Understanding Thangka Art',
                excerpt: 'Learn about the spiritual significance and intricate process of thangka painting.',
                content: 'Thangka art is a traditional Buddhist painting style...',
                author: 'Cultural Heritage Team',
                image_url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',
                publish_date: new Date().toISOString(),
                slug: 'understanding-thangka-art',
                is_featured: false
            }
        ]

        for (const blog of blogStories) {
            const { error } = await supabase
                .from('blog_stories')
                .upsert(blog, { onConflict: 'id' })
            if (error) console.error(`❌ Blog ${blog.title}:`, error)
            else console.log(`✅ Blog "${blog.title}" created/updated`)
        }

        console.log('\n🎉 Initial content population completed!')
        console.log('📱 You can now manage this content through the admin panel at /admin/content.html')

    } catch (error) {
        console.error('❌ Error populating content:', error)
    }
}

populateContent()