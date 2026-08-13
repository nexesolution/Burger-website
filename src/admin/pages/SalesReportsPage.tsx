import React, { useState } from 'react';
import { Download, Shield, FileCheck, Ban, Layers } from 'lucide-react';
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
  { day: 'Mon', revenue: 14200, expense: 4200 },
  { day: 'Tue', revenue: 18900, expense: 5100 },
  { day: 'Wed', revenue: 21000, expense: 4800 },
  { day: 'Thu', revenue: 24500, expense: 6200 },
  { day: 'Fri', revenue: 38000, expense: 8900 },
  { day: 'Sat', revenue: 42000, expense: 9500 },
  { day: 'Sun', revenue: 35000, expense: 8100 }
];

export const SalesReportsPage: React.FC = () => {
  const orders = useBuzzStore((state) => state.orders);
  const expenses = useBuzzStore((state) => state.expenses);
  const adminUser = useBuzzStore((state) => state.adminUser);
  const showToast = useBuzzStore((state) => state.showToast);

  const [dateRange, setDateRange] = useState('This Week');

  const isSuperadmin = adminUser?.role?.toLowerCase() === 'superadmin';

  // Orders breakdown:
  const fbrOfficialOrders = orders.filter(
    (o) => o.tax > 0 || (o.notes && o.notes.includes('FBR REPORTED: Yes'))
  );
  const nonFbrOrders = orders.filter(
    (o) => !(o.tax > 0 || (o.notes && o.notes.includes('FBR REPORTED: Yes')))
  );

  const activeOrders = isSuperadmin ? orders : fbrOfficialOrders;

  const grossSales = activeOrders.reduce((acc, o) => acc + o.total, 0);
  const fbrSalesAmount = fbrOfficialOrders.reduce((acc, o) => acc + o.total, 0);
  const nonFbrSalesAmount = nonFbrOrders.reduce((acc, o) => acc + o.total, 0);
  const masterTotalSales = orders.reduce((acc, o) => acc + o.total, 0);

  const totalExp = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = grossSales - totalExp;

  const handleExportCSV = () => {
    showToast('Exporting Sales Report to CSV...');
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
              SALES & FINANCIAL <span className="text-buzz-yellow">REPORTS</span>
            </h1>
            {isSuperadmin && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-black tracking-wide border border-emerald-500/30 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> SUPERADMIN AUDIT
              </span>
            )}
          </div>
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

      {/* Superadmin Master Audit Card */}
      {isSuperadmin && (
        <div className="p-6 rounded-3xl bg-emerald-950/30 border border-emerald-500/40 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-black font-display text-white">
                SUPERADMIN MASTER SALES AUDIT
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              COMPLETE AUDIT
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
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-1">
              <span className="text-[11px] text-zinc-400 font-sans font-semibold flex items-center gap-1">
                <Ban className="w-3.5 h-3.5 text-buzz-yellow" /> Direct Sales (GST Off)
              </span>
              <span className="block text-2xl font-black text-buzz-yellow font-display">
                Rs. {Math.round(nonFbrSalesAmount).toLocaleString()}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-emerald-500/30 space-y-1">
              <span className="text-[11px] text-emerald-300 font-sans font-extrabold flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-400" /> Master Total Revenue
              </span>
              <span className="block text-2xl font-black text-white font-display">
                Rs. {Math.round(masterTotalSales).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-card border border-zinc-800 space-y-1">
          <span className="text-xs font-bold text-zinc-400 uppercase">Gross Sales Revenue</span>
          <span className="block text-3xl font-black font-display text-buzz-yellow">
            Rs. {Math.round(grossSales).toLocaleString()}
          </span>
        </div>
        <div className="p-6 rounded-3xl glass-card border border-zinc-800 space-y-1">
          <span className="text-xs font-bold text-zinc-400 uppercase">Total Operational Cost</span>
          <span className="block text-3xl font-black font-display text-red-400">
            Rs. {Math.round(totalExp).toLocaleString()}
          </span>
        </div>
        <div className="p-6 rounded-3xl glass-card border border-zinc-800 space-y-1">
          <span className="text-xs font-bold text-zinc-400 uppercase">Estimated Net Profit</span>
          <span className="block text-3xl font-black font-display text-emerald-400">
            Rs. {Math.round(netProfit).toLocaleString()}
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
              <YAxis stroke="#a1a1aa" fontSize={11} tickFormatter={(val) => `Rs. ${val}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#121215',
                  borderColor: '#27272a',
                  borderRadius: '12px'
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#F5C400" name="Revenue (Rs.)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#f43f5e" name="Expenses (Rs.)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
