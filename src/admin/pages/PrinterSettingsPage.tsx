import React, { useState } from 'react';
import { Printer, Save, Check } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

export const PrinterSettingsPage: React.FC = () => {
  const printerConfig = useBuzzStore((state) => state.printerConfig);
  const updatePrinterConfig = useBuzzStore((state) => state.updatePrinterConfig);
  const showToast = useBuzzStore((state) => state.showToast);

  const [printerName, setPrinterName] = useState(printerConfig.printerName);
  const [printerType, setPrinterType] = useState(printerConfig.printerType);
  const [ipAddress, setIpAddress] = useState(printerConfig.ipAddress);
  const [receiptWidth, setReceiptWidth] = useState(printerConfig.receiptWidth);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePrinterConfig({
      printerName,
      printerType: printerType as any,
      ipAddress,
      receiptWidth: receiptWidth as any
    });
  };

  const handleTestPrint = () => {
    showToast('Executing thermal printer test output preview...');
    window.print();
  };

  return (
    <div className="space-y-6 text-white max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
          THERMAL PRINTER <span className="text-buzz-yellow">CONFIG</span>
        </h1>
        <p className="text-xs text-zinc-400">
          Configure receipt printer IP, width templates, and test physical printing.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold">Printer Name</label>
            <input
              type="text"
              value={printerName}
              onChange={(e) => setPrinterName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold">Connection Type</label>
            <select
              value={printerType}
              onChange={(e) => setPrinterType(e.target.value as any)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs"
            >
              <option value="Thermal POS">Thermal POS (USB / LAN)</option>
              <option value="Network">Network IP Printer</option>
              <option value="USB">Direct USB Serial</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold">IP Address</label>
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold">Receipt Width</label>
            <select
              value={receiptWidth}
              onChange={(e) => setReceiptWidth(e.target.value as any)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs"
            >
              <option value="80mm">80mm Standard Thermal</option>
              <option value="58mm">58mm Compact Receipt</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-buzz-yellow text-buzz-black font-black text-xs shadow-buzz-glow flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> SAVE PRINTER CONFIG
          </button>

          <button
            type="button"
            onClick={handleTestPrint}
            className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:border-buzz-yellow font-bold text-xs flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-buzz-yellow" /> TEST PRINT RECEIPT
          </button>
        </div>
      </form>
    </div>
  );
};
