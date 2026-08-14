import React, { useState } from 'react';
import {
  Bike,
  CheckCircle2,
  MapPin,
  Phone,
  Clock,
  DollarSign,
  Navigation,
  Power,
  ShieldCheck,
  Package,
  Check,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';
import { Rider } from '../../types';

export const RiderWorkspacePage: React.FC = () => {
  const orders = useBuzzStore((state) => state.orders);
  const riders = useBuzzStore((state) => state.riders);
  const updateOrderStatus = useBuzzStore((state) => state.updateOrderStatus);
  const adminUser = useBuzzStore((state) => state.adminUser);
  const showToast = useBuzzStore((state) => state.showToast);

  const [isOnDuty, setIsOnDuty] = useState(true);
  const [selectedRiderId, setSelectedRiderId] = useState<string>(() => {
    if (adminUser?.name) {
      const match = riders.find(
        (r) => r.name.toLowerCase().includes(adminUser.name.toLowerCase()) || adminUser.name.toLowerCase().includes(r.name.toLowerCase())
      );
      if (match) return match.id;
    }
    return riders[0]?.id || '';
  });

  const activeRider = riders.find((r) => r.id === selectedRiderId) || riders[0];
  const activeRiderName = activeRider?.name?.toLowerCase();

  // Filter delivery orders assigned to active rider (or unassigned delivery orders)
  const deliveryOrders = orders.filter((o) => {
    if (o.orderType !== 'Delivery') return false;
    if (o.status === 'Delivered' || o.status === 'Cancelled') return false;
    if (activeRiderName && o.riderName) {
      return o.riderName.toLowerCase().includes(activeRiderName) || activeRiderName.includes(o.riderName.toLowerCase());
    }
    return true;
  });

  const completedToday = orders.filter((o) => {
    if (o.orderType !== 'Delivery' || o.status !== 'Delivered') return false;
    if (activeRiderName && o.riderName) {
      return o.riderName.toLowerCase().includes(activeRiderName) || activeRiderName.includes(o.riderName.toLowerCase());
    }
    return true;
  });

  const totalCashCollected = completedToday.reduce((sum, o) => sum + o.total, 0);

  // Rider Action 1: Mark Out For Delivery
  const handleStartDelivery = (orderId: string, orderNum: string) => {
    updateOrderStatus(orderId, 'Out for Delivery', activeRider?.id);
    showToast(`Order #${orderNum} marked OUT FOR DELIVERY! 🛵 (Synced to Supabase)`, 'success');
  };

  // Rider Action 2: Mark Delivered & Cash Collected
  const handleCompleteDelivery = (orderId: string, orderNum: string, total: number) => {
    updateOrderStatus(orderId, 'Delivered', activeRider?.id);
    showToast(`Order #${orderNum} DELIVERED! Collected Rs. ${Math.round(total).toLocaleString()} Cash (Synced to Supabase)`, 'success');
  };

  return (
    <div className="space-y-6 text-white max-w-4xl mx-auto">
      {/* Rider Header & Rider Selector Bar */}
      <div className="p-6 rounded-3xl glass-panel border border-zinc-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-buzz-yellow text-buzz-black flex items-center justify-center font-black shadow-buzz-glow">
            <Bike className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black font-display tracking-tight text-white">
                RIDER TERMINAL WORKSPACE
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                🟢 REALTIME SUPABASE SYNC
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Active Rider:{' '}
              <span className="text-buzz-yellow font-bold">
                {activeRider ? activeRider.name : adminUser?.name || 'Rider Fleet'}
              </span>
              {activeRider && <span className="text-zinc-500 font-mono ml-2">({activeRider.vehicle})</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto">
          {/* Rider Account Switcher Dropdown */}
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl px-3 py-2 text-xs">
            <UserCheck className="w-4 h-4 text-buzz-yellow" />
            <select
              value={selectedRiderId}
              onChange={(e) => setSelectedRiderId(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none"
            >
              {riders.map((r) => (
                <option key={r.id} value={r.id} className="bg-zinc-900 text-white">
                  {r.name} ({r.vehicle.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Duty Status Switch */}
          <button
            onClick={() => {
              setIsOnDuty(!isOnDuty);
              showToast(isOnDuty ? 'Duty status set to OFFLINE' : 'Duty status set to ON DUTY! 🛵', isOnDuty ? 'info' : 'success');
            }}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-lg ${
              isOnDuty
                ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isOnDuty ? '🟢 ON DUTY' : '🔴 OFFLINE'}</span>
          </button>
        </div>
      </div>

      {/* Rider Today Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Deliveries Completed Today
          </span>
          <span className="text-2xl font-black font-display text-emerald-400">
            {completedToday.length} Orders
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Total Cash Collected (COD)
          </span>
          <span className="text-2xl font-black font-display text-buzz-yellow font-mono">
            Rs. {Math.round(totalCashCollected).toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Active Assigned Deliveries
          </span>
          <span className="text-2xl font-black font-display text-sky-400">
            {deliveryOrders.length} Pending
          </span>
        </div>
      </div>

      {/* Active Delivery Tasks Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-black font-display text-white flex items-center gap-2">
          <Package className="w-5 h-5 text-buzz-yellow" /> ACTIVE ASSIGNED DELIVERY TASKS
        </h3>

        {!isOnDuty ? (
          <div className="p-8 rounded-3xl bg-zinc-950/60 border border-zinc-800 text-center space-y-2">
            <Power className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-sm font-bold text-zinc-400">You are currently OFFLINE</p>
            <p className="text-xs text-zinc-500">Toggle to ON DUTY above to view delivery orders.</p>
          </div>
        ) : deliveryOrders.length === 0 ? (
          <div className="p-8 rounded-3xl bg-zinc-950/60 border border-dashed border-zinc-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-white">All deliveries completed for {activeRider?.name || 'Rider'}!</p>
            <p className="text-xs text-zinc-500">New delivery orders assigned by counter will appear here in real-time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliveryOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-xl hover:border-buzz-yellow/40 transition-all"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black font-display text-white">
                      ORDER #{ord.orderNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        ord.status === 'Out for Delivery'
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                          : 'bg-amber-500/10 text-buzz-yellow border-amber-500/30'
                      }`}
                    >
                      STATUS: {ord.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-zinc-400 block font-semibold">CASH TO COLLECT</span>
                    <span className="text-base font-black font-mono text-buzz-yellow">
                      Rs. {Math.round(ord.total).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Customer Info & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                      Customer Profile & Phone
                    </span>
                    <p className="font-bold text-white text-sm">{ord.customerName}</p>
                    <a
                      href={`tel:${ord.phone}`}
                      className="inline-flex items-center gap-1.5 text-buzz-yellow hover:underline font-mono font-bold"
                    >
                      <Phone className="w-3.5 h-3.5" /> {ord.phone}
                    </a>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                      Delivery Street Address
                    </span>
                    <p className="font-medium text-zinc-200 flex items-start gap-1">
                      <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{ord.address || 'Standard Delivery'}, {ord.city}</span>
                    </p>
                  </div>
                </div>

                {/* Purchased Items List */}
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs space-y-1.5">
                  <span className="text-[10px] text-zinc-400 font-bold block uppercase">
                    Items to Deliver ({ord.items.reduce((a, b) => a + b.quantity, 0)} Items)
                  </span>
                  <div className="flex flex-wrap gap-2 text-[11px] text-zinc-300 font-mono">
                    {ord.items.map((item, idx) => (
                      <span key={idx} className="bg-zinc-900 px-2.5 py-1 rounded-xl border border-zinc-800 font-bold text-white">
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rider Work Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  {ord.status !== 'Out for Delivery' && (
                    <button
                      onClick={() => handleStartDelivery(ord.id, ord.orderNumber)}
                      className="flex-1 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <Navigation className="w-4 h-4" /> 🛵 MARK OUT FOR DELIVERY
                    </button>
                  )}

                  <button
                    onClick={() => handleCompleteDelivery(ord.id, ord.orderNumber, ord.total)}
                    className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Check className="w-4 h-4" /> 💵 DELIVERED & COLLECTED RS. {Math.round(ord.total).toLocaleString()} CASH
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
