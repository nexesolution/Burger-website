import React, { useState } from 'react';
import { ShoppingBag, Eye, Printer, Filter, CheckCircle2 } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';
import { Order, OrderStatus } from '../../types';
import { ReceiptModal } from '../../components/ui/ReceiptModal';

export const OrdersAdminPage: React.FC = () => {
  const orders = useBuzzStore((state) => state.orders);
  const riders = useBuzzStore((state) => state.riders);
  const updateOrderStatus = useBuzzStore((state) => state.updateOrderStatus);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            MASTER ORDER <span className="text-buzz-yellow">LEDGER</span>
          </h1>
          <p className="text-xs text-zinc-400">
            View, track, update status, assign riders, and print receipts for all restaurant orders.
          </p>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          {['all', 'Received', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-buzz-yellow text-buzz-black shadow-buzz-glow font-black'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              {st === 'all' ? 'All Orders' : st}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-3xl glass-panel border border-zinc-800 overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="text-[10px] font-bold text-zinc-400 uppercase border-b border-zinc-800 pb-2">
            <tr>
              <th className="pb-3">Order Number</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Total Amount</th>
              <th className="pb-3">Payment</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Assigned Rider</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {filteredOrders.map((ord) => (
              <tr key={ord.id} className="hover:bg-zinc-900/50">
                <td className="py-3 font-mono font-bold text-buzz-yellow">#{ord.orderNumber}</td>
                <td className="py-3 font-bold text-white">{ord.customerName}</td>
                <td className="py-3 text-zinc-400">{ord.orderType}</td>
                <td className="py-3 font-bold text-white">Rs. {Math.round(ord.total).toLocaleString()}</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-medium">
                    {ord.paymentMethod} ({ord.paymentStatus})
                  </span>
                </td>
                <td className="py-3">
                  <select
                    value={ord.status}
                    onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                    className="bg-zinc-950 border border-zinc-800 text-white rounded-lg p-1.5 text-[11px] font-bold focus:outline-none focus:border-buzz-yellow"
                  >
                    <option value="Received">Received</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Ready">Ready</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-3">
                  <select
                    value={ord.riderId || ''}
                    onChange={(e) => updateOrderStatus(ord.id, ord.status, e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg p-1.5 text-[11px]"
                  >
                    <option value="">Unassigned</option>
                    {riders.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.vehicle.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => setReceiptOrder(ord)}
                    className="p-1.5 rounded-lg bg-zinc-900 text-buzz-yellow hover:bg-zinc-800"
                    title="Print Thermal Receipt"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReceiptModal
        order={receiptOrder}
        isOpen={!!receiptOrder}
        onClose={() => setReceiptOrder(null)}
      />
    </div>
  );
};
