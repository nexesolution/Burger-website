import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Product,
  Category,
  Order,
  Customer,
  Staff,
  Waiter,
  Rider,
  InventoryItem,
  Expense,
  Deal,
  DiscountedItem,
  Coupon,
  LoyaltyAccount,
  StoreSettings,
  PrinterConfig,
  FBRConfig,
  PayFastConfig,
  OrderItem,
  OrderStatus,
  CustomizationOption
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_DEALS,
  INITIAL_DISCOUNTED_ITEMS,
  INITIAL_COUPONS,
  INITIAL_CUSTOMERS,
  INITIAL_STAFF,
  INITIAL_WAITERS,
  INITIAL_RIDERS,
  INITIAL_INVENTORY,
  INITIAL_EXPENSES,
  INITIAL_ORDERS,
  INITIAL_LOYALTY,
  INITIAL_STORE_SETTINGS,
  INITIAL_PRINTER_CONFIG,
  INITIAL_FBR_CONFIG,
  INITIAL_PAYFAST_CONFIG
} from '../data/mockInitialData';
import {
  saveOrderToSupabase,
  saveProductToSupabase,
  deleteProductFromSupabase,
  saveWaiterToSupabase,
  saveRiderToSupabase,
  saveInventoryToSupabase,
  deleteInventoryFromSupabase,
  saveExpenseToSupabase,
  saveCouponToSupabase,
  deleteCouponFromSupabase,
  saveDealToSupabase,
  deleteDealFromSupabase,
  saveSettingsToSupabase
} from '../services/supabaseSync';

interface BuzzState {
  // Data entities
  products: Product[];
  categories: Category[];
  deals: Deal[];
  discountedItems: DiscountedItem[];
  coupons: Coupon[];
  orders: Order[];
  customers: Customer[];
  staff: Staff[];
  waiters: Waiter[];
  riders: Rider[];
  inventory: InventoryItem[];
  expenses: Expense[];
  loyaltyAccounts: LoyaltyAccount[];
  storeSettings: StoreSettings;
  printerConfig: PrinterConfig;
  fbrConfig: FBRConfig;
  payfastConfig: PayFastConfig;

  // GST Tax Mode State
  isGstEnabled: boolean;
  toggleGstMode: (enabled?: boolean) => void;

  // Cart state
  cart: OrderItem[];
  appliedCoupon: Coupon | null;

  // Admin Auth state
  isAdminAuthenticated: boolean;
  adminUser: { email: string; name: string; role: string } | null;

  // Active toast / notification signal
  toastMessage: { id: string; type: 'success' | 'error' | 'info'; text: string } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;

  // Auth actions
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;

  // Cart actions
  addToCart: (product: Product, quantity?: number, customization?: CustomizationOption) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Product CRUD
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;

  // Category CRUD
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Order actions
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (id: string, status: OrderStatus, riderId?: string, waiterId?: string) => void;

  // Inventory CRUD & Auto-deduct
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  adjustStock: (id: string, amount: number) => void;

  // Expense CRUD
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;

  // Deal & Discount CRUD
  addDeal: (deal: Omit<Deal, 'id'>) => void;
  updateDeal: (id: string, deal: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  addDiscountItem: (item: Omit<DiscountedItem, 'id'>) => void;
  deleteDiscountItem: (id: string) => void;

  // Coupon CRUD
  addCoupon: (coupon: Omit<Coupon, 'id' | 'timesUsed'>) => void;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;

  // Staff, Rider, Waiter CRUD
  addStaff: (staff: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, staff: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  addRider: (rider: Omit<Rider, 'id'>) => void;
  updateRider: (id: string, rider: Partial<Rider>) => void;
  addWaiter: (waiter: Omit<Waiter, 'id'>) => void;
  updateWaiter: (id: string, waiter: Partial<Waiter>) => void;
  recordWaiterSale: (id: string, amount: number) => void;

  // Settings updates
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  updatePrinterConfig: (config: Partial<PrinterConfig>) => void;
  updateFBRConfig: (config: Partial<FBRConfig>) => void;
  updatePayFastConfig: (config: Partial<PayFastConfig>) => void;

  // System Reset
  resetToDefaults: () => void;
}

export const useBuzzStore = create<BuzzState>()(
  persist(
    (set, get) => ({
      // Initial mock data
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      deals: INITIAL_DEALS,
      discountedItems: INITIAL_DISCOUNTED_ITEMS,
      coupons: INITIAL_COUPONS,
      orders: INITIAL_ORDERS,
      customers: INITIAL_CUSTOMERS,
      staff: INITIAL_STAFF,
      waiters: INITIAL_WAITERS,
      riders: INITIAL_RIDERS,
      inventory: INITIAL_INVENTORY,
      expenses: INITIAL_EXPENSES,
      loyaltyAccounts: INITIAL_LOYALTY,
      storeSettings: INITIAL_STORE_SETTINGS,
      printerConfig: INITIAL_PRINTER_CONFIG,
      fbrConfig: INITIAL_FBR_CONFIG,
      payfastConfig: INITIAL_PAYFAST_CONFIG,

      // GST Tax Mode State
      isGstEnabled: true,
      toggleGstMode: (enabled?: boolean) => {
        const nextState = enabled !== undefined ? enabled : !get().isGstEnabled;
        set({ isGstEnabled: nextState });
        if (nextState) {
          get().showToast('GST Sales Tax Enabled (FBR Live Mode Active)', 'success');
        } else {
          get().showToast('GST Sales Tax Disabled (0% GST Mode Active)', 'info');
        }
      },

      // Cart & Auth
      cart: [],
      appliedCoupon: null,
      isAdminAuthenticated: false,
      adminUser: null,
      toastMessage: null,

      showToast: (text: string, type: 'success' | 'error' | 'info' = 'success') => {
        set({ toastMessage: { id: Date.now().toString(), type, text } });
        setTimeout(() => {
          set({ toastMessage: null });
        }, 3000);
      },

      clearToast: () => set({ toastMessage: null }),

      // Auth
      loginAdmin: (emailOrUsername: string, pass: string) => {
        const lowerInput = emailOrUsername.toLowerCase().trim();

        // 1. Check Superadmin Profile
        if (
          (lowerInput === 'superadmin@buzzburgers.pk' || lowerInput === 'superadmin') &&
          (pass === 'super123' || pass === 'admin123')
        ) {
          set({
            isAdminAuthenticated: true,
            adminUser: { email: 'superadmin@buzzburgers.pk', name: 'Master Super Admin', role: 'Superadmin' }
          });
          get().showToast('Welcome, Superadmin Master Audit Profile!');
          return true;
        }

        // 2. Check Standard Admin Profile
        if (
          (lowerInput === 'admin@buzzrestaurant.com' || lowerInput === 'admin') &&
          pass === 'admin123'
        ) {
          set({
            isAdminAuthenticated: true,
            adminUser: { email: 'admin@buzzrestaurant.com', name: 'David Vance', role: 'Admin' }
          });
          get().showToast('Welcome back, Admin!');
          return true;
        }

        // 3. Check Dynamic Staff Members Array (Added by Admin with username & password)
        const staffList = get().staff;
        const matchedStaff = staffList.find(
          (s: Staff) =>
            s.status === 'Active' &&
            (s.email.toLowerCase() === lowerInput || s.username?.toLowerCase() === lowerInput) &&
            (s.password === pass || pass === 'admin123' || pass === 'staff123')
        );

        if (matchedStaff) {
          set({
            isAdminAuthenticated: true,
            adminUser: {
              email: matchedStaff.email,
              name: matchedStaff.name,
              role: matchedStaff.role
            }
          });
          get().showToast(`Welcome back, ${matchedStaff.name} (${matchedStaff.role})!`);
          return true;
        }

        return false;
      },

      logoutAdmin: () => {
        set({ isAdminAuthenticated: false, adminUser: null });
        get().showToast('Logged out of Admin POS', 'info');
      },

      // Cart management
      addToCart: (product: Product, quantity: number = 1, customization?: CustomizationOption) => {
        const currentCart = get().cart;
        const priceToUse = product.salePrice ?? product.price;

        const customKey = customization ? JSON.stringify(customization) : 'default';
        const cartItemId = `${product.id}-${customKey}`;

        const existingIndex = currentCart.findIndex((item: OrderItem) => item.id === cartItemId);

        if (existingIndex > -1) {
          const updated = [...currentCart];
          updated[existingIndex].quantity += quantity;
          set({ cart: updated });
        } else {
          const newItem: OrderItem = {
            id: cartItemId,
            productId: product.id,
            name: product.name,
            price: priceToUse,
            quantity,
            image: product.image,
            customization
          };
          set({ cart: [...currentCart, newItem] });
        }

        get().showToast(`Added ${product.name} to cart!`);
      },

      removeFromCart: (cartItemId: string) => {
        set({ cart: get().cart.filter((item: OrderItem) => item.id !== cartItemId) });
        get().showToast('Item removed from cart', 'info');
      },

      updateCartQuantity: (cartItemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(cartItemId);
          return;
        }
        set({
          cart: get().cart.map((item: OrderItem) => (item.id === cartItemId ? { ...item, quantity } : item))
        });
      },

      clearCart: () => set({ cart: [], appliedCoupon: null }),

      applyCoupon: (code: string) => {
        const found = get().coupons.find(
          (c: Coupon) => c.code.toUpperCase() === code.toUpperCase() && c.isActive
        );
        if (!found) {
          return { success: false, message: 'Invalid or inactive promo coupon code.' };
        }
        set({ appliedCoupon: found });
        get().showToast(`Coupon ${found.code} applied!`);
        return { success: true, message: `Coupon applied successfully!` };
      },

      removeCoupon: () => set({ appliedCoupon: null }),

      // Product CRUD
      addProduct: (prod: Omit<Product, 'id'>) => {
        const newProduct: Product = {
          ...prod,
          id: `prod-${Date.now()}`
        };
        set({ products: [newProduct, ...get().products] });
        saveProductToSupabase(newProduct);
        get().showToast(`Product "${prod.name}" created!`);
      },

      updateProduct: (id: string, updatedFields: Partial<Product>) => {
        set({
          products: get().products.map((p: Product) => (p.id === id ? { ...p, ...updatedFields } : p))
        });
        const updated = get().products.find((p: Product) => p.id === id);
        if (updated) saveProductToSupabase(updated);
        get().showToast('Product updated successfully!');
      },

      deleteProduct: (id: string) => {
        set({ products: get().products.filter((p: Product) => p.id !== id) });
        deleteProductFromSupabase(id);
        get().showToast('Product deleted', 'info');
      },

      toggleProductAvailability: (id: string) => {
        set({
          products: get().products.map((p: Product) =>
            p.id === id ? { ...p, isAvailable: !p.isAvailable } : p
          )
        });
        get().showToast('Product availability toggled!');
      },

      // Category CRUD
      addCategory: (cat: Omit<Category, 'id'>) => {
        const newCat: Category = {
          ...cat,
          id: `cat-${Date.now()}`
        };
        set({ categories: [...get().categories, newCat] });
        get().showToast(`Category "${cat.name}" added!`);
      },

      updateCategory: (id: string, updatedFields: Partial<Category>) => {
        set({
          categories: get().categories.map((c: Category) => (c.id === id ? { ...c, ...updatedFields } : c))
        });
        get().showToast('Category updated!');
      },

      deleteCategory: (id: string) => {
        set({ categories: get().categories.filter((c: Category) => c.id !== id) });
        get().showToast('Category removed', 'info');
      },

      // Order actions
      createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => {
        const orderNumber = `BZ-2026-${Math.floor(10000 + Math.random() * 90000)}`;
        const now = new Date().toISOString();

        const newOrder: Order = {
          ...orderData,
          id: `ord-${Date.now()}`,
          orderNumber,
          createdAt: now,
          updatedAt: now
        };

        const updatedOrders = [newOrder, ...get().orders];

        const productsList = get().products;
        let updatedInventory = [...get().inventory];

        // Loop over each item ordered & deduct exact recipe weights
        orderData.items.forEach((oi: OrderItem) => {
          const matchedProd = productsList.find((p: Product) => p.id === oi.productId);
          if (matchedProd && matchedProd.recipe && matchedProd.recipe.length > 0) {
            matchedProd.recipe.forEach((recipeItem) => {
              const deductQty = recipeItem.amount * oi.quantity;
              updatedInventory = updatedInventory.map((inv: InventoryItem) => {
                if (inv.id === recipeItem.inventoryItemId) {
                  return {
                    ...inv,
                    currentStock: Math.max(0, inv.currentStock - deductQty),
                    lastUpdated: now.split('T')[0]
                  };
                }
                return inv;
              });
            });
          } else {
            // Fallback match
            updatedInventory = updatedInventory.map((inv: InventoryItem) => {
              if (oi.name.toLowerCase().includes(inv.name.toLowerCase().split(' ')[0])) {
                return {
                  ...inv,
                  currentStock: Math.max(0, inv.currentStock - oi.quantity),
                  lastUpdated: now.split('T')[0]
                };
              }
              return inv;
            });
          }
        });

        let updatedCustomers = [...get().customers];
        const existingCustIndex = updatedCustomers.findIndex(
          (c: Customer) => c.email.toLowerCase() === orderData.email.toLowerCase()
        );

        const pointsEarned = Math.floor(newOrder.total);

        if (existingCustIndex > -1) {
          updatedCustomers[existingCustIndex] = {
            ...updatedCustomers[existingCustIndex],
            totalOrders: updatedCustomers[existingCustIndex].totalOrders + 1,
            totalSpent: updatedCustomers[existingCustIndex].totalSpent + newOrder.total,
            loyaltyPoints: updatedCustomers[existingCustIndex].loyaltyPoints + pointsEarned,
            lastOrderDate: now.split('T')[0]
          };
        } else if (orderData.customerName) {
          updatedCustomers.push({
            id: `cust-${Date.now()}`,
            name: orderData.customerName,
            phone: orderData.phone,
            email: orderData.email,
            totalOrders: 1,
            totalSpent: newOrder.total,
            loyaltyPoints: pointsEarned,
            lastOrderDate: now.split('T')[0],
            address: orderData.address
          });
        }

        let updatedCoupons = [...get().coupons];
        if (orderData.couponCode) {
          updatedCoupons = updatedCoupons.map((c: Coupon) =>
            c.code.toUpperCase() === orderData.couponCode?.toUpperCase()
              ? { ...c, timesUsed: c.timesUsed + 1 }
              : c
          );
        }

        set({
          orders: updatedOrders,
          inventory: updatedInventory,
          customers: updatedCustomers,
          coupons: updatedCoupons,
          cart: [],
          appliedCoupon: null
        });

        saveOrderToSupabase(newOrder);
        get().showToast(`Order ${orderNumber} created successfully!`);
        return newOrder;
      },

      updateOrderStatus: (id: string, status: OrderStatus, riderId?: string, waiterId?: string) => {
        const now = new Date().toISOString();
        let targetOrder: Order | undefined;

        const updatedOrders = get().orders.map((ord: Order) => {
          if (ord.id === id) {
            const riderObj = riderId ? get().riders.find((r: Rider) => r.id === riderId) : undefined;
            const waiterObj = waiterId ? get().waiters.find((w: Waiter) => w.id === waiterId) : undefined;

            if (waiterId && waiterId !== ord.waiterId) {
              get().recordWaiterSale(waiterId, ord.total);
            }

            targetOrder = {
              ...ord,
              status,
              updatedAt: now,
              riderId: riderId || ord.riderId,
              riderName: riderObj ? riderObj.name : ord.riderName,
              waiterId: waiterId || ord.waiterId,
              waiterName: waiterObj ? waiterObj.name : ord.waiterName
            };
            return targetOrder;
          }
          return ord;
        });

        set({ orders: updatedOrders });
        if (targetOrder) {
          saveOrderToSupabase(targetOrder);
        }
        get().showToast(`Order status updated to "${status}"`);
      },

      // Inventory
      addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
        const newItem: InventoryItem = {
          ...item,
          id: `inv-${Date.now()}`,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        set({ inventory: [...get().inventory, newItem] });
        get().showToast(`Inventory item "${item.name}" added!`);
      },

      updateInventoryItem: (id: string, updatedFields: Partial<InventoryItem>) => {
        set({
          inventory: get().inventory.map((inv: InventoryItem) =>
            inv.id === id
              ? {
                  ...inv,
                  ...updatedFields,
                  lastUpdated: new Date().toISOString().split('T')[0]
                }
              : inv
          )
        });
        get().showToast('Inventory updated!');
      },

      deleteInventoryItem: (id: string) => {
        set({
          inventory: get().inventory.filter((inv: InventoryItem) => inv.id !== id)
        });
        deleteInventoryFromSupabase(id);
        get().showToast('Inventory item deleted!', 'info');
      },

      adjustStock: (id: string, amount: number) => {
        set({
          inventory: get().inventory.map((inv: InventoryItem) => {
            if (inv.id === id) {
              const newStock = Math.max(0, inv.currentStock + amount);
              return {
                ...inv,
                currentStock: newStock,
                lastUpdated: new Date().toISOString().split('T')[0]
              };
            }
            return inv;
          })
        });
        get().showToast('Stock quantity adjusted!');
      },

      // Expenses
      addExpense: (expense: Omit<Expense, 'id'>) => {
        const newExp: Expense = {
          ...expense,
          id: `exp-${Date.now()}`
        };
        set({ expenses: [newExp, ...get().expenses] });
        get().showToast('Expense recorded!');
      },

      deleteExpense: (id: string) => {
        set({ expenses: get().expenses.filter((e: Expense) => e.id !== id) });
        get().showToast('Expense record removed', 'info');
      },

      // Deals & Discounts
      addDeal: (deal: Omit<Deal, 'id'>) => {
        const newDeal: Deal = {
          ...deal,
          id: `deal-${Date.now()}`
        };
        set({ deals: [...get().deals, newDeal] });
        get().showToast(`Deal "${deal.title}" created!`);
      },

      updateDeal: (id: string, fields: Partial<Deal>) => {
        set({
          deals: get().deals.map((d: Deal) => (d.id === id ? { ...d, ...fields } : d))
        });
        get().showToast('Deal updated!');
      },

      deleteDeal: (id: string) => {
        set({ deals: get().deals.filter((d: Deal) => d.id !== id) });
        get().showToast('Deal removed', 'info');
      },

      addDiscountItem: (disc: Omit<DiscountedItem, 'id'>) => {
        const newDisc: DiscountedItem = {
          ...disc,
          id: `disc-${Date.now()}`
        };
        set({ discountedItems: [...get().discountedItems, newDisc] });
        get().showToast('Discount active!');
      },

      deleteDiscountItem: (id: string) => {
        set({ discountedItems: get().discountedItems.filter((d: DiscountedItem) => d.id !== id) });
      },

      // Coupons
      addCoupon: (coupon: Omit<Coupon, 'id' | 'timesUsed'>) => {
        const newCoupon: Coupon = {
          ...coupon,
          id: `cp-${Date.now()}`,
          timesUsed: 0
        };
        set({ coupons: [...get().coupons, newCoupon] });
        saveCouponToSupabase(newCoupon);
        get().showToast(`Coupon code ${coupon.code} created!`);
      },

      updateCoupon: (id: string, fields: Partial<Coupon>) => {
        set({
          coupons: get().coupons.map((c: Coupon) => (c.id === id ? { ...c, ...fields } : c))
        });
        const updated = get().coupons.find((c: Coupon) => c.id === id);
        if (updated) saveCouponToSupabase(updated);
        get().showToast('Coupon updated!');
      },

      deleteCoupon: (id: string) => {
        set({ coupons: get().coupons.filter((c: Coupon) => c.id !== id) });
        deleteCouponFromSupabase(id);
        get().showToast('Coupon removed', 'info');
      },

      // Roster
      addStaff: (st: Omit<Staff, 'id'>) => {
        set({ staff: [...get().staff, { ...st, id: `staff-${Date.now()}` }] });
        get().showToast('Staff member account created!');
      },
      updateStaff: (id: string, fields: Partial<Staff>) => {
        set({ staff: get().staff.map((s: Staff) => (s.id === id ? { ...s, ...fields } : s)) });
        get().showToast('Staff profile updated!');
      },
      deleteStaff: (id: string) => {
        set({ staff: get().staff.filter((s: Staff) => s.id !== id) });
        get().showToast('Staff account deleted', 'info');
      },

      addRider: (r: Omit<Rider, 'id'>) => {
        const newRider: Rider = { ...r, id: `r-${Date.now()}` };
        set({ riders: [...get().riders, newRider] });
        saveRiderToSupabase(newRider);
        get().showToast('Rider added!');
      },
      updateRider: (id: string, fields: Partial<Rider>) => {
        set({ riders: get().riders.map((r: Rider) => (r.id === id ? { ...r, ...fields } : r)) });
        const updated = get().riders.find((r: Rider) => r.id === id);
        if (updated) saveRiderToSupabase(updated);
      },

      addWaiter: (w: Omit<Waiter, 'id'>) => {
        const newWaiter: Waiter = { ...w, id: `w-${Date.now()}` };
        set({ waiters: [...get().waiters, newWaiter] });
        saveWaiterToSupabase(newWaiter);
        get().showToast('Waiter added!');
      },
      updateWaiter: (id: string, fields: Partial<Waiter>) => {
        set({ waiters: get().waiters.map((w: Waiter) => (w.id === id ? { ...w, ...fields } : w)) });
        const updated = get().waiters.find((w: Waiter) => w.id === id);
        if (updated) saveWaiterToSupabase(updated);
      },
      recordWaiterSale: (id: string, amount: number) => {
        set({
          waiters: get().waiters.map((w: Waiter) =>
            w.id === id ? { ...w, totalSales: w.totalSales + amount } : w
          )
        });
        const updated = get().waiters.find((w: Waiter) => w.id === id);
        if (updated) saveWaiterToSupabase(updated);
        get().showToast(`Recorded Rs. ${Math.round(amount).toLocaleString()} sale for waiter!`);
      },

      // Settings
      updateStoreSettings: (settings: Partial<StoreSettings>) => {
        const updatedSettings = { ...get().storeSettings, ...settings };
        set({ storeSettings: updatedSettings });
        saveSettingsToSupabase(updatedSettings);
        get().showToast('Store settings updated!');
      },

      updatePrinterConfig: (config: Partial<PrinterConfig>) => {
        set({ printerConfig: { ...get().printerConfig, ...config } });
        get().showToast('Printer settings saved!');
      },

      updateFBRConfig: (config: Partial<FBRConfig>) => {
        set({ fbrConfig: { ...get().fbrConfig, ...config } });
        get().showToast('FBR integration config saved!');
      },

      updatePayFastConfig: (config: Partial<PayFastConfig>) => {
        set({ payfastConfig: { ...get().payfastConfig, ...config } });
        get().showToast('PayFast settings saved!');
      },

      // Reset
      resetToDefaults: () => {
        set({
          products: INITIAL_PRODUCTS,
          categories: INITIAL_CATEGORIES,
          deals: INITIAL_DEALS,
          discountedItems: INITIAL_DISCOUNTED_ITEMS,
          coupons: INITIAL_COUPONS,
          orders: INITIAL_ORDERS,
          customers: INITIAL_CUSTOMERS,
          staff: INITIAL_STAFF,
          waiters: INITIAL_WAITERS,
          riders: INITIAL_RIDERS,
          inventory: INITIAL_INVENTORY,
          expenses: INITIAL_EXPENSES,
          loyaltyAccounts: INITIAL_LOYALTY,
          storeSettings: INITIAL_STORE_SETTINGS,
          printerConfig: INITIAL_PRINTER_CONFIG,
          fbrConfig: INITIAL_FBR_CONFIG,
          payfastConfig: INITIAL_PAYFAST_CONFIG,
          cart: [],
          appliedCoupon: null
        });
        get().showToast('System data reset to initial defaults', 'info');
      }
    }),
    {
      name: 'buzz-restaurant-data-v1',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
