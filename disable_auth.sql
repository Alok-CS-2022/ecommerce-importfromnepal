-- ⚠️ DANGER: This disables security checks on your database tables.
-- Run this in your Supabase SQL Editor to allow the "Login-Free" version of your site to work.

-- 1. Disable Row Level Security (RLS) on key tables
-- This allows anyone with the API key (which is public) to read/write data.
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- If you have other tables like 'inquiries', add them here:
-- ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;
