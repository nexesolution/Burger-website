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
  Check
} from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

export const RiderWorkspacePage: React.FC = () => {
  const orders = useBuzzStore((state) => state.orders);
  const updateOrderStatus = useBuzzStore((state) => state.updateOrderStatus);
  const adminUser = useBuzzStore((state) => state.adminUser);
  const showToast = useBuzzStore((state) => state.showToast);

  const [isOnDuty, setIsOnDuty] = useState(true);

  // Filter delivery orders assigned or available for delivery
  const deliveryOrders = orders.filter(
    (o) => o.orderType === 'Delivery' && (o.status === 'Preparing' || o.status === 'Out for Delivery')
  );

  const completedToday = orders.filter(
    (o) => o.orderType === 'Delivery' && o.status === 'Delivered'
  );

  const totalCashCollected = completedToday.reduce((sum, o) => sum + o.total, 0);

  const handleStartDelivery = (orderId: string, orderNum: string) => {
    updateOrderStatus(orderId, 'Out for Delivery');
    showToast(`Order #${orderNum} marked OUT FOR DELIVERY! 🛵`, 'success');
  };

  const handleCompleteDelivery = (orderId: string, orderNum: string, total: number) => {
    updateOrderStatus(orderId, 'Delivered');
    showToast(`Order #${orderNum} DELIVERED! Collected Rs. ${Math.round(total).toLocaleString()}`, 'success');
  };

  return (
    <div className="space-y-6 text-white max-w-4xl mx-auto">
      {/* Rider Header & Duty Toggle Bar */}
      <div className="p-6 rounded-3xl glass-panel border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-buzz-yellow text-buzz-black flex items-center justify-center font-black shadow-buzz-glow">
            <Bike className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black font-display tracking-tight text-white">
                RIDER TERMINAL
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                ACTIVE RIDER
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Welcome back, <span className="text-buzz-yellow font-bold">{adminUser?.name || 'Rider'}</span>
            </p>
          </div>
        </div>

        {/* Duty Status Switch */}
        <button
          onClick={() => {
            setIsOnDuty(!isOnDuty);
            showToast(isOnDuty ? 'Duty status set to OFFLINE' : 'Duty status set to ON DUTY! 🛵', isOnDuty ? 'info' : 'success');
          }}
          className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-lg ${
            isOnDuty
              ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isOnDuty ? '🟢 ON DUTY / ONLINE' : '🔴 OFFLINE / SHIFT END'}</span>
        </button>
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
          <span className="text-2xl font-black font-display text-buzz-yellow">
            Rs. {Math.round(totalCashCollected).toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Active Deliveries
          </span>
          <span className="text-2xl font-black font-display text-sky-400">
            {deliveryOrders.length} Pending
          </span>
        </div>
      </div>

      {/* Active Orders List */}
      <div className="space-y-4">
        <h3 className="text-lg font-black font-display text-white flex items-center gap-2">
          <Package className="w-5 h-5 text-buzz-yellow" /> ACTIVE DELIVERY ORDERS
        </h3>

        {!isOnDuty ? (
          <div className="p-8 rounded-3xl bg-zinc-950/60 border border-zinc-800 text-center space-y-2">
            <Power className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-sm font-bold text-zinc-400">You are currently OFFLINE</p>
            <p className="text-xs text-zinc-500">Switch to ON DUTY above to receive delivery tasks</p>
          </div>
        ) : deliveryOrders.length === 0 ? (
          <div className="p-8 rounded-3xl bg-zinc-950/60 border border-dashed border-zinc-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-white">All deliveries completed!</p>
            <p className="text-xs text-zinc-500">New delivery orders assigned by counter will appear here live.</p>
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
                      {ord.status.toUpperCase()}
                    </span>
                  </div>

                  <span className="text-base font-black font-mono text-buzz-yellow">
                    Collect COD: Rs. {Math.round(ord.total).toLocaleString()}
                  </span>
                </div>

                {/* Customer Details & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                      Customer Info
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
                      Delivery Address
                    </span>
                    <p className="font-medium text-zinc-300 flex items-start gap-1">
                      <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      {ord.address}, {ord.city}
                    </p>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs space-y-1">
                  <span className="text-[10px] text-zinc-400 font-bold block uppercase">
                    Items to Deliver ({ord.items.reduce((a, b) => a + b.quantity, 0)})
                  </span>
                  <div className="flex flex-wrap gap-2 text-[11px] text-zinc-300 font-mono">
                    {ord.items.map((item, idx) => (
                      <span key={idx} className="bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rider Action Buttons */}
                <div className="pt-2 flex gap-3">
                  {ord.status === 'Preparing' && (
                    <button
                      onClick={() => handleStartDelivery(ord.id, ord.orderNumber)}
                      className="flex-1 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <Navigation className="w-4 h-4" /> START DELIVERY (OUT FOR DELIVERY)
                    </button>
                  )}

                  {ord.status === 'Out for Delivery' && (
                    <button
                      onClick={() => handleCompleteDelivery(ord.id, ord.orderNumber, ord.total)}
                      className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <Check className="w-4 h-4" /> COMPLETE DELIVERY & COLLECT CASH
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
