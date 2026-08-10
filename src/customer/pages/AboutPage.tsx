import React from 'react';
import { Flame, ShieldCheck, Award, Heart, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 text-white bg-buzz-black space-y-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full glass-yellow text-buzz-yellow text-xs font-black uppercase tracking-widest">
          <Sparkles className="w-4 h-4" /> Our Story & Obsession
        </span>
        <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight">
          SERIOUS BURGERS. <br />
          <span className="text-buzz-yellow">ZERO COMPROMISE.</span>
        </h1>
        <p className="text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          BUZZ was born from a simple obsession: creating the ultimate smash burger using grass-fed Angus beef, custom-baked brioche buns, and artisanal melted cheese.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl glass-card border border-zinc-800 space-y-4">
          <Flame className="w-10 h-10 text-buzz-yellow" />
          <h3 className="text-xl font-bold font-display text-white">The Smash Craft</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            We sear every Angus beef patty at 450°F to create deeply caramelized crisp lace edges that seal in every drop of rich beef juice.
          </p>
        </div>

        <div className="p-8 rounded-3xl glass-card border border-zinc-800 space-y-4">
          <ShieldCheck className="w-10 h-10 text-buzz-yellow" />
          <h3 className="text-xl font-bold font-display text-white">Fresh Local Sourcing</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Never frozen, never pre-cut. Our produce arrives daily from local organic farms, and our brioche is baked fresh every morning.
          </p>
        </div>

        <div className="p-8 rounded-3xl glass-card border border-zinc-800 space-y-4">
          <Award className="w-10 h-10 text-buzz-yellow" />
          <h3 className="text-xl font-bold font-display text-white">Tech-Driven Kitchen</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            From our custom kitchen display system to automated thermal printing, every step is built for maximum speed and food quality consistency.
          </p>
        </div>
      </div>
    </div>
  );
};
