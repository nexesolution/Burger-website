module.exports = {
  storeSettings: {
    restaurantName: 'BUZZ BURGER',
    tagline: '100% Halal Angus Beef. Bold Flavors. Serious Burgers.',
    phone: '+92 300 8282899',
    email: 'info@buzzburgers.pk',
    address: 'Plot 14-C, Main Khayaban-e-Shahbaz, DHA Phase 6',
    city: 'Karachi',
    openingHours: 'Mon-Sun: 12:00 PM - 03:00 AM (Late Night Delivery)',
    currency: 'PKR',
    currencySymbol: 'Rs.',
    taxRate: 13,
    deliveryFee: 150,
    minOrderAmount: 850,
    preparationTimeMinutes: 15,
    autoConfirmOrders: true,
    brandColor: '#F5C400',
    themeMode: 'dark'
  },

  categories: [
    { id: 'cat-1', name: 'Gourmet Smash Burgers', icon: 'Burger', description: 'Double-pressed smashed Angus beef with crispy caramelized edges & melted cheese.' },
    { id: 'cat-2', name: 'Loaded Cheese Fries', icon: 'Fries', description: 'Golden hand-cut fries smothered in signature molten cheese sauce.' },
    { id: 'cat-3', name: 'Crispy Buttermilk Chicken', icon: 'Drumstick', description: '24-hour marinated buttermilk fried chicken tenders & burgers.' },
    { id: 'cat-4', name: 'Beverages & Lemonades', icon: 'Drink', description: 'Fresh mint lemonades, iced teas & sodas.' },
    { id: 'cat-5', name: 'Thick Milkshakes', icon: 'IceCream', description: 'Creamy hand-spun ice cream shakes with whipped cream.' }
  ],

  products: [
    {
      id: 'prod-1',
      name: 'Molten Cheese Overload Smash',
      categoryId: 'cat-1',
      price: 1290,
      salePrice: 1190,
      description: 'Double smashed Angus beef patties drenched in molten cheddar lava sauce, caramelized onions, and signature house mayo on a toasted brioche bun.',
      image: '/assets/burger-opening.png',
      isPopular: true,
      isFeatured: true,
      isSpicy: false,
      sku: 'COC-SMASH-01',
      inStock: true,
      stockQuantity: 150,
      calories: 820,
      preparationTime: 12,
      ingredients: ['Double Angus Beef', 'Molten Cheddar Lava', 'Caramelized Onions', 'Brioche Bun', 'House Mayo']
    },
    {
      id: 'prod-2',
      name: 'Lahore Double Smash Melt',
      categoryId: 'cat-1',
      price: 1450,
      description: 'Two smashed patties infused with green chillies, double smoked gouda cheese, garlic aioli, and crispy fried onion rings.',
      image: '/assets/burger-opening.png',
      isPopular: true,
      isFeatured: true,
      isSpicy: true,
      sku: 'COC-SMASH-02',
      inStock: true,
      stockQuantity: 120,
      calories: 910,
      preparationTime: 15,
      ingredients: ['Angus Beef', 'Smoked Gouda', 'Garlic Aioli', 'Fried Onion Rings', 'Fresh Green Chillies']
    },
    {
      id: 'prod-3',
      name: 'Loaded Garlic Mayo Cheese Fries',
      categoryId: 'cat-2',
      price: 790,
      description: 'Crispy skin-on fries topped with melted cheddar, garlic mayo, chopped jalapeños, and beef bacon bits.',
      image: '/assets/burger-opening.png',
      isPopular: true,
      isFeatured: false,
      isSpicy: true,
      sku: 'COC-FRIES-01',
      inStock: true,
      stockQuantity: 200,
      calories: 640,
      preparationTime: 8,
      ingredients: ['Hand-cut Fries', 'Melted Cheddar', 'Garlic Mayo', 'Jalapeños', 'Beef Bacon']
    },
    {
      id: 'prod-4',
      name: 'Lahori Mint Lemonade',
      categoryId: 'cat-4',
      price: 390,
      description: 'Refreshing ice-blended mint cooler with fresh lemon juice, black salt, and sparkling soda.',
      image: '/assets/burger-opening.png',
      isPopular: true,
      isFeatured: false,
      isSpicy: false,
      sku: 'COC-DRINK-01',
      inStock: true,
      stockQuantity: 300,
      calories: 140,
      preparationTime: 4,
      ingredients: ['Fresh Mint', 'Lemon Juice', 'Black Salt', 'Soda']
    }
  ],

  deals: [
    {
      id: 'deal-1',
      title: 'Duo Smash & Loaded Fries Bundle',
      description: '2x Molten Cheese Overload Smash Burgers + 1x Large Loaded Garlic Mayo Fries + 2x Mint Lemonades.',
      price: 2690,
      originalPrice: 3250,
      productIds: ['prod-1', 'prod-3', 'prod-4'],
      image: '/assets/burger-opening.png',
      badge: 'POPULAR COMBO',
      validUntil: '2026-12-31'
    }
  ],

  coupons: [
    { id: 'cp-1', code: 'CHEESE10', discountType: 'percentage', amount: 10, minOrder: 1500, expiryDate: '2026-12-31', timesUsed: 42, active: true },
    { id: 'cp-2', code: 'WELCOME20', discountType: 'percentage', amount: 20, minOrder: 2000, expiryDate: '2026-12-31', timesUsed: 128, active: true }
  ],

  waiters: [
    { id: 'w-1', name: 'Kamran Ali', phone: '+92 300 4567891', status: 'On Shift', assignedTables: ['Table 01', 'Table 02', 'Table 03'], totalSales: 24500 },
    { id: 'w-2', name: 'Fahad Sheikh', phone: '+92 321 9876543', status: 'On Shift', assignedTables: ['Table 04', 'Table 05'], totalSales: 18900 },
    { id: 'w-3', name: 'Daniyal Hassan', phone: '+92 333 1122334', status: 'Available', assignedTables: ['VIP Booth A'], totalSales: 31200 }
  ],

  riders: [
    { id: 'r-1', name: 'Zeeshan Khan', phone: '+92 301 5554433', vehicle: 'Honda CG125 (KHI-8921)', status: 'Available', currentOrders: 0, rating: 4.9 },
    { id: 'r-2', name: 'Tariq Mehmood', phone: '+92 312 7778899', vehicle: 'Yamaha YBR (KHI-4310)', status: 'Busy', currentOrders: 2, rating: 4.8 }
  ],

  inventory: [
    { id: 'inv-1', sku: 'RAW-BEEF-01', name: 'Halal Angus Beef Mince (kg)', category: 'Meat', currentStock: 45, unit: 'kg', lowStockThreshold: 15, unitCost: 1850, supplier: 'Karachi Prime Meats', lastUpdated: '2026-08-08' },
    { id: 'inv-2', sku: 'RAW-CHEESE-01', name: 'Imported Red Cheddar Cheese (Slices)', category: 'Dairy', currentStock: 250, unit: 'slices', lowStockThreshold: 50, unitCost: 45, supplier: 'Dairy Fresh PK', lastUpdated: '2026-08-08' }
  ],

  expenses: [
    { id: 'exp-1', title: 'Monthly Store Rent - Shahbaz DHA', category: 'Rent', amount: 185000, date: '2026-08-01', paidBy: 'Manager', notes: 'Paid via bank transfer' },
    { id: 'exp-2', title: 'Fresh Beef & Dairy Supplies', category: 'Supplies', amount: 42000, date: '2026-08-05', paidBy: 'Procurement Officer', notes: 'Karachi Meat Market' }
  ],

  orders: []
};
