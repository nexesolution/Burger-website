import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, CheckCircle2, Clock, MapPin, Truck, ChefHat, PackageCheck, AlertCircle } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';
import { OrderStatus } from '../../types';

const STATUS_STEPS: { status: OrderStatus; label: string; icon: any }[] = [
  { status: 'Received', label: 'Order Received', icon: Clock },
  { status: 'Confirmed', label: 'Confirmed by Restaurant', icon: CheckCircle2 },
  { status: 'Preparing', label: 'Chef Preparing', icon: ChefHat },
  { status: 'Ready', label: 'Kitchen Ready', icon: PackageCheck },
  { status: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
  { status: 'Delivered', label: 'Delivered', icon: CheckCircle2 }
];

export const OrderTrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const orders = useBuzzStore((state) => state.orders);

  const [searchQuery, setSearchQuery] = useState(initialId);

  // Find order by ID or orderNumber
  const targetOrder = orders.find(
    (o) =>
      o.orderNumber.toLowerCase() === searchQuery.trim().toLowerCase() ||
      o.id.toLowerCase() === searchQuery.trim().toLowerCase()
  ) || orders[0];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Cancelled') return -1;
    return STATUS_STEPS.findIndex((s) => s.status === status);
  };

  const currentStepIdx = targetOrder ? getStepIndex(targetOrder.status) : 0;

  return (
    <div className="min-h-screen pt-32 pb-24 text-white bg-buzz-black space-y-12">
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-8">
        {/* Header & Lookup Bar */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
            LIVE ORDER <span className="text-buzz-yellow">TRACKING</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Track your burger prep in real-time from the smash grill to your doorstep.
          </p>

          {/* Search Box */}
          <div className="max-w-md mx-auto relative pt-2">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Order # e.g. BZ-2026-00128"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-2xl pl-12 pr-4 py-3 text-xs focus:outline-none focus:border-buzz-yellow font-mono uppercase"
            />
          </div>
        </div>

        {targetOrder ? (
          <div className="space-y-8">
            {/* Main Status Hero Card */}
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-buzz-yellow/30 shadow-buzz-glow space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
                <div>
                  <span className="text-xs text-buzz-yellow font-mono font-bold block">
                    ORDER #{targetOrder.orderNumber}
                  </span>
                  <h2 className="text-2xl font-black font-display text-white mt-1">
                    Customer: {targetOrder.customerName}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">{targetOrder.address}</p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="px-4 py-1.5 rounded-full bg-buzz-yellow text-buzz-black text-xs font-black uppercase tracking-wider shadow-buzz-glow inline-block">
                    {targetOrder.status}
                  </span>
                  <span className="block text-[11px] text-zinc-400 mt-1">
                    Estimated Time: 15-20 Mins
                  </span>
                </div>
              </div>

              {/* Animated Progress Stepper */}
              <div className="py-6">
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    const IconComponent = step.icon;

                    return (
                      <div key={step.status} className="flex md:flex-col items-center gap-3 md:gap-2 z-10 flex-1">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                            isCurrent
                              ? 'bg-buzz-yellow text-buzz-black shadow-buzz-glow font-bold scale-110'
                              : isCompleted
                              ? 'bg-zinc-800 text-buzz-yellow border border-buzz-yellow/40'
                              : 'bg-zinc-900 text-zinc-600 border border-zinc-800'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-xs font-bold text-center ${
                            isCompleted ? 'text-white' : 'text-zinc-500'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Driver / Rider info if assigned */}
              {targetOrder.riderName && (
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Truck className="w-6 h-6 text-buzz-yellow" />
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Rider Assigned: {targetOrder.riderName}
                      </span>
                      <span className="text-[11px] text-zinc-400">On transit to delivery address</span>
                    </div>
                  </div>
                  <span className="text-xs text-buzz-yellow font-bold">En Route</span>
                </div>
              )}
            </div>

            {/* Itemized Receipt breakdown */}
            <div className="p-6 rounded-3xl glass-card border border-zinc-800 space-y-4">
              <h3 className="text-lg font-bold font-display text-white">Order Summary</h3>
              <div className="space-y-3">
                {targetOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-zinc-200">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-mono text-zinc-400 font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-zinc-800 flex justify-between font-black text-lg text-white font-display">
                <span>Total Paid ({targetOrder.paymentMethod})</span>
                <span className="text-buzz-yellow">${targetOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 rounded-3xl glass-panel text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-xl font-bold text-white">No Order Found</h3>
            <p className="text-xs text-zinc-400">Check your order number or browse our menu.</p>
          </div>
        )}
      </div>
    </div>
  );
};
