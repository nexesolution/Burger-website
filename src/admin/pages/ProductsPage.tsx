import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Package, Check, X } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';
import { Product } from '../../types';

export const ProductsPage: React.FC = () => {
  const products = useBuzzStore((state) => state.products);
  const categories = useBuzzStore((state) => state.categories);
  const addProduct = useBuzzStore((state) => state.addProduct);
  const updateProduct = useBuzzStore((state) => state.updateProduct);
  const deleteProduct = useBuzzStore((state) => state.deleteProduct);
  const toggleProductAvailability = useBuzzStore((state) => state.toggleProductAvailability);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [price, setPrice] = useState(12.99);
  const [cost, setCost] = useState(4.5);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [stockQuantity, setStockQuantity] = useState(100);

  const filteredProducts = products.filter((p) => {
    if (selectedCatId !== 'all' && p.categoryId !== selectedCatId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenModal = (p?: Product) => {
    if (p) {
      setEditingProduct(p);
      setName(p.name);
      setSku(p.sku);
      setCategoryId(p.categoryId);
      setPrice(p.price);
      setCost(p.cost);
      setDescription(p.description);
      setImage(p.image);
      setStockQuantity(p.stockQuantity);
    } else {
      setEditingProduct(null);
      setName('');
      setSku(`BZ-PROD-${Math.floor(100 + Math.random() * 900)}`);
      setCategoryId(categories[0]?.id || '');
      setPrice(12.99);
      setCost(4.5);
      setDescription('');
      setImage('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80');
      setStockQuantity(100);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        sku,
        categoryId,
        price,
        cost,
        description,
        image,
        stockQuantity
      });
    } else {
      addProduct({
        name,
        sku,
        categoryId,
        description,
        price,
        cost,
        image,
        ingredients: ['Angus Beef', 'Brioche Bun', 'Cheddar Cheese'],
        calories: 750,
        preparationTime: 10,
        stockQuantity,
        lowStockThreshold: 15,
        isFeatured: false,
        isAvailable: true,
        isSpicy: false,
        isPopular: true,
        isVegetarian: false
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            PRODUCT <span className="text-buzz-yellow">CATALOG</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Full product CRUD. Disabling products immediately hides them on the customer website.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-xl bg-buzz-yellow text-buzz-black font-extrabold text-xs shadow-buzz-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> ADD NEW PRODUCT
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-2xl glass-panel border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search product or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-buzz-yellow"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setSelectedCatId('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              selectedCatId === 'all' ? 'bg-buzz-yellow text-buzz-black' : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCatId(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                selectedCatId === c.id ? 'bg-buzz-yellow text-buzz-black' : 'bg-zinc-900 text-zinc-400'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="p-6 rounded-3xl glass-panel border border-zinc-800 overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="text-[10px] font-bold text-zinc-400 uppercase border-b border-zinc-800 pb-2">
            <tr>
              <th className="pb-3">Product</th>
              <th className="pb-3">SKU</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Cost</th>
              <th className="pb-3">Stock</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-900/50">
                <td className="py-3 flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <span className="font-bold text-white block">{p.name}</span>
                    <span className="text-[10px] text-zinc-500">{p.calories} Cal</span>
                  </div>
                </td>
                <td className="py-3 font-mono">{p.sku}</td>
                <td className="py-3 font-bold text-buzz-yellow">${p.price.toFixed(2)}</td>
                <td className="py-3 text-zinc-400">${p.cost.toFixed(2)}</td>
                <td className="py-3">
                  <span
                    className={`font-bold ${
                      p.stockQuantity <= p.lowStockThreshold ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {p.stockQuantity} pcs
                  </span>
                </td>
                <td className="py-3">
                  <button
                    onClick={() => toggleProductAvailability(p.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      p.isAvailable
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {p.isAvailable ? 'Available' : 'Disabled'}
                  </button>
                </td>
                <td className="py-3 text-right space-x-2">
                  <button
                    onClick={() => handleOpenModal(p)}
                    className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold font-display text-white">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={cost}
                    onChange={(e) => setCost(parseFloat(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(parseInt(e.target.value))}
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

              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
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
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
