import React, { useState } from 'react';
import { FileCheck2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

export const FbrIntegrationPage: React.FC = () => {
  const fbrConfig = useBuzzStore((state) => state.fbrConfig);
  const updateFBRConfig = useBuzzStore((state) => state.updateFBRConfig);
  const showToast = useBuzzStore((state) => state.showToast);

  const [ntn, setNtn] = useState(fbrConfig.ntn);
  const [posId, setPosId] = useState(fbrConfig.posId);
  const [apiUrl, setApiUrl] = useState(fbrConfig.apiUrl);
  const [environment, setEnvironment] = useState(fbrConfig.environment);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateFBRConfig({ ntn, posId, apiUrl, environment: environment as any });
  };

  const handleTestConnection = () => {
    showToast('Testing FBR POS API Gateway Connection... OK! Status 200');
  };

  return (
    <div className="space-y-6 text-white max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
          FBR POS <span className="text-buzz-yellow">INTEGRATION DEMO</span>
        </h1>
        <p className="text-xs text-zinc-400">
          Demo interface for FBR fiscal invoice registration and POS ID configuration.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300">
              FBR POS Status: {fbrConfig.isConnected ? 'Connected (Sandbox)' : 'Disconnected'}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-zinc-400 font-mono">
            {fbrConfig.environment} Mode
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold">FBR NTN Number</label>
            <input
              type="text"
              value={ntn}
              onChange={(e) => setNtn(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold">FBR POS ID</label>
            <input
              type="text"
              value={posId}
              onChange={(e) => setPosId(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs font-mono"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-zinc-400 font-semibold">FBR Invoice API Endpoint</label>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs font-mono"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-buzz-yellow text-buzz-black font-black text-xs shadow-buzz-glow"
          >
            SAVE CONFIG
          </button>

          <button
            type="button"
            onClick={handleTestConnection}
            className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:border-buzz-yellow font-bold text-xs"
          >
            TEST CONNECTION
          </button>
        </div>
      </form>
    </div>
  );
};
