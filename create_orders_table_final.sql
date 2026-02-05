-- Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_country TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_city TEXT,
    customer_state TEXT,
    customer_zip TEXT,
    special_requests TEXT,
    items TEXT NOT NULL, -- JSON format
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, processing, shipped, delivered
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_orders_email ON public.orders(customer_email);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- Enable RLS (Row Level Security) if needed
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert orders (for guest checkout)
CREATE POLICY "Allow anyone to insert orders" 
    ON public.orders 
    FOR INSERT 
    WITH CHECK (true);

-- Create policy to allow users to read their own orders
CREATE POLICY "Allow reading own orders" 
    ON public.orders 
    FOR SELECT 
    USING (true); -- Change to: auth.jwt() ->> 'email' = customer_email for authenticated users only

-- Create policy to allow anyone to update order status
CREATE POLICY "Allow updating order status" 
    ON public.orders 
    FOR UPDATE 
    USING (true);
