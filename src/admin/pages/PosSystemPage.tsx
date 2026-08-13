import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  ShoppingBag,
  CreditCard,
  Banknote,
  Split,
  XCircle,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';
import { Product, OrderItem, OrderType, PaymentMethod, Order } from '../../types';
import { ReceiptModal } from '../../components/ui/ReceiptModal';

type PosPaymentMode = 'Cash' | 'Card' | 'Split';

export const PosSystemPage: React.FC = () => {
  const products = useBuzzStore((state) => state.products);
  const categories = useBuzzStore((state) => state.categories);
  const waiters = useBuzzStore((state) => state.waiters);
  const storeSettings = useBuzzStore((state) => state.storeSettings);
  const createOrder = useBuzzStore((state) => state.createOrder);
  const coupons = useBuzzStore((state) => state.coupons);
  const showToast = useBuzzStore((state) => state.showToast);

  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Local POS Terminal Order State
  const [posCart, setPosCart] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState<string>('Walk-in Guest');
  const [phone, setPhone] = useState<string>('+92 300 0000000');
  const [selectedWaiterId, setSelectedWaiterId] = useState<string>(waiters[0]?.id || '');
  const [orderType, setOrderType] = useState<OrderType>('Dine-in');
  const [tableNumber, setTableNumber] = useState<string>('Table 01');
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Payment Mode & GST Rates (Cash = 16% GST, Online/Card = 5% GST, Split = Calculated on exact entered amounts)
  const [paymentMode, setPaymentMode] = useState<PosPaymentMode>('Cash');
  const [splitCashAmount, setSplitCashAmount] = useState<number>(0);
  const [splitCardAmount, setSplitCardAmount] = useState<number>(0);

  // FBR Live Integration Toggle (Ctrl+F Enabled, Ctrl+S Disabled)
  const [fbrEnabled, setFbrEnabled] = useState<boolean>(true);
  const [fbrModalStatus, setFbrModalStatus] = useState<'ENABLED' | 'DISABLED' | null>(null);

  // Receipt Modal control
  const [createdOrderForReceipt, setCreatedOrderForReceipt] = useState<Order | null>(null);
  const [receiptOpen, setReceiptOpen] = useState<boolean>(false);

  // Keyboard Hotkeys: Ctrl + F (Enable FBR & GST) & Ctrl + S (Disable FBR & GST)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl + F or Cmd + F
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setFbrEnabled(true);
        setFbrModalStatus('ENABLED');
        showToast('⚡ FBR Live Integration ENABLED (GST Active)', 'success');
      }

      // Check for Ctrl + S or Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setFbrEnabled(false);
        setFbrModalStatus('DISABLED');
        showToast('⛔ FBR Live Integration DISABLED (Tax Off)', 'error');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showToast]);

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

  // Dynamic GST Calculation based on exact entered amounts
  let calculatedGst = 0;
  let taxLabel = '16% GST';

  if (paymentMode === 'Cash') {
    calculatedGst = (taxableAmount * 16) / 100;
    taxLabel = '16% GST (Cash)';
  } else if (paymentMode === 'Card') {
    calculatedGst = (taxableAmount * 5) / 100;
    taxLabel = '5% GST (Digital/Card)';
  } else if (paymentMode === 'Split') {
    const cashTax = (Math.max(0, splitCashAmount) * 16) / 100;
    const cardTax = (Math.max(0, splitCardAmount) * 5) / 100;
    calculatedGst = cashTax + cardTax;
    const effectivePercent = taxableAmount > 0 ? ((calculatedGst / taxableAmount) * 100).toFixed(1) : '0';
    taxLabel = `Split Tax (~${effectivePercent}%)`;
  }

  // On POS Screen, always display full total with calculated GST so screen looks 100% normal
  const posScreenGrandTotal = taxableAmount + calculatedGst;

  // Switching payment modes - No auto 50/50, cashier enters exact amounts
  const handleSelectPaymentMode = (mode: PosPaymentMode) => {
    setPaymentMode(mode);
    if (mode === 'Split') {
      setSplitCashAmount(0);
      setSplitCardAmount(0);
    }
  };

  const handleApplyCoupon = () => {
    const found = coupons.find((c) => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive);
    if (found) {
      if (found.discountType === 'percentage') {
        setDiscountAmount(Math.min((subtotal * found.amount) / 100, found.maxDiscount));
      } else {
        setDiscountAmount(found.amount);
      }
      showToast(`Coupon ${found.code} applied!`);
    } else {
      showToast('Invalid or expired promo code', 'error');
    }
  };

  const handleCompleteOrder = () => {
    if (posCart.length === 0) return;

    const waiterObj = waiters.find((w) => w.id === selectedWaiterId);

    let finalPaymentMethodStr: PaymentMethod = 'Cash';
    let paymentDetailsNote = '';

    if (paymentMode === 'Cash') {
      finalPaymentMethodStr = 'Cash';
      paymentDetailsNote = `Paid in Cash (16% GST: Rs. ${Math.round(calculatedGst)})`;
    } else if (paymentMode === 'Card') {
      finalPaymentMethodStr = 'Card';
      paymentDetailsNote = `Paid via Card/Digital (5% GST: Rs. ${Math.round(calculatedGst)})`;
    } else if (paymentMode === 'Split') {
      finalPaymentMethodStr = 'Card';
      paymentDetailsNote = `Split Payment -> Cash: Rs. ${splitCashAmount} (16% GST: Rs. ${Math.round(
        (splitCashAmount * 16) / 100
      )}) | Card: Rs. ${splitCardAmount} (5% GST: Rs. ${Math.round((splitCardAmount * 5) / 100)})`;
    }

    // Final order tax:
    // If FBR mode is ON, tax is included in order & printed receipt.
    // If FBR mode is OFF (Ctrl+S), tax is set to 0 (so receipt removes GST tax line)!
    const finalOrderTax = fbrEnabled ? calculatedGst : 0;
    const finalOrderTotal = taxableAmount + finalOrderTax;

    const fbrNote = fbrEnabled
      ? `FBR REPORTED: Yes | Invoice Ref: FBR-${Date.now().toString().slice(-6)} | ${paymentDetailsNote}`
      : `FBR REPORTED: No (FBR Disabled via Ctrl+S) | ${paymentDetailsNote}`;

    const newOrder = createOrder({
      customerName,
      phone,
      email: `${customerName.toLowerCase().replace(/\s+/g, '')}@guest.com`,
      address: orderType === 'Dine-in' ? tableNumber : 'POS Counter Takeaway',
      city: storeSettings.city,
      orderType,
      tableNumber: orderType === 'Dine-in' ? tableNumber : undefined,
      status: 'Preparing',
      paymentMethod: finalPaymentMethodStr,
      paymentStatus: 'Paid',
      items: posCart,
      subtotal,
      tax: finalOrderTax,
      deliveryFee: 0,
      discount: discountAmount,
      couponCode: couponCode || undefined,
      total: finalOrderTotal,
      waiterId: waiterObj?.id,
      waiterName: waiterObj?.name,
      notes: fbrNote
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
        {/* Top Bar: Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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

      {/* Right Column: POS Cart Order Panel (With Scrollable Inner Body) */}
      <div className="w-full md:w-[440px] bg-zinc-900/90 border border-zinc-800 rounded-3xl flex flex-col h-full overflow-hidden flex-shrink-0 shadow-2xl">
        {/* 1. Terminal Header (Fixed Top) */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/80 space-y-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black font-display text-white">Current Order</h3>

            {/* FBR Status Badge - ALWAYS displays FBR LIVE ACTIVE as requested */}
            <div className="px-3 py-1 rounded-full text-[10px] font-black tracking-wide flex items-center gap-1.5 border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>FBR LIVE ACTIVE</span>
            </div>
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
                  <option value="VIP Booth A">VIP Booth A</option>
                  <option value="VIP Booth B">VIP Booth B</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* 2. Scrollable Middle Body (Cart items + Payment Modes + Split Settings) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pr-2">
          {/* Order Items List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <span>Order Items ({posCart.reduce((a, b) => a + b.quantity, 0)})</span>
              {posCart.length > 0 && (
                <button
                  onClick={() => setPosCart([])}
                  className="text-[10px] text-red-400 hover:text-red-300 underline font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            {posCart.length > 0 ? (
              <div className="space-y-2">
                {posCart.map((item) => (
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
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-zinc-500 py-8 bg-zinc-950/40 rounded-2xl border border-dashed border-zinc-800">
                <ShoppingBag className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-xs font-semibold">Tap products on left to add to order</p>
              </div>
            )}
          </div>

          {/* Payment Mode Selector */}
          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Payment Method & Tax Calculation
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
              <button
                onClick={() => handleSelectPaymentMode('Cash')}
                className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                  paymentMode === 'Cash'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 font-black shadow-md'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>💵 Cash</span>
                <span className="text-[9px] opacity-80">(16% GST)</span>
              </button>

              <button
                onClick={() => handleSelectPaymentMode('Card')}
                className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                  paymentMode === 'Card'
                    ? 'bg-sky-500/20 text-sky-400 border-sky-500 font-black shadow-md'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>💳 Card</span>
                <span className="text-[9px] opacity-80">(5% GST)</span>
              </button>

              <button
                onClick={() => handleSelectPaymentMode('Split')}
                className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                  paymentMode === 'Split'
                    ? 'bg-buzz-yellow/20 text-buzz-yellow border-buzz-yellow font-black shadow-md'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                <Split className="w-4 h-4" />
                <span>🔀 Split</span>
                <span className="text-[9px] opacity-80">(16% + 5%)</span>
              </button>
            </div>

            {/* Split Payment Custom Amounts */}
            {paymentMode === 'Split' && (
              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs animate-fade-in">
                <div className="flex items-center justify-between text-[11px] font-bold text-zinc-300 border-b border-zinc-800 pb-2">
                  <span>Split Amount Customizer</span>
                  <span className="text-[10px] text-zinc-400">Enter exact amounts paid</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-semibold block">
                      Cash Paid (16% GST)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-[10px]">
                        Rs.
                      </span>
                      <input
                        type="number"
                        value={splitCashAmount || ''}
                        onChange={(e) => setSplitCashAmount(parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg pl-8 pr-2 py-2 text-xs font-mono font-bold focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <span className="text-[9px] text-emerald-400 block font-mono">
                      Tax: Rs. {Math.round((splitCashAmount * 16) / 100)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-semibold block">
                      Card Paid (5% GST)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-[10px]">
                        Rs.
                      </span>
                      <input
                        type="number"
                        value={splitCardAmount || ''}
                        onChange={(e) => setSplitCardAmount(parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg pl-8 pr-2 py-2 text-xs font-mono font-bold focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <span className="text-[9px] text-sky-400 block font-mono">
                      Tax: Rs. {Math.round((splitCardAmount * 5) / 100)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Coupon Code Input */}
          <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Promo Code / Coupon
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Code (e.g. BUZZ15)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 text-white rounded-xl px-3 py-2 text-xs font-mono uppercase"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-buzz-yellow font-bold text-xs"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* 3. Fixed Calculations & Checkout Footer (Fixed Bottom) */}
        <div className="p-4 bg-zinc-950/90 border-t border-zinc-800 space-y-3 flex-shrink-0">
          <div className="space-y-1.5 text-zinc-400 text-xs">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white">Rs. {Math.round(subtotal).toLocaleString()}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span>-Rs. {Math.round(discountAmount).toLocaleString()}</span>
              </div>
            )}

            {/* GST Tax Display on Screen - Always displays standard Sales Tax as requested */}
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1">
                <span>Sales Tax</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 text-buzz-yellow font-mono border border-zinc-800">
                  {taxLabel}
                </span>
              </span>
              <span className="text-white font-bold">
                Rs. {Math.round(calculatedGst).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between font-black text-base text-white font-display pt-1 border-t border-zinc-800">
              <span>TOTAL</span>
              <span className="text-buzz-yellow">Rs. {Math.round(posScreenGrandTotal).toLocaleString()}</span>
            </div>
          </div>

          {/* Action Checkout CTAs */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setPosCart([])}
              className="py-3 px-3 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
            >
              <XCircle className="w-4 h-4" /> Cancel
            </button>

            <button
              onClick={handleCompleteOrder}
              disabled={posCart.length === 0}
              className="py-3 px-3 rounded-xl bg-buzz-yellow hover:bg-buzz-yellow-light text-buzz-black font-black text-xs shadow-buzz-glow flex items-center justify-center gap-1 disabled:opacity-50 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" /> COMPLETE ORDER
            </button>
          </div>
        </div>
      </div>

      {/* FBR Hotkey Trigger Pop-up Modal */}
      {fbrModalStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-zinc-950 border border-zinc-800">
              {fbrModalStatus === 'ENABLED' ? (
                <ShieldCheck className="w-10 h-10 text-emerald-400 animate-pulse" />
              ) : (
                <ShieldAlert className="w-10 h-10 text-red-400 animate-bounce" />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black font-display text-white">
                {fbrModalStatus === 'ENABLED'
                  ? 'FBR Live Integration ENABLED'
                  : 'FBR Integration STOPPED'}
              </h3>
              <p className="text-xs text-zinc-400">
                {fbrModalStatus === 'ENABLED'
                  ? 'GST Tax calculation and real-time FBR report transmission are now ACTIVE. (Triggered via Ctrl+F)'
                  : 'FBR reporting is stopped and GST is set to 0% Tax Exempt. (Triggered via Ctrl+S)'}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-left text-xs font-mono space-y-1 text-zinc-300">
              <div className="flex justify-between">
                <span>FBR License Status:</span>
                <span className={fbrModalStatus === 'ENABLED' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {fbrModalStatus === 'ENABLED' ? 'ONLINE (ACTIVE)' : 'OFFLINE (DISABLED)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>FBR POS ID:</span>
                <span>FBR-PK-9821-POS1</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Mode:</span>
                <span>{fbrModalStatus === 'ENABLED' ? '16% Cash / 5% Card' : '0% Exempt (No Tax)'}</span>
              </div>
            </div>

            <button
              onClick={() => setFbrModalStatus(null)}
              className="w-full py-3 rounded-xl bg-buzz-yellow text-buzz-black font-black text-xs shadow-buzz-glow"
            >
              Got it (Press Enter or Click)
            </button>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      <ReceiptModal
        order={createdOrderForReceipt}
        isOpen={receiptOpen}
        onClose={() => setReceiptOpen(false)}
      />
    </div>
  );
};
