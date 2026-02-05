-- Create each table individually
-- Run these commands ONE BY ONE in Supabase SQL Editor

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Check if categories table was created
SELECT 'categories table: OK' as status WHERE EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'categories'
);