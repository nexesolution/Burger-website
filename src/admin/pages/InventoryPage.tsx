import React, { useState } from 'react';
import { Plus, Boxes, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

export const InventoryPage: React.FC = () => {
  const inventory = useBuzzStore((state) => state.inventory);
  const adjustStock = useBuzzStore((state) => state.adjustStock);
  const addInventoryItem = useBuzzStore((state) => state.addInventoryItem);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Meat & Poultry');
  const [currentStock, setCurrentStock] = useState(100);
  const [unit, setUnit] = useState('pcs');
  const [lowStockThreshold, setLowStockThreshold] = useState(25);
  const [unitCost, setUnitCost] = useState(1.5);
  const [supplier, setSupplier] = useState('Prime Butchery');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addInventoryItem({
      name,
      sku,
      category,
      currentStock,
      unit,
      lowStockThreshold,
      unitCost,
      supplier
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            INVENTORY <span className="text-buzz-yellow">MANAGEMENT</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Track raw ingredients, automatic stock-out on POS orders & low-stock alerts.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-buzz-yellow text-buzz-black font-extrabold text-xs shadow-buzz-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> ADD INVENTORY ITEM
        </button>
      </div>

      <div className="p-6 rounded-3xl glass-panel border border-zinc-800 overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="text-[10px] font-bold text-zinc-400 uppercase border-b border-zinc-800 pb-2">
            <tr>
              <th className="pb-3">Item & SKU</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Stock Level</th>
              <th className="pb-3">Unit Cost</th>
              <th className="pb-3">Supplier</th>
              <th className="pb-3">Last Updated</th>
              <th className="pb-3 text-right">Stock Adjust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {inventory.map((item) => {
              const isLow = item.currentStock <= item.lowStockThreshold;
              return (
                <tr key={item.id} className="hover:bg-zinc-900/50">
                  <td className="py-3">
                    <span className="font-bold text-white block">{item.name}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{item.sku}</span>
                  </td>
                  <td className="py-3 text-zinc-400">{item.category}</td>
                  <td className="py-3">
                    <span
                      className={`font-bold inline-flex items-center gap-1 ${
                        isLow ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {isLow && <AlertTriangle className="w-3.5 h-3.5" />}
                      {item.currentStock} {item.unit}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-buzz-yellow">${item.unitCost.toFixed(2)}</td>
                  <td className="py-3 text-zinc-400">{item.supplier}</td>
                  <td className="py-3 text-zinc-500">{item.lastUpdated}</td>
                  <td className="py-3 text-right space-x-1">
                    <button
                      onClick={() => adjustStock(item.id, 10)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-900 text-emerald-400 font-bold hover:bg-zinc-800"
                    >
                      +10 Stock In
                    </button>
                    <button
                      onClick={() => adjustStock(item.id, -10)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-900 text-red-400 font-bold hover:bg-zinc-800"
                    >
                      -10 Stock Out
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold font-display text-white">Add Inventory Item</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Item Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={currentStock}
                    onChange={(e) => setCurrentStock(parseInt(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Unit (pcs, kg, liters)</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                  />
                </div>
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
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
