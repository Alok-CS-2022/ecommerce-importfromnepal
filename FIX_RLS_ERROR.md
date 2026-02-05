# How to Fix "Row-Level Security" Error

Your Supabase database has Row-Level Security (RLS) enabled on the tables, which prevents the API from inserting/updating data.

## Quick Fix (Recommended for Development)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"
5. Paste and run this SQL:

```sql
-- Disable RLS on all admin tables
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_content DISABLE ROW LEVEL SECURITY;
```

6. Click "Run"

## What This Does

- Removes Row-Level Security restrictions
- Allows the public API key to insert/update/delete data
- Safe for development (not recommended for production with user data)

## After Running the SQL

1. The admin pages should work immediately
2. You can create categories, products, and manage orders
3. No need to restart the server

## For Production

If you're deploying to production, you should:
- Keep RLS enabled
- Set up proper policies for authenticated users
- Use the service role key for admin operations
- Implement proper authentication in the admin panel
