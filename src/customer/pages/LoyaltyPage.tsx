import React from 'react';
import { Award, Star, Zap, Gift, ShieldCheck, Sparkles } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

export const LoyaltyPage: React.FC = () => {
  const loyaltyAccounts = useBuzzStore((state) => state.loyaltyAccounts);
  const sampleAccount = loyaltyAccounts[0];

  return (
    <div className="min-h-screen pt-32 pb-24 text-white bg-buzz-black space-y-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full glass-yellow text-buzz-yellow text-xs font-black uppercase tracking-widest">
          <Award className="w-4 h-4" /> BUZZ VIP Rewards
        </span>
        <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight">
          EARN AS YOU <span className="text-buzz-yellow">CRAVE</span>
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Earn 1 Buzz Point for every $1 spent. Unlock exclusive discounts, free freakshakes, and priority delivery.
        </p>
      </div>

      {/* Account Overview Card */}
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="p-8 rounded-3xl glass-panel border border-buzz-yellow/30 shadow-buzz-glow space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Welcome back
              </span>
              <h2 className="text-2xl font-black font-display text-white mt-1">
                {sampleAccount ? sampleAccount.customerName : 'Alexander Wright'}
              </h2>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-buzz-yellow text-buzz-black font-black text-sm uppercase tracking-wider shadow-buzz-glow">
              {sampleAccount ? sampleAccount.tier : 'Gold Tier'} Member
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
              <span className="text-xs text-zinc-400 uppercase font-bold">Total Points</span>
              <span className="block text-3xl font-black font-display text-buzz-yellow">
                {sampleAccount ? sampleAccount.points : 482} PTS
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
              <span className="text-xs text-zinc-400 uppercase font-bold">Reward Multiplier</span>
              <span className="block text-3xl font-black font-display text-white">1.5x</span>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
              <span className="text-xs text-zinc-400 uppercase font-bold">Next Tier Upgrade</span>
              <span className="block text-3xl font-black font-display text-emerald-400">18 PTS Left</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Tiers Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <h2 className="text-2xl font-bold font-display text-white text-center">REWARD TIERS</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              tier: 'Silver',
              points: '0 - 250 PTS',
              benefits: ['1x Point per $1 spent', 'Birthday Shake Gift', 'Member App Access']
            },
            {
              tier: 'Gold',
              points: '251 - 750 PTS',
              benefits: ['1.5x Points per $1 spent', 'Free Secret Sauce Addons', 'Priority Kitchen Queue']
            },
            {
              tier: 'VIP Champion',
              points: '751+ PTS',
              benefits: ['2x Points per $1 spent', 'Free Delivery Forever', 'Exclusive Chef Tasting Invites']
            }
          ].map((t, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl glass-card border space-y-4 ${
                t.tier.includes('Gold') ? 'border-buzz-yellow shadow-buzz-glow' : 'border-zinc-800'
              }`}
            >
              <h3 className="text-xl font-black font-display text-white">{t.tier}</h3>
              <span className="text-xs font-bold text-buzz-yellow block">{t.points}</span>
              <ul className="space-y-2 text-xs text-zinc-300">
                {t.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-buzz-yellow" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
