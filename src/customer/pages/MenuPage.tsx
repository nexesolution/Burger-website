import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Flame,
  Star,
  Plus,
  ShoppingBag,
  Sparkles,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';
import { Product } from '../../types';
import { ProductDetailModal } from '../components/ProductDetailModal';

export const MenuPage: React.FC = () => {
  const products = useBuzzStore((state) => state.products);
  const categories = useBuzzStore((state) => state.categories);
  const addToCart = useBuzzStore((state) => state.addToCart);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'spicy' | 'popular' | 'vegetarian'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'name'>('popular');
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Availability
        if (!p.isAvailable) return false;

        // Category filter
        if (selectedCategoryId !== 'all' && p.categoryId !== selectedCategoryId) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const matchesIng = p.ingredients.some((i) => i.toLowerCase().includes(q));
          if (!matchesName && !matchesDesc && !matchesIng) return false;
        }

        // Dietary
        if (dietaryFilter === 'spicy' && !p.isSpicy) return false;
        if (dietaryFilter === 'popular' && !p.isPopular) return false;
        if (dietaryFilter === 'vegetarian' && !p.isVegetarian) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
        if (sortBy === 'price-desc') return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      });
  }, [products, selectedCategoryId, searchQuery, dietaryFilter, sortBy]);

  return (
    <div className="min-h-screen pt-32 pb-24 text-white bg-buzz-black space-y-12">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-4 text-center">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full glass-yellow text-buzz-yellow text-xs font-black uppercase tracking-widest">
          <Sparkles className="w-4 h-4" /> Handcrafted Fresh Daily
        </span>
        <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight">
          CRAFT BURGER <span className="text-buzz-yellow">MENU</span>
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Explore our menu of Angus smash burgers, crispy buttermilk chicken, loaded fries, jumbo wings, and thick artisan shakes.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        {/* Search & Sort Controls Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-2xl glass-panel border border-zinc-800">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search burgers, ingredients, drinks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-12 pr-4 py-3 text-xs focus:outline-none focus:border-buzz-yellow placeholder-zinc-500"
            />
          </div>

          {/* Dietary Filters */}
          <div className="md:col-span-3 flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All' },
              { id: 'popular', label: 'Popular 🔥' },
              { id: 'spicy', label: 'Spicy 🌶️' },
              { id: 'vegetarian', label: 'Plant-Based 🍃' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setDietaryFilter(f.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  dietaryFilter === f.id
                    ? 'bg-buzz-yellow text-buzz-black shadow-buzz-glow'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-3 relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-buzz-yellow appearance-none cursor-pointer"
            >
              <option value="popular">Sort by: Popularity</option>
              <option value="price-asc">Sort by: Price Low to High</option>
              <option value="price-desc">Sort by: Price High to Low</option>
              <option value="name">Sort by: Product Name</option>
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`px-5 py-3 rounded-2xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedCategoryId === 'all'
                ? 'bg-buzz-yellow text-buzz-black shadow-buzz-glow font-black'
                : 'glass-card text-zinc-300 hover:text-white hover:border-zinc-700'
            }`}
          >
            All Items ({products.filter((p) => p.isAvailable).length})
          </button>

          {categories
            .filter((c) => c.isActive)
            .map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id && p.isAvailable).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-5 py-3 rounded-2xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
                    selectedCategoryId === cat.id
                      ? 'bg-buzz-yellow text-buzz-black shadow-buzz-glow font-black'
                      : 'glass-card text-zinc-300 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((prod) => (
              <motion.div
                key={prod.id}
                whileHover={{ y: -6 }}
                className="glass-card rounded-3xl overflow-hidden border border-zinc-800 hover:border-buzz-yellow/40 transition-all flex flex-col justify-between group shadow-xl"
              >
                {/* Product Image & Badges */}
                <div
                  className="relative h-60 overflow-hidden bg-zinc-900 cursor-pointer"
                  onClick={() => setModalProduct(prod)}
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {prod.salePrice && (
                      <span className="px-2.5 py-1 rounded-lg bg-buzz-yellow text-buzz-black text-[10px] font-black uppercase shadow-buzz-glow">
                        OFFER PRICE
                      </span>
                    )}
                    {prod.isSpicy && (
                      <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[10px] font-black uppercase flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Spicy
                      </span>
                    )}
                    {prod.isPopular && (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-600 text-white text-[10px] font-black uppercase flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" /> Popular
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setModalProduct(prod)}
                    >
                      <h3 className="text-xl font-bold font-display text-white group-hover:text-buzz-yellow transition-colors">
                        {prod.name}
                      </h3>
                      <div className="text-right">
                        <span className="text-xl font-black font-display text-buzz-yellow">
                          Rs. {(prod.salePrice ?? prod.price).toLocaleString()}
                        </span>
                        {prod.salePrice && (
                          <span className="block text-[11px] text-zinc-500 line-through">
                            Rs. {prod.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-[10px] text-zinc-400">
                      <span>{prod.calories} Calories</span> • <span>~{prod.preparationTime} mins</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-zinc-900 flex items-center gap-2">
                    <button
                      onClick={() => setModalProduct(prod)}
                      className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs transition-colors"
                    >
                      Customize
                    </button>

                    <button
                      onClick={() => addToCart(prod)}
                      className="flex-1 py-3 px-4 rounded-xl bg-buzz-yellow hover:bg-buzz-yellow-light text-buzz-black font-extrabold text-xs tracking-wider shadow-buzz-glow flex items-center justify-center gap-2 transition-all"
                    >
                      <ShoppingBag className="w-4 h-4" /> ADD TO CART
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 glass-panel rounded-3xl border border-zinc-800">
            <SlidersHorizontal className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-xl font-bold text-white font-display">No Products Match Your Criteria</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Try clearing your search query or switching category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryId('all');
                setDietaryFilter('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-buzz-yellow text-buzz-black text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <ProductDetailModal
        product={modalProduct}
        isOpen={!!modalProduct}
        onClose={() => setModalProduct(null)}
      />
    </div>
  );
};
