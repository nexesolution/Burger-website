import React, { useState } from 'react';
import { Settings, Save, Database, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';
import {
  getSupabaseCredentials,
  setSupabaseCredentials,
  isSupabaseConfigured,
  initSupabaseSync
} from '../../services/supabaseSync';

export const SettingsAdminPage: React.FC = () => {
  const storeSettings = useBuzzStore((state) => state.storeSettings);
  const updateStoreSettings = useBuzzStore((state) => state.updateStoreSettings);
  const showToast = useBuzzStore((state) => state.showToast);

  const initialCreds = getSupabaseCredentials();

  const [restaurantName, setRestaurantName] = useState(storeSettings.restaurantName);
  const [phone, setPhone] = useState(storeSettings.phone);
  const [email, setEmail] = useState(storeSettings.email);
  const [address, setAddress] = useState(storeSettings.address);
  const [taxRate, setTaxRate] = useState(storeSettings.taxRate);
  const [deliveryFee, setDeliveryFee] = useState(storeSettings.deliveryFee);

  const [supabaseUrl, setSupabaseUrl] = useState(initialCreds.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(initialCreds.key);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Save Supabase Cloud credentials if entered
    if (supabaseUrl.trim() && supabaseAnonKey.trim()) {
      setSupabaseCredentials(supabaseUrl.trim(), supabaseAnonKey.trim());
    }

    // 2. Update Store Settings (triggers saveSettingsToSupabase)
    updateStoreSettings({
      restaurantName,
      phone,
      email,
      address,
      taxRate,
      deliveryFee
    });

    // 3. Initialize / refresh sync
    if (isSupabaseConfigured()) {
      await initSupabaseSync();
    }
  };

  return (
    <div className="space-y-6 text-white max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
          RESTAURANT <span className="text-buzz-yellow">SETTINGS & SUPABASE CLOUD</span>
        </h1>
        <p className="text-xs text-zinc-400">
          Configure restaurant profile, physical address, tax rates, and live Supabase Cloud database connection.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Supabase Cloud Connection Card */}
        <div className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-buzz-yellow" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Supabase Cloud Database Connection
              </h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                isSupabaseConfigured()
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              {isSupabaseConfigured() ? 'SUPABASE CONNECTED' : 'ENTER CREDENTIALS'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-semibold">Supabase Project URL</label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzpdq.supabase.co"
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs font-mono focus:border-buzz-yellow focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-semibold">Supabase Anon Key</label>
              <input
                type="password"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs font-mono focus:border-buzz-yellow focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Restaurant Profile Settings */}
        <div className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-semibold">Restaurant Brand Name</label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:border-buzz-yellow focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-semibold">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:border-buzz-yellow focus:outline-none"
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
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:border-buzz-yellow focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-semibold">Physical Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:border-buzz-yellow focus:outline-none"
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
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:border-buzz-yellow focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-semibold">Standard Delivery Fee (Rs.)</label>
              <input
                type="number"
                step="1"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(parseFloat(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:border-buzz-yellow focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-buzz-yellow text-buzz-black font-black text-xs shadow-buzz-glow flex items-center gap-2 hover:bg-yellow-400 transition-colors"
          >
            <Save className="w-4 h-4" /> SAVE SETTINGS TO SUPABASE
          </button>
        </div>
      </form>
    </div>
  );
};
