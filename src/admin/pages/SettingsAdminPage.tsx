import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

export const SettingsAdminPage: React.FC = () => {
  const storeSettings = useBuzzStore((state) => state.storeSettings);
  const updateStoreSettings = useBuzzStore((state) => state.updateStoreSettings);

  const [restaurantName, setRestaurantName] = useState(storeSettings.restaurantName);
  const [phone, setPhone] = useState(storeSettings.phone);
  const [email, setEmail] = useState(storeSettings.email);
  const [address, setAddress] = useState(storeSettings.address);
  const [taxRate, setTaxRate] = useState(storeSettings.taxRate);
  const [deliveryFee, setDeliveryFee] = useState(storeSettings.deliveryFee);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({
      restaurantName,
      phone,
      email,
      address,
      taxRate,
      deliveryFee
    });
  };

  return (
    <div className="space-y-6 text-white max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
          RESTAURANT <span className="text-buzz-yellow">SETTINGS</span>
        </h1>
        <p className="text-xs text-zinc-400">
          Configure restaurant profile, tax percentage, and delivery parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold">Restaurant Brand Name</label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold">Physical Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-900 pt-4">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold">Sales Tax Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold">Standard Delivery Fee ($)</label>
            <input
              type="number"
              step="0.01"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(parseFloat(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-buzz-yellow text-buzz-black font-black text-xs shadow-buzz-glow flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> SAVE SETTINGS
        </button>
      </form>
    </div>
  );
};
