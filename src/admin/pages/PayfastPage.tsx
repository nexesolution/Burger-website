import React, { useState } from 'react';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

export const PayfastPage: React.FC = () => {
  const payfastConfig = useBuzzStore((state) => state.payfastConfig);
  const updatePayFastConfig = useBuzzStore((state) => state.updatePayFastConfig);
  const showToast = useBuzzStore((state) => state.showToast);

  const [merchantId, setMerchantId] = useState(payfastConfig.merchantId);
  const [merchantKey, setMerchantKey] = useState(payfastConfig.merchantKey);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePayFastConfig({ merchantId, merchantKey });
  };

  const handleTestPayment = () => {
    showToast('Testing PayFast Gateway Callback... Sandbox Transaction Approved!');
  };

  return (
    <div className="space-y-6 text-white max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
          PAYFAST <span className="text-buzz-yellow">PAYMENTS DEMO</span>
        </h1>
        <p className="text-xs text-zinc-400">
          Demo interface for online PayFast card & wallet payment gateway integration.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300">
              PayFast Status: {payfastConfig.isConnected ? 'Active (Sandbox)' : 'Inactive'}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-zinc-400 font-mono">
            {payfastConfig.environment} Mode
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold">Merchant ID</label>
            <input
              type="text"
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold">Merchant Key</label>
            <input
              type="password"
              value={merchantKey}
              onChange={(e) => setMerchantKey(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs font-mono"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-buzz-yellow text-buzz-black font-black text-xs shadow-buzz-glow"
          >
            SAVE PAYFAST CONFIG
          </button>

          <button
            type="button"
            onClick={handleTestPayment}
            className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:border-buzz-yellow font-bold text-xs"
          >
            TEST PAYMENT
          </button>
        </div>
      </form>
    </div>
  );
};
