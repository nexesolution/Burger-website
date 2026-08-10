import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Check, ArrowLeft } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const cart = useBuzzStore((state) => state.cart);
  const appliedCoupon = useBuzzStore((state) => state.appliedCoupon);
  const storeSettings = useBuzzStore((state) => state.storeSettings);
  const removeFromCart = useBuzzStore((state) => state.removeFromCart);
  const updateCartQuantity = useBuzzStore((state) => state.updateCartQuantity);
  const applyCoupon = useBuzzStore((state) => state.applyCoupon);
  const removeCoupon = useBuzzStore((state) => state.removeCoupon);

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');

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
  const deliveryFee = subtotal > 0 ? storeSettings.deliveryFee : 0;
  const grandTotal = taxableAmount + tax + deliveryFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCodeInput.trim()) return;

    const res = applyCoupon(couponCodeInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCodeInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-36 pb-24 text-white bg-buzz-black flex flex-col items-center justify-center text-center px-4">
        <div className="p-6 rounded-full glass-panel border border-zinc-800 text-buzz-yellow mb-6">
          <ShoppingBag className="w-16 h-16" />
        </div>
        <h1 className="text-3xl font-black font-display tracking-tight">YOUR CART IS EMPTY</h1>
        <p className="text-sm text-zinc-400 max-w-sm mt-2 mb-8">
          Looks like you haven't added any burgers or sides to your order yet.
        </p>
        <Link
          to="/menu"
          className="px-8 py-4 rounded-2xl bg-buzz-yellow text-buzz-black font-extrabold text-xs tracking-wider shadow-buzz-glow hover:scale-105 transition-all flex items-center gap-2"
        >
          EXPLORE MENU NOW <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 text-white bg-buzz-black space-y-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/menu"
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
            YOUR <span className="text-buzz-yellow">CART</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-6 rounded-3xl glass-card border border-zinc-800 flex flex-col sm:flex-row items-center gap-4 justify-between"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-zinc-900 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold font-display text-white">
                      {item.name}
                    </h3>
                    {item.customization && (
                      <div className="text-[11px] text-buzz-yellow font-medium">
                        {item.customization.size && `Size: ${item.customization.size} `}
                        {item.customization.extraCheese && `+Extra Cheese `}
                        {item.customization.sauce && `Sauce: ${item.customization.sauce}`}
                      </div>
                    )}
                    <span className="text-sm font-black text-white font-display">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-4 sm:pt-0 border-t sm:border-0 border-zinc-900">
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-sm text-white w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black font-display text-buzz-yellow block">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-medium mt-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="lg:col-span-4 space-y-6">
            {/* Promo Coupon Applicator */}
            <div className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-buzz-yellow" /> Apply Promo Code
              </h3>

              {appliedCoupon ? (
                <div className="p-3.5 rounded-2xl bg-buzz-yellow/10 border border-buzz-yellow/40 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-buzz-yellow uppercase block">{appliedCoupon.code}</span>
                    <span className="text-[10px] text-zinc-300">
                      {appliedCoupon.discountType === 'percentage'
                        ? `${appliedCoupon.amount}% Discount`
                        : `Rs. ${appliedCoupon.amount} Off`}
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-zinc-400 hover:text-white underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. BUZZ10, WELCOME20"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-buzz-yellow uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-buzz-yellow text-buzz-black font-extrabold text-xs shadow-buzz-glow hover:bg-buzz-yellow-light transition-all"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-400 font-medium">{couponError}</p>}
                </form>
              )}

              <div className="text-[11px] text-zinc-400 space-y-1 pt-2 border-t border-zinc-900">
                <p>Available Demo Codes:</p>
                <div className="flex flex-wrap gap-1 font-mono font-bold text-buzz-yellow">
                  <span className="px-1.5 py-0.5 bg-zinc-900 rounded border border-zinc-800">BUZZ10</span>
                  <span className="px-1.5 py-0.5 bg-zinc-900 rounded border border-zinc-800">WELCOME20</span>
                  <span className="px-1.5 py-0.5 bg-zinc-900 rounded border border-zinc-800">FRIDAY15</span>
                </div>
              </div>
            </div>

            {/* Order Cost Breakdown */}
            <div className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
              <h3 className="text-lg font-bold font-display text-white">Order Summary</h3>

              <div className="space-y-2.5 text-xs text-zinc-300 border-b border-zinc-800 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {Math.round(subtotal).toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-buzz-yellow font-semibold">
                    <span>Discount ({appliedCoupon?.code})</span>
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
              </div>

              <div className="flex justify-between font-black text-xl text-white font-display pt-2">
                <span>Grand Total</span>
                <span className="text-buzz-yellow">Rs. {Math.round(grandTotal).toLocaleString()}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 rounded-2xl bg-buzz-yellow hover:bg-buzz-yellow-light text-buzz-black font-extrabold text-sm tracking-wider shadow-buzz-glow flex items-center justify-center gap-2 transition-all mt-4"
              >
                PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
