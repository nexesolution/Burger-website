import React from 'react';
import { Users, Star } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

export const CustomersAdminPage: React.FC = () => {
  const customers = useBuzzStore((state) => state.customers);

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
          CUSTOMER <span className="text-buzz-yellow">CRM DIRECTORY</span>
        </h1>
        <p className="text-xs text-zinc-400">
          Customer purchasing history, lifetime spend & loyalty point balances.
        </p>
      </div>

      <div className="p-6 rounded-3xl glass-panel border border-zinc-800 overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="text-[10px] font-bold text-zinc-400 uppercase border-b border-zinc-800 pb-2">
            <tr>
              <th className="pb-3">Customer Name</th>
              <th className="pb-3">Contact</th>
              <th className="pb-3">Total Orders</th>
              <th className="pb-3">Lifetime Spent</th>
              <th className="pb-3">Loyalty Points</th>
              <th className="pb-3">Last Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-900/50">
                <td className="py-3 font-bold text-white">{c.name}</td>
                <td className="py-3 text-zinc-400">
                  <span>{c.email}</span>
                  <span className="block text-[10px] font-mono">{c.phone}</span>
                </td>
                <td className="py-3 font-bold text-white">{c.totalOrders} orders</td>
                <td className="py-3 font-black text-buzz-yellow font-display">
                  Rs. {Math.round(c.totalSpent).toLocaleString()}
                </td>
                <td className="py-3 font-bold text-emerald-400">{c.loyaltyPoints} PTS</td>
                <td className="py-3 text-zinc-500">{c.lastOrderDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
