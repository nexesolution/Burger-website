import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame } from 'lucide-react';

export const WebsitePreloader: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // Progress counter simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 400);
          return 100;
        }
        return prev + 4;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-buzz-black flex flex-col items-center justify-center overflow-hidden p-4"
        >
          {/* Ambient Background Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-buzz-yellow/20 via-buzz-black to-buzz-black pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

          {/* Centered Burger Loader Container */}
          <div className="relative z-10 flex flex-col items-center space-y-6 max-w-sm text-center">
            {/* Logo Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-buzz-yellow flex items-center justify-center font-black font-display text-buzz-black text-sm font-black tracking-tighter shadow-buzz-glow-lg">
                BUZZ
              </div>
              <div className="flex flex-col text-left">
                <span className="font-black font-display text-2xl sm:text-3xl tracking-tighter text-white leading-none">
                  BUZZ BURGER<span className="text-buzz-yellow">.</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-buzz-yellow tracking-widest mt-1">
                  100% Halal Angus Smash
                </span>
              </div>
            </motion.div>

            {/* Video Opening Burger Media Container (No video background clutter) */}
            <div className="relative w-72 sm:w-80 aspect-square rounded-3xl overflow-hidden shadow-buzz-glow-lg border border-buzz-yellow/30 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center">
              <video
                src="/assets/burger-opening.mp4"
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover filter drop-shadow-[0_15px_30px_rgba(245,196,0,0.3)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-buzz-black/80 via-transparent to-buzz-black/40 pointer-events-none" />
            </div>

            {/* Loading Status & Progress Bar */}
            <div className="w-full space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono font-bold">
                <span className="flex items-center gap-1 text-buzz-yellow uppercase tracking-wider">
                  <Flame className="w-4 h-4 animate-pulse" /> Searing Fresh Burgers...
                </span>
                <span className="text-white font-display text-sm font-black">{progress}%</span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                  className="h-full bg-buzz-yellow rounded-full shadow-buzz-glow"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
