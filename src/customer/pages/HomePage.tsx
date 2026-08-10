import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame,
  ArrowRight,
  Sparkles,
  Award,
  Clock,
  ShieldCheck,
  Star,
  Plus,
  ShoppingBag,
  Gift,
  Truck,
  Heart
} from 'lucide-react';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { useBuzzStore } from '../../store/useBuzzStore';
import { Product } from '../../types';

export const HomePage: React.FC = () => {
  const products = useBuzzStore((state) => state.products);
  const deals = useBuzzStore((state) => state.deals);
  const addToCart = useBuzzStore((state) => state.addToCart);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const featuredProducts = products.filter((p) => p.isFeatured && p.isAvailable).slice(0, 6);

  return (
    <div className="space-y-0 text-white bg-buzz-black min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] pt-32 pb-20 flex items-center justify-center overflow-hidden">
        {/* Background Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-buzz-yellow/15 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Hero Editorial Typography */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-yellow text-buzz-yellow text-xs sm:text-sm font-extrabold uppercase tracking-widest shadow-buzz-glow"
            >
              <Flame className="w-4 h-4 animate-pulse" />
              #1 Rated Gourmet Smash Burgers
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-7xl lg:text-8xl font-black font-display tracking-tight leading-[0.95]"
            >
              THE BURGER <br />
              <span className="text-buzz-yellow text-gradient-yellow">THAT MAKES NOISE.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl text-zinc-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              Fresh Angus beef smash patties, artisanal brioche buns, double melted cheddar, and secret truffle sauces. Serious burgers for serious appetites.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <Link
                to="/menu"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-buzz-yellow hover:bg-buzz-yellow-light text-buzz-black font-black text-sm tracking-wider shadow-buzz-glow-lg flex items-center justify-center gap-3 hover:scale-105 transition-all"
              >
                <Flame className="w-5 h-5" /> ORDER NOW
              </Link>
              <Link
                to="/menu"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel hover:bg-zinc-800/80 text-white font-bold text-sm tracking-wider border border-zinc-800 flex items-center justify-center gap-2 hover:border-buzz-yellow/40 transition-all"
              >
                EXPLORE MENU <ArrowRight className="w-4 h-4 text-buzz-yellow" />
              </Link>
            </motion.div>

            {/* Micro Highlights */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-zinc-900 text-left max-w-lg mx-auto lg:mx-0">
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl font-black font-display text-white">100%</span>
                <span className="block text-[11px] text-zinc-400 font-medium">Fresh Angus Beef</span>
              </div>
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl font-black font-display text-buzz-yellow">15 MIN</span>
                <span className="block text-[11px] text-zinc-400 font-medium">Avg Prep Time</span>
              </div>
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl font-black font-display text-white">4.9 ★</span>
                <span className="block text-[11px] text-zinc-400 font-medium">10,000+ Reviews</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Product Display */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="relative w-full max-w-md aspect-square rounded-full flex items-center justify-center"
            >
              {/* Outer Glowing Rings */}
              <div className="absolute inset-0 rounded-full border border-buzz-yellow/20 animate-spin-slow" />
              <div className="absolute inset-4 rounded-full border border-dashed border-buzz-yellow/30" />

              {/* Main Hero Burger Image */}
              <img
                src="/assets/burger-master.jpg"
                alt="Buzz Exploding Smash Burger"
                className="w-80 sm:w-96 rounded-3xl object-cover shadow-2xl shadow-buzz-yellow/30 z-10 border-4 border-buzz-yellow/40"
              />

              {/* Floating Highlight Chips */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
                className="absolute top-4 left-0 glass-panel px-4 py-2 rounded-2xl border border-buzz-yellow/30 text-xs font-bold text-white shadow-buzz-glow z-20 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-buzz-yellow" /> Double Melted Cheddar
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, delay: 1 }}
                className="absolute bottom-6 right-0 glass-panel px-4 py-2 rounded-2xl border border-buzz-yellow/30 text-xs font-bold text-white shadow-buzz-glow z-20 flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-buzz-yellow" /> Signature Truffle Glaze
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* FEATURED SIGNATURE PRODUCTS */}
      <section className="py-24 bg-zinc-950/80 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-buzz-yellow uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Fresh Off The Smash Grill
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white">
                FEATURED <span className="text-buzz-yellow">CRAVINGS</span>
              </h2>
            </div>
            <Link
              to="/menu"
              className="text-xs font-extrabold text-buzz-yellow hover:text-white flex items-center gap-1 transition-colors"
            >
              VIEW FULL MENU <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((prod) => (
              <motion.div
                key={prod.id}
                whileHover={{ y: -6 }}
                className="glass-card rounded-3xl overflow-hidden border border-zinc-800 hover:border-buzz-yellow/40 transition-all flex flex-col justify-between group shadow-xl"
              >
                {/* Image & Badges */}
                <div className="relative h-56 overflow-hidden bg-zinc-900">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {prod.salePrice && (
                      <span className="px-2.5 py-1 rounded-lg bg-buzz-yellow text-buzz-black text-[10px] font-black uppercase shadow-buzz-glow">
                        SPECIAL PRICE
                      </span>
                    )}
                    {prod.isSpicy && (
                      <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[10px] font-black uppercase flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Spicy
                      </span>
                    )}
                  </div>

                  {/* Quick Detail View button */}
                  <button
                    onClick={() => setSelectedProduct(prod)}
                    className="absolute bottom-3 right-3 p-2.5 rounded-xl glass-panel text-white hover:bg-buzz-yellow hover:text-buzz-black transition-all text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100"
                  >
                    Quick View
                  </button>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold font-display text-white group-hover:text-buzz-yellow transition-colors">
                        {prod.name}
                      </h3>
                      <span className="text-lg font-black font-display text-buzz-yellow">
                        Rs. {(prod.salePrice ?? prod.price).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>

                  {/* Add to Cart CTA */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => addToCart(prod)}
                      className="w-full py-3 px-4 rounded-xl bg-buzz-yellow hover:bg-buzz-yellow-light text-buzz-black font-extrabold text-xs tracking-wider shadow-buzz-glow flex items-center justify-center gap-2 transition-all"
                    >
                      <ShoppingBag className="w-4 h-4" /> ADD TO CART
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIAL DEALS SHOWCASE BANNER */}
      <section className="py-20 bg-zinc-900/60 border-y border-zinc-800 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-buzz-yellow uppercase tracking-widest inline-flex items-center gap-1">
              <Gift className="w-4 h-4" /> Maximum Savings
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
              DEEP FRIES <span className="text-buzz-yellow">COMBO DEALS</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="p-6 rounded-3xl glass-panel border border-buzz-yellow/30 shadow-buzz-glow space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-buzz-yellow text-buzz-black text-[10px] font-black uppercase tracking-wider">
                      {deal.badge || 'COMBO'}
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-buzz-yellow font-display">
                        Rs. {deal.price.toLocaleString()}
                      </span>
                      <span className="block text-xs text-zinc-500 line-through">
                        Rs. {deal.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black font-display text-white">{deal.title}</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">{deal.description}</p>
                </div>

                <Link
                  to="/deals"
                  className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-buzz-yellow hover:text-buzz-black text-white font-bold text-xs text-center transition-all block"
                >
                  CLAIM DEAL NOW
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS */}
      <section className="py-24 bg-buzz-black relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-buzz-yellow uppercase tracking-widest">
              Real Reviews From Burger Lovers
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
              WHAT THE NOISE IS <span className="text-buzz-yellow">ABOUT</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Marcus Brody',
                role: 'Food Critic',
                text: 'The Double Buzz Smash is hands down the best burger in town. Crisp lace edges, melted cheese, and that truffle glaze is sensational!',
                stars: 5
              },
              {
                name: 'Sophia Martinez',
                role: 'Verified Customer',
                text: 'Fastest delivery ever! My order arrived piping hot in 18 minutes. The loaded fries are pure gold.',
                stars: 5
              },
              {
                name: 'David Chen',
                role: 'Tech Lead & Burger Fanatic',
                text: 'The ordering experience and live tracking are super slick. Plus, the Nashville Fire Chicken has insane spice balance!',
                stars: 5
              }
            ].map((rev, idx) => (
              <div key={idx} className="p-6 rounded-3xl glass-card border border-zinc-800 space-y-4">
                <div className="flex text-buzz-yellow gap-1">
                  {[...Array(rev.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-buzz-yellow" />
                  ))}
                </div>
                <p className="text-xs text-zinc-300 italic leading-relaxed">"{rev.text}"</p>
                <div className="pt-2 border-t border-zinc-900">
                  <h4 className="text-sm font-bold text-white font-display">{rev.name}</h4>
                  <span className="text-[10px] text-buzz-yellow font-medium">{rev.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK VIEW MODAL */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
