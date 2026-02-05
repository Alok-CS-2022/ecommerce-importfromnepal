-- Create orders table for customer inquiries
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    product_name TEXT NOT NULL,
    message TEXT NOT NULL,
    items TEXT, -- JSON string of order items
    total_amount DECIMAL(10,2) DEFAULT 0,
    status TEXT DEFAULT 'new', -- new, pending, completed
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders table
-- Allow admins to read all orders
CREATE POLICY "Admins can view all orders" ON orders
    FOR SELECT USING (
        auth.jwt() ->> 'role' = 'admin'
    );

-- Allow users to read their own orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (
        auth.uid() = user_id
    );

-- Allow anyone to insert orders (for guest submissions)
CREATE POLICY "Anyone can insert orders" ON orders
    FOR INSERT WITH CHECK (true);

-- Allow admins to update all orders
CREATE POLICY "Admins can update all orders" ON orders
    FOR UPDATE USING (
        auth.jwt() ->> 'role' = 'admin'
    );

-- Allow admins to delete orders
CREATE POLICY "Admins can delete orders" ON orders
    FOR DELETE USING (
        auth.jwt() ->> 'role' = 'admin'
    );

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);