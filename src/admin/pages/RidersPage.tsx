import React, { useState } from 'react';
import { Plus, Bike, Star, ToggleLeft, ToggleRight } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

export const RidersPage: React.FC = () => {
  const riders = useBuzzStore((state) => state.riders);
  const addRider = useBuzzStore((state) => state.addRider);
  const updateRider = useBuzzStore((state) => state.updateRider);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicle, setVehicle] = useState('Motorcycle');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addRider({
      name,
      phone,
      vehicle,
      status: 'Available',
      currentOrders: 0,
      rating: 5.0
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            DELIVERY <span className="text-buzz-yellow">RIDERS</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Rider fleet status, active delivery tracking & ratings.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-buzz-yellow text-buzz-black font-extrabold text-xs shadow-buzz-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> REGISTER NEW RIDER
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {riders.map((r) => (
          <div key={r.id} className="p-6 rounded-3xl glass-card border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-buzz-yellow/10 text-buzz-yellow">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display text-white">{r.name}</h3>
                  <span className="text-[10px] text-zinc-400">{r.vehicle}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-zinc-900 text-buzz-yellow border border-zinc-800">
                {r.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs border-t border-zinc-900 pt-3">
              <div>
                <span className="text-[10px] text-zinc-400 block">Phone</span>
                <span className="font-mono text-zinc-200">{r.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">Rating</span>
                <span className="text-buzz-yellow font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-buzz-yellow" /> {r.rating}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold font-display text-white">Register Delivery Rider</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Rider Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Vehicle Type</label>
                <input
                  type="text"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
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
                  Register Rider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
