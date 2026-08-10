import { createClient } from '@supabase/supabase-js';
import { useBuzzStore } from '../store/useBuzzStore';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL');
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

let isRemoteSync = false;

export const initSupabaseSync = async () => {
  if (!supabase || !isSupabaseConfigured()) {
    console.log('ℹ️ Supabase credentials not set in VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Running in offline & WebSocket mode.');
    return;
  }

  console.log('⚡ Initializing Supabase Cloud Database Realtime Sync Engine...');

  // 1. Fetch initial tables from Supabase Cloud
  try {
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

    isRemoteSync = true;
    if (products && products.length > 0) {
      useBuzzStore.setState({
        products: products.map((p) => ({
          ...p,
          categoryId: p.category_id,
          salePrice: p.sale_price,
          isPopular: p.is_popular,
          isFeatured: p.is_featured,
          isSpicy: p.is_spicy,
          inStock: p.in_stock,
          stockQuantity: p.stock_quantity,
          preparationTime: p.preparation_time
        }))
      });
    }

    if (orders) {
      useBuzzStore.setState({
        orders: orders.map((o) => ({
          ...o,
          orderNumber: o.order_number,
          customerName: o.customer_name,
          customerPhone: o.customer_phone,
          customerEmail: o.customer_email,
          deliveryAddress: o.delivery_address,
          orderType: o.order_type,
          tableNumber: o.table_number,
          paymentMethod: o.payment_method,
          paymentStatus: o.payment_status,
          deliveryFee: o.delivery_fee,
          createdAt: o.created_at
        }))
      });
    }

    if (waiters) {
      useBuzzStore.setState({
        waiters: waiters.map((w) => ({
          ...w,
          assignedTables: w.assigned_tables || [],
          totalSales: w.total_sales || 0
        }))
      });
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
          taxRate: s.tax_rate,
          deliveryFee: s.delivery_fee,
          minOrderAmount: s.min_order_amount,
          preparationTimeMinutes: 15,
          autoConfirmOrders: true,
          brandColor: s.brand_color,
          themeMode: s.theme_mode
        }
      });
    }
    isRemoteSync = false;
    console.log('✅ Supabase data loaded successfully!');
  } catch (err) {
    console.error('Error fetching Supabase data:', err);
    isRemoteSync = false;
  }

  // 2. Subscribe to Supabase Realtime changes on all tables
  supabase
    .channel('public:buzz_burger_realtime')
    .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
      console.log('🔄 Supabase Realtime Event Received:', payload.eventType, payload.table);
      // Reload state on external edits
      initSupabaseSync();
    })
    .subscribe();
};
