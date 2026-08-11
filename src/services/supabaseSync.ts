import { createClient } from '@supabase/supabase-js';
import { useBuzzStore } from '../store/useBuzzStore';
import { Order, Product, Waiter, Rider, InventoryItem, Expense, Coupon, Deal, StoreSettings } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL');
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

let isFetchingFromSupabase = false;

// Formatters for database columns (converting camelCase app models to snake_case DB columns)
const formatOrderForSupabase = (o: Order) => ({
  id: o.id,
  order_number: o.orderNumber,
  customer_name: o.customerName,
  customer_phone: o.phone,
  customer_email: o.email || null,
  delivery_address: o.address || null,
  order_type: o.orderType,
  table_number: o.tableNumber || null,
  items: o.items,
  subtotal: o.subtotal,
  discount: o.discount || 0,
  tax: o.tax || 0,
  delivery_fee: o.deliveryFee || 0,
  total: o.total,
  payment_method: o.paymentMethod,
  payment_status: o.paymentStatus || 'Pending',
  status: o.status,
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
  sku: p.sku || null,
  name: p.name,
  category_id: p.categoryId,
  price: p.price,
  sale_price: p.salePrice || null,
  description: p.description,
  image: p.image,
  is_popular: p.isPopular || false,
  is_featured: p.isFeatured || false,
  is_spicy: p.isSpicy || false,
  in_stock: p.isAvailable !== false,
  stock_quantity: p.stockQuantity || 100,
  calories: p.calories || 0,
  preparation_time: p.preparationTime || 15,
  ingredients: p.ingredients || []
});

const formatWaiterForSupabase = (w: Waiter) => ({
  id: w.id,
  name: w.name,
  phone: w.phone,
  status: w.status,
  assigned_tables: w.assignedTables || [],
  total_sales: w.totalSales || 0,
  updated_at: new Date().toISOString()
});

const formatRiderForSupabase = (r: Rider) => ({
  id: r.id,
  name: r.name,
  phone: r.phone,
  vehicle: r.vehicle,
  status: r.status,
  current_orders: r.currentOrders || 0,
  rating: r.rating || 4.9,
  updated_at: new Date().toISOString()
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

const formatExpenseForSupabase = (e: Expense) => ({
  id: e.id,
  title: e.title,
  category: e.category,
  amount: e.amount,
  date: e.date,
  paid_by: e.paymentMethod || 'Cash',
  notes: e.description || null
});

const formatCouponForSupabase = (c: Coupon) => ({
  id: c.id,
  code: c.code,
  discount_type: c.discountType,
  amount: c.amount,
  min_order: c.minOrder || 0,
  expiry_date: c.expiration || null,
  times_used: c.timesUsed || 0,
  active: c.isActive !== false
});

const formatDealForSupabase = (d: Deal) => ({
  id: d.id,
  title: d.title,
  description: d.description,
  price: d.price,
  original_price: d.originalPrice,
  product_ids: d.productIds || [],
  image: d.image,
  badge: d.badge || null
});

const formatSettingsForSupabase = (s: StoreSettings) => ({
  id: 'default',
  restaurant_name: s.restaurantName,
  tagline: s.tagline,
  phone: s.phone,
  email: s.email,
  address: s.address,
  city: s.city,
  opening_hours: s.openingHours,
  currency: s.currency,
  currency_symbol: s.currencySymbol,
  tax_rate: s.taxRate,
  delivery_fee: s.deliveryFee,
  min_order_amount: s.minOrderAmount,
  brand_color: s.brandColor,
  theme_mode: s.themeMode,
  updated_at: new Date().toISOString()
});

// ========================================================
// DIRECT MUTATION EXPORTS FOR WRITE OPERATIONS
// ========================================================

export const saveOrderToSupabase = async (order: Order) => {
  if (!supabase) return;
  try {
    const payload = formatOrderForSupabase(order);
    const { error } = await supabase.from('orders').upsert(payload, { onConflict: 'id' });
    if (error) console.error('Supabase error saving order:', error);
    else console.log('✅ Order saved to Supabase Cloud:', order.id);
  } catch (err) {
    console.error('Error saving order to Supabase:', err);
  }
};

export const saveProductToSupabase = async (product: Product) => {
  if (!supabase) return;
  try {
    const payload = formatProductForSupabase(product);
    const { error } = await supabase.from('products').upsert(payload, { onConflict: 'id' });
    if (error) console.error('Supabase error saving product:', error);
    else console.log('✅ Product saved to Supabase Cloud:', product.name);
  } catch (err) {
    console.error('Error saving product to Supabase:', err);
  }
};

export const deleteProductFromSupabase = async (id: string) => {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) console.error('Supabase error deleting product:', error);
    else console.log('✅ Product deleted from Supabase Cloud:', id);
  } catch (err) {
    console.error('Error deleting product from Supabase:', err);
  }
};

export const saveWaiterToSupabase = async (waiter: Waiter) => {
  if (!supabase) return;
  try {
    const payload = formatWaiterForSupabase(waiter);
    const { error } = await supabase.from('waiters').upsert(payload, { onConflict: 'id' });
    if (error) console.error('Supabase error saving waiter:', error);
    else console.log('✅ Waiter updated in Supabase Cloud:', waiter.name);
  } catch (err) {
    console.error('Error saving waiter to Supabase:', err);
  }
};

export const saveRiderToSupabase = async (rider: Rider) => {
  if (!supabase) return;
  try {
    const payload = formatRiderForSupabase(rider);
    const { error } = await supabase.from('riders').upsert(payload, { onConflict: 'id' });
    if (error) console.error('Supabase error saving rider:', error);
  } catch (err) {
    console.error('Error saving rider to Supabase:', err);
  }
};

export const saveInventoryToSupabase = async (item: InventoryItem) => {
  if (!supabase) return;
  try {
    const payload = formatInventoryForSupabase(item);
    const { error } = await supabase.from('inventory').upsert(payload, { onConflict: 'id' });
    if (error) console.error('Supabase error saving inventory:', error);
  } catch (err) {
    console.error('Error saving inventory to Supabase:', err);
  }
};

export const deleteInventoryFromSupabase = async (id: string) => {
  if (!supabase) return;
  try {
    await supabase.from('inventory').delete().eq('id', id);
  } catch (err) {
    console.error('Error deleting inventory item from Supabase:', err);
  }
};

export const saveExpenseToSupabase = async (expense: Expense) => {
  if (!supabase) return;
  try {
    const payload = formatExpenseForSupabase(expense);
    const { error } = await supabase.from('expenses').upsert(payload, { onConflict: 'id' });
    if (error) console.error('Supabase error saving expense:', error);
  } catch (err) {
    console.error('Error saving expense to Supabase:', err);
  }
};

export const saveCouponToSupabase = async (coupon: Coupon) => {
  if (!supabase) return;
  try {
    const payload = formatCouponForSupabase(coupon);
    const { error } = await supabase.from('coupons').upsert(payload, { onConflict: 'id' });
    if (error) console.error('Supabase error saving coupon:', error);
  } catch (err) {
    console.error('Error saving coupon to Supabase:', err);
  }
};

export const deleteCouponFromSupabase = async (id: string) => {
  if (!supabase) return;
  try {
    await supabase.from('coupons').delete().eq('id', id);
  } catch (err) {
    console.error('Error deleting coupon from Supabase:', err);
  }
};

export const saveDealToSupabase = async (deal: Deal) => {
  if (!supabase) return;
  try {
    const payload = formatDealForSupabase(deal);
    const { error } = await supabase.from('deals').upsert(payload, { onConflict: 'id' });
    if (error) console.error('Supabase error saving deal:', error);
  } catch (err) {
    console.error('Error saving deal to Supabase:', err);
  }
};

export const deleteDealFromSupabase = async (id: string) => {
  if (!supabase) return;
  try {
    await supabase.from('deals').delete().eq('id', id);
  } catch (err) {
    console.error('Error deleting deal from Supabase:', err);
  }
};

export const saveSettingsToSupabase = async (settings: StoreSettings) => {
  if (!supabase) return;
  try {
    const payload = formatSettingsForSupabase(settings);
    const { error } = await supabase.from('store_settings').upsert(payload, { onConflict: 'id' });
    if (error) console.error('Supabase error saving settings:', error);
    else console.log('✅ Store settings updated in Supabase Cloud');
  } catch (err) {
    console.error('Error saving store settings to Supabase:', err);
  }
};

// ========================================================
// INITIAL READ & REALTIME LISTENERS
// ========================================================

export const initSupabaseSync = async () => {
  if (!supabase || !isSupabaseConfigured()) {
    console.log('ℹ️ Supabase credentials not configured in environment variables.');
    return;
  }

  console.log('⚡ Connected to Supabase Cloud Database & Realtime Sync Engine');

  const fetchFullSupabaseState = async () => {
    try {
      isFetchingFromSupabase = true;
      const [
        { data: products },
        { data: orders },
        { data: waiters },
        { data: riders },
        { data: inventory },
        { data: expenses },
        { data: coupons },
        { data: deals },
        { data: settings }
      ] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('waiters').select('*'),
        supabase.from('riders').select('*'),
        supabase.from('inventory').select('*'),
        supabase.from('expenses').select('*'),
        supabase.from('coupons').select('*'),
        supabase.from('deals').select('*'),
        supabase.from('store_settings').select('*').limit(1)
      ]);

      if (products && products.length > 0) {
        const mappedProducts: Product[] = products.map((p) => ({
          id: p.id,
          sku: p.sku || `SKU-${p.id}`,
          name: p.name,
          categoryId: p.category_id,
          description: p.description || '',
          price: Number(p.price),
          salePrice: p.sale_price ? Number(p.sale_price) : undefined,
          cost: Number(p.price * 0.4),
          image: p.image || '/assets/burger-opening.png',
          ingredients: Array.isArray(p.ingredients) ? p.ingredients : [],
          calories: p.calories || 0,
          preparationTime: p.preparation_time || 15,
          stockQuantity: p.stock_quantity || 100,
          lowStockThreshold: 10,
          isFeatured: Boolean(p.is_featured),
          isAvailable: Boolean(p.in_stock),
          isSpicy: Boolean(p.is_spicy),
          isPopular: Boolean(p.is_popular),
          isVegetarian: false
        }));
        useBuzzStore.setState({ products: mappedProducts });
      }

      if (orders && orders.length > 0) {
        const mappedOrders: Order[] = orders.map((o) => ({
          id: o.id,
          orderNumber: o.order_number,
          customerName: o.customer_name,
          phone: o.customer_phone,
          email: o.customer_email || 'guest@buzzburger.pk',
          address: o.delivery_address || 'Karachi, Pakistan',
          city: 'Karachi',
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
          rating: Number(r.rating || 4.9)
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
          paymentMethod: e.paid_by || 'Cash',
          description: e.notes || 'Expense record'
        }));
        useBuzzStore.setState({ expenses: mappedExpenses });
      }

      if (coupons && coupons.length > 0) {
        const mappedCoupons: Coupon[] = coupons.map((c) => ({
          id: c.id,
          code: c.code,
          discountType: c.discount_type,
          amount: Number(c.amount),
          minOrder: Number(c.min_order || 0),
          maxDiscount: 1000,
          usageLimit: 500,
          timesUsed: c.times_used || 0,
          expiration: c.expiry_date || '2026-12-31',
          isActive: c.active !== false
        }));
        useBuzzStore.setState({ coupons: mappedCoupons });
      }

      if (deals && deals.length > 0) {
        const mappedDeals: Deal[] = deals.map((d) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          price: Number(d.price),
          originalPrice: Number(d.original_price),
          productIds: Array.isArray(d.product_ids) ? d.product_ids : [],
          image: d.image,
          isAvailable: true,
          badge: d.badge || undefined
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
            openingHours: s.opening_hours,
            currency: s.currency,
            currencySymbol: s.currency_symbol,
            taxRate: Number(s.tax_rate),
            deliveryFee: Number(s.delivery_fee),
            minOrderAmount: Number(s.min_order_amount),
            preparationTimeMinutes: 15,
            autoConfirmOrders: true,
            brandColor: s.brand_color,
            themeMode: s.theme_mode
          }
        });
      }

      isFetchingFromSupabase = false;
      console.log('✅ Supabase Cloud data synchronized with local POS App!');
    } catch (err) {
      console.error('Error fetching Supabase state:', err);
      isFetchingFromSupabase = false;
    }
  };

  // Initial fetch
  await fetchFullSupabaseState();

  // Listen to Supabase Realtime changes across all tables
  supabase
    .channel('public:buzz_burger_realtime')
    .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
      if (isFetchingFromSupabase) return;
      console.log('⚡ Supabase Realtime Change Event:', payload.eventType, 'on table:', payload.table);
      fetchFullSupabaseState();
    })
    .subscribe();
};
