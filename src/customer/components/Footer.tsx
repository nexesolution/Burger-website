import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Shield, Sparkles, Heart } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

export const Footer: React.FC = () => {
  const storeSettings = useBuzzStore((state) => state.storeSettings);

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-400 pt-16 pb-12 relative overflow-hidden">
      {/* Background glow ambient */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-buzz-yellow/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
        {/* Brand info */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-buzz-yellow flex items-center justify-center font-black font-display text-buzz-black text-xs font-bold shadow-buzz-glow">
              BUZZ
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold font-display text-xl tracking-tighter text-white leading-none">
                BUZZ BURGER<span className="text-buzz-yellow">.</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-buzz-yellow font-bold mt-0.5">
                Gourmet Smash & Fries
              </span>
            </div>
          </Link>

          <p className="text-xs leading-relaxed text-zinc-400">
            {storeSettings.tagline}. Handcrafted Angus beef smash burgers, crisp tenders, and thick shakes prepared fresh daily.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-buzz-yellow hover:border-buzz-yellow transition-all"
            >
              <Shield className="w-3.5 h-3.5" /> Launch POS Admin
            </Link>
          </div>
        </div>

        {/* Quick links */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white font-display uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-buzz-yellow" /> Explore Menu
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/menu" className="hover:text-buzz-yellow transition-colors">
                Signature Smash Burgers
              </Link>
            </li>
            <li>
              <Link to="/menu" className="hover:text-buzz-yellow transition-colors">
                Crispy Buttermilk Chicken
              </Link>
            </li>
            <li>
              <Link to="/menu" className="hover:text-buzz-yellow transition-colors">
                Loaded Buzz Fries & Sides
              </Link>
            </li>
            <li>
              <Link to="/deals" className="hover:text-buzz-yellow transition-colors text-buzz-yellow font-semibold">
                Special Combo Deals
              </Link>
            </li>
            <li>
              <Link to="/loyalty" className="hover:text-buzz-yellow transition-colors">
                Loyalty & Rewards Program
              </Link>
            </li>
          </ul>
        </div>

        {/* Support & Tracking */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white font-display uppercase tracking-wider">
            Customer Care
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/tracking" className="hover:text-buzz-yellow transition-colors">
                Live Order Tracker
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-buzz-yellow transition-colors">
                About BUZZ Quality
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-buzz-yellow transition-colors">
                Contact & Feedback
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-buzz-yellow transition-colors">
                Frequently Asked Questions
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact info & hours */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white font-display uppercase tracking-wider">
            Visit & Contact
          </h4>
          <div className="space-y-2.5 text-xs text-zinc-300">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-buzz-yellow flex-shrink-0 mt-0.5" />
              <span>{storeSettings.address}, {storeSettings.city}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-buzz-yellow flex-shrink-0" />
              <span>{storeSettings.phone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-buzz-yellow flex-shrink-0" />
              <span>{storeSettings.email}</span>
            </div>
            <div className="flex items-center gap-2.5 pt-1 text-zinc-400">
              <Clock className="w-4 h-4 text-buzz-yellow flex-shrink-0" />
              <span>{storeSettings.openingHours}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 mt-12 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <p>© {new Date().getFullYear()} BUZZ Restaurant. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Designed with <Heart className="w-3.5 h-3.5 text-buzz-yellow fill-buzz-yellow" /> for burger perfection.
        </p>
      </div>
    </footer>
  );
};
