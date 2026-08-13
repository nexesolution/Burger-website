import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, CheckCircle2, Play, AlertTriangle, Maximize2, Minimize2, Timer } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

// Map storing order preparation start timestamps (orderId -> startTimeMs)
const prepStartTimes: Record<string, number> = {};

export const KitchenDisplayPage: React.FC = () => {
  const orders = useBuzzStore((state) => state.orders);
  const updateOrderStatus = useBuzzStore((state) => state.updateOrderStatus);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [now, setNow] = useState(Date.now());

  // 1-second ticker for live 20-minute countdown timers
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeKitchenOrders = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  );

  const handleStartPreparation = (orderId: string) => {
    prepStartTimes[orderId] = Date.now();
    updateOrderStatus(orderId, 'Preparing');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Calculate 20-minute countdown timer (1200 seconds)
  const getPrepTimerInfo = (orderId: string, createdAtStr: string, status: string) => {
    if (status !== 'Preparing') return null;

    // Use prepStartTimes[orderId] or fallback to order creation time
    const startTime = prepStartTimes[orderId] || new Date(createdAtStr).getTime();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    const totalTimerSeconds = 20 * 60; // 20 minutes = 1200 seconds
    const remainingSeconds = totalTimerSeconds - elapsedSeconds;

    if (remainingSeconds <= 0) {
      return {
        formatted: '00:00 (TIME EXPIRED - OVERDUE!)',
        isCritical: true,
        isWarning: true
      };
    }

    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    return {
      formatted: `${formatted} REMAINING (20 MIN TIMER)`,
      isCritical: remainingSeconds <= 300, // < 5 mins
      isWarning: remainingSeconds <= 600 // < 10 mins
    };
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-buzz-yellow/10 text-buzz-yellow">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-display tracking-tight">
              KITCHEN DISPLAY <span className="text-buzz-yellow">SYSTEM (KDS)</span>
            </h1>
            <p className="text-xs text-zinc-400">
              Live preparation queue with 20-minute target timers per station.
            </p>
          </div>
        </div>

        <button
          onClick={toggleFullscreen}
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-buzz-yellow hover:border-buzz-yellow flex items-center gap-2 transition-all"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}</span>
        </button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeKitchenOrders.map((ord) => {
          let statusBg = 'border-zinc-800';
          if (ord.status === 'Received') statusBg = 'border-sky-500/50 shadow-sky-500/10';
          if (ord.status === 'Preparing') statusBg = 'border-buzz-yellow/60 shadow-buzz-glow';
          if (ord.status === 'Ready') statusBg = 'border-emerald-500/50 shadow-emerald-500/10';

          const timerInfo = getPrepTimerInfo(ord.id, ord.createdAt, ord.status);

          // Clean customer notes (Remove internal FBR system text)
          const customerNotes = ord.notes
            ? ord.notes.split('|').filter((part) => !part.includes('FBR') && !part.includes('Invoice Ref')).join(' ').trim()
            : '';

          return (
            <div
              key={ord.id}
              className={`p-6 rounded-3xl glass-panel border ${statusBg} space-y-4 shadow-xl flex flex-col justify-between`}
            >
              <div className="space-y-4">
                {/* Order Top Meta */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-buzz-yellow block">
                      #{ord.orderNumber}
                    </span>
                    <h3 className="text-lg font-bold font-display text-white mt-0.5">
                      {ord.customerName}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase text-buzz-yellow">
                      {ord.orderType} {ord.tableNumber ? `(${ord.tableNumber})` : ''}
                    </span>
                    <span className="block text-[10px] text-zinc-400 mt-1 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3 text-zinc-500" /> {new Date(ord.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                {/* 20-Minute Kitchen Preparation Countdown Timer */}
                {timerInfo && (
                  <div
                    className={`p-2.5 rounded-2xl border text-center font-mono text-xs font-black flex items-center justify-center gap-2 ${
                      timerInfo.isCritical
                        ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
                        : timerInfo.isWarning
                        ? 'bg-amber-500/20 text-buzz-yellow border-amber-500/50'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    <Timer className="w-4 h-4" />
                    <span>{timerInfo.formatted}</span>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-2">
                  {ord.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs flex justify-between items-start"
                    >
                      <div>
                        <span className="font-extrabold text-white text-sm">
                          {item.quantity}x {item.name}
                        </span>
                        {item.customization && (
                          <div className="text-[10px] text-buzz-yellow font-medium mt-0.5">
                            {item.customization.size && `Size: ${item.customization.size} `}
                            {item.customization.extraCheese && `+Extra Cheese `}
                            {item.customization.sauce && `Sauce: ${item.customization.sauce}`}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Kitchen Customer Notes Only (No FBR debug notes) */}
                {customerNotes && (
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-300 text-xs font-sans">
                    <strong>Special Customer Note:</strong> {customerNotes}
                  </div>
                )}
              </div>

              {/* Progression Buttons */}
              <div className="pt-2">
                {ord.status === 'Received' && (
                  <button
                    onClick={() => handleStartPreparation(ord.id)}
                    className="w-full py-3.5 rounded-xl bg-buzz-yellow text-buzz-black font-extrabold text-xs tracking-wider shadow-buzz-glow flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-buzz-black" /> START PREPARATION (20 MIN TIMER)
                  </button>
                )}

                {ord.status === 'Preparing' && (
                  <button
                    onClick={() => updateOrderStatus(ord.id, 'Ready')}
                    className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4" /> MARK KITCHEN READY
                  </button>
                )}

                {ord.status === 'Ready' && (
                  <button
                    onClick={() => updateOrderStatus(ord.id, 'Out for Delivery')}
                    className="w-full py-3.5 rounded-xl bg-sky-500 text-black font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4" /> DISPATCH ORDER
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
