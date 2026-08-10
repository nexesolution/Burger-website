import React, { useState } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CheckCircle2,
  User,
  ShoppingBag,
  CreditCard,
  PauseCircle,
  XCircle,
  Tag
} from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';
import { Product, OrderItem, OrderType, PaymentMethod, Order } from '../../types';
import { ReceiptModal } from '../../components/ui/ReceiptModal';

export const PosSystemPage: React.FC = () => {
  const products = useBuzzStore((state) => state.products);
  const categories = useBuzzStore((state) => state.categories);
  const waiters = useBuzzStore((state) => state.waiters);
  const customers = useBuzzStore((state) => state.customers);
  const storeSettings = useBuzzStore((state) => state.storeSettings);
  const createOrder = useBuzzStore((state) => state.createOrder);
  const coupons = useBuzzStore((state) => state.coupons);

  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Local POS Terminal Order State
  const [posCart, setPosCart] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState<string>('Walk-in Guest');
  const [phone, setPhone] = useState<string>('+1 (555) 000-0000');
  const [selectedWaiterId, setSelectedWaiterId] = useState<string>(waiters[0]?.id || '');
  const [orderType, setOrderType] = useState<OrderType>('Dine-in');
  const [tableNumber, setTableNumber] = useState<string>('Table 01');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Receipt Modal control
  const [createdOrderForReceipt, setCreatedOrderForReceipt] = useState<Order | null>(null);
  const [receiptOpen, setReceiptOpen] = useState<boolean>(false);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    if (!p.isAvailable) return false;
    if (selectedCatId !== 'all' && p.categoryId !== selectedCatId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  // Cart operations
  const addToPosCart = (product: Product) => {
    const priceToUse = product.salePrice ?? product.price;
    const existingIndex = posCart.findIndex((item) => item.productId === product.id);

    if (existingIndex > -1) {
      const updated = [...posCart];
      updated[existingIndex].quantity += 1;
      setPosCart(updated);
    } else {
      const newItem: OrderItem = {
        id: `pos-${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: priceToUse,
        quantity: 1,
        image: product.image
      };
      setPosCart([...posCart, newItem]);
    }
  };

  const updateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      setPosCart(posCart.filter((item) => item.id !== itemId));
      return;
    }
    setPosCart(posCart.map((item) => (item.id === itemId ? { ...item, quantity: qty } : item)));
  };

  const removeItem = (itemId: string) => {
    setPosCart(posCart.filter((item) => item.id !== itemId));
  };

  // Calculations
  const subtotal = posCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = (taxableAmount * storeSettings.taxRate) / 100;
  const grandTotal = taxableAmount + tax;

  const handleApplyCoupon = () => {
    const found = coupons.find((c) => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive);
    if (found) {
      if (found.discountType === 'percentage') {
        setDiscountAmount(Math.min((subtotal * found.amount) / 100, found.maxDiscount));
      } else {
        setDiscountAmount(found.amount);
      }
    }
  };

  const handleCompleteOrder = () => {
    if (posCart.length === 0) return;

    const waiterObj = waiters.find((w) => w.id === selectedWaiterId);

    const newOrder = createOrder({
      customerName,
      phone,
      email: `${customerName.toLowerCase().replace(/\s+/g, '')}@guest.com`,
      address: orderType === 'Dine-in' ? tableNumber : 'POS Counter Takeaway',
      city: storeSettings.city,
      orderType,
      tableNumber: orderType === 'Dine-in' ? tableNumber : undefined,
      status: 'Preparing',
      paymentMethod,
      paymentStatus: 'Paid',
      items: posCart,
      subtotal,
      tax,
      deliveryFee: 0,
      discount: discountAmount,
      couponCode: couponCode || undefined,
      total: grandTotal,
      waiterId: waiterObj?.id,
      waiterName: waiterObj?.name
    });

    // Reset local state & show receipt
    setPosCart([]);
    setDiscountAmount(0);
    setCouponCode('');
    setCreatedOrderForReceipt(newOrder);
    setReceiptOpen(true);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-6 text-white overflow-hidden">
      {/* Left Column: Product Selection Grid */}
      <div className="flex-1 flex flex-col min-w-0 space-y-4 overflow-hidden">
        {/* Search & Category Filter Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-buzz-yellow"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCatId('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCatId === 'all'
                  ? 'bg-buzz-yellow text-buzz-black shadow-buzz-glow font-black'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCatId === cat.id
                    ? 'bg-buzz-yellow text-buzz-black shadow-buzz-glow font-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pr-1">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => addToPosCart(prod)}
              className="p-3 rounded-2xl glass-card border border-zinc-800 hover:border-buzz-yellow cursor-pointer transition-all flex flex-col justify-between space-y-2 group shadow-md"
            >
              <div className="relative h-28 rounded-xl overflow-hidden bg-zinc-900">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 font-black font-display text-buzz-yellow text-xs">
                  Rs. {(prod.salePrice ?? prod.price).toLocaleString()}
                </span>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white group-hover:text-buzz-yellow line-clamp-1">
                  {prod.name}
                </h4>
                <span className="text-[10px] text-zinc-500 font-mono block">SKU: {prod.sku}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: POS Cart Order Panel */}
      <div className="w-full md:w-96 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-between space-y-4 overflow-hidden flex-shrink-0 shadow-2xl">
        {/* Terminal Header */}
        <div className="space-y-3 pb-3 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black font-display text-white">Current Order</h3>
            <span className="text-xs font-mono font-bold text-buzz-yellow">TERMINAL POS #1</span>
          </div>

          {/* Customer & Order Type Selectors */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-zinc-400 font-semibold block">Order Type</label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as OrderType)}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-2 text-xs"
              >
                <option value="Dine-in">Dine-in</option>
                <option value="Pickup">Takeaway</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>

            {orderType === 'Dine-in' && (
              <div>
                <label className="text-[10px] text-zinc-400 font-semibold block">Table</label>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-2 text-xs"
                >
                  <option value="Table 01">Table 01</option>
                  <option value="Table 02">Table 02</option>
                  <option value="Table 03">Table 03</option>
                  <option value="Table 04">Table 04</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Order Items List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {posCart.length > 0 ? (
            posCart.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5 min-w-0 flex-1">
                  <span className="font-bold text-white block truncate">{item.name}</span>
                  <span className="text-[10px] text-buzz-yellow font-mono">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold text-white w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-red-400 hover:text-red-300 ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 py-12">
              <ShoppingBag className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-xs font-semibold">Tap products on left to add to order</p>
            </div>
          )}
        </div>

        {/* Calculations & Actions */}
        <div className="space-y-3 pt-3 border-t border-zinc-800 text-xs">
          <div className="space-y-1 text-zinc-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white">Rs. {Math.round(subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Sales Tax ({storeSettings.taxRate}%)</span>
              <span className="text-white">Rs. {Math.round(tax).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-black text-base text-white font-display pt-1 border-t border-zinc-800">
              <span>TOTAL</span>
              <span className="text-buzz-yellow">Rs. {Math.round(grandTotal).toLocaleString()}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => setPosCart([])}
              className="py-2.5 px-3 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white font-bold text-xs flex items-center justify-center gap-1"
            >
              <XCircle className="w-4 h-4" /> Cancel
            </button>

            <button
              onClick={handleCompleteOrder}
              disabled={posCart.length === 0}
              className="py-2.5 px-3 rounded-xl bg-buzz-yellow hover:bg-buzz-yellow-light text-buzz-black font-black text-xs shadow-buzz-glow flex items-center justify-center gap-1 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" /> COMPLETE ORDER
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        order={createdOrderForReceipt}
        isOpen={receiptOpen}
        onClose={() => setReceiptOpen(false)}
      />
    </div>
  );
};
