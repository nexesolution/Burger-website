-- ========================================================
-- BUZZ BURGER — SUPABASE COMPLETE DATABASE SCHEMA & REALTIME SETUP
-- Paste this entire script into your Supabase SQL Editor and click RUN
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS store_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  restaurant_name TEXT NOT NULL DEFAULT 'BUZZ BURGER',
  tagline TEXT NOT NULL DEFAULT '100% Halal Angus Beef. Bold Flavors. Serious Burgers.',
  phone TEXT NOT NULL DEFAULT '+92 300 8282899',
  email TEXT NOT NULL DEFAULT 'info@buzzburgers.pk',
  address TEXT NOT NULL DEFAULT 'Plot 14-C, Main Khayaban-e-Shahbaz, DHA Phase 6',
  city TEXT NOT NULL DEFAULT 'Karachi',
  opening_hours TEXT NOT NULL DEFAULT 'Mon-Sun: 12:00 PM - 03:00 AM (Late Night Delivery)',
  currency TEXT NOT NULL DEFAULT 'PKR',
  currency_symbol TEXT NOT NULL DEFAULT 'Rs.',
  tax_rate NUMERIC NOT NULL DEFAULT 13,
  delivery_fee NUMERIC NOT NULL DEFAULT 150,
  min_order_amount NUMERIC NOT NULL DEFAULT 850,
  brand_color TEXT NOT NULL DEFAULT '#F5C400',
  theme_mode TEXT NOT NULL DEFAULT 'dark',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial store settings if not exists
INSERT INTO store_settings (id, restaurant_name, tagline, phone, email, address, city, currency, currency_symbol, tax_rate, delivery_fee)
VALUES ('default', 'BUZZ BURGER', '100% Halal Angus Beef. Bold Flavors. Serious Burgers.', '+92 300 8282899', 'info@buzzburgers.pk', 'Plot 14-C, Main Khayaban-e-Shahbaz, DHA Phase 6', 'Karachi', 'PKR', 'Rs.', 13, 150)
ON CONFLICT (id) DO NOTHING;

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT NOT NULL,
  price NUMERIC NOT NULL,
  sale_price NUMERIC,
  description TEXT,
  image TEXT,
  is_popular BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_spicy BOOLEAN DEFAULT false,
  sku TEXT,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INT DEFAULT 100,
  calories INT DEFAULT 0,
  preparation_time INT DEFAULT 15,
  ingredients JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_address TEXT,
  order_type TEXT NOT NULL, -- Dine-in, Pickup, Delivery
  table_number TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  tax NUMERIC DEFAULT 0,
  delivery_fee NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'Unpaid',
  status TEXT DEFAULT 'Pending', -- Pending, Preparing, Ready, Out for Delivery, Completed, Cancelled
  waiter_id TEXT,
  waiter_name TEXT,
  rider_id TEXT,
  rider_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WAITERS TABLE
CREATE TABLE IF NOT EXISTS waiters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT DEFAULT 'On Shift', -- Available, On Shift, Off Shift
  assigned_tables JSONB DEFAULT '[]'::jsonb,
  total_sales NUMERIC DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RIDERS TABLE
CREATE TABLE IF NOT EXISTS riders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle TEXT NOT NULL,
  status TEXT DEFAULT 'Available', -- Available, Busy, Offline
  current_orders INT DEFAULT 0,
  rating NUMERIC DEFAULT 4.9,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INVENTORY TABLE
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  current_stock NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  low_stock_threshold NUMERIC NOT NULL,
  unit_cost NUMERIC NOT NULL,
  supplier TEXT NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 7. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  date TEXT NOT NULL,
  paid_by TEXT NOT NULL,
  notes TEXT
);

-- 8. COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL, -- percentage, flat
  amount NUMERIC NOT NULL,
  min_order NUMERIC DEFAULT 0,
  expiry_date TEXT,
  times_used INT DEFAULT 0,
  active BOOLEAN DEFAULT true
);

-- 9. DEALS TABLE
CREATE TABLE IF NOT EXISTS deals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC NOT NULL,
  product_ids JSONB DEFAULT '[]'::jsonb,
  image TEXT,
  badge TEXT,
  valid_until TEXT
);

-- ========================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC ACCESS POLICIES
-- ========================================================

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE waiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Create policies allowing full read & write for app API access
CREATE POLICY "Public Read Store Settings" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Public Write Store Settings" ON store_settings FOR ALL USING (true);

CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Write Products" ON products FOR ALL USING (true);

CREATE POLICY "Public Read Orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public Write Orders" ON orders FOR ALL USING (true);

CREATE POLICY "Public Read Waiters" ON waiters FOR SELECT USING (true);
CREATE POLICY "Public Write Waiters" ON waiters FOR ALL USING (true);

CREATE POLICY "Public Read Riders" ON riders FOR SELECT USING (true);
CREATE POLICY "Public Write Riders" ON riders FOR ALL USING (true);

CREATE POLICY "Public Read Inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "Public Write Inventory" ON inventory FOR ALL USING (true);

CREATE POLICY "Public Read Expenses" ON expenses FOR SELECT USING (true);
CREATE POLICY "Public Write Expenses" ON expenses FOR ALL USING (true);

CREATE POLICY "Public Read Coupons" ON coupons FOR SELECT USING (true);
CREATE POLICY "Public Write Coupons" ON coupons FOR ALL USING (true);

CREATE POLICY "Public Read Deals" ON deals FOR SELECT USING (true);
CREATE POLICY "Public Write Deals" ON deals FOR ALL USING (true);

-- ========================================================
-- ENABLE SUPABASE REALTIME PUBLICATION FOR LIVE SYNC ACROSS ALL DEVICES
-- ========================================================
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
