import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Flame, Menu as MenuIcon, X, Shield, Search, Sparkles } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const cart = useBuzzStore((state) => state.cart);
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Deals', path: '/deals' },
    { name: 'Loyalty', path: '/loyalty' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-buzz-black/90 backdrop-blur-md py-3 border-b border-zinc-800 shadow-2xl'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-buzz-yellow flex items-center justify-center font-black font-display text-buzz-black text-xs font-bold tracking-tighter shadow-buzz-glow group-hover:scale-105 transition-transform">
              BUZZ
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold font-display text-xl sm:text-2xl tracking-tighter text-white group-hover:text-buzz-yellow transition-colors leading-none">
                BUZZ BURGER<span className="text-buzz-yellow">.</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-buzz-yellow font-bold mt-0.5">
                Gourmet Smash & Fries
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 glass-panel px-4 py-1.5 rounded-full border border-zinc-800">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-buzz-yellow text-buzz-black shadow-buzz-glow'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-3">
            {/* Order Tracking Quick Access */}
            <Link
              to="/tracking"
              className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-300 hover:text-buzz-yellow transition-colors font-medium px-3 py-1.5 rounded-xl hover:bg-zinc-900"
            >
              <Search className="w-4 h-4 text-buzz-yellow" />
              <span>Track Order</span>
            </Link>

            {/* Admin Dashboard Switch Button */}
            <Link
              to="/admin"
              className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl transition-all hover:border-buzz-yellow/40"
              title="Open Restaurant POS / Admin System"
            >
              <Shield className="w-3.5 h-3.5 text-buzz-yellow" />
              <span>POS Admin</span>
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl glass-card text-white hover:text-buzz-yellow border border-zinc-800 hover:border-buzz-yellow/40 transition-all group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-buzz-yellow text-buzz-black font-extrabold text-[10px] flex items-center justify-center shadow-buzz-glow animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* Main Order CTA */}
            <Link
              to="/menu"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-buzz-yellow hover:bg-buzz-yellow-light text-buzz-black font-extrabold text-xs tracking-wide shadow-buzz-glow hover:scale-105 transition-all"
            >
              <Flame className="w-4 h-4" />
              ORDER NOW
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl glass-card text-white hover:text-buzz-yellow"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[70px] z-30 bg-buzz-black/98 backdrop-blur-xl border-t border-zinc-800 p-6 flex flex-col justify-between lg:hidden overflow-y-auto"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <span className="text-xs font-bold text-buzz-yellow uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Navigation Menu
                </span>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-bold text-buzz-yellow flex items-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5" /> POS Admin
                </Link>
              </div>

              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl font-display font-extrabold text-lg transition-all ${
                      location.pathname === link.path
                        ? 'bg-buzz-yellow text-buzz-black shadow-buzz-glow'
                        : 'text-zinc-200 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  to="/tracking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl font-display font-extrabold text-lg text-zinc-300 hover:bg-zinc-900 flex items-center gap-2"
                >
                  <Search className="w-5 h-5 text-buzz-yellow" /> Track Order Status
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800 space-y-3">
              <Link
                to="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 rounded-xl bg-buzz-yellow text-buzz-black font-black text-center text-sm tracking-wider shadow-buzz-glow block"
              >
                EXPLORE FULL MENU & ORDER
              </Link>
              <p className="text-center text-[10px] text-zinc-500">
                BUZZ Restaurant • Fresh Ingredients • Bold Flavors
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
