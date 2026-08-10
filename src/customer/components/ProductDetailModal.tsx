import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Flame, Clock, Plus, Minus, ShoppingBag, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { Product, CustomizationOption } from '../../types';
import { useBuzzStore } from '../../store/useBuzzStore';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const addToCart = useBuzzStore((state) => state.addToCart);

  const [quantity, setQuantity] = useState<number>(1);
  const [size, setSize] = useState<'Single' | 'Double' | 'Triple'>('Single');
  const [extraCheese, setExtraCheese] = useState<boolean>(false);
  const [sauce, setSauce] = useState<string>('BUZZ Special Sauce');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  if (!isOpen || !product) return null;

  // Price calculations based on customization
  const basePrice = product.salePrice ?? product.price;
  let sizeMultiplier = 0;
  if (size === 'Double') sizeMultiplier = 350;
  if (size === 'Triple') sizeMultiplier = 600;

  const cheeseCost = extraCheese ? 150 : 0;
  const unitPrice = basePrice + sizeMultiplier + cheeseCost;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    const customization: CustomizationOption = {
      size,
      extraCheese,
      sauce,
      specialInstructions: specialInstructions.trim() || undefined
    };
    addToCart(product, quantity, customization);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-buzz-glow flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="relative h-64 sm:h-72 overflow-hidden bg-zinc-900 flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-buzz-yellow hover:text-buzz-black transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Product Badges */}
          <div className="absolute bottom-4 left-6 flex flex-wrap gap-2 z-10">
            {product.isFeatured && (
              <span className="px-3 py-1 rounded-full bg-buzz-yellow text-buzz-black text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-buzz-glow">
                <Sparkles className="w-3.5 h-3.5" /> Featured
              </span>
            )}
            {product.isSpicy && (
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> Spicy Glaze
              </span>
            )}
            {product.isVegetarian && (
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black uppercase tracking-wider">
                Plant-Based
              </span>
            )}
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Title & Description */}
          <div>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                {product.name}
              </h2>
              <div className="text-right">
                <span className="text-2xl font-black text-buzz-yellow font-display">
                  Rs. {unitPrice.toLocaleString()}
                </span>
                {product.salePrice && (
                  <span className="block text-xs text-zinc-500 line-through">
                    Rs. {product.price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quick Stats: Calories & Prep time */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <Flame className="w-4 h-4 text-buzz-yellow" />
              <span>{product.calories} Calories</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <Clock className="w-4 h-4 text-buzz-yellow" />
              <span>~{product.preparationTime} Mins Prep Time</span>
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Fresh Ingredients
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {product.ingredients.map((ing, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Customization Section */}
          <div className="space-y-4 pt-4 border-t border-zinc-900">
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-buzz-yellow" /> Customize Your Build
            </h3>

            {/* Size Selector */}
            {product.categoryId === 'cat-1' && (
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-semibold block">Patty Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Single', 'Double', 'Triple'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                        size === s
                          ? 'bg-buzz-yellow text-buzz-black border-buzz-yellow shadow-buzz-glow'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <span>{s}</span>
                      <span className="text-[10px] opacity-80">
                        {s === 'Single' ? 'Standard' : s === 'Double' ? '+Rs. 350' : '+Rs. 600'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Extra Cheese */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <div>
                <span className="text-xs font-bold text-white block">Extra Melted Cheddar</span>
                <span className="text-[10px] text-zinc-400">+Rs. 150 extra slice</span>
              </div>
              <button
                type="button"
                onClick={() => setExtraCheese(!extraCheese)}
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                  extraCheese ? 'bg-buzz-yellow text-buzz-black' : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {extraCheese && <Check className="w-4 h-4 stroke-[3]" />}
              </button>
            </div>

            {/* Sauce Selection */}
            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-semibold block">Signature Sauce</label>
              <select
                value={sauce}
                onChange={(e) => setSauce(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-buzz-yellow"
              >
                <option value="BUZZ Special Sauce">BUZZ Special Sauce (Recommended)</option>
                <option value="Smoky Hickory BBQ">Smoky Hickory BBQ</option>
                <option value="Ghost Pepper Garlic Aioli">Ghost Pepper Garlic Aioli (Hot)</option>
                <option value="White Truffle Mayo">White Truffle Mayo</option>
                <option value="No Sauce">No Sauce</option>
              </select>
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-semibold block">Special Kitchen Notes</label>
              <input
                type="text"
                placeholder="e.g. Extra crispy bacon, no pickles..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-buzz-yellow"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-6 bg-zinc-950 border-t border-zinc-900 flex items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-sm text-white w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3.5 px-6 rounded-xl bg-buzz-yellow hover:bg-buzz-yellow-light text-buzz-black font-extrabold text-sm tracking-wide shadow-buzz-glow flex items-center justify-between transition-all"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" /> ADD TO CART
            </span>
            <span className="font-display font-black text-base">Rs. {totalPrice.toLocaleString()}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
