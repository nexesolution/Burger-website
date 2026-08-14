import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useBuzzStore } from '../store/useBuzzStore';
import {
  Order,
  Product,
  Category,
  Staff,
  Waiter,
  Rider,
  InventoryItem,
  Expense,
  Coupon,
  Deal,
  Customer,
  StoreSettings,
  FBRConfig
} from '../types';

export const getSupabaseCredentials = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('BUZZ_SUPABASE_URL') || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('BUZZ_SUPABASE_ANON_KEY') || '' : '';

  const url = envUrl && envUrl !== 'YOUR_SUPABASE_URL' ? envUrl : localUrl;
  const key = envKey && envKey !== 'YOUR_SUPABASE_ANON_KEY' ? envKey : localKey;

  return { url, key };
};

export const setSupabaseCredentials = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('BUZZ_SUPABASE_URL', url.trim());
    localStorage.setItem('BUZZ_SUPABASE_ANON_KEY', key.trim());
    cachedClient = null; // reset cached client
  }
};

let cachedClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (cachedClient) return cachedClient;
  const { url, key } = getSupabaseCredentials();
  if (url && key) {
    try {
      cachedClient = createClient(url, key);
      return cachedClient;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return null;
};

export const isSupabaseConfigured = () => {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key);
};

let isFetchingFromSupabase = false;

// Formatters for database columns (matching exact snake_case columns in Supabase SQL schema)
const formatOrderForSupabase = (o: Order) => ({
  id: o.id,
  order_number: o.orderNumber,
  customer_name: o.customerName,
  phone: o.phone,
  email: o.email || null,
  address: o.address || null,
  city: o.city || 'Lahore',
  order_type: o.orderType,
  table_number: o.tableNumber || null,
  status: o.status,
  payment_method: o.paymentMethod,
  payment_status: o.paymentStatus || 'Paid',
  items: o.items,
  subtotal: o.subtotal,
  tax: o.tax || 0,
  delivery_fee: o.deliveryFee || 0,
  discount: o.discount || 0,
  coupon_code: o.couponCode || null,
  total: o.total,
  waiter_id: o.waiterId || null,
  waiter_name: o.waiterName || null,
  rider_id: o.riderId || null,
  rider_name: o.riderName || null,
  notes: o.notes || null,
  created_at: o.createdAt || new Date().toISOString(),
  updated_at: o.updatedAt || new Date().toISOString()
});

const formatProductForSupabase = (p: Product) => ({
  id: p.id,
  sku: p.sku,
  name: p.name,
  category_id: p.categoryId,
  description: p.description,
  price: p.price,
  sale_price: p.salePrice || null,
  cost: p.cost || 0,
  image: p.image,
  ingredients: p.ingredients || [],
  recipe: p.recipe || [],
  calories: p.calories || 0,
  preparation_time: p.preparationTime || 10,
  stock_quantity: p.stockQuantity || 100,
  low_stock_threshold: p.lowStockThreshold || 10,
  is_featured: p.isFeatured || false,
  is_available: p.isAvailable !== false,
  is_spicy: p.isSpicy || false,
  is_popular: p.isPopular || false,
  is_vegetarian: p.isVegetarian || false,
  created_at: new Date().toISOString()
});

const formatCategoryForSupabase = (c: Category) => ({
  id: c.id,
  name: c.name,
  slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
  description: c.description || '',
  image: c.image || '',
  is_active: c.isActive !== false,
  display_order: c.displayOrder || 0
});

const formatStaffForSupabase = (s: Staff) => ({
  id: s.id,
  name: s.name,
  email: s.email,
  username: s.username,
  password: s.password,
  phone: s.phone || null,
  role: s.role,
  status: s.status || 'Active',
  joining_date: s.joiningDate || new Date().toISOString().split('T')[0]
});

const formatWaiterForSupabase = (w: Waiter) => ({
  id: w.id,
  name: w.name,
  phone: w.phone,
  status: w.status,
  assigned_tables: w.assignedTables || [],
  total_sales: w.totalSales || 0
});

const formatRiderForSupabase = (r: Rider) => ({
  id: r.id,
  name: r.name,
  phone: r.phone,
  vehicle: r.vehicle,
  status: r.status,
  current_orders: r.currentOrders || 0,
  rating: r.rating || 5.0
});

const formatInventoryForSupabase = (i: InventoryItem) => ({
  id: i.id,
  sku: i.sku,
  name: i.name,
  category: i.category,
  current_stock: i.currentStock,
  unit: i.unit,
  low_stock_threshold: i.lowStockThreshold,
  unit_cost: i.unitCost,
  supplier: i.supplier,
  last_updated: i.lastUpdated || new Date().toISOString()
});

const formatCustomerForSupabase = (c: Customer) => ({
  id: c.id,
  name: c.name,
  phone: c.phone,
  email: c.email || null,
  total_orders: c.totalOrders || 0,
  total_spent: c.totalSpent || 0,
  loyalty_points: c.loyaltyPoints || 0,
  last_order_date: c.lastOrderDate || null,
  address: c.address || null
});

const formatExpenseForSupabase = (e: Expense) => ({
  id: e.id,
  title: e.title,
  category: e.category,
  amount: e.amount,
  date: e.date,
  payment_method: e.paymentMethod || 'Cash',
  description: e.description || null
});

const formatCouponForSupabase = (c: Coupon) => ({
  id: c.id,
  code: c.code,
  discount_type: c.discountType,
  amount: c.amount,
  max_discount: c.maxDiscount || 500,
  min_spend: c.minOrder || 1000,
  times_used: c.timesUsed || 0,
  max_uses: c.usageLimit || 100,
  is_active: c.isActive !== false
});

const formatDealForSupabase = (d: Deal) => ({
  id: d.id,
  title: d.title,
  description: d.description,
  price: d.price,
  original_price: d.originalPrice || null,
  image: d.image,
  items: d.productIds || [],
  is_active: d.isAvailable !== false
});

const formatSettingsForSupabase = (s: StoreSettings) => ({
  id: 'main_settings',
  restaurant_name: s.restaurantName,
  tagline: s.tagline,
  phone: s.phone,
  email: s.email,
  address: s.address,
  city: s.city,
  opening_hours: s.openingHours || '12:00 PM - 03:00 AM',
  currency: s.currency || 'PKR',
  currency_symbol: s.currencySymbol || 'Rs.',
  gst_percentage: s.taxRate || 16,
  card_gst_percentage: 5,
  delivery_fee: s.deliveryFee || 150,
  min_order_amount: s.minOrderAmount || 850,
  fbr_pos_id: 'FBR-PK-9821-POS1'
});

const formatFBRForSupabase = (f: FBRConfig) => ({
  id: 'fbr_main_config',
  pos_id: f.posId,
  strn: f.strn,
  ntn: f.ntn,
  revenue_authority: f.revenueAuthority,
  cash_tax_rate: f.cashTaxRate,
  card_tax_rate: f.cardTaxRate,
  api_url: f.apiUrl,
  environment: f.environment,
  bearer_token: f.bearerToken,
  terminal_code: f.terminalCode,
  auto_fiscalize: f.autoFiscalize,
  is_connected: f.isConnected,
  last_updated: new Date().toISOString()
});

// ========================================================
// WRITE OPERATIONS (WEBSITE ➔ SUPABASE CLOUD)
// ========================================================

export const saveOrderToSupabase = async (order: Order) => {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const payload = formatOrderForSupabase(order);
    const { error } = await client.from('orders').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.error('Supabase error saving order:', error);
      useBuzzStore.getState().showToast(`⚠️ Supabase Sync Error: ${error.message}`, 'error');
    } else {
      console.log('✅ Order saved to Supabase Cloud:', order.id);
    }
  } catch (err: any) {
    console.error('Error saving order to Supabase:', err);
  }
};

export const saveProductToSupabase = async (product: Product) => {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const payload = formatProductForSupabase(product);
    const { error } = await client.from('products').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.error('Supabase error saving product:', error);
      useBuzzStore.getState().showToast(`⚠️ Supabase Sync Error: ${error.message}`, 'error');
    } else {
      console.log('✅ Product saved to Supabase Cloud:', product.name);
    }
  } catch (err: any) {
    console.error('Error saving product to Supabase:', err);
  }
};

export const deleteProductFromSupabase = async (id: string) => {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const { error } = await client.from('products').delete().eq('id', id);
    if (error) console.error('Supabase error deleting product:', error);
    else console.log('✅ Product deleted from Supabase Cloud:', id);
  } catch (err: any) {
    console.error('Error deleting product from Supabase:', err);
  }
};

export const saveCategoryToSupabase = async (category: Category) => {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const payload = formatCategoryForSupabase(category);
    const { error } = await client.from('categories').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.error('Supabase error saving category:', error);
      useBuzzStore.getState().showToast(`⚠️ Supabase Sync Error: ${error.message}`, 'error');
    }
  } catch (err: any) {
    console.error('Error saving category to Supabase:', err);
  }
};

export const deleteCategoryFromSupabase = async (id: string) => {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.from('categories').delete().eq('id', id);
  } catch (err: any) {
    console.error('Error deleting category from Supabase:', err);
  }
};

export const saveStaffToSupabase = async (staff: Staff) => {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const payload = formatStaffForSupabase(staff);
    const { error } = await client.from('staff').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.error('Supabase error saving staff:', error);
      useBuzzStore.getState().showToast(`⚠️ Supabase Sync Error: ${error.message}`, 'error');
    } else {
      console.log('✅ Staff saved to Supabase Cloud:', staff.name);
    }
  } catch (err: any) {
    console.error('Error saving staff to Supabase:', err);
  }
};

export const deleteStaffFromSupabase = async (id: string) => {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.from('staff').delete().eq('id', id);
  } catch (err: any) {
    console.error('Error deleting staff from Supabase:', err);
  }
};

export const saveWaiterToSupabase = async (waiter: Waiter) => {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const payload = formatWaiterForSupabase(waiter);
    const { error } = await client.from('waiters').upsert(payload, { onConflict: 'id' });
    if (error) console.error('Supabase error saving waiter:', error);
  } catch (err: any) {
    console.error('Error saving waiter to Supabase:', err);
  }
};

export const saveRiderToSupabase = async (rider: Rider) => {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const payload = formatRiderForSupabase(rider);
    const { error } = await client.from('riders').upsert(payload, { onConflict: 'id' });
    if (error) console.error('Supabase error saving rider:', error);
  } catch (err: any) {
    console.error('Error saving rider to Supabase:', err);
  }
};

export const saveInventoryToSupabase = async (item: InventoryItem) => {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const payload = formatInventoryForSupabase(item);
    const { error } = await client.from('inventory').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.error('Supabase error saving inventory:', error);
      useBuzzStore.getState().showToast(`⚠️ Supabase Sync Error: ${error.message}`, 'error');
    }
  } catch (err: any) {
    console.error('Error saving inventory to Supabase:', err);
  }
};

export const deleteInventoryFromSupabase = async (id: string) => {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.from('inventory').delete().eq('id', id);
  } catch (err: any) {
    console.error('Error deleting inventory item from Supabase:', err);
  }
};

export const saveCustomerToSupabase = async (customer: Customer) => {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const payload = formatCustomerForSupabase(customer);
    await client.from('customers').upsert(payload, { onConflict: 'id' });
  } catch (err: any) {
    console.error('Error saving customer to Supabase:', err);
  }
};

export const saveExpenseToSupabase = async (expense: Expense) => {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const payload = formatExpenseForSupabase(expense);
    const { error } = await client.from('expenses').upsert(payload, { onConflict: 'id' });
    if (error) console.error('Supabase error saving expense:', error);
  } catch (err: any) {
    console.error('Error saving expense to Supabase:', err);
  }
};

export const saveCouponToSupabase = async (coupon: Coupon) => {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const payload = formatCouponForSupabase(coupon);
    const { error } = await client.from('coupons').upsert(payload, { onConflict: 'id' });
    if (error) console.error('Supabase error saving coupon:', error);
  } catch (err: any) {
    console.error('Error saving coupon to Supabase:', err);
  }
};

export const deleteCouponFromSupabase = async (id: string) => {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.from('coupons').delete().eq('id', id);
  } catch (err: any) {
    console.error('Error deleting coupon from Supabase:', err);
  }
};

export const saveDealToSupabase = async (deal: Deal) => {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const payload = formatDealForSupabase(deal);
    const { error } = await client.from('deals').upsert(payload, { onConflict: 'id' });
    if (error) console.error('Supabase error saving deal:', error);
  } catch (err: any) {
    console.error('Error saving deal to Supabase:', err);
  }
};

export const deleteDealFromSupabase = async (id: string) => {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.from('deals').delete().eq('id', id);
  } catch (err: any) {
    console.error('Error deleting deal from Supabase:', err);
  }
};

export const saveSettingsToSupabase = async (settings: StoreSettings) => {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const payload = formatSettingsForSupabase(settings);
    const { error } = await client.from('store_settings').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.error('Supabase error saving settings:', error);
      useBuzzStore.getState().showToast(`⚠️ Supabase Settings Error: ${error.message}`, 'error');
    } else {
      console.log('✅ Store settings updated in Supabase Cloud');
      useBuzzStore.getState().showToast('✅ Store Settings Saved to Supabase Cloud!', 'success');
    }
  } catch (err: any) {
    console.error('Error saving store settings to Supabase:', err);
  }
};

export const saveFBRToSupabase = async (config: FBRConfig) => {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const payload = formatFBRForSupabase(config);
    const { error } = await client.from('fbr_config').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.error('Supabase error saving FBR config:', error);
      useBuzzStore.getState().showToast(`⚠️ Supabase FBR Error: ${error.message}`, 'error');
    } else {
      console.log('✅ FBR Config updated in Supabase Cloud');
    }
  } catch (err: any) {
    console.error('Error saving FBR config to Supabase:', err);
  }
};

// ========================================================
// READ & REALTIME SYNC (SUPABASE CLOUD ➔ WEBSITE)
// ========================================================

export const initSupabaseSync = async () => {
  const client = getSupabaseClient();
  if (!client) {
    console.log('ℹ️ Supabase credentials not configured.');
    return;
  }

  console.log('⚡ Connected to Supabase Cloud Database & Realtime Sync Engine');

  const fetchFullSupabaseState = async () => {
    try {
      isFetchingFromSupabase = true;
      const [
        { data: products },
        { data: categories },
        { data: orders },
        { data: staff },
        { data: waiters },
        { data: riders },
        { data: inventory },
        { data: expenses },
        { data: coupons },
        { data: deals },
        { data: settings },
        { data: fbr }
      ] = await Promise.all([
        client.from('products').select('*'),
        client.from('categories').select('*').order('display_order', { ascending: true }),
        client.from('orders').select('*').order('created_at', { ascending: false }),
        client.from('staff').select('*'),
        client.from('waiters').select('*'),
        client.from('riders').select('*'),
        client.from('inventory').select('*'),
        client.from('expenses').select('*'),
        client.from('coupons').select('*'),
        client.from('deals').select('*'),
        client.from('store_settings').select('*').limit(1),
        client.from('fbr_config').select('*').limit(1)
      ]);

      if (products && products.length > 0) {
        const mappedProducts: Product[] = products.map((p) => ({
          id: p.id,
          sku: p.sku || `BZ-PK-${p.id}`,
          name: p.name,
          categoryId: p.category_id,
          description: p.description || '',
          price: Number(p.price),
          salePrice: p.sale_price ? Number(p.sale_price) : undefined,
          cost: Number(p.cost || p.price * 0.4),
          image: p.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
          ingredients: Array.isArray(p.ingredients) ? p.ingredients : [],
          recipe: Array.isArray(p.recipe) ? p.recipe : [],
          calories: p.calories || 0,
          preparationTime: p.preparation_time || 10,
          stockQuantity: p.stock_quantity || 100,
          lowStockThreshold: p.low_stock_threshold || 10,
          isFeatured: Boolean(p.is_featured),
          isAvailable: Boolean(p.is_available),
          isSpicy: Boolean(p.is_spicy),
          isPopular: Boolean(p.is_popular),
          isVegetarian: Boolean(p.is_vegetarian)
        }));
        useBuzzStore.setState({ products: mappedProducts });
      }

      if (categories && categories.length > 0) {
        const mappedCategories: Category[] = categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || '',
          image: c.image || '',
          isActive: Boolean(c.is_active),
          displayOrder: c.display_order || 0
        }));
        useBuzzStore.setState({ categories: mappedCategories });
      }

      if (orders && orders.length > 0) {
        const mappedOrders: Order[] = orders.map((o) => ({
          id: o.id,
          orderNumber: o.order_number,
          customerName: o.customer_name,
          phone: o.phone,
          email: o.email || 'guest@buzzburger.pk',
          address: o.address || 'Lahore, Pakistan',
          city: o.city || 'Lahore',
          orderType: o.order_type,
          tableNumber: o.table_number || undefined,
          status: o.status,
          paymentMethod: o.payment_method,
          paymentStatus: o.payment_status,
          items: Array.isArray(o.items) ? o.items : [],
          subtotal: Number(o.subtotal),
          tax: Number(o.tax || 0),
          deliveryFee: Number(o.delivery_fee || 0),
          discount: Number(o.discount || 0),
          couponCode: o.coupon_code || undefined,
          total: Number(o.total),
          createdAt: o.created_at,
          updatedAt: o.updated_at || o.created_at,
          waiterId: o.waiter_id || undefined,
          waiterName: o.waiter_name || undefined,
          riderId: o.rider_id || undefined,
          riderName: o.rider_name || undefined,
          notes: o.notes || undefined
        }));
        useBuzzStore.setState({ orders: mappedOrders });
      }

      if (staff && staff.length > 0) {
        const mappedStaff: Staff[] = staff.map((s) => ({
          id: s.id,
          name: s.name,
          email: s.email,
          username: s.username,
          password: s.password,
          phone: s.phone || '',
          role: s.role,
          status: s.status,
          joiningDate: s.joining_date
        }));
        useBuzzStore.setState({ staff: mappedStaff });
      }

      if (waiters && waiters.length > 0) {
        const mappedWaiters: Waiter[] = waiters.map((w) => ({
          id: w.id,
          name: w.name,
          phone: w.phone,
          status: w.status,
          assignedTables: Array.isArray(w.assigned_tables) ? w.assigned_tables : [],
          totalSales: Number(w.total_sales || 0)
        }));
        useBuzzStore.setState({ waiters: mappedWaiters });
      }

      if (riders && riders.length > 0) {
        const mappedRiders: Rider[] = riders.map((r) => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          vehicle: r.vehicle,
          status: r.status,
          currentOrders: r.current_orders || 0,
          rating: Number(r.rating || 5.0)
        }));
        useBuzzStore.setState({ riders: mappedRiders });
      }

      if (inventory && inventory.length > 0) {
        const mappedInventory: InventoryItem[] = inventory.map((i) => ({
          id: i.id,
          sku: i.sku,
          name: i.name,
          category: i.category,
          currentStock: Number(i.current_stock),
          unit: i.unit,
          lowStockThreshold: Number(i.low_stock_threshold),
          unitCost: Number(i.unit_cost),
          supplier: i.supplier,
          lastUpdated: i.last_updated
        }));
        useBuzzStore.setState({ inventory: mappedInventory });
      }

      if (expenses && expenses.length > 0) {
        const mappedExpenses: Expense[] = expenses.map((e) => ({
          id: e.id,
          title: e.title,
          category: e.category,
          amount: Number(e.amount),
          date: e.date,
          paymentMethod: e.payment_method || 'Cash',
          description: e.description || ''
        }));
        useBuzzStore.setState({ expenses: mappedExpenses });
      }

      if (coupons && coupons.length > 0) {
        const mappedCoupons: Coupon[] = coupons.map((c) => ({
          id: c.id,
          code: c.code,
          discountType: c.discount_type,
          amount: Number(c.amount),
          minOrder: Number(c.min_spend || 0),
          maxDiscount: Number(c.max_discount || 500),
          usageLimit: Number(c.max_uses || 100),
          timesUsed: c.times_used || 0,
          expiration: '2026-12-31',
          isActive: Boolean(c.is_active)
        }));
        useBuzzStore.setState({ coupons: mappedCoupons });
      }

      if (deals && deals.length > 0) {
        const mappedDeals: Deal[] = deals.map((d) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          price: Number(d.price),
          originalPrice: Number(d.original_price || d.price * 1.2),
          productIds: Array.isArray(d.items) ? d.items : [],
          image: d.image,
          isAvailable: Boolean(d.is_active)
        }));
        useBuzzStore.setState({ deals: mappedDeals });
      }

      if (settings && settings.length > 0) {
        const s = settings[0];
        useBuzzStore.setState({
          storeSettings: {
            restaurantName: s.restaurant_name,
            tagline: s.tagline,
            phone: s.phone,
            email: s.email,
            address: s.address,
            city: s.city,
            openingHours: s.opening_hours || '12:00 PM - 03:00 AM',
            currency: s.currency || 'PKR',
            currencySymbol: s.currency_symbol || 'Rs.',
            taxRate: Number(s.gst_percentage || 16),
            deliveryFee: Number(s.delivery_fee || 150),
            minOrderAmount: Number(s.min_order_amount || 850),
            preparationTimeMinutes: 15,
            autoConfirmOrders: true,
            brandColor: '#F5C400',
            themeMode: 'dark'
          }
        });
      }

      if (fbr && fbr.length > 0) {
        const f = fbr[0];
        useBuzzStore.setState({
          fbrConfig: {
            posId: f.pos_id,
            strn: f.strn,
            ntn: f.ntn,
            revenueAuthority: f.revenue_authority,
            cashTaxRate: Number(f.cash_tax_rate),
            cardTaxRate: Number(f.card_tax_rate),
            apiUrl: f.api_url,
            environment: f.environment,
            bearerToken: f.bearer_token,
            terminalCode: f.terminal_code,
            autoFiscalize: Boolean(f.auto_fiscalize),
            token: f.bearer_token,
            isConnected: Boolean(f.is_connected)
          }
        });
      }

      isFetchingFromSupabase = false;
      console.log('✅ 100% Supabase Cloud data synchronized with local App!');
    } catch (err) {
      console.error('Error fetching Supabase state:', err);
      isFetchingFromSupabase = false;
    }
  };

  // Initial fetch
  await fetchFullSupabaseState();

  // Listen to Supabase Realtime changes across all tables
  client
    .channel('public:buzz_burger_realtime')
    .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
      if (isFetchingFromSupabase) return;
      console.log('⚡ Supabase Realtime Change Event:', payload.eventType, 'on table:', payload.table);
      fetchFullSupabaseState();
    })
    .subscribe();
};
