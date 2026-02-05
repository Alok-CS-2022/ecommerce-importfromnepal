-- Create missing tables for Phase 3
-- Run this in Supabase SQL Editor

-- Create categories table (if it doesn't exist with proper structure)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
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

-- Add missing columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Test the tables exist
SELECT 'categories table created' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories');
SELECT 'slider_items table created' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'slider_items');
SELECT 'blog_stories table created' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blog_stories');