import React from 'react';
import { Percent, Trash2, Plus } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

export const DiscountedItemsPage: React.FC = () => {
  const discountedItems = useBuzzStore((state) => state.discountedItems);
  const deleteDiscountItem = useBuzzStore((state) => state.deleteDiscountItem);

  return (
    <div className="space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            DISCOUNTED <span className="text-buzz-yellow">ITEMS</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Active percentage discounts on products. Synchronized across store & menu.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-3xl glass-panel border border-zinc-800 overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="text-[10px] font-bold text-zinc-400 uppercase border-b border-zinc-800 pb-2">
            <tr>
              <th className="pb-3">Product Name</th>
              <th className="pb-3">Original Price</th>
              <th className="pb-3">Discount %</th>
              <th className="pb-3">Offer Price</th>
              <th className="pb-3">Validity</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {discountedItems.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-900/50">
                <td className="py-3 font-bold text-white">{item.productName}</td>
                <td className="py-3 text-zinc-500 line-through">Rs. {item.originalPrice.toLocaleString()}</td>
                <td className="py-3 font-bold text-buzz-yellow">{item.discountPercentage}% OFF</td>
                <td className="py-3 font-black text-emerald-400">Rs. {item.discountedPrice.toLocaleString()}</td>
                <td className="py-3 text-zinc-400">
                  {item.startDate} to {item.endDate}
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => deleteDiscountItem(item.id)}
                    className="p-1.5 rounded-lg bg-zinc-900 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
