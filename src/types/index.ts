export interface ProductRecipeItem {
  inventoryItemId: string;
  inventoryItemName: string;
  amount: number; // weightage e.g. 0.6 Kg, 1 Pcs, 0.2 Liters
  unit: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  description: string;
  price: number;
  salePrice?: number;
  cost: number;
  image: string;
  ingredients: string[];
  recipe?: ProductRecipeItem[];
  calories: number;
  preparationTime: number; // in mins
  stockQuantity?: number;
  lowStockThreshold?: number;
  isFeatured: boolean;
  isAvailable: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  isVegetarian: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  displayOrder: number;
}

export interface CustomizationOption {
  size?: 'Single' | 'Double' | 'Triple' | 'Monster';
  pattyType?: 'Beef' | 'Crispy Chicken' | 'Plant-based';
  extraCheese?: boolean;
  sauce?: string;
  addOns?: { name: string; price: number }[];
  specialInstructions?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  customization?: CustomizationOption;
}

export type OrderType = 'Delivery' | 'Pickup' | 'Dine-in';
export type OrderStatus = 'Received' | 'Confirmed' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'Cash' | 'PayFast' | 'Card';
export type PaymentStatus = 'Paid' | 'Pending';

export interface Order {
  id: string;
  orderNumber: string; // e.g. BZ-2026-00128
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  orderType: OrderType;
  tableNumber?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  waiterId?: string;
  waiterName?: string;
  riderId?: string;
  riderName?: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  lastOrderDate: string;
  address: string;
}

export type StaffRole = 'Admin' | 'Manager' | 'Cashier' | 'Kitchen' | 'Waiter' | 'Rider';

export interface Staff {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  phone: string;
  role: StaffRole;
  status: 'Active' | 'Inactive';
  joiningDate: string;
}

export interface Waiter {
  id: string;
  name: string;
  phone: string;
  status: 'Available' | 'On Shift' | 'Off Shift';
  assignedTables: string[];
  totalSales: number;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  status: 'Available' | 'Busy' | 'Offline';
  currentOrders: number;
  rating: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  lowStockThreshold: number;
  unitCost: number;
  supplier: string;
  lastUpdated: string;
}

export type ExpenseCategory = 'Rent' | 'Utilities' | 'Salaries' | 'Supplies' | 'Marketing' | 'Maintenance' | 'Other';

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  paymentMethod: string;
  description: string;
  receiptUrl?: string;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  productIds: string[];
  image: string;
  isAvailable: boolean;
  badge?: string;
}

export interface DiscountedItem {
  id: string;
  productId: string;
  productName: string;
  originalPrice: number;
  discountPercentage: number;
  discountedPrice: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  amount: number; // e.g. 10 for 10% or $10
  minOrder: number;
  maxDiscount: number;
  usageLimit: number;
  timesUsed: number;
  expiration: string;
  isActive: boolean;
}

export interface LoyaltyHistoryItem {
  id: string;
  date: string;
  points: number;
  type: 'earned' | 'redeemed';
  description: string;
}

export interface LoyaltyAccount {
  customerId: string;
  customerName: string;
  points: number;
  tier: 'Silver' | 'Gold' | 'VIP';
  history: LoyaltyHistoryItem[];
}

export interface StoreSettings {
  restaurantName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  openingHours: string;
  currency: string;
  currencySymbol: string;
  taxRate: number; // percentage, e.g. 8 for 8%
  deliveryFee: number;
  minOrderAmount: number;
  preparationTimeMinutes: number;
  autoConfirmOrders: boolean;
  brandColor: string;
  themeMode: 'dark' | 'light';
}

export interface PrinterConfig {
  printerName: string;
  printerType: 'Thermal POS' | 'Network' | 'USB';
  ipAddress: string;
  port: number;
  receiptWidth: '58mm' | '80mm';
  autoPrint: boolean;
}

export interface FBRTransmissionItem {
  id: string;
  orderNumber: string;
  fbrInvoiceNumber: string;
  customerName: string;
  totalAmount: number;
  taxAmount: number;
  paymentMode: string;
  fiscalizationStatus: 'FISCALIZED' | 'PENDING' | 'FAILED';
  transmittedAt: string;
  qrHash: string;
}

export interface FBRConfig {
  ntn: string;
  strn: string;
  posId: string;
  revenueAuthority: 'PRA (Punjab)' | 'SRB (Sindh)' | 'BRA (Balochistan)' | 'KPRA (KPK)' | 'FBR Federal';
  cashTaxRate: number;
  cardTaxRate: number;
  apiUrl: string;
  environment: 'Sandbox' | 'Production';
  token: string;
  bearerToken: string;
  terminalCode: string;
  isConnected: boolean;
  autoFiscalize: boolean;
}

export interface PayFastConfig {
  merchantId: string;
  merchantKey: string;
  environment: 'Sandbox' | 'Production';
  callbackUrl: string;
  isConnected: boolean;
}
