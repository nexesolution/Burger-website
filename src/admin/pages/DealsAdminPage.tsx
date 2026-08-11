import React, { useState } from 'react';
import { Plus, Gift, Trash2 } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

export const DealsAdminPage: React.FC = () => {
  const deals = useBuzzStore((state) => state.deals);
  const addDeal = useBuzzStore((state) => state.addDeal);
  const deleteDeal = useBuzzStore((state) => state.deleteDeal);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(24.99);
  const [originalPrice, setOriginalPrice] = useState(32.99);
  const [badge, setBadge] = useState('SAVE 25%');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addDeal({
      title,
      description,
      price,
      originalPrice,
      productIds: ['prod-1', 'prod-9'],
      image: 'https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      badge
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            DEALS & <span className="text-buzz-yellow">BUNDLES</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Create multi-product combo packages. Instantly updates customer website deals section.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-buzz-yellow text-buzz-black font-extrabold text-xs shadow-buzz-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> CREATE DEAL BUNDLE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="p-5 rounded-3xl glass-card border border-zinc-800 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-40 rounded-2xl object-cover"
              />
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-buzz-yellow text-buzz-black text-[10px] font-black uppercase">
                  {deal.badge || 'COMBO'}
                </span>
                <span className="text-xl font-black font-display text-buzz-yellow">
                  Rs. {deal.price.toLocaleString()}
                </span>
              </div>
              <h3 className="text-lg font-bold font-display text-white">{deal.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{deal.description}</p>
            </div>

            <button
              onClick={() => deleteDeal(deal.id)}
              className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-red-950/40 text-red-400 text-xs font-bold flex items-center justify-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove Deal
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold font-display text-white">Create Combo Deal</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Deal Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Deal Price (Rs.)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Original Value (Rs.)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(parseFloat(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                />
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
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
