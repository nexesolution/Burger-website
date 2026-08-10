import React from 'react';
import { Gift, Flame, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

export const DealsPage: React.FC = () => {
  const deals = useBuzzStore((state) => state.deals);
  const coupons = useBuzzStore((state) => state.coupons);
  const addToCart = useBuzzStore((state) => state.addToCart);
  const products = useBuzzStore((state) => state.products);

  return (
    <div className="min-h-screen pt-32 pb-24 text-white bg-buzz-black space-y-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full glass-yellow text-buzz-yellow text-xs font-black uppercase tracking-widest">
          <Gift className="w-4 h-4" /> Exclusive Offers & Combos
        </span>
        <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight">
          BUZZ OFFERS & <span className="text-buzz-yellow">DEALS</span>
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Save big on combo boxes, family feasts, student bundles, and active discount promo codes.
        </p>
      </div>

      {/* Featured Deals Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <h2 className="text-2xl font-bold font-display text-white border-l-4 border-buzz-yellow pl-4">
          COMBO PACKAGES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="p-6 rounded-3xl glass-card border border-zinc-800 hover:border-buzz-yellow/40 transition-all flex flex-col justify-between space-y-6 shadow-xl"
            >
              <div className="space-y-4">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-48 rounded-2xl object-cover bg-zinc-900"
                />
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-buzz-yellow text-buzz-black text-[10px] font-black uppercase">
                    {deal.badge || 'SPECIAL'}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-buzz-yellow font-display">
                      Rs. {deal.price.toLocaleString()}
                    </span>
                    <span className="block text-xs text-zinc-500 line-through">
                      Rs. {deal.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-black font-display text-white">{deal.title}</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">{deal.description}</p>
              </div>

              <button
                onClick={() => {
                  // Add first product from deal to cart
                  const match = products.find((p) => deal.productIds.includes(p.id)) || products[0];
                  addToCart(match);
                }}
                className="w-full py-3.5 rounded-xl bg-buzz-yellow hover:bg-buzz-yellow-light text-buzz-black font-extrabold text-xs tracking-wider shadow-buzz-glow flex items-center justify-center gap-2 transition-all"
              >
                <Flame className="w-4 h-4" /> CLAIM DEAL NOW
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Coupons Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <h2 className="text-2xl font-bold font-display text-white border-l-4 border-buzz-yellow pl-4">
          ACTIVE PROMO CODES
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coupons.map((cp) => (
            <div
              key={cp.id}
              className="p-5 rounded-2xl glass-panel border border-buzz-yellow/30 space-y-3 shadow-buzz-glow"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-lg text-buzz-yellow tracking-wider">
                  {cp.code}
                </span>
                <Tag className="w-4 h-4 text-buzz-yellow" />
              </div>
              <p className="text-xs text-zinc-300 font-medium">
                {cp.discountType === 'percentage'
                  ? `Get ${cp.amount}% Off your order`
                  : `Flat Rs. ${cp.amount} Discount`}
              </p>
              <p className="text-[10px] text-zinc-500">Min Order: Rs. {cp.minOrder.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
