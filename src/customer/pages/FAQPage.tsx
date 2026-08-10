import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'What beef blend does BUZZ use for smash burgers?',
    a: 'We use a proprietary 100% grass-fed Angus beef blend ground fresh daily in-house with an 80/20 lean-to-fat ratio for ultimate juiciness and crispy lace edge searing.'
  },
  {
    q: 'How fast is BUZZ delivery?',
    a: 'Our average kitchen prep time is 8-12 minutes, and our specialized rider fleet delivers orders in insulated thermal bags within 25 minutes of order placement.'
  },
  {
    q: 'Are gluten-free or plant-based options available?',
    a: 'Yes! We offer 100% plant-based Beyond Meat patties, vegan melted cheese, and fresh lettuce wrap bun substitutes.'
  },
  {
    q: 'How do loyalty rewards work?',
    a: 'Every $1 spent earns 1 Buzz Point. You can redeem points directly at checkout for free milkshakes, fries, or instant percentage discounts.'
  },
  {
    q: 'Can I track my delivery in real time?',
    a: 'Absolutely. Once you place an order, you will receive a unique tracking ID (e.g. BZ-2026-00128) to watch your order progress step-by-step.'
  }
];

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="min-h-screen pt-32 pb-24 text-white bg-buzz-black space-y-12">
      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full glass-yellow text-buzz-yellow text-xs font-black uppercase tracking-widest">
          <HelpCircle className="w-4 h-4" /> Got Questions?
        </span>
        <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight">
          FREQUENTLY ASKED <span className="text-buzz-yellow">QUESTIONS</span>
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl glass-card border border-zinc-800 transition-all cursor-pointer"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-bold font-display text-white">{faq.q}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-buzz-yellow transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
              {isOpen && <p className="text-xs text-zinc-300 pt-3 leading-relaxed border-t border-zinc-900 mt-3">{faq.a}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
