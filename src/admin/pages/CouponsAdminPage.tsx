import React, { useState } from 'react';
import { Plus, Tag, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

export const CouponsAdminPage: React.FC = () => {
  const coupons = useBuzzStore((state) => state.coupons);
  const addCoupon = useBuzzStore((state) => state.addCoupon);
  const updateCoupon = useBuzzStore((state) => state.updateCoupon);
  const deleteCoupon = useBuzzStore((state) => state.deleteCoupon);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [amount, setAmount] = useState(10);
  const [minOrder, setMinOrder] = useState(20);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon({
      code: code.toUpperCase(),
      discountType: 'percentage',
      amount,
      minOrder,
      maxDiscount: 20,
      usageLimit: 500,
      expiration: '2026-12-31',
      isActive: true
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            COUPON <span className="text-buzz-yellow">MANAGEMENT</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Create discount promo codes. Validated in real-time at customer checkout.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-buzz-yellow text-buzz-black font-extrabold text-xs shadow-buzz-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> CREATE PROMO CODE
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {coupons.map((cp) => (
          <div key={cp.id} className="p-5 rounded-3xl glass-card border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-lg text-buzz-yellow">{cp.code}</span>
              <button
                onClick={() => updateCoupon(cp.id, { isActive: !cp.isActive })}
                className="text-buzz-yellow"
              >
                {cp.isActive ? (
                  <ToggleRight className="w-6 h-6" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-zinc-600" />
                )}
              </button>
            </div>
            <p className="text-xs text-zinc-300">
              {cp.discountType === 'percentage' ? `${cp.amount}% Discount` : `Rs. ${cp.amount} Flat Off`}
            </p>
            <div className="text-[10px] text-zinc-500 space-y-0.5">
              <p>Min Order: Rs. {cp.minOrder.toLocaleString()}</p>
              <p>Times Used: {cp.timesUsed} times</p>
            </div>
            <button
              onClick={() => deleteCoupon(cp.id)}
              className="w-full py-2 rounded-xl bg-zinc-900 text-red-400 hover:text-red-300 text-xs font-bold pt-2 border-t border-zinc-900 flex items-center justify-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove Code
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold font-display text-white">Create Promo Code</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs font-mono uppercase"
                  placeholder="e.g. BUZZ15"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Discount Amount (%)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Min Order (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={minOrder}
                    onChange={(e) => setMinOrder(parseFloat(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-zinc-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-buzz-yellow text-buzz-black font-black text-xs shadow-buzz-glow"
                >
                  Save Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
