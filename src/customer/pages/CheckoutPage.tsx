import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, ShoppingBag, CreditCard, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';
import { OrderType, PaymentMethod } from '../../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const cart = useBuzzStore((state) => state.cart);
  const appliedCoupon = useBuzzStore((state) => state.appliedCoupon);
  const storeSettings = useBuzzStore((state) => state.storeSettings);
  const createOrder = useBuzzStore((state) => state.createOrder);

  // Form states
  const [customerName, setCustomerName] = useState('Bilal Ahmed');
  const [phone, setPhone] = useState('+92 300 9234567');
  const [email, setEmail] = useState('bilal.ahmed@gmail.com');
  const [address, setAddress] = useState('Plot 45-C, Khayaban-e-Seher, DHA Phase 6');
  const [city, setCity] = useState('Karachi');
  const [tableNumber, setTableNumber] = useState('Table 04');
  const [notes, setNotes] = useState('Extra garlic mayo and extra napkins please!');

  const [orderType, setOrderType] = useState<OrderType>('Delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.min((subtotal * appliedCoupon.amount) / 100, appliedCoupon.maxDiscount);
    } else {
      discount = appliedCoupon.amount;
    }
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = (taxableAmount * storeSettings.taxRate) / 100;
  const deliveryFee = orderType === 'Delivery' ? storeSettings.deliveryFee : 0;
  const grandTotal = taxableAmount + tax + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !phone) return;

    const placedOrder = createOrder({
      customerName,
      phone,
      email,
      address: orderType === 'Dine-in' ? `Table ${tableNumber}` : address,
      city,
      orderType,
      tableNumber: orderType === 'Dine-in' ? tableNumber : undefined,
      status: 'Received',
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash' ? 'Pending' : 'Paid',
      items: cart,
      subtotal,
      tax,
      deliveryFee,
      discount,
      couponCode: appliedCoupon?.code,
      total: grandTotal,
      notes
    });

    navigate(`/tracking?id=${placedOrder.orderNumber}`);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-36 text-white text-center">
        <p>Your cart is empty.</p>
        <Link to="/menu" className="text-buzz-yellow underline mt-4 inline-block">
          Go to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 text-white bg-buzz-black space-y-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/cart"
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
            CHECKOUT <span className="text-buzz-yellow">DETAILS</span>
          </h1>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Delivery & Payment Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Order Type Selector */}
            <div className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-buzz-yellow" /> Select Order Type
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {(['Delivery', 'Pickup', 'Dine-in'] as OrderType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setOrderType(type)}
                    className={`p-4 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1 ${
                      orderType === type
                        ? 'bg-buzz-yellow text-buzz-black border-buzz-yellow shadow-buzz-glow font-black'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <span>{type}</span>
                    <span className="text-[10px] opacity-75">
                      {type === 'Delivery'
                        ? `$${storeSettings.deliveryFee.toFixed(2)} Fee`
                        : type === 'Pickup'
                        ? 'Self Pick'
                        : 'At Table'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Details Form */}
            <div className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                Customer Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-buzz-yellow"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-buzz-yellow"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-semibold">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-buzz-yellow"
                />
              </div>

              {orderType === 'Delivery' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs text-zinc-400 font-semibold">Delivery Address *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-buzz-yellow"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400 font-semibold">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-buzz-yellow"
                    />
                  </div>
                </div>
              )}

              {orderType === 'Dine-in' && (
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Table Number</label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-buzz-yellow"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-semibold">Special Instructions</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-buzz-yellow"
                  placeholder="Gate code, landmark, extra napkins..."
                />
              </div>
            </div>

            {/* Payment Options */}
            <div className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-buzz-yellow" /> Payment Method (Demo)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'Cash', label: 'Cash on Delivery', desc: 'Pay cash upon arrival' },
                  { id: 'PayFast', label: 'PayFast Demo', desc: 'Secure local gateway' },
                  { id: 'Card', label: 'Demo Credit Card', desc: 'Instant demo check' }
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                    className={`p-4 rounded-2xl border text-xs text-left transition-all space-y-1 ${
                      paymentMethod === pm.id
                        ? 'bg-buzz-yellow/15 border-buzz-yellow text-white shadow-buzz-glow'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="font-bold text-white block">{pm.label}</span>
                    <span className="text-[10px] text-zinc-400 block">{pm.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Confirmation Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
              <h3 className="text-lg font-bold font-display text-white">Order Summary</h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-white">
                        {item.quantity}x {item.name}
                      </span>
                      {item.customization && (
                        <span className="block text-[10px] text-buzz-yellow">
                          {item.customization.size || 'Standard'}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-zinc-300 font-bold">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-zinc-300 pt-4 border-t border-zinc-800">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {Math.round(subtotal).toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-buzz-yellow font-semibold">
                    <span>Discount</span>
                    <span>-Rs. {Math.round(discount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Sales Tax ({storeSettings.taxRate}%)</span>
                  <span>Rs. {Math.round(tax).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>Rs. {Math.round(deliveryFee).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-black text-lg text-white font-display pt-2 border-t border-zinc-800">
                  <span>Total</span>
                  <span className="text-buzz-yellow">Rs. {Math.round(grandTotal).toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-buzz-yellow hover:bg-buzz-yellow-light text-buzz-black font-black text-sm tracking-wider shadow-buzz-glow flex items-center justify-center gap-2 transition-all mt-4"
              >
                <CheckCircle2 className="w-5 h-5" /> CONFIRM & PLACE ORDER
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
