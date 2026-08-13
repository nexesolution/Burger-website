import React, { useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Shield,
  FileCheck,
  Ban,
  Layers
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useBuzzStore } from '../../store/useBuzzStore';

const SALES_GRAPH_DATA = [
  { time: '11:00 AM', sales: 240, orders: 8 },
  { time: '01:00 PM', sales: 890, orders: 24 },
  { time: '03:00 PM', sales: 520, orders: 14 },
  { time: '05:00 PM', sales: 1100, orders: 32 },
  { time: '07:00 PM', sales: 1850, orders: 48 },
  { time: '09:00 PM', sales: 1420, orders: 38 },
  { time: '11:00 PM', sales: 780, orders: 19 }
];

export const DashboardHome: React.FC = () => {
  const orders = useBuzzStore((state) => state.orders);
  const inventory = useBuzzStore((state) => state.inventory);
  const products = useBuzzStore((state) => state.products);
  const adminUser = useBuzzStore((state) => state.adminUser);

  const [dateFilter, setDateFilter] = useState<'Today' | '7 Days' | '30 Days'>('Today');

  // Check if current logged-in role is Superadmin
  const isSuperadmin = adminUser?.role?.toLowerCase() === 'superadmin';

  // Orders audit breakdown:
  // Official FBR Orders = Orders where GST Tax was applied (tax > 0 or FBR reported)
  const fbrOfficialOrders = orders.filter(
    (o) => o.tax > 0 || (o.notes && o.notes.includes('FBR REPORTED: Yes'))
  );
  const nonFbrOrders = orders.filter(
    (o) => !(o.tax > 0 || (o.notes && o.notes.includes('FBR REPORTED: Yes')))
  );

  // Active Orders for calculation:
  // Standard Admin/Manager sees ONLY official FBR declared revenue.
  // Superadmin Profile sees 100% COMPLETE total revenue (GST active + GST off combined).
  const activeOrders = isSuperadmin ? orders : fbrOfficialOrders;

  const totalSalesAmount = activeOrders.reduce((acc, o) => acc + o.total, 0);
  const fbrSalesAmount = fbrOfficialOrders.reduce((acc, o) => acc + o.total, 0);
  const nonFbrSalesAmount = nonFbrOrders.reduce((acc, o) => acc + o.total, 0);
  const masterTotalAmount = orders.reduce((acc, o) => acc + o.total, 0);

  const averageOrderVal = activeOrders.length > 0 ? totalSalesAmount / activeOrders.length : 0;
  const lowStockCount = inventory.filter((i) => i.currentStock <= i.lowStockThreshold).length;

  return (
    <div className="space-y-8 text-white">
      {/* Top Banner Header & Date Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
              RESTAURANT <span className="text-buzz-yellow">ANALYTICS</span>
            </h1>
            {isSuperadmin && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-black tracking-wide border border-emerald-500/30 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> SUPERADMIN MASTER PROFILE
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400">
            Real-time performance metrics, orders, sales overview & inventory alerts.
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
          {(['Today', '7 Days', '30 Days'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setDateFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                dateFilter === filter
                  ? 'bg-buzz-yellow text-buzz-black shadow-buzz-glow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Superadmin Master Revenue Breakdown Audit Card (Shown ONLY for Superadmin Profile) */}
      {isSuperadmin && (
        <div className="p-6 rounded-3xl bg-emerald-950/30 border border-emerald-500/40 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-black font-display text-white">
                SUPERADMIN MASTER REVENUE AUDIT
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              100% COMPLETE SALES REPORT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-1">
              <span className="text-[11px] text-zinc-400 font-sans font-semibold flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" /> Official FBR Declared Sales
              </span>
              <span className="block text-2xl font-black text-emerald-400 font-display">
                Rs. {Math.round(fbrSalesAmount).toLocaleString()}
              </span>
              <span className="text-[10px] text-zinc-500 block font-sans">
                {fbrOfficialOrders.length} FBR Tax Orders
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-1">
              <span className="text-[11px] text-zinc-400 font-sans font-semibold flex items-center gap-1">
                <Ban className="w-3.5 h-3.5 text-buzz-yellow" /> Direct Sales (GST Off)
              </span>
              <span className="block text-2xl font-black text-buzz-yellow font-display">
                Rs. {Math.round(nonFbrSalesAmount).toLocaleString()}
              </span>
              <span className="text-[10px] text-zinc-500 block font-sans">
                {nonFbrOrders.length} Non-GST Orders
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-emerald-500/30 space-y-1">
              <span className="text-[11px] text-emerald-300 font-sans font-extrabold flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-400" /> Complete Combined Revenue
              </span>
              <span className="block text-2xl font-black text-white font-display">
                Rs. {Math.round(masterTotalAmount).toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400/80 block font-sans font-bold">
                100% Grand Total ({orders.length} Orders)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Standard KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Sales */}
        <div className="p-5 rounded-2xl glass-card border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="p-2 rounded-xl bg-buzz-yellow/10 text-buzz-yellow">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-display text-white">
              Rs. {Math.round(totalSalesAmount).toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
            </span>
          </div>
        </div>

        {/* Orders */}
        <div className="p-5 rounded-2xl glass-card border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-display text-white">{activeOrders.length}</span>
            <span className="text-xs text-emerald-400 font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +8.5%
            </span>
          </div>
        </div>

        {/* Avg Order Value */}
        <div className="p-5 rounded-2xl glass-card border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Avg Order Value
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-display text-white">
              Rs. {Math.round(averageOrderVal).toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +3.1%
            </span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-5 rounded-2xl glass-card border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Low Stock Alert
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-buzz-yellow">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-display text-buzz-yellow">
              {lowStockCount} Items
            </span>
            <span className="text-[11px] text-zinc-400">Requires Restock</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Revenue Trend Chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-display text-white">Hourly Sales Revenue</h3>
              <p className="text-xs text-zinc-400">Revenue trends across operating peak hours</p>
            </div>
            <span className="text-xs font-bold text-buzz-yellow bg-buzz-yellow/10 px-3 py-1 rounded-full border border-buzz-yellow/30">
              LIVE POS STREAM
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_GRAPH_DATA}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F5C400" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F5C400" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="time" stroke="#a1a1aa" fontSize={11} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickFormatter={(val) => `Rs. ${val}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121215',
                    borderColor: '#27272a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#F5C400"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#salesGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="lg:col-span-4 p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
          <h3 className="text-lg font-bold font-display text-white">Top Sellers</h3>
          <div className="space-y-3">
            {products.slice(0, 5).map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-buzz-yellow text-buzz-black font-black text-center leading-6 text-[11px]">
                    0{idx + 1}
                  </span>
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">{p.name}</span>
                    <span className="text-[10px] text-zinc-400">Rs. {p.price.toLocaleString()}</span>
                  </div>
                </div>
                <span className="font-bold text-buzz-yellow">{80 - idx * 12} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
