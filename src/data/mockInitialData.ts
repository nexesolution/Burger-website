import {
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
  PayFastConfig
} from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Gourmet Smash Burgers',
    slug: 'burgers',
    description: '100% Angus beef smash patties, melted cheddar, signature sauce on brioche buns.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    displayOrder: 1
  },
  {
    id: 'cat-2',
    name: 'Crispy Chicken Burgers',
    slug: 'chicken',
    description: 'Ultra crispy, spicy buttermilk fried chicken fillets and tenders.',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    displayOrder: 2
  },
  {
    id: 'cat-3',
    name: 'Loaded Fries & Sides',
    slug: 'fries',
    description: 'Hand-cut garlic mayo loaded fries, cheese poppers, and crispy onion rings.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    displayOrder: 3
  },
  {
    id: 'cat-4',
    name: 'Jumbo Wings',
    slug: 'wings',
    description: 'Smoky BBQ, buffalo glaze, and sweet chili jumbo wings.',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    displayOrder: 4
  },
  {
    id: 'cat-5',
    name: 'Gourmet Shakes',
    slug: 'shakes',
    description: 'Thick handcrafted milkshakes with whipped cream, Lotus Biscoff, and chocolate.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    displayOrder: 5
  },
  {
    id: 'cat-6',
    name: 'Chilled Drinks',
    slug: 'drinks',
    description: 'Lahori mint lemonade, iced teas, and chilled soft drinks.',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    displayOrder: 6
  },
  {
    id: 'cat-7',
    name: 'Combo Deals',
    slug: 'deals',
    description: 'Pakistani favorite combo bundles and family feast packages with maximum savings.',
    image: 'https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    displayOrder: 7
  },
  {
    id: 'cat-8',
    name: 'Hot Desserts',
    slug: 'desserts',
    description: 'Nutella lava brownies, Lotus Biscoff molten cakes, and churros.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    displayOrder: 8
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'BZ-PK-001',
    name: 'Buzz Karachi Smash',
    categoryId: 'cat-1',
    description: 'Single Angus beef smash patty, melted cheddar, caramelized onions, jalapeños & BUZZ secret sauce on toasted brioche.',
    price: 1290,
    salePrice: 1090,
    cost: 450,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Angus Beef', 'Wisconsin Cheddar', 'Caramelized Onions', 'Jalapeños', 'Brioche Bun', 'Buzz Sauce'],
    calories: 720,
    preparationTime: 10,
    stockQuantity: 120,
    lowStockThreshold: 20,
    isFeatured: true,
    isAvailable: true,
    isSpicy: false,
    isPopular: true,
    isVegetarian: false
  },
  {
    id: 'prod-2',
    sku: 'BZ-PK-002',
    name: 'Lahore Double Smash Melt',
    categoryId: 'cat-1',
    description: 'Double Angus beef smash patties, double melted cheddar, smoked bacon, crispy onion rings & garlic truffle mayo.',
    price: 1690,
    cost: 620,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Double Beef Smash', 'Double Cheddar', 'Crispy Bacon', 'Onion Rings', 'Truffle Mayo'],
    calories: 1050,
    preparationTime: 12,
    stockQuantity: 95,
    lowStockThreshold: 15,
    isFeatured: true,
    isAvailable: true,
    isSpicy: false,
    isPopular: true,
    isVegetarian: false
  },
  {
    id: 'prod-3',
    sku: 'BZ-PK-003',
    name: 'Smoky Jalapeño BBQ Monster',
    categoryId: 'cat-1',
    description: 'Triple Angus smash patty, smoked bacon, gouda cheese, crispy shallots & hickory smoked BBQ sauce.',
    price: 1890,
    salePrice: 1650,
    cost: 710,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Triple Beef', 'Smoked Bacon', 'Gouda Cheese', 'BBQ Reduction', 'Jalapeños'],
    calories: 1280,
    preparationTime: 15,
    stockQuantity: 60,
    lowStockThreshold: 10,
    isFeatured: true,
    isAvailable: true,
    isSpicy: true,
    isPopular: false,
    isVegetarian: false
  },
  {
    id: 'prod-4',
    sku: 'BZ-PK-004',
    name: 'Cheese Lava Overload',
    categoryId: 'cat-1',
    description: 'Smash beef patty with a molten cheddar cheese explosion center, pickled jalapeño relish & spicy aioli.',
    price: 1490,
    cost: 550,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Beef Patty', 'Molten Cheddar Center', 'Jalapeños', 'Spicy Aioli'],
    calories: 890,
    preparationTime: 12,
    stockQuantity: 80,
    lowStockThreshold: 15,
    isFeatured: false,
    isAvailable: true,
    isSpicy: true,
    isPopular: true,
    isVegetarian: false
  },
  {
    id: 'prod-5',
    sku: 'BZ-PK-005',
    name: 'Crispy Zinger Buttermilk',
    categoryId: 'cat-2',
    description: '24-hr buttermilk marinated crispy chicken breast, slaw, dill pickles & garlic herb mayo on potato brioche roll.',
    price: 1190,
    cost: 420,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Crispy Chicken Fillet', 'Cabbage Slaw', 'Dill Pickles', 'Garlic Mayo'],
    calories: 820,
    preparationTime: 10,
    stockQuantity: 110,
    lowStockThreshold: 20,
    isFeatured: true,
    isAvailable: true,
    isSpicy: false,
    isPopular: true,
    isVegetarian: false
  },
  {
    id: 'prod-6',
    sku: 'BZ-PK-006',
    name: 'Fire Nashville Spicy Chicken',
    categoryId: 'cat-2',
    description: 'Ultra spicy Nashville style glazed fried chicken fillet, ghost pepper aioli, cayenne dust & crinkle cut pickles.',
    price: 1390,
    cost: 480,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Spicy Chicken Fillet', 'Ghost Pepper Glaze', 'Cayenne Dust', 'Pickles'],
    calories: 860,
    preparationTime: 11,
    stockQuantity: 75,
    lowStockThreshold: 12,
    isFeatured: false,
    isAvailable: true,
    isSpicy: true,
    isPopular: true,
    isVegetarian: false
  },
  {
    id: 'prod-7',
    sku: 'BZ-PK-007',
    name: 'Mushroom Swiss Truffle Beef',
    categoryId: 'cat-1',
    description: 'Angus beef patty topped with sautéed wild portobello mushrooms, melted Swiss cheese & garlic truffle cream.',
    price: 1790,
    cost: 680,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Angus Beef', 'Portobello Mushrooms', 'Swiss Cheese', 'Truffle Cream'],
    calories: 810,
    preparationTime: 12,
    stockQuantity: 50,
    lowStockThreshold: 10,
    isFeatured: false,
    isAvailable: true,
    isSpicy: false,
    isPopular: false,
    isVegetarian: false
  },
  {
    id: 'prod-8',
    sku: 'BZ-PK-008',
    name: 'Beyond Green Plant Burger',
    categoryId: 'cat-1',
    description: '100% plant-based patty, vegan cheddar, avocado smash, butter lettuce & heirloom tomato on toasted brioche.',
    price: 1590,
    cost: 600,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Plant-Based Patty', 'Vegan Cheese', 'Avocado', 'Lettuce', 'Tomato'],
    calories: 640,
    preparationTime: 10,
    stockQuantity: 40,
    lowStockThreshold: 8,
    isFeatured: false,
    isAvailable: true,
    isSpicy: false,
    isPopular: false,
    isVegetarian: true
  },
  {
    id: 'prod-9',
    sku: 'BZ-PK-009',
    name: 'Loaded Garlic Mayo Buzz Fries',
    categoryId: 'cat-3',
    description: 'Hand-cut skin-on fries topped with liquid gold cheddar, chopped smash beef, jalapenos & house garlic mayo.',
    price: 790,
    cost: 250,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Skin-on Fries', 'Liquid Cheddar', 'Smash Beef Bits', 'Jalapeños', 'Garlic Mayo'],
    calories: 680,
    preparationTime: 6,
    stockQuantity: 150,
    lowStockThreshold: 25,
    isFeatured: true,
    isAvailable: true,
    isSpicy: false,
    isPopular: true,
    isVegetarian: false
  },
  {
    id: 'prod-10',
    sku: 'BZ-PK-010',
    name: 'Truffle Parmesan Fries',
    categoryId: 'cat-3',
    description: 'Crispy shoestring fries tossed in white truffle oil, freshly grated aged parmesan & fresh parsley.',
    price: 690,
    cost: 220,
    image: 'https://images.unsplash.com/photo-1630384060421-cb3f20e06493?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Shoestring Fries', 'Truffle Oil', 'Aged Parmesan', 'Parsley'],
    calories: 520,
    preparationTime: 6,
    stockQuantity: 130,
    lowStockThreshold: 20,
    isFeatured: false,
    isAvailable: true,
    isSpicy: false,
    isPopular: true,
    isVegetarian: true
  },
  {
    id: 'prod-11',
    sku: 'BZ-PK-011',
    name: 'Buzz Buffalo Wings (8 Pcs)',
    categoryId: 'cat-4',
    description: 'Double fried crispy jumbo chicken wings tossed in Spicy Buffalo or Honey BBQ sauce with ranch dip.',
    price: 1150,
    cost: 410,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Jumbo Chicken Wings', 'Buffalo Sauce', 'Ranch Dip'],
    calories: 780,
    preparationTime: 12,
    stockQuantity: 90,
    lowStockThreshold: 15,
    isFeatured: true,
    isAvailable: true,
    isSpicy: true,
    isPopular: true,
    isVegetarian: false
  },
  {
    id: 'prod-12',
    sku: 'BZ-PK-012',
    name: 'Belgian Chocolate Fudge Shake',
    categoryId: 'cat-5',
    description: 'Ultra dense Belgian chocolate shake topped with whipped cream, brownie chunks & chocolate drizzle.',
    price: 750,
    cost: 210,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Belgian Chocolate Ice Cream', 'Brownie Pieces', 'Whipped Cream'],
    calories: 620,
    preparationTime: 5,
    stockQuantity: 200,
    lowStockThreshold: 30,
    isFeatured: true,
    isAvailable: true,
    isSpicy: false,
    isPopular: true,
    isVegetarian: true
  },
  {
    id: 'prod-13',
    sku: 'BZ-PK-013',
    name: 'Lotus Biscoff Salted Caramel Shake',
    categoryId: 'cat-5',
    description: 'Creamy Lotus Biscoff milkshake infused with sea salt caramel and crushed Biscoff cookie dust.',
    price: 790,
    cost: 230,
    image: 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Lotus Biscoff Spread', 'Vanilla Cream', 'Salted Caramel'],
    calories: 680,
    preparationTime: 5,
    stockQuantity: 180,
    lowStockThreshold: 25,
    isFeatured: true,
    isAvailable: true,
    isSpicy: false,
    isPopular: true,
    isVegetarian: true
  },
  {
    id: 'prod-14',
    sku: 'BZ-PK-014',
    name: 'Lahori Mint Lemonade',
    categoryId: 'cat-6',
    description: 'Freshly muddled mint leaves, squeezed lemon juice, black salt & chilled sparkling soda.',
    price: 390,
    cost: 90,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Fresh Mint', 'Lemon Juice', 'Black Salt', 'Sparkling Soda'],
    calories: 140,
    preparationTime: 4,
    stockQuantity: 300,
    lowStockThreshold: 40,
    isFeatured: false,
    isAvailable: true,
    isSpicy: false,
    isPopular: true,
    isVegetarian: true
  },
  {
    id: 'prod-15',
    sku: 'BZ-PK-015',
    name: 'Nutella Stuffed Lava Brownie',
    categoryId: 'cat-8',
    description: 'Warm dark chocolate brownie with a molten Nutella core served with vanilla bean gelato.',
    price: 690,
    cost: 220,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Dark Chocolate', 'Nutella Core', 'Vanilla Gelato'],
    calories: 690,
    preparationTime: 6,
    stockQuantity: 65,
    lowStockThreshold: 10,
    isFeatured: true,
    isAvailable: true,
    isSpicy: false,
    isPopular: true,
    isVegetarian: true
  }
];

export const INITIAL_DEALS: Deal[] = [
  {
    id: 'deal-1',
    title: 'Buzz Duo Feast (For 2)',
    description: '2x Buzz Karachi Smashes, 1x Loaded Garlic Mayo Fries & 2x Lahori Mint Lemonades.',
    price: 2890,
    originalPrice: 3750,
    productIds: ['prod-1', 'prod-1', 'prod-9', 'prod-14', 'prod-14'],
    image: 'https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'SAVE 23%'
  },
  {
    id: 'deal-2',
    title: 'Family Buzz Mega Box',
    description: '2x Double Smash Melts, 2x Crispy Zinger Burgers, 2x Truffle Fries & 4x Shakes.',
    price: 5990,
    originalPrice: 7450,
    productIds: ['prod-2', 'prod-2', 'prod-5', 'prod-5', 'prod-10', 'prod-10', 'prod-12', 'prod-12', 'prod-13', 'prod-13'],
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'FAMILY FAVORITE'
  },
  {
    id: 'deal-3',
    title: 'Midnight Craving Bundle',
    description: '1x Smoky BBQ Monster, 1x Buffalo Wings, 1x Loaded Fries & 1x Lotus Biscoff Shake.',
    price: 3490,
    originalPrice: 4480,
    productIds: ['prod-3', 'prod-11', 'prod-9', 'prod-13'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'POPULAR'
  }
];

export const INITIAL_DISCOUNTED_ITEMS: DiscountedItem[] = [
  {
    id: 'disc-1',
    productId: 'prod-1',
    productName: 'Buzz Karachi Smash',
    originalPrice: 1290,
    discountPercentage: 15,
    discountedPrice: 1090,
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    isActive: true
  },
  {
    id: 'disc-2',
    productId: 'prod-3',
    productName: 'Smoky Jalapeño BBQ Beef',
    originalPrice: 1890,
    discountPercentage: 12,
    discountedPrice: 1650,
    startDate: '2026-08-01',
    endDate: '2026-08-15',
    isActive: true
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cp-1',
    code: 'BUZZ10',
    discountType: 'percentage',
    amount: 10,
    minOrder: 1500,
    maxDiscount: 500,
    usageLimit: 500,
    timesUsed: 142,
    expiration: '2026-12-31',
    isActive: true
  },
  {
    id: 'cp-2',
    code: 'WELCOME20',
    discountType: 'percentage',
    amount: 20,
    minOrder: 2000,
    maxDiscount: 800,
    usageLimit: 200,
    timesUsed: 89,
    expiration: '2026-12-31',
    isActive: true
  },
  {
    id: 'cp-3',
    code: 'FREESHAKE',
    discountType: 'fixed',
    amount: 750,
    minOrder: 2500,
    maxDiscount: 750,
    usageLimit: 100,
    timesUsed: 43,
    expiration: '2026-09-30',
    isActive: true
  },
  {
    id: 'cp-4',
    code: 'FRIDAY15',
    discountType: 'percentage',
    amount: 15,
    minOrder: 2200,
    maxDiscount: 600,
    usageLimit: 300,
    timesUsed: 112,
    expiration: '2026-10-31',
    isActive: true
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Bilal Ahmed',
    phone: '+92 300 9234567',
    email: 'bilal.ahmed@gmail.com',
    totalOrders: 18,
    totalSpent: 28450,
    loyaltyPoints: 2845,
    lastOrderDate: '2026-08-07',
    address: 'Plot 45-C, Khayaban-e-Seher, DHA Phase 6, Karachi'
  },
  {
    id: 'cust-2',
    name: 'Ayesha Malik',
    phone: '+92 321 8765432',
    email: 'ayesha.m@outlook.com',
    totalOrders: 12,
    totalSpent: 19800,
    loyaltyPoints: 1980,
    lastOrderDate: '2026-08-06',
    address: 'House 112, Block H, Gulberg III, Lahore'
  },
  {
    id: 'cust-3',
    name: 'Zain Ali',
    phone: '+92 333 4321098',
    email: 'zain.ali@techpk.io',
    totalOrders: 25,
    totalSpent: 42500,
    loyaltyPoints: 4250,
    lastOrderDate: '2026-08-07',
    address: 'Street 14, Sector F-7/2, Islamabad'
  },
  {
    id: 'cust-4',
    name: 'Sara Khan',
    phone: '+92 301 9876543',
    email: 'sara.k@creative.pk',
    totalOrders: 8,
    totalSpent: 14200,
    loyaltyPoints: 1420,
    lastOrderDate: '2026-08-04',
    address: 'Villa 88, Bahria Town Phase 4, Rawalpindi'
  },
  {
    id: 'cust-5',
    name: 'Hamza Sheikh',
    phone: '+92 345 3456789',
    email: 'hamza.s@architects.pk',
    totalOrders: 14,
    totalSpent: 24900,
    loyaltyPoints: 2490,
    lastOrderDate: '2026-08-05',
    address: 'Block R, Johar Town, Lahore'
  }
];

export const INITIAL_STAFF: Staff[] = [
  {
    id: 'staff-1',
    name: 'Tariq Ahmed',
    email: 'admin@buzzrestaurant.com',
    username: 'admin',
    password: 'admin123',
    phone: '+92 300 8282899',
    role: 'Admin',
    status: 'Active',
    joiningDate: '2025-01-10'
  },
  {
    id: 'staff-2',
    name: 'Zubair Khan',
    email: 'zubair@buzzrestaurant.com',
    username: 'manager',
    password: 'manager123',
    phone: '+92 321 2223333',
    role: 'Manager',
    status: 'Active',
    joiningDate: '2025-02-15'
  },
  {
    id: 'staff-3',
    name: 'Usman Farooq',
    email: 'usman@buzzrestaurant.com',
    username: 'cashier',
    password: 'cashier123',
    phone: '+92 333 3334444',
    role: 'Cashier',
    status: 'Active',
    joiningDate: '2025-03-01'
  },
  {
    id: 'staff-4',
    name: 'Chef Muhammad Raza',
    email: 'raza@buzzrestaurant.com',
    username: 'chef',
    password: 'chef123',
    phone: '+92 345 4445555',
    role: 'Kitchen',
    status: 'Active',
    joiningDate: '2025-01-20'
  },
  {
    id: 'staff-5',
    name: 'Kamran Ali',
    email: 'kamran@buzzrestaurant.com',
    username: 'waiter',
    password: 'waiter123',
    phone: '+92 301 5556666',
    role: 'Waiter',
    status: 'Active',
    joiningDate: '2025-04-10'
  },
  {
    id: 'staff-6',
    name: 'Shahid Iqbal',
    email: 'shahid@buzzrestaurant.com',
    username: 'rider',
    password: 'rider123',
    phone: '+92 302 6667777',
    role: 'Rider',
    status: 'Active',
    joiningDate: '2025-05-01'
  }
];

export const INITIAL_WAITERS: Waiter[] = [
  {
    id: 'w-1',
    name: 'Kamran Ali',
    phone: '+92 301 5556666',
    status: 'On Shift',
    assignedTables: ['Table 01', 'Table 02', 'Table 05'],
    totalSales: 48500
  },
  {
    id: 'w-2',
    name: 'Fahad Sheikh',
    phone: '+92 322 7778888',
    status: 'On Shift',
    assignedTables: ['Table 03', 'Table 04', 'Table 06'],
    totalSales: 39200
  },
  {
    id: 'w-3',
    name: 'Daniyal Hassan',
    phone: '+92 334 8889999',
    status: 'Available',
    assignedTables: [],
    totalSales: 28900
  }
];

export const INITIAL_RIDERS: Rider[] = [
  {
    id: 'r-1',
    name: 'Shahid Iqbal',
    phone: '+92 302 6667777',
    vehicle: 'Honda CG125 Bike',
    status: 'Busy',
    currentOrders: 2,
    rating: 4.9
  },
  {
    id: 'r-2',
    name: 'Rashid Mehmood',
    phone: '+92 313 9990000',
    vehicle: 'Honda CD70 Bike',
    status: 'Available',
    currentOrders: 0,
    rating: 4.8
  },
  {
    id: 'r-3',
    name: 'Asadullah',
    phone: '+92 346 1239999',
    vehicle: 'Yamaha YBR125',
    status: 'Available',
    currentOrders: 0,
    rating: 5.0
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'RAW-BEEF-01',
    name: 'Fresh Angus Beef Meat',
    category: 'Meat & Poultry',
    currentStock: 50,
    unit: 'Kg',
    lowStockThreshold: 10,
    unitCost: 2400,
    supplier: 'MeatOne Halal Butchery',
    lastUpdated: '2026-08-12'
  },
  {
    id: 'inv-2',
    sku: 'RAW-CHICKEN-02',
    name: 'Boneless Chicken Breast Fillets',
    category: 'Meat & Poultry',
    currentStock: 45,
    unit: 'Kg',
    lowStockThreshold: 8,
    unitCost: 1150,
    supplier: 'K&N Fresh Farms',
    lastUpdated: '2026-08-12'
  },
  {
    id: 'inv-3',
    sku: 'RAW-BUN-03',
    name: 'Artisanal Brioche Burger Buns',
    category: 'Bakery & Buns',
    currentStock: 250,
    unit: 'Pcs',
    lowStockThreshold: 40,
    unitCost: 65,
    supplier: 'Golden Bakehouse DHA',
    lastUpdated: '2026-08-12'
  },
  {
    id: 'inv-4',
    sku: 'RAW-PATTY-04',
    name: 'Pre-Formed Angus Beef Patties',
    category: 'Meat & Poultry',
    currentStock: 120,
    unit: 'Pcs',
    lowStockThreshold: 25,
    unitCost: 380,
    supplier: 'Prime Butchery Gulberg',
    lastUpdated: '2026-08-12'
  },
  {
    id: 'inv-5',
    sku: 'RAW-ZINGER-05',
    name: 'Crispy Zinger Chicken Patties',
    category: 'Meat & Poultry',
    currentStock: 100,
    unit: 'Pcs',
    lowStockThreshold: 20,
    unitCost: 260,
    supplier: 'K&N Fresh Farms',
    lastUpdated: '2026-08-12'
  },
  {
    id: 'inv-6',
    sku: 'RAW-CHEESE-06',
    name: 'Melted Cheddar Cheese Slices',
    category: 'Dairy & Cheese',
    currentStock: 300,
    unit: 'Pcs',
    lowStockThreshold: 50,
    unitCost: 45,
    supplier: 'Nurpur Dairy Pakistan',
    lastUpdated: '2026-08-12'
  },
  {
    id: 'inv-7',
    sku: 'RAW-COKE-07',
    name: 'Coca-Cola 1.5L Bottles',
    category: 'Beverages',
    currentStock: 40,
    unit: 'Liters',
    lowStockThreshold: 12,
    unitCost: 180,
    supplier: 'Coca-Cola Beverages Pakistan',
    lastUpdated: '2026-08-12'
  },
  {
    id: 'inv-8',
    sku: 'RAW-FANTA-08',
    name: 'Fanta Orange 1.5L Bottles',
    category: 'Beverages',
    currentStock: 30,
    unit: 'Liters',
    lowStockThreshold: 10,
    unitCost: 180,
    supplier: 'Coca-Cola Beverages Pakistan',
    lastUpdated: '2026-08-12'
  },
  {
    id: 'inv-9',
    sku: 'RAW-MIRINDA-09',
    name: 'Mirinda Citrus Cans (350ml)',
    category: 'Beverages',
    currentStock: 60,
    unit: 'Cans',
    lowStockThreshold: 15,
    unitCost: 95,
    supplier: 'PepsiCola International PK',
    lastUpdated: '2026-08-12'
  },
  {
    id: 'inv-10',
    sku: 'RAW-SAUCE-10',
    name: 'BUZZ Secret Recipe Mayo Sauce',
    category: 'Sauces & Condiments',
    currentStock: 15,
    unit: 'Liters',
    lowStockThreshold: 4,
    unitCost: 850,
    supplier: 'In-House Prep Station',
    lastUpdated: '2026-08-12'
  },
  {
    id: 'inv-11',
    sku: 'RAW-VEG-11',
    name: 'Iceberg Lettuce & Pickled Relish',
    category: 'Produce & Veggies',
    currentStock: 18,
    unit: 'Kg',
    lowStockThreshold: 5,
    unitCost: 320,
    supplier: 'Sabzi Mandi Farm Direct',
    lastUpdated: '2026-08-12'
  },
  {
    id: 'inv-12',
    sku: 'RAW-OIL-12',
    name: 'Deep Frying Cooking Oil',
    category: 'Sauces & Condiments',
    currentStock: 50,
    unit: 'Liters',
    lowStockThreshold: 12,
    unitCost: 520,
    supplier: 'Habib Oil Mills',
    lastUpdated: '2026-08-12'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    title: 'Monthly DHA Branch Lease Rent',
    category: 'Rent',
    amount: 350000,
    date: '2026-08-01',
    paymentMethod: 'Bank Transfer',
    description: 'August 2026 commercial lease payment for DHA Phase 6 Karachi branch.'
  },
  {
    id: 'exp-2',
    title: 'K-Electric & SSGC Commercial Bill',
    category: 'Utilities',
    amount: 85000,
    date: '2026-08-03',
    paymentMethod: 'Corporate Bank Transfer',
    description: 'Commercial kitchen power electricity & high-pressure gas meter bill.'
  },
  {
    id: 'exp-3',
    title: 'Halal Beef & Produce Inventory Batch',
    category: 'Supplies',
    amount: 245000,
    date: '2026-08-05',
    paymentMethod: 'Vendor Credit',
    description: 'Weekly stock of 100% Halal Angus beef, buttermilk chicken & fresh produce.'
  },
  {
    id: 'exp-4',
    title: 'Instagram Reels & Food Blogger Campaign',
    category: 'Marketing',
    amount: 65000,
    date: '2026-08-04',
    paymentMethod: 'Corporate Card',
    description: 'Instagram sponsored reels & local food blogger reviews.'
  },
  {
    id: 'exp-5',
    title: 'Deep Fryer Maintenance & Cooking Oil',
    category: 'Maintenance',
    amount: 28000,
    date: '2026-08-06',
    paymentMethod: 'Cash',
    description: 'Kitchen fryer servicing & Dalda cooking oil stock.'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'BZ-2026-00128',
    customerName: 'Bilal Ahmed',
    phone: '+92 300 9234567',
    email: 'bilal.ahmed@gmail.com',
    address: 'Plot 45-C, Khayaban-e-Seher, DHA Phase 6',
    city: 'Karachi',
    orderType: 'Delivery',
    status: 'Preparing',
    paymentMethod: 'PayFast',
    paymentStatus: 'Paid',
    items: [
      {
        id: 'oi-1',
        productId: 'prod-2',
        name: 'Lahore Double Smash Melt',
        price: 1690,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
        customization: { size: 'Double', extraCheese: true }
      },
      {
        id: 'oi-2',
        productId: 'prod-9',
        name: 'Loaded Garlic Mayo Buzz Fries',
        price: 790,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'oi-3',
        productId: 'prod-12',
        name: 'Belgian Chocolate Fudge Shake',
        price: 750,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 5670,
    tax: 737,
    deliveryFee: 150,
    discount: 567,
    couponCode: 'BUZZ10',
    total: 5990,
    createdAt: '2026-08-07T20:45:00Z',
    updatedAt: '2026-08-07T20:50:00Z',
    riderId: 'r-1',
    riderName: 'Shahid Iqbal',
    notes: 'Extra garlic mayo on the side please!'
  },
  {
    id: 'ord-102',
    orderNumber: 'BZ-2026-00127',
    customerName: 'Ayesha Malik',
    phone: '+92 321 8765432',
    email: 'ayesha.m@outlook.com',
    address: 'Restaurant Table 02',
    city: 'Karachi',
    orderType: 'Dine-in',
    tableNumber: 'Table 02',
    status: 'Ready',
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    items: [
      {
        id: 'oi-4',
        productId: 'prod-1',
        name: 'Buzz Karachi Smash',
        price: 1090,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'oi-5',
        productId: 'prod-10',
        name: 'Truffle Parmesan Fries',
        price: 690,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1630384060421-cb3f20e06493?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 1780,
    tax: 231,
    deliveryFee: 0,
    discount: 0,
    total: 2011,
    createdAt: '2026-08-07T20:30:00Z',
    updatedAt: '2026-08-07T20:42:00Z',
    waiterId: 'w-1',
    waiterName: 'Kamran Ali'
  },
  {
    id: 'ord-103',
    orderNumber: 'BZ-2026-00126',
    customerName: 'Zain Ali',
    phone: '+92 333 4321098',
    email: 'zain.ali@techpk.io',
    address: 'Street 14, Sector F-7/2',
    city: 'Islamabad',
    orderType: 'Delivery',
    status: 'Delivered',
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    items: [
      {
        id: 'oi-6',
        productId: 'prod-3',
        name: 'Smoky Jalapeño BBQ Beef',
        price: 1650,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'oi-7',
        productId: 'prod-11',
        name: 'Buzz Buffalo Wings (8 Pcs)',
        price: 1150,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 2800,
    tax: 364,
    deliveryFee: 150,
    discount: 0,
    total: 3314,
    createdAt: '2026-08-07T19:15:00Z',
    updatedAt: '2026-08-07T19:55:00Z',
    riderId: 'r-2',
    riderName: 'Rashid Mehmood'
  }
];

export const INITIAL_LOYALTY: LoyaltyAccount[] = [
  {
    customerId: 'cust-1',
    customerName: 'Bilal Ahmed',
    points: 2845,
    tier: 'Gold',
    history: [
      { id: 'lh-1', date: '2026-08-07', points: 599, type: 'earned', description: 'Order #BZ-2026-00128' },
      { id: 'lh-2', date: '2026-07-28', points: 1250, type: 'earned', description: 'Order #BZ-2026-00094' }
    ]
  },
  {
    customerId: 'cust-3',
    customerName: 'Zain Ali',
    points: 4250,
    tier: 'VIP',
    history: [
      { id: 'lh-3', date: '2026-08-07', points: 331, type: 'earned', description: 'Order #BZ-2026-00126' },
      { id: 'lh-4', date: '2026-07-15', points: 750, type: 'redeemed', description: 'Free Shake Reward Coupon' }
    ]
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  restaurantName: 'BUZZ BURGER',
  tagline: '100% Halal Angus Beef. Bold Flavors. Serious Burgers.',
  phone: '+92 300 8282899',
  email: 'info@buzzburgers.pk',
  address: 'Plot 14-C, Main Khayaban-e-Shahbaz, DHA Phase 6',
  city: 'Karachi',
  openingHours: 'Mon-Sun: 12:00 PM - 03:00 AM (Late Night Delivery)',
  currency: 'PKR',
  currencySymbol: 'Rs.',
  taxRate: 13, // 13% Sales Tax (FBR / SRB / PRA)
  deliveryFee: 150,
  minOrderAmount: 850,
  preparationTimeMinutes: 15,
  autoConfirmOrders: true,
  brandColor: '#F5C400',
  themeMode: 'dark'
};

export const INITIAL_PRINTER_CONFIG: PrinterConfig = {
  printerName: 'Epson TM-T88VI Thermal POS Printer',
  printerType: 'Thermal POS',
  ipAddress: '192.168.1.150',
  port: 9100,
  receiptWidth: '80mm',
  autoPrint: true
};

export const INITIAL_FBR_CONFIG: FBRConfig = {
  ntn: '7891234-5',
  strn: '3277876123459',
  posId: 'FBR-PK-9821-POS1',
  revenueAuthority: 'PRA (Punjab)',
  cashTaxRate: 16,
  cardTaxRate: 5,
  apiUrl: 'https://pos.fbr.gov.pk/api/v1/Invoice/Post',
  environment: 'Production',
  token: 'fbr_pk_live_token_sec_893471982',
  bearerToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fbr_live_access_token',
  terminalCode: 'LHR-DHA-TERM-01',
  isConnected: true,
  autoFiscalize: true
};

export const INITIAL_PAYFAST_CONFIG: PayFastConfig = {
  merchantId: 'PF_PK_MERCHANT_89123',
  merchantKey: 'pf_pk_sec_key_demo_7721839',
  environment: 'Sandbox',
  callbackUrl: 'https://buzzburgers.pk/api/payfast/callback',
  isConnected: true
};
