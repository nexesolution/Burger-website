-- ====================================================================
-- BUZZ BURGER RESTAURANT & POS SYSTEM - ALL-IN-ONE MASTER SUPABASE SCRIPT
-- ====================================================================

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    image TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0
);

-- 2. PRODUCTS TABLE (With Recipe JSON for Auto Inventory Stock Deduction)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    sale_price NUMERIC,
    cost NUMERIC DEFAULT 0,
    image TEXT,
    ingredients JSONB DEFAULT '[]'::jsonb,
    recipe JSONB DEFAULT '[]'::jsonb,
    calories INT DEFAULT 0,
    preparation_time INT DEFAULT 10,
    stock_quantity NUMERIC DEFAULT 100,
    low_stock_threshold NUMERIC DEFAULT 10,
    is_featured BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    is_spicy BOOLEAN DEFAULT false,
    is_popular BOOLEAN DEFAULT false,
    is_vegetarian BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INVENTORY & RAW MATERIALS TABLE (Kg, Pcs, Liters, Cans)
CREATE TABLE IF NOT EXISTS public.inventory (
    id TEXT PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    current_stock NUMERIC DEFAULT 0,
    unit TEXT NOT NULL, -- 'Kg', 'Pcs', 'Liters', 'Cans'
    low_stock_threshold NUMERIC DEFAULT 10,
    unit_cost NUMERIC DEFAULT 0,
    supplier TEXT,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE (POS, Waiter Pad & Customer Orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    city TEXT DEFAULT 'Lahore',
    order_type TEXT NOT NULL, -- 'Delivery', 'Pickup', 'Dine-in'
    table_number TEXT,
    status TEXT DEFAULT 'Received', -- 'Received', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'
    payment_method TEXT DEFAULT 'Cash', -- 'Cash', 'Card', 'PayFast'
    payment_status TEXT DEFAULT 'Paid',
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL,
    tax NUMERIC DEFAULT 0,
    delivery_fee NUMERIC DEFAULT 0,
    discount NUMERIC DEFAULT 0,
    coupon_code TEXT,
    total NUMERIC NOT NULL,
    waiter_id TEXT,
    waiter_name TEXT,
    rider_id TEXT,
    rider_name TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FBR CONFIGURATION TABLE (Federal Board of Revenue POS Licensing)
CREATE TABLE IF NOT EXISTS public.fbr_config (
    id TEXT PRIMARY KEY DEFAULT 'fbr_main_config',
    pos_id TEXT NOT NULL DEFAULT 'FBR-PK-9821-POS1',
    strn TEXT NOT NULL DEFAULT '3277876123459',
    ntn TEXT NOT NULL DEFAULT '7891234-5',
    revenue_authority TEXT DEFAULT 'PRA (Punjab)',
    cash_tax_rate NUMERIC DEFAULT 16,
    card_tax_rate NUMERIC DEFAULT 5,
    api_url TEXT DEFAULT 'https://pos.fbr.gov.pk/api/v1/Invoice/Post',
    environment TEXT DEFAULT 'Production',
    bearer_token TEXT DEFAULT 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fbr_live_access_token',
    terminal_code TEXT DEFAULT 'LHR-DHA-TERM-01',
    auto_fiscalize BOOLEAN DEFAULT true,
    is_connected BOOLEAN DEFAULT true,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FBR FISCALIZED TRANSMISSIONS LOG TABLE
CREATE TABLE IF NOT EXISTS public.fbr_transmissions (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    order_number TEXT NOT NULL,
    fbr_invoice_number TEXT UNIQUE NOT NULL,
    customer_name TEXT,
    total_amount NUMERIC NOT NULL,
    tax_amount NUMERIC NOT NULL,
    payment_mode TEXT NOT NULL,
    fiscalization_status TEXT DEFAULT 'FISCALIZED', -- 'FISCALIZED', 'PENDING', 'FAILED'
    qr_hash TEXT,
    response_code INT DEFAULT 200,
    transmitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. STAFF MEMBERS TABLE (With Username & Password Credentials)
CREATE TABLE IF NOT EXISTS public.staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL, -- 'Admin', 'Manager', 'Cashier', 'Kitchen', 'Waiter', 'Rider', 'Superadmin'
    status TEXT DEFAULT 'Active',
    joining_date DATE DEFAULT CURRENT_DATE
);

-- 8. WAITERS TABLE
CREATE TABLE IF NOT EXISTS public.waiters (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT DEFAULT 'Available', -- 'Available', 'On Shift', 'Off Shift'
    assigned_tables JSONB DEFAULT '[]'::jsonb,
    total_sales NUMERIC DEFAULT 0
);

-- 9. RIDERS TABLE
CREATE TABLE IF NOT EXISTS public.riders (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    vehicle TEXT DEFAULT 'Bike',
    status TEXT DEFAULT 'Available', -- 'Available', 'Busy', 'Offline'
    current_orders INT DEFAULT 0,
    rating NUMERIC DEFAULT 5.0
);

-- 10. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    total_orders INT DEFAULT 0,
    total_spent NUMERIC DEFAULT 0,
    loyalty_points INT DEFAULT 0,
    last_order_date DATE,
    address TEXT
);

-- 11. DEALS & COMBOS TABLE
CREATE TABLE IF NOT EXISTS public.deals (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    image TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true
);

-- 12. DISCOUNTED ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.discounted_items (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    discount_percentage NUMERIC NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT true
);

-- 13. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT DEFAULT 'percentage', -- 'percentage' or 'fixed'
    amount NUMERIC NOT NULL,
    max_discount NUMERIC DEFAULT 500,
    min_spend NUMERIC DEFAULT 1000,
    times_used INT DEFAULT 0,
    max_uses INT DEFAULT 100,
    is_active BOOLEAN DEFAULT true
);

-- 14. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS public.expenses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    payment_method TEXT DEFAULT 'Cash',
    description TEXT
);

-- 15. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'main_settings',
    restaurant_name TEXT DEFAULT 'BUZZ BURGER',
    tagline TEXT DEFAULT 'SMASH BURGERS & CRAFT FRIES',
    address TEXT DEFAULT 'DHA Phase 6 Commercial, Lahore, Pakistan',
    phone TEXT DEFAULT '+92 300 8282899',
    email TEXT DEFAULT 'info@buzzburgers.pk',
    city TEXT DEFAULT 'Lahore',
    opening_hours TEXT DEFAULT '12:00 PM - 03:00 AM',
    currency TEXT DEFAULT 'PKR',
    currency_symbol TEXT DEFAULT 'Rs.',
    gst_percentage NUMERIC DEFAULT 16,
    card_gst_percentage NUMERIC DEFAULT 5,
    delivery_fee NUMERIC DEFAULT 150,
    min_order_amount NUMERIC DEFAULT 850,
    fbr_pos_id TEXT DEFAULT 'FBR-PK-9821-POS1'
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES & ANON PUBLIC ACCESS (2-Way Live Sync)
-- ====================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fbr_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fbr_transmissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounted_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
DROP POLICY IF EXISTS "Public Write Categories" ON public.categories;
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Write Categories" ON public.categories FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Products" ON public.products;
DROP POLICY IF EXISTS "Public Write Products" ON public.products;
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Write Products" ON public.products FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Inventory" ON public.inventory;
DROP POLICY IF EXISTS "Public Write Inventory" ON public.inventory;
CREATE POLICY "Public Read Inventory" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Public Write Inventory" ON public.inventory FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Write Orders" ON public.orders;
CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Write Orders" ON public.orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read FBR Config" ON public.fbr_config;
DROP POLICY IF EXISTS "Public Write FBR Config" ON public.fbr_config;
CREATE POLICY "Public Read FBR Config" ON public.fbr_config FOR SELECT USING (true);
CREATE POLICY "Public Write FBR Config" ON public.fbr_config FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read FBR Transmissions" ON public.fbr_transmissions;
DROP POLICY IF EXISTS "Public Write FBR Transmissions" ON public.fbr_transmissions;
CREATE POLICY "Public Read FBR Transmissions" ON public.fbr_transmissions FOR SELECT USING (true);
CREATE POLICY "Public Write FBR Transmissions" ON public.fbr_transmissions FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Staff" ON public.staff;
DROP POLICY IF EXISTS "Public Write Staff" ON public.staff;
CREATE POLICY "Public Read Staff" ON public.staff FOR SELECT USING (true);
CREATE POLICY "Public Write Staff" ON public.staff FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Waiters" ON public.waiters;
DROP POLICY IF EXISTS "Public Write Waiters" ON public.waiters;
CREATE POLICY "Public Read Waiters" ON public.waiters FOR SELECT USING (true);
CREATE POLICY "Public Write Waiters" ON public.waiters FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Riders" ON public.riders;
DROP POLICY IF EXISTS "Public Write Riders" ON public.riders;
CREATE POLICY "Public Read Riders" ON public.riders FOR SELECT USING (true);
CREATE POLICY "Public Write Riders" ON public.riders FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Customers" ON public.customers;
DROP POLICY IF EXISTS "Public Write Customers" ON public.customers;
CREATE POLICY "Public Read Customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Public Write Customers" ON public.customers FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Deals" ON public.deals;
DROP POLICY IF EXISTS "Public Write Deals" ON public.deals;
CREATE POLICY "Public Read Deals" ON public.deals FOR SELECT USING (true);
CREATE POLICY "Public Write Deals" ON public.deals FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Discounted" ON public.discounted_items;
DROP POLICY IF EXISTS "Public Write Discounted" ON public.discounted_items;
CREATE POLICY "Public Read Discounted" ON public.discounted_items FOR SELECT USING (true);
CREATE POLICY "Public Write Discounted" ON public.discounted_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Coupons" ON public.coupons;
DROP POLICY IF EXISTS "Public Write Coupons" ON public.coupons;
CREATE POLICY "Public Read Coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Public Write Coupons" ON public.coupons FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Expenses" ON public.expenses;
DROP POLICY IF EXISTS "Public Write Expenses" ON public.expenses;
CREATE POLICY "Public Read Expenses" ON public.expenses FOR SELECT USING (true);
CREATE POLICY "Public Write Expenses" ON public.expenses FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Settings" ON public.store_settings;
DROP POLICY IF EXISTS "Public Write Settings" ON public.store_settings;
CREATE POLICY "Public Read Settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Public Write Settings" ON public.store_settings FOR ALL USING (true);

-- ====================================================================
-- REALTIME BROADCASTING PUBLICATION (ENABLES REALTIME ON ALL 15 TABLES)
-- ====================================================================

DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;

-- ====================================================================
-- INITIAL SEED DATA INSERTS FOR ALL TABLES
-- ====================================================================

-- 1. Store Settings Seed Data
INSERT INTO public.store_settings (id, restaurant_name, tagline, address, phone, email, city, gst_percentage, card_gst_percentage, fbr_pos_id)
VALUES ('main_settings', 'BUZZ BURGER', 'SMASH BURGERS & CRAFT FRIES', 'Plot 14-C, Main Khayaban-e-Shahbaz, DHA Phase 6', '+92 300 8282899', 'info@buzzburgers.pk', 'Lahore', 16, 5, 'FBR-PK-9821-POS1')
ON CONFLICT (id) DO UPDATE SET restaurant_name = EXCLUDED.restaurant_name;

-- 2. FBR Config Seed Data
INSERT INTO public.fbr_config (id, pos_id, strn, ntn, revenue_authority, cash_tax_rate, card_tax_rate, api_url, environment, bearer_token, terminal_code, auto_fiscalize, is_connected)
VALUES ('fbr_main_config', 'FBR-PK-9821-POS1', '3277876123459', '7891234-5', 'PRA (Punjab)', 16, 5, 'https://pos.fbr.gov.pk/api/v1/Invoice/Post', 'Production', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fbr_live_access_token', 'LHR-DHA-TERM-01', true, true)
ON CONFLICT (id) DO UPDATE SET pos_id = EXCLUDED.pos_id;

-- 3. Categories Seed Data
INSERT INTO public.categories (id, name, slug, description, image, is_active, display_order) VALUES
('cat-1', 'Gourmet Burgers', 'gourmet-burgers', '100% Halal Angus beef smash burgers & buttermilk crispy chicken', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', true, 1),
('cat-2', 'Loaded Fries & Sides', 'loaded-fries-sides', 'Hand-cut shoestring fries, melted cheddar, & signature dips', 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80', true, 2),
('cat-3', 'Thick Milkshakes', 'thick-milkshakes', 'Hand-spun ice cream milkshakes', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', true, 3),
('cat-4', 'Chilled Beverages', 'chilled-beverages', 'Coca-Cola, Fanta, Mirinda, & fresh juices', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80', true, 4)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 4. Staff Accounts Seed Data (With Credentials)
INSERT INTO public.staff (id, name, email, username, password, phone, role, status, joining_date) VALUES
('staff-1', 'Restaurant Administrator', 'admin@buzzburgers.pk', 'admin', 'admin123', '+92 300 1112222', 'Admin', 'Active', '2026-01-01'),
('staff-2', 'Master Superadmin', 'superadmin@buzzburgers.pk', 'superadmin', 'admin123', '+92 300 0000000', 'Superadmin', 'Active', '2026-01-01'),
('staff-3', 'Chef Tariq Jameel', 'chef@buzzburgers.pk', 'chef', 'chef123', '+92 311 4445555', 'Kitchen', 'Active', '2026-02-01'),
('staff-4', 'Kamran Ali', 'kamran@buzzburgers.pk', 'waiter', 'waiter123', '+92 301 5556666', 'Waiter', 'Active', '2026-02-15'),
('staff-5', 'Shahid Iqbal', 'shahid@buzzburgers.pk', 'rider', 'rider123', '+92 302 6667777', 'Rider', 'Active', '2026-03-01')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 5. Raw Material Inventory Seed Data (Kg, Pcs, Liters, Cans)
INSERT INTO public.inventory (id, sku, name, category, current_stock, unit, low_stock_threshold, unit_cost, supplier) VALUES
('inv-1', 'RAW-BEEF-01', 'Fresh Angus Beef Meat', 'Meat & Poultry', 50, 'Kg', 10, 2400, 'MeatOne Halal Butchery'),
('inv-2', 'RAW-CHICKEN-02', 'Boneless Chicken Breast Fillets', 'Meat & Poultry', 45, 'Kg', 8, 1150, 'K&N Fresh Farms'),
('inv-3', 'RAW-BUN-03', 'Artisanal Brioche Burger Buns', 'Bakery & Buns', 250, 'Pcs', 40, 65, 'Golden Bakehouse DHA'),
('inv-4', 'RAW-PATTY-04', 'Pre-Formed Angus Beef Patties', 'Meat & Poultry', 120, 'Pcs', 25, 380, 'Prime Butchery Gulberg'),
('inv-5', 'RAW-CHEESE-06', 'Melted Cheddar Cheese Slices', 'Dairy & Cheese', 300, 'Pcs', 50, 45, 'Nurpur Dairy Pakistan'),
('inv-6', 'RAW-COKE-07', 'Coca-Cola 1.5L Bottles', 'Beverages', 40, 'Liters', 12, 180, 'Coca-Cola Beverages Pakistan'),
('inv-7', 'RAW-OIL-12', 'Deep Frying Cooking Oil', 'Sauces & Condiments', 50, 'Liters', 12, 520, 'Habib Oil Mills')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 6. Products Catalog Seed Data (With Recipe Weight JSON)
INSERT INTO public.products (id, sku, name, category_id, description, price, sale_price, cost, image, ingredients, recipe, calories, preparation_time, stock_quantity, low_stock_threshold, is_featured, is_available, is_spicy, is_popular, is_vegetarian) VALUES
('prod-1', 'BZ-PK-101', 'Lahore Double Smash Melt', 'cat-1', 'Double Angus beef smash patties, melted cheddar, pickles & special secret sauce on toasted brioche bun.', 1490, 1350, 520, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', '["Angus Beef", "Brioche Bun", "Cheddar Cheese"]'::jsonb, '[{"inventoryItemId":"inv-1","inventoryItemName":"Fresh Angus Beef Meat","amount":0.6,"unit":"Kg"},{"inventoryItemId":"inv-3","inventoryItemName":"Artisanal Brioche Burger Buns","amount":1,"unit":"Pcs"},{"inventoryItemId":"inv-5","inventoryItemName":"Melted Cheddar Cheese Slices","amount":2,"unit":"Pcs"}]'::jsonb, 850, 12, 100, 10, true, true, false, true, false),
('prod-2', 'BZ-PK-102', 'Crispy Buttermilk Chicken Zinger', 'cat-1', 'Crispy fried buttermilk chicken breast, iceberg lettuce & garlic mayo on toasted brioche bun.', 1190, NULL, 380, 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80', '["Chicken Breast", "Brioche Bun", "Mayo"]'::jsonb, '[{"inventoryItemId":"inv-2","inventoryItemName":"Boneless Chicken Breast Fillets","amount":0.4,"unit":"Kg"},{"inventoryItemId":"inv-3","inventoryItemName":"Artisanal Brioche Burger Buns","amount":1,"unit":"Pcs"}]'::jsonb, 720, 10, 100, 10, true, true, true, true, false),
('prod-3', 'BZ-PK-103', 'Smoky Jalapeño BBQ Beef', 'cat-1', 'Double beef patties, pickled jalapeños, crispy onion rings & hickory BBQ sauce.', 1650, NULL, 580, 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', '["Angus Beef", "Brioche Bun", "BBQ Sauce"]'::jsonb, '[{"inventoryItemId":"inv-1","inventoryItemName":"Fresh Angus Beef Meat","amount":0.6,"unit":"Kg"},{"inventoryItemId":"inv-3","inventoryItemName":"Artisanal Brioche Burger Buns","amount":1,"unit":"Pcs"}]'::jsonb, 920, 14, 100, 10, false, true, true, true, false),
('prod-4', 'BZ-PK-104', 'Beast Monster Triple Stack', 'cat-1', 'Triple smash beef patties, triple cheese, smoked bacon strips & Buzz signature glaze.', 2290, 2090, 820, 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80', '["Angus Beef", "Brioche Bun", "Cheddar Cheese"]'::jsonb, '[{"inventoryItemId":"inv-1","inventoryItemName":"Fresh Angus Beef Meat","amount":0.9,"unit":"Kg"},{"inventoryItemId":"inv-3","inventoryItemName":"Artisanal Brioche Burger Buns","amount":1,"unit":"Pcs"}]'::jsonb, 1250, 15, 100, 10, true, true, false, true, false),
('prod-5', 'BZ-PK-201', 'BUZZ Special Craft Fries', 'cat-2', 'Hand-cut shoestring potato fries dusted with signature peri-peri spice blend.', 590, NULL, 180, 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80', '["Potato Fries", "Spice Mix"]'::jsonb, '[]'::jsonb, 420, 6, 100, 10, true, true, false, true, true),
('prod-6', 'BZ-PK-202', 'Truffle Parmesan Fries', 'cat-2', 'Crispy shoestring fries tossed in white truffle oil, shaved parmesan cheese & fresh parsley.', 790, NULL, 260, 'https://images.unsplash.com/photo-1630384060421-cb3f20e0649d?auto=format&fit=crop&w=800&q=80', '["Potato Fries", "Truffle Oil", "Parmesan"]'::jsonb, '[]'::jsonb, 510, 8, 100, 10, false, true, false, false, true),
('prod-7', 'BZ-PK-301', 'Salted Caramel Milkshake', 'cat-3', 'Hand-spun vanilla bean ice cream blended with thick salted caramel drizzle.', 690, NULL, 210, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', '["Vanilla Ice Cream", "Caramel"]'::jsonb, '[]'::jsonb, 580, 5, 100, 10, true, true, false, true, true),
('prod-8', 'BZ-PK-302', 'Belgian Chocolate Shake', 'cat-3', 'Rich Belgian dark chocolate ice cream shake topped with whipped cream.', 750, NULL, 230, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80', '["Dark Chocolate", "Ice Cream"]'::jsonb, '[]'::jsonb, 620, 5, 100, 10, false, true, false, true, true),
('prod-9', 'BZ-PK-401', 'Coca-Cola 1.5L Bottle', 'cat-4', 'Chilled 1.5 Liters Coca-Cola Bottle.', 280, NULL, 180, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80', '["Coca Cola"]'::jsonb, '[{"inventoryItemId":"inv-6","inventoryItemName":"Coca-Cola 1.5L Bottles","amount":1.5,"unit":"Liters"}]'::jsonb, 200, 2, 100, 10, false, true, false, true, true),
('prod-10', 'BZ-PK-402', 'Fanta Orange 1.5L Bottle', 'cat-4', 'Chilled 1.5 Liters Fanta Orange Bottle.', 280, NULL, 180, 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&w=800&q=80', '["Fanta Orange"]'::jsonb, '[]'::jsonb, 210, 2, 100, 10, false, true, false, false, true),
('prod-11', 'BZ-PK-403', 'Mirinda Citrus Can (350ml)', 'cat-4', 'Chilled 350ml Mirinda Citrus Can.', 160, NULL, 95, 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=800&q=80', '["Mirinda Can"]'::jsonb, '[{"inventoryItemId":"inv-8","inventoryItemName":"Mirinda Citrus Cans (350ml)","amount":1,"unit":"Cans"}]'::jsonb, 140, 2, 100, 10, false, true, false, false, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 7. Waiters Seed Data
INSERT INTO public.waiters (id, name, phone, status, assigned_tables, total_sales) VALUES
('w-1', 'Kamran Ali', '+92 301 5556666', 'On Shift', '["Table 01", "Table 02", "Table 05"]'::jsonb, 45200),
('w-2', 'Fahad Sheikh', '+92 322 7778888', 'On Shift', '["Table 03", "Table 04", "Table 06"]'::jsonb, 39200),
('w-3', 'Daniyal Hassan', '+92 334 8889999', 'Available', '[]'::jsonb, 28900)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 8. Riders Seed Data
INSERT INTO public.riders (id, name, phone, vehicle, status, current_orders, rating) VALUES
('r-1', 'Shahid Iqbal', '+92 302 6667777', 'Honda CG125 Bike', 'Busy', 2, 4.9),
('r-2', 'Rashid Mehmood', '+92 313 9990000', 'Honda CD70 Bike', 'Available', 0, 4.8),
('r-3', 'Asadullah', '+92 346 1239999', 'Yamaha YBR125', 'Available', 0, 5.0)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 9. Customers Seed Data
INSERT INTO public.customers (id, name, phone, email, total_orders, total_spent, loyalty_points, last_order_date, address) VALUES
('cust-1', 'Bilal Ahmed', '+92 300 9234567', 'bilal.ahmed@gmail.com', 8, 14500, 1450, '2026-08-07', 'Plot 45-C, Khayaban-e-Seher, DHA Phase 6'),
('cust-2', 'Hamza Sheikh', '+92 321 8765432', 'hamza.s@hotmail.com', 5, 8900, 890, '2026-08-06', 'House 12, Street 4, Gulberg III'),
('cust-3', 'Ayesha Khan', '+92 333 4321098', 'ayesha.khan@gmail.com', 7, 12300, 1230, '2026-08-05', 'Apartment 4B, Silver Towers, F-11/1')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 10. Deals Seed Data
INSERT INTO public.deals (id, title, description, price, original_price, image, items, is_active) VALUES
('deal-1', 'Double Smash Feast Combo', '2x Lahore Double Smash Melts, 1x Large Buzz Craft Fries & 2x Chilled Beverages.', 2890, 3450, 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', '["2x Lahore Double Smash Melt", "1x Buzz Craft Fries", "2x Coke 1.5L"]'::jsonb, true),
('deal-2', 'Family Burger Stack Combo', '4x Gourmet Smash Burgers, 2x Loaded Fries & 4x Chilled Drinks.', 4990, 6200, 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80', '["4x Gourmet Burgers", "2x Loaded Fries", "4x Soft Drinks"]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- 11. Discounted Items Seed Data
INSERT INTO public.discounted_items (id, product_id, discount_percentage, end_date, is_active) VALUES
('disc-1', 'prod-1', 15, '2026-08-31', true),
('disc-2', 'prod-3', 20, '2026-08-31', true)
ON CONFLICT (id) DO UPDATE SET discount_percentage = EXCLUDED.discount_percentage;

-- 12. Coupons Seed Data
INSERT INTO public.coupons (id, code, discount_type, amount, max_discount, min_spend, times_used, max_uses, is_active) VALUES
('cp-1', 'BUZZ50', 'percentage', 15, 500, 1000, 14, 100, true),
('cp-2', 'WELCOME100', 'fixed', 100, 100, 800, 28, 200, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code;

-- 13. Expenses Seed Data
INSERT INTO public.expenses (id, title, category, amount, date, payment_method, description) VALUES
('exp-1', 'Monthly DHA Branch Lease Rent', 'Rent', 350000, '2026-08-01', 'Bank Transfer', 'August 2026 commercial lease payment for DHA Phase 6 Karachi branch.'),
('exp-2', 'K-Electric & SSGC Commercial Bill', 'Utilities', 85000, '2026-08-03', 'Corporate Bank Transfer', 'Commercial kitchen power electricity & high-pressure gas meter bill.'),
('exp-3', 'Halal Beef & Produce Inventory Batch', 'Supplies', 245000, '2026-08-05', 'Vendor Credit', 'Weekly stock of 100% Halal Angus beef, buttermilk chicken & fresh produce.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;