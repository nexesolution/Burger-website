import React from 'react';
import { Printer, X } from 'lucide-react';
import { Order } from '../../types';
import { useBuzzStore } from '../../store/useBuzzStore';

interface ReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, isOpen, onClose }) => {
  const storeSettings = useBuzzStore((state) => state.storeSettings);
  const fbrConfig = useBuzzStore((state) => state.fbrConfig);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-sm w-full overflow-hidden shadow-buzz-glow flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm font-display">
            <Printer className="w-4 h-4 text-buzz-yellow" />
            <span>THERMAL RECEIPT</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Paper Container */}
        <div className="p-6 overflow-y-auto bg-zinc-950/60 font-mono text-xs text-zinc-300">
          <div
            id="printable-receipt"
            className="p-6 bg-white text-black rounded-lg shadow-inner border border-zinc-200"
          >
            {/* Header */}
            <div className="text-center pb-4 border-b border-dashed border-zinc-400">
              <h2 className="text-xl font-extrabold tracking-wider">{storeSettings.restaurantName}</h2>
              <p className="text-[10px] text-zinc-600">{storeSettings.tagline}</p>
              <p className="text-[10px] text-zinc-600 mt-1">{storeSettings.address}</p>
              <p className="text-[10px] text-zinc-600">TEL: {storeSettings.phone}</p>
              {order.notes?.includes('FBR REPORTED: Yes') && (
                <div className="mt-2 inline-block bg-emerald-50 text-emerald-800 px-2 py-1 rounded text-[9px] border border-emerald-300 font-bold">
                  ✓ FBR LIVE INVOICE | POS ID: {fbrConfig.posId || 'FBR-PK-9821-POS1'}
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="py-3 border-b border-dashed border-zinc-400 space-y-1">
              <div className="flex justify-between font-bold text-sm">
                <span>ORDER: #{order.orderNumber}</span>
                <span>{order.orderType.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-600">
                <span>DATE: {new Date(order.createdAt).toLocaleDateString()}</span>
                <span>TIME: {new Date(order.createdAt).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>CUSTOMER: {order.customerName}</span>
                <span>PAYMENT: {order.paymentMethod}</span>
              </div>
              {order.tableNumber && (
                <div className="font-bold text-[11px] text-zinc-800">TABLE: {order.tableNumber}</div>
              )}
              {order.notes && !order.notes.includes('FBR REPORTED:') && (
                <div className="text-[9px] text-zinc-600 font-sans italic border-t border-dashed border-zinc-200 pt-1 mt-1">
                  Note: {order.notes}
                </div>
              )}
            </div>

            {/* Line Items */}
            <div className="py-3 border-b border-dashed border-zinc-400 space-y-2">
              <div className="flex justify-between font-bold text-[10px] text-zinc-600 pb-1 border-b border-zinc-200">
                <span>QTY & ITEM</span>
                <span>AMOUNT</span>
              </div>

              {order.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-semibold">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>Rs. {Math.round(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                  {item.customization && (
                    <div className="text-[9px] text-zinc-500 pl-4">
                      {item.customization.size && `Size: ${item.customization.size} `}
                      {item.customization.extraCheese && `+Extra Cheese `}
                      {item.customization.sauce && `Sauce: ${item.customization.sauce}`}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="py-3 border-b border-dashed border-zinc-400 space-y-1">
              <div className="flex justify-between text-[11px]">
                <span>SUBTOTAL:</span>
                <span>Rs. {Math.round(order.subtotal).toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[11px] text-emerald-700 font-medium">
                  <span>DISCOUNT ({order.couponCode || 'PROMO'}):</span>
                  <span>-Rs. {Math.round(order.discount).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-[11px]">
                <span>SALES TAX (GST):</span>
                <span>Rs. {Math.round(order.tax).toLocaleString()}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-[11px]">
                  <span>DELIVERY FEE:</span>
                  <span>Rs. {Math.round(order.deliveryFee).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-base pt-2 border-t border-zinc-300">
                <span>TOTAL:</span>
                <span>Rs. {Math.round(order.total).toLocaleString()}</span>
              </div>
            </div>

            {/* Footer barcode/notes */}
            <div className="text-center pt-4 space-y-1">
              <p className="font-extrabold text-xs">THANK YOU FOR VISITING!</p>
              <p className="text-[9px] text-zinc-500">Powered by BUZZ BURGER POS v3.0</p>
              <div className="pt-2 font-mono text-[10px] tracking-widest text-zinc-400">
                * * * BUZZ-BURGER-PK * * *
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-xl bg-buzz-yellow text-buzz-black font-black text-xs shadow-buzz-glow flex items-center justify-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" /> Print Thermal Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
