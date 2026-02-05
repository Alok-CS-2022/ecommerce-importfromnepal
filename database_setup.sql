-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create slider_items table
CREATE TABLE IF NOT EXISTS slider_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    button_text TEXT,
    button_link TEXT,
    accent_pill TEXT DEFAULT 'Featured',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_stories table
CREATE TABLE IF NOT EXISTS blog_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'Story',
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to products table if they don't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Insert some initial categories (with slug column)
INSERT INTO categories (name, slug, image_url, display_order) VALUES
('Home Decor', 'home-decor', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=90', 1),
('Wooden Masks', 'wooden-masks', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=90', 2),
('Beverages', 'beverages', 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=90', 3)
ON CONFLICT (slug) DO NOTHING;

-- Insert initial slider items (migrate from hardcoded HTML)
INSERT INTO slider_items (title, description, image_url, button_text, button_link, accent_pill, display_order) VALUES
('Handwoven Thangka', '200-year technique from Kathmandu Valley', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=1200&q=90', 'Explore Legacy', '/products.html', 'Ancient Craft', 1),
('Singing Bowls', '7-Metal alloy handcrafted in the Himalayas', 'https://images.unsplash.com/photo-1599458319801-443b73259966?w=1200&q=90', 'Feel the Sound', '/products.html', 'Vimana Sounds', 2),
('Pashmina Shawls', 'Authentic hand-combed Chyangra goat wool', 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=1200&q=90', 'Discover Warmth', '/products.html', 'Mountain Gold', 3)
ON CONFLICT DO NOTHING;

-- Insert initial blog stories (migrate from hardcoded HTML)
INSERT INTO blog_stories (title, description, image_url, category, is_featured, display_order) VALUES
('The Resonance of Seven Metals: Singing Bowl Secrets', 'Discover the ancient metallurgical secrets behind the healing vibrations of Himalayan singing bowls.', 'https://images.unsplash.com/photo-1582719366955-bfb54a72b2fc?w=800&q=100', 'Tradition', true, 1),
('Preserving Heritage: The Copper Smiths of Patan', 'Meet the families who have perfected the art of copper sculpture over ten generations in Nepal.', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=100', 'Artisans', false, 2),
('Mandala Meditation: Decoding Sacred Geometry', 'A deep dive into the mathematical precision and spiritual significance of Thangka mandala paintings.', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=100', 'Symbolism', false, 3)
ON CONFLICT DO NOTHING;