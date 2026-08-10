import React from 'react';
import { Award, Star } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

export const LoyaltyAdminPage: React.FC = () => {
  const loyaltyAccounts = useBuzzStore((state) => state.loyaltyAccounts);

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
          LOYALTY & <span className="text-buzz-yellow">REWARDS</span>
        </h1>
        <p className="text-xs text-zinc-400">
          Customer points ledger, tier upgrades & reward redemptions.
        </p>
      </div>

      <div className="p-6 rounded-3xl glass-panel border border-zinc-800 overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="text-[10px] font-bold text-zinc-400 uppercase border-b border-zinc-800 pb-2">
            <tr>
              <th className="pb-3">Customer Name</th>
              <th className="pb-3">Points Balance</th>
              <th className="pb-3">Tier Status</th>
              <th className="pb-3">Earned History</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {loyaltyAccounts.map((acc) => (
              <tr key={acc.customerId} className="hover:bg-zinc-900/50">
                <td className="py-3 font-bold text-white">{acc.customerName}</td>
                <td className="py-3 font-black text-buzz-yellow font-display text-sm">
                  {acc.points} PTS
                </td>
                <td className="py-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-buzz-yellow/10 text-buzz-yellow border border-buzz-yellow/30 font-bold text-[10px]">
                    {acc.tier}
                  </span>
                </td>
                <td className="py-3 text-zinc-400 text-[11px]">
                  {acc.history.length} transactions recorded
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
