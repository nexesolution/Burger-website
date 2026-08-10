import React, { useState } from 'react';
import { Download, BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useBuzzStore } from '../../store/useBuzzStore';

const REPORT_DATA = [
  { day: 'Mon', revenue: 1420, expense: 420 },
  { day: 'Tue', revenue: 1890, expense: 510 },
  { day: 'Wed', revenue: 2100, expense: 480 },
  { day: 'Thu', revenue: 2450, expense: 620 },
  { day: 'Fri', revenue: 3800, expense: 890 },
  { day: 'Sat', revenue: 4200, expense: 950 },
  { day: 'Sun', revenue: 3500, expense: 810 }
];

export const SalesReportsPage: React.FC = () => {
  const orders = useBuzzStore((state) => state.orders);
  const expenses = useBuzzStore((state) => state.expenses);
  const showToast = useBuzzStore((state) => state.showToast);

  const [dateRange, setDateRange] = useState('This Week');

  const grossSales = orders.reduce((acc, o) => acc + o.total, 0);
  const totalExp = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = grossSales - totalExp;

  const handleExportCSV = () => {
    showToast('Exporting Sales Report to CSV...');
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            SALES & FINANCIAL <span className="text-buzz-yellow">REPORTS</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Revenue charts, expense ratio & net profit estimation.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-buzz-yellow text-buzz-black font-extrabold text-xs shadow-buzz-glow flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> EXPORT REPORT CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-card border border-zinc-800 space-y-1">
          <span className="text-xs font-bold text-zinc-400 uppercase">Gross Sales Revenue</span>
          <span className="block text-3xl font-black font-display text-buzz-yellow">
            ${grossSales.toFixed(2)}
          </span>
        </div>
        <div className="p-6 rounded-3xl glass-card border border-zinc-800 space-y-1">
          <span className="text-xs font-bold text-zinc-400 uppercase">Total Operational Cost</span>
          <span className="block text-3xl font-black font-display text-red-400">
            ${totalExp.toFixed(2)}
          </span>
        </div>
        <div className="p-6 rounded-3xl glass-card border border-zinc-800 space-y-1">
          <span className="text-xs font-bold text-zinc-400 uppercase">Estimated Net Profit</span>
          <span className="block text-3xl font-black font-display text-emerald-400">
            ${netProfit.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-4">
        <h3 className="text-lg font-bold font-display text-white">Revenue vs Operating Expense</h3>
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REPORT_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="day" stroke="#a1a1aa" fontSize={11} />
              <YAxis stroke="#a1a1aa" fontSize={11} tickFormatter={(val) => `$${val}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#121215',
                  borderColor: '#27272a',
                  borderRadius: '12px'
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#F5C400" name="Revenue ($)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#f43f5e" name="Expenses ($)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
