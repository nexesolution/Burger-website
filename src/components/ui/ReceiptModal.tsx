import React from 'react';
import { Printer, X, Check } from 'lucide-react';
import { Order } from '../../types';
import { useBuzzStore } from '../../store/useBuzzStore';

interface ReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, isOpen, onClose }) => {
  const storeSettings = useBuzzStore((state) => state.storeSettings);
  const printerConfig = useBuzzStore((state) => state.printerConfig);
  const fbrConfig = useBuzzStore((state) => state.fbrConfig);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-buzz-yellow" />
            <h3 className="text-lg font-bold text-white font-display">Thermal Receipt Preview</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content Body */}
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
              {fbrConfig.isConnected && (
                <div className="mt-2 inline-block bg-zinc-100 px-2 py-0.5 rounded text-[9px] border border-zinc-300">
                  FBR POS ID: {fbrConfig.posId} | NTN: {fbrConfig.ntn}
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
                <span>TAX ({storeSettings.taxRate}%):</span>
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

            {/* Footer barcode/qr demo */}
            <div className="pt-4 text-center space-y-1">
              <div className="text-[9px] tracking-widest font-bold">||| | |||| | ||||| || |||||| |||| |</div>
              <p className="text-[9px] text-zinc-500">Thank you for dining at DEEP FRIES!</p>
              <p className="text-[8px] text-zinc-400">Powered by DEEP FRIES POS v2.6 • {printerConfig.receiptWidth}</p>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-400">
            Printer: <strong className="text-white">{printerConfig.printerName}</strong>
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 text-xs font-bold text-buzz-black bg-buzz-yellow hover:bg-buzz-yellow-light rounded-xl shadow-buzz-glow flex items-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
