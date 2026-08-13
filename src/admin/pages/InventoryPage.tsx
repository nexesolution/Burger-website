import React, { useState } from 'react';
import {
  Plus,
  Boxes,
  AlertTriangle,
  Search,
  Edit,
  Trash2,
  PackageCheck,
  TrendingDown,
  DollarSign,
  X,
  Check,
  Layers
} from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';
import { InventoryItem } from '../../types';

const CATEGORIES = [
  'All',
  'Meat & Poultry',
  'Bakery & Buns',
  'Dairy & Cheese',
  'Sauces & Condiments',
  'Beverages',
  'Produce & Veggies'
];

const METRIC_UNITS = ['Kg', 'Pcs', 'Liters', 'Packs', 'Cans', 'Grams'];

export const InventoryPage: React.FC = () => {
  const inventory = useBuzzStore((state) => state.inventory);
  const adjustStock = useBuzzStore((state) => state.adjustStock);
  const addInventoryItem = useBuzzStore((state) => state.addInventoryItem);
  const updateInventoryItem = useBuzzStore((state) => state.updateInventoryItem);
  const deleteInventoryItem = useBuzzStore((state) => state.deleteInventoryItem);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Meat & Poultry');
  const [currentStock, setCurrentStock] = useState<number>(50);
  const [unit, setUnit] = useState('Kg');
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(10);
  const [unitCost, setUnitCost] = useState<number>(500);
  const [supplier, setSupplier] = useState('');

  const openAddModal = () => {
    setEditingItemId(null);
    setName('');
    setSku(`RAW-${Date.now().toString().slice(-4)}`);
    setCategory('Meat & Poultry');
    setCurrentStock(50);
    setUnit('Kg');
    setLowStockThreshold(10);
    setUnitCost(500);
    setSupplier('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItemId(item.id);
    setName(item.name);
    setSku(item.sku);
    setCategory(item.category);
    setCurrentStock(item.currentStock);
    setUnit(item.unit);
    setLowStockThreshold(item.lowStockThreshold);
    setUnitCost(item.unitCost);
    setSupplier(item.supplier);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItemId) {
      updateInventoryItem(editingItemId, {
        name,
        sku,
        category,
        currentStock,
        unit,
        lowStockThreshold,
        unitCost,
        supplier
      });
    } else {
      addInventoryItem({
        name,
        sku: sku || `RAW-${Date.now().toString().slice(-4)}`,
        category,
        currentStock,
        unit,
        lowStockThreshold,
        unitCost,
        supplier: supplier || 'Local Vendor'
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, itemName: string) => {
    if (window.confirm(`Are you sure you want to delete inventory item "${itemName}"?`)) {
      deleteInventoryItem(id);
    }
  };

  // Filter Inventory
  const filteredInventory = inventory.filter((item) => {
    const matchesCat = selectedCat === 'All' || item.category.toLowerCase() === selectedCat.toLowerCase();
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Analytics Metrics
  const lowStockItems = inventory.filter((i) => i.currentStock <= i.lowStockThreshold);
  const totalInventoryValuation = inventory.reduce((sum, i) => sum + i.currentStock * i.unitCost, 0);

  return (
    <div className="space-y-6 text-white">
      {/* Top Banner Header & Primary Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            INVENTORY & <span className="text-buzz-yellow">RAW MATERIALS</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Track chicken (Kg), burger buns (Pcs), patties (Pcs) & beverages (Liters) with real-time stock-out tracking.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-buzz-yellow text-buzz-black font-extrabold text-xs shadow-buzz-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> ADD RAW MATERIAL / INGREDIENT
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl glass-card border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Total Stock Items
            </span>
            <div className="p-2 rounded-xl bg-buzz-yellow/10 text-buzz-yellow">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black font-display text-white">{inventory.length} Items</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Low Stock Alerts
            </span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-display text-red-400">
              {lowStockItems.length} Low
            </span>
            <span className="text-[11px] text-zinc-500 font-bold">Needs Re-order</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Stock Valuation
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black font-display text-emerald-400">
            Rs. {Math.round(totalInventoryValuation).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search raw material name, SKU or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-buzz-yellow"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCat === cat
                  ? 'bg-buzz-yellow text-buzz-black font-black shadow-buzz-glow'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Items Table */}
      <div className="p-6 rounded-3xl glass-panel border border-zinc-800 overflow-x-auto shadow-2xl">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="text-[10px] font-bold text-zinc-400 uppercase border-b border-zinc-800 pb-2">
            <tr>
              <th className="pb-3">Raw Material & SKU</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Current Stock</th>
              <th className="pb-3">Unit Cost (Rs.)</th>
              <th className="pb-3">Total Valuation</th>
              <th className="pb-3">Supplier</th>
              <th className="pb-3">Last Updated</th>
              <th className="pb-3 text-right">Quick Restock / Out</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {filteredInventory.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-zinc-500 font-bold">
                  No inventory items match your search filter.
                </td>
              </tr>
            ) : (
              filteredInventory.map((item) => {
                const isLow = item.currentStock <= item.lowStockThreshold;
                const valuation = item.currentStock * item.unitCost;

                return (
                  <tr key={item.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3">
                      <span className="font-bold text-white block">{item.name}</span>
                      <span className="text-[10px] font-mono text-zinc-500">{item.sku}</span>
                    </td>

                    <td className="py-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-semibold">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3">
                      <span
                        className={`font-bold font-mono px-2.5 py-1 rounded-xl text-xs flex items-center gap-1.5 w-max ${
                          isLow
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30 animate-pulse'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isLow && <AlertTriangle className="w-3.5 h-3.5" />}
                        {item.currentStock} {item.unit}
                      </span>
                    </td>

                    <td className="py-3 font-mono font-bold text-buzz-yellow">
                      Rs. {Math.round(item.unitCost).toLocaleString()} / {item.unit}
                    </td>

                    <td className="py-3 font-mono text-white font-bold">
                      Rs. {Math.round(valuation).toLocaleString()}
                    </td>

                    <td className="py-3 text-zinc-400 font-sans">{item.supplier}</td>

                    <td className="py-3 text-zinc-500 font-mono text-[11px]">{item.lastUpdated}</td>

                    {/* Quick Stock In / Out Adjustment */}
                    <td className="py-3 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => adjustStock(item.id, 5)}
                        className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-emerald-400 font-mono font-bold text-[10px] border border-zinc-800"
                        title="Add +5 Stock In"
                      >
                        +5 {item.unit}
                      </button>
                      <button
                        onClick={() => adjustStock(item.id, 20)}
                        className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-emerald-400 font-mono font-bold text-[10px] border border-zinc-800"
                        title="Add +20 Stock In"
                      >
                        +20 {item.unit}
                      </button>
                      <button
                        onClick={() => adjustStock(item.id, -5)}
                        className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-red-400 font-mono font-bold text-[10px] border border-zinc-800"
                        title="Deduct -5 Stock Out"
                      >
                        -5 {item.unit}
                      </button>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="py-3 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-buzz-yellow transition-colors"
                        title="Edit Item"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Inventory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Boxes className="w-5 h-5 text-buzz-yellow" />
                {editingItemId ? 'Edit Raw Material' : 'Add Raw Material Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-semibold">Material / Ingredient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Boneless Chicken Breast, Brioche Buns, Coke 1.5L"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs focus:border-buzz-yellow focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">SKU Code</label>
                  <input
                    type="text"
                    required
                    placeholder="RAW-CHICKEN-01"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs font-mono focus:border-buzz-yellow focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs focus:border-buzz-yellow focus:outline-none"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Current Stock Qty *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(parseFloat(e.target.value) || 0)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs font-mono focus:border-buzz-yellow focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Metric Unit *</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs font-bold focus:border-buzz-yellow focus:outline-none"
                  >
                    {METRIC_UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u} (e.g. {u === 'Kg' ? 'Chicken/Beef' : u === 'Pcs' ? 'Buns/Patties' : u === 'Liters' ? 'Drinks/Oil' : u})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Low Stock Alert Limit *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(parseFloat(e.target.value) || 1)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs font-mono focus:border-buzz-yellow focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Unit Purchase Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={unitCost}
                    onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs font-mono focus:border-buzz-yellow focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-semibold">Supplier Name / Vendor</label>
                <input
                  type="text"
                  placeholder="e.g. K&N Fresh Poultry, Habib Oil Mills"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs focus:border-buzz-yellow focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-zinc-800 text-xs font-bold text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-buzz-yellow text-buzz-black font-black text-xs shadow-buzz-glow"
                >
                  {editingItemId ? 'Update Material' : 'Save Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
