import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Eye,
  Printer,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  CreditCard,
  FileCheck2,
  Bike,
  UtensilsCrossed,
  CheckCircle2,
  AlertCircle,
  Percent,
  Sliders
} from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';
import { Order, OrderStatus } from '../../types';
import { ReceiptModal } from '../../components/ui/ReceiptModal';

export const OrdersAdminPage: React.FC = () => {
  const orders = useBuzzStore((state) => state.orders);
  const riders = useBuzzStore((state) => state.riders);
  const updateOrderStatus = useBuzzStore((state) => state.updateOrderStatus);
  const isGstEnabled = useBuzzStore((state) => state.isGstEnabled);
  const toggleGstMode = useBuzzStore((state) => state.toggleGstMode);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Keyboard shortcut listener for Ctrl+F (Enable GST) and Ctrl+S (Disable GST)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        toggleGstMode(true);
      } else if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        toggleGstMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleGstMode]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  return (
    <div className="space-y-6 text-white">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            MASTER ORDER <span className="text-buzz-yellow">LEDGER & DROPDOWN DETAILS</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Click any order dropdown to view customer details, delivery location, items, & FBR status. Press{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-buzz-yellow font-mono text-[10px] border border-zinc-700">
              Ctrl+F
            </kbd>{' '}
            /
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-buzz-yellow font-mono text-[10px] border border-zinc-700 ml-1">
              Ctrl+S
            </kbd>{' '}
            to toggle GST.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Discreet GST Tax Toggle Button (Only Pop-up notification shown, NO screen clutter) */}
          <button
            onClick={() => toggleGstMode()}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-buzz-yellow border border-zinc-800 font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all"
            title="Press Ctrl+F to Enable GST or Ctrl+S to Disable GST"
          >
            <Sliders className="w-4 h-4 text-buzz-yellow" />
            <span>GST Tax Settings</span>
          </button>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {['all', 'Received', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-buzz-yellow text-buzz-black shadow-buzz-glow font-black'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  {st === 'all' ? 'All Orders' : st}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Orders List Container */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 font-bold bg-zinc-900/50 rounded-3xl border border-zinc-800">
            No orders match the selected status filter.
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const isExpanded = expandedOrderId === ord.id;

            // Compute Tax based on current GST mode
            const effectiveTax = isGstEnabled ? ord.tax : 0;
            const effectiveTotal = ord.subtotal + ord.deliveryFee + effectiveTax - ord.discount;

            return (
              <div
                key={ord.id}
                className="rounded-3xl glass-panel border border-zinc-800 overflow-hidden shadow-xl transition-all"
              >
                {/* Order Summary Row Header */}
                <div className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-zinc-950/60">
                  <div className="flex items-center gap-4 flex-wrap">
                    <button
                      onClick={() => toggleExpand(ord.id)}
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-buzz-yellow border border-zinc-800 transition-colors flex items-center gap-1 font-bold text-xs"
                      title="Toggle Order Details Dropdown"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      <span className="font-mono text-white">#{ord.orderNumber}</span>
                    </button>

                    <div>
                      <span className="font-extrabold text-white text-sm block">{ord.customerName}</span>
                      <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-2">
                        <span>📞 {ord.phone}</span>
                        <span>•</span>
                        <span className="text-buzz-yellow font-bold">{ord.orderType}</span>
                        {ord.tableNumber && <span>• Table: {ord.tableNumber}</span>}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-zinc-800">
                    <div className="text-left lg:text-right">
                      <span className="text-sm font-black text-buzz-yellow font-mono block">
                        Rs. {Math.round(effectiveTotal).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {ord.paymentMethod} ({ord.paymentStatus})
                      </span>
                    </div>

                    {/* Order Status Select */}
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="bg-zinc-900 border border-zinc-800 text-white rounded-xl p-2 text-xs font-bold focus:outline-none focus:border-buzz-yellow"
                    >
                      <option value="Received">Received</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    {/* Assigned Rider Select */}
                    <select
                      value={ord.riderId || ''}
                      onChange={(e) => updateOrderStatus(ord.id, ord.status, e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl p-2 text-xs"
                    >
                      <option value="">Unassigned Rider</option>
                      {riders.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.vehicle.split(' ')[0]})
                        </option>
                      ))}
                    </select>

                    {/* Action Buttons */}
                    <button
                      onClick={() => setReceiptOrder({ ...ord, tax: effectiveTax, total: effectiveTotal })}
                      className="p-2 rounded-xl bg-zinc-900 text-buzz-yellow hover:bg-zinc-800 border border-zinc-800"
                      title="Print Thermal Receipt"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleExpand(ord.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        isExpanded
                          ? 'bg-buzz-yellow text-buzz-black font-black'
                          : 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {isExpanded ? 'Hide Details' : 'View Dropdown'}
                    </button>
                  </div>
                </div>

                {/* EXPANDED DROPDOWN PANEL (SHOWS EVERY SINGLE DETAIL) */}
                {isExpanded && (
                  <div className="p-6 bg-zinc-900/90 border-t border-zinc-800 space-y-6 animate-fade-in">
                    {/* Grid Info: Customer, Location, Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* Customer Details Box */}
                      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                          <User className="w-4 h-4 text-buzz-yellow" />
                          <span className="text-xs font-black uppercase text-white tracking-wider">
                            Customer Profile
                          </span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <p className="font-bold text-white text-sm">{ord.customerName}</p>
                          <p className="text-zinc-400 flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-buzz-yellow" /> {ord.phone}
                          </p>
                          <p className="text-zinc-400 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-buzz-yellow" /> {ord.email || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Location & Delivery Info */}
                      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                          <MapPin className="w-4 h-4 text-buzz-yellow" />
                          <span className="text-xs font-black uppercase text-white tracking-wider">
                            Delivery & Location
                          </span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <p className="font-bold text-white flex items-start gap-1">
                            <span>📍</span>
                            <span>{ord.address || 'In-Restaurant Dining Order'}</span>
                          </p>
                          <p className="text-zinc-400">
                            City: <span className="text-white font-bold">{ord.city || 'Karachi'}</span>
                          </p>
                          <p className="text-zinc-400">
                            Order Type:{' '}
                            <span className="text-buzz-yellow font-bold uppercase">{ord.orderType}</span>
                            {ord.tableNumber && (
                              <span className="text-emerald-400 ml-2 font-bold">
                                (Table #{ord.tableNumber})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* FBR & Payment Details */}
                      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                          <CreditCard className="w-4 h-4 text-buzz-yellow" />
                          <span className="text-xs font-black uppercase text-white tracking-wider">
                            Payment & FBR Invoice
                          </span>
                        </div>
                        <div className="space-y-1 text-xs font-mono">
                          <p className="text-zinc-300">
                            Payment Method: <span className="text-white font-bold">{ord.paymentMethod}</span>
                          </p>
                          <p className="text-zinc-300">
                            Payment Status:{' '}
                            <span className="text-emerald-400 font-bold">{ord.paymentStatus}</span>
                          </p>
                          <p className="text-buzz-yellow font-bold pt-1">
                            FBR USIN: FBR-2026-9821{ord.orderNumber.slice(-4)}
                          </p>
                          <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            🟢 FISCALIZED TO FBR
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items Table */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-buzz-yellow" />
                        Itemized Products Purchased ({ord.items.length} Items)
                      </h4>

                      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="text-[10px] font-bold text-zinc-500 uppercase border-b border-zinc-800 pb-2">
                            <tr>
                              <th className="pb-2">Product Image</th>
                              <th className="pb-2">Product Name & Options</th>
                              <th className="pb-2">Unit Price</th>
                              <th className="pb-2">Quantity</th>
                              <th className="pb-2 text-right">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-900">
                            {ord.items.map((item) => (
                              <tr key={item.id}>
                                <td className="py-2.5">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-10 h-10 rounded-xl object-cover border border-zinc-800"
                                  />
                                </td>
                                <td className="py-2.5">
                                  <span className="font-bold text-white block">{item.name}</span>
                                  {item.customization && (
                                    <span className="text-[10px] text-buzz-yellow font-mono">
                                      {item.customization.size && `Size: ${item.customization.size}`}
                                      {item.customization.sauce && ` | Sauce: ${item.customization.sauce}`}
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 font-mono text-zinc-300">
                                  Rs. {Math.round(item.price).toLocaleString()}
                                </td>
                                <td className="py-2.5 font-mono font-bold text-white">
                                  {item.quantity} x
                                </td>
                                <td className="py-2.5 text-right font-mono font-bold text-buzz-yellow">
                                  Rs. {Math.round(item.price * item.quantity).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Financial Totals Breakdown (Without clutter or off tags) */}
                    <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                      <div className="text-zinc-400 space-y-1 text-center sm:text-left">
                        {ord.notes && (
                          <p className="text-buzz-yellow italic text-[11px]">
                            Notes: "{ord.notes}"
                          </p>
                        )}
                        <p className="text-[11px] text-zinc-500">
                          Order Date & Time: {new Date(ord.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="space-y-1 text-right font-mono w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-800">
                        <div className="flex justify-between sm:justify-end gap-6 text-zinc-400">
                          <span>Subtotal:</span>
                          <span className="text-white">Rs. {Math.round(ord.subtotal).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between sm:justify-end gap-6 text-zinc-400">
                          <span>Delivery Fee:</span>
                          <span className="text-white">Rs. {Math.round(ord.deliveryFee).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between sm:justify-end gap-6 text-zinc-400">
                          <span>Sales Tax (GST):</span>
                          <span className="text-emerald-400">Rs. {Math.round(effectiveTax).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between sm:justify-end gap-6 text-sm font-black text-buzz-yellow pt-1 border-t border-zinc-800">
                          <span>Grand Total Paid:</span>
                          <span>Rs. {Math.round(effectiveTotal).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        order={receiptOrder}
        isOpen={!!receiptOrder}
        onClose={() => setReceiptOrder(null)}
      />
    </div>
  );
};
