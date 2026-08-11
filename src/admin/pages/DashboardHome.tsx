import React, { useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
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
  const customers = useBuzzStore((state) => state.customers);
  const inventory = useBuzzStore((state) => state.inventory);
  const products = useBuzzStore((state) => state.products);

  const [dateFilter, setDateFilter] = useState<'Today' | '7 Days' | '30 Days'>('Today');

  // Calculation metrics
  const totalSalesAmount = orders.reduce((acc, o) => acc + o.total, 0);
  const averageOrderVal = orders.length > 0 ? totalSalesAmount / orders.length : 0;
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Received' || o.status === 'Preparing'
  ).length;
  const lowStockCount = inventory.filter((i) => i.currentStock <= i.lowStockThreshold).length;

  return (
    <div className="space-y-8 text-white">
      {/* Top Banner Header & Date Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            RESTAURANT <span className="text-buzz-yellow">ANALYTICS</span>
          </h1>
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

      {/* KPI Cards Grid */}
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
            <span className="text-3xl font-black font-display text-white">{orders.length}</span>
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
