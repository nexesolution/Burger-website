import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Package,
  Check,
  X,
  Upload,
  Layers,
  Boxes,
  ChefHat,
  AlertTriangle
} from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';
import { Product, ProductRecipeItem } from '../../types';

export const ProductsPage: React.FC = () => {
  const products = useBuzzStore((state) => state.products);
  const categories = useBuzzStore((state) => state.categories);
  const inventory = useBuzzStore((state) => state.inventory);
  const addProduct = useBuzzStore((state) => state.addProduct);
  const updateProduct = useBuzzStore((state) => state.updateProduct);
  const deleteProduct = useBuzzStore((state) => state.deleteProduct);
  const toggleProductAvailability = useBuzzStore((state) => state.toggleProductAvailability);
  const showToast = useBuzzStore((state) => state.showToast);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states (No stockQuantity input as requested!)
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [price, setPrice] = useState<number>(1290);
  const [salePrice, setSalePrice] = useState<number | undefined>(undefined);
  const [cost, setCost] = useState<number>(450);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Recipe Ingredients state (Linked to Inventory Items for Auto Stock Deduction)
  const [recipe, setRecipe] = useState<ProductRecipeItem[]>([]);
  const [selectedInvId, setSelectedInvId] = useState('');
  const [ingredientAmount, setIngredientAmount] = useState<number>(0.6);

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
      setSalePrice(p.salePrice);
      setCost(p.cost);
      setDescription(p.description);
      setImage(p.image);
      setRecipe(p.recipe || []);
    } else {
      setEditingProduct(null);
      setName('');
      setSku(`BZ-PK-${Math.floor(100 + Math.random() * 900)}`);
      setCategoryId(categories[0]?.id || '');
      setPrice(1290);
      setSalePrice(undefined);
      setCost(450);
      setDescription('');
      setImage(
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
      );
      setRecipe([]);
    }
    setSelectedInvId(inventory[0]?.id || '');
    setIngredientAmount(0.6);
    setImageFile(null);
    setIsModalOpen(true);
  };

  // Image Upload File Change with 2MB Max Validation
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 2MB = 2 * 1024 * 1024 bytes
    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      showToast('❌ Image file size exceeds 2MB limit! Please upload a smaller image.', 'error');
      e.target.value = '';
      return;
    }

    setImageFile(file);

    // Convert file to Data URL for preview and base64 storage
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
        showToast('Image uploaded successfully (Max 2MB validated)!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Recipe Ingredient Addition
  const handleAddRecipeIngredient = () => {
    const invItem = inventory.find((i) => i.id === selectedInvId);
    if (!invItem) return;

    // Avoid duplicate ingredient selection
    if (recipe.some((r) => r.inventoryItemId === invItem.id)) {
      showToast('Ingredient already added to recipe list', 'info');
      return;
    }

    const newItem: ProductRecipeItem = {
      inventoryItemId: invItem.id,
      inventoryItemName: invItem.name,
      amount: ingredientAmount,
      unit: invItem.unit
    };

    setRecipe([...recipe, newItem]);
    showToast(`Added ${ingredientAmount} ${invItem.unit} of ${invItem.name} to product recipe!`);
  };

  const handleRemoveRecipeIngredient = (invId: string) => {
    setRecipe(recipe.filter((r) => r.inventoryItemId !== invId));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Human-friendly ingredient text list for customer site
    const customerIngredientsList = recipe.map((r) => r.inventoryItemName);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        sku,
        categoryId,
        price,
        salePrice: salePrice || undefined,
        cost,
        description,
        image,
        ingredients: customerIngredientsList,
        recipe
      });
    } else {
      addProduct({
        name,
        sku,
        categoryId,
        description,
        price,
        salePrice: salePrice || undefined,
        cost,
        image,
        ingredients: customerIngredientsList,
        recipe,
        calories: 850,
        preparationTime: 12,
        isFeatured: true,
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            PRODUCT <span className="text-buzz-yellow">RECIPE CATALOG</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Create products linked to inventory ingredients for automatic stock deduction on every order.
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
            placeholder="Search product name or SKU..."
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
      <div className="p-6 rounded-3xl glass-panel border border-zinc-800 overflow-x-auto shadow-2xl">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="text-[10px] font-bold text-zinc-400 uppercase border-b border-zinc-800 pb-2">
            <tr>
              <th className="pb-3">Product Name</th>
              <th className="pb-3">SKU</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Linked Recipe Ingredients</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-900/50 transition-colors">
                <td className="py-3 flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <span className="font-bold text-white block text-sm">{p.name}</span>
                    <span className="text-[10px] text-zinc-400 line-clamp-1">{p.description}</span>
                  </div>
                </td>

                <td className="py-3 font-mono font-bold text-zinc-400">{p.sku}</td>

                <td className="py-3 font-bold text-buzz-yellow font-mono text-sm">
                  Rs. {p.price.toLocaleString()}
                  {p.salePrice && (
                    <span className="text-[10px] text-zinc-500 line-through block font-normal">
                      Rs. {p.salePrice}
                    </span>
                  )}
                </td>

                {/* Recipe Ingredients Preview */}
                <td className="py-3">
                  {p.recipe && p.recipe.length > 0 ? (
                    <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                      {p.recipe.map((r, idx) => (
                        <span
                          key={idx}
                          className="bg-zinc-900 text-buzz-yellow px-2 py-0.5 rounded border border-zinc-800"
                        >
                          {r.amount} {r.unit} {r.inventoryItemName}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] text-zinc-500 italic">No recipe linked</span>
                  )}
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
                    {p.isAvailable ? 'Active On Web' : 'Disabled'}
                  </button>
                </td>

                <td className="py-3 text-right space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => handleOpenModal(p)}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-buzz-yellow transition-colors"
                    title="Edit Product & Recipe"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal Page */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-buzz-yellow" />
                <h3 className="text-lg font-black font-display text-white">
                  {editingProduct ? 'Edit Product & Recipe Ingredients' : 'Add New Burger / Product'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Product Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lahore Double Smash Melt"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs focus:border-buzz-yellow focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">SKU Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="BZ-PK-001"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs font-mono focus:border-buzz-yellow focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs focus:border-buzz-yellow focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Selling Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs font-mono font-bold focus:border-buzz-yellow focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Sale / Discount Price</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Optional"
                    value={salePrice || ''}
                    onChange={(e) => setSalePrice(parseFloat(e.target.value) || undefined)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs font-mono focus:border-buzz-yellow focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-semibold">
                  Customer Description (Visible on Website)
                </label>
                <textarea
                  rows={2}
                  placeholder="Double Angus beef smash patties, melted cheddar, smoked bacon & garlic truffle mayo."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs focus:border-buzz-yellow focus:outline-none"
                />
              </div>

              {/* Product Image File Picker with 2MB Max Validation */}
              <div className="space-y-2 p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
                <label className="text-xs font-bold text-zinc-300 block flex items-center justify-between">
                  <span>Product Image (Max File Size: 2MB)</span>
                  <span className="text-[10px] text-zinc-500 font-normal">Formats: JPG, PNG, WEBP</span>
                </label>

                <div className="flex items-center gap-3">
                  {image && (
                    <img src={image} alt="Preview" className="w-14 h-14 rounded-xl object-cover border border-zinc-700" />
                  )}

                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-buzz-yellow hover:file:bg-zinc-700 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Recipe Ingredients Builder (For Auto Inventory Stock Deduction) */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-buzz-yellow/30 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-buzz-yellow" />
                    <span className="text-xs font-black text-white uppercase tracking-wider">
                      RECIPE INGREDIENT STOCK WEIGHTS (AUTO DEDUCTION)
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 italic">Hidden from customer site</span>
                </div>

                {/* Add Recipe Ingredient Row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                  <div className="sm:col-span-6 space-y-1">
                    <label className="text-[10px] text-zinc-400 font-semibold block">
                      Select Inventory Stock Item
                    </label>
                    <select
                      value={selectedInvId}
                      onChange={(e) => setSelectedInvId(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-2 text-xs"
                    >
                      {inventory.map((inv) => (
                        <option key={inv.id} value={inv.id}>
                          {inv.name} (Stock: {inv.currentStock} {inv.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-[10px] text-zinc-400 font-semibold block">
                      Weightage / Qty Used per Burger
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0.01"
                      placeholder="e.g. 0.6 Kg or 1 Pcs"
                      value={ingredientAmount}
                      onChange={(e) => setIngredientAmount(parseFloat(e.target.value) || 0)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-2 text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddRecipeIngredient}
                      className="w-full py-2 rounded-xl bg-buzz-yellow text-buzz-black font-black text-xs shadow-buzz-glow flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>

                {/* Recipe Ingredients List */}
                <div className="space-y-1.5 pt-2">
                  {recipe.length === 0 ? (
                    <p className="text-[11px] text-zinc-500 italic text-center py-2 border border-dashed border-zinc-800 rounded-xl">
                      No recipe ingredients added yet. Select inventory items above to link stock auto-deduction.
                    </p>
                  ) : (
                    recipe.map((r) => (
                      <div
                        key={r.inventoryItemId}
                        className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs font-mono"
                      >
                        <span className="text-white font-bold">
                          {r.amount} {r.unit} of <span className="text-buzz-yellow">{r.inventoryItemName}</span> per burger
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRecipeIngredient(r.inventoryItemId)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Actions */}
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
                  {editingProduct ? 'Update Product & Recipe' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
