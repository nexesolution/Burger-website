import React, { useState } from 'react';
import { Menu, Bell, Search, User, ShieldCheck, RefreshCw } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleMobileSidebar }) => {
  const adminUser = useBuzzStore((state) => state.adminUser);
  const resetToDefaults = useBuzzStore((state) => state.resetToDefaults);
  const orders = useBuzzStore((state) => state.orders);

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Received' || o.status === 'Preparing'
  ).length;

  return (
    <header className="h-16 bg-zinc-950 border-b border-zinc-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 text-zinc-400 hover:text-white rounded-lg lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Quick search POS..."
            className="bg-transparent text-white focus:outline-none placeholder-zinc-500 text-xs"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* System Reset Button for Demo */}
        <button
          onClick={resetToDefaults}
          className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-zinc-400 hover:text-buzz-yellow flex items-center gap-1.5 transition-all"
          title="Reset initial demo dataset"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Demo Data
        </button>

        {/* Live Notification Indicator */}
        <div className="relative p-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white cursor-pointer">
          <Bell className="w-4 h-4" />
          {pendingOrdersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-buzz-yellow text-buzz-black text-[9px] font-black flex items-center justify-center animate-pulse">
              {pendingOrdersCount}
            </span>
          )}
        </div>

        {/* Admin Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-buzz-yellow text-buzz-black font-black flex items-center justify-center text-xs shadow-buzz-glow">
            DV
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-bold text-white leading-none">
              {adminUser ? adminUser.name : 'David Vance'}
            </span>
            <span className="text-[10px] text-buzz-yellow font-medium leading-tight">
              Restaurant Manager
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
