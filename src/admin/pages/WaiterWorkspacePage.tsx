import React, { useState } from 'react';
import {
  Users,
  UtensilsCrossed,
  Plus,
  CheckCircle2,
  Clock,
  Search,
  Check,
  ShoppingBag,
  TrendingUp
} from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';
import { Product, OrderItem } from '../../types';

export const WaiterWorkspacePage: React.FC = () => {
  const products = useBuzzStore((state) => state.products);
  const categories = useBuzzStore((state) => state.categories);
  const orders = useBuzzStore((state) => state.orders);
  const createOrder = useBuzzStore((state) => state.createOrder);
  const adminUser = useBuzzStore((state) => state.adminUser);
  const recordWaiterSale = useBuzzStore((state) => state.recordWaiterSale);
  const waiters = useBuzzStore((state) => state.waiters);
  const showToast = useBuzzStore((state) => state.showToast);

  const [selectedTable, setSelectedTable] = useState('Table 01');
  const [selectedCatId, setSelectedCatId] = useState('all');
  const [waiterCart, setWaiterCart] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState('Guest');

  const tables = [
    { name: 'Table 01', seats: 4 },
    { name: 'Table 02', seats: 4 },
    { name: 'Table 03', seats: 2 },
    { name: 'Table 04', seats: 6 },
    { name: 'VIP Booth A', seats: 8 },
    { name: 'VIP Booth B', seats: 8 }
  ];

  // My Waiter Stats
  const currentWaiterObj = waiters.find((w) => w.name.toLowerCase() === adminUser?.name.toLowerCase());
  const totalSalesRecorded = currentWaiterObj?.totalSales || 0;

  const addToWaiterCart = (prod: Product) => {
    const priceToUse = prod.salePrice ?? prod.price;
    const existingIndex = waiterCart.findIndex((i) => i.productId === prod.id);

    if (existingIndex > -1) {
      const updated = [...waiterCart];
      updated[existingIndex].quantity += 1;
      setWaiterCart(updated);
    } else {
      const newItem: OrderItem = {
        id: `wcart-${prod.id}-${Date.now()}`,
        productId: prod.id,
        name: prod.name,
        price: priceToUse,
        quantity: 1,
        image: prod.image
      };
      setWaiterCart([...waiterCart, newItem]);
    }
  };

  const subtotal = waiterCart.reduce((a, b) => a + b.price * b.quantity, 0);

  const handleSendToKitchen = () => {
    if (waiterCart.length === 0) return;

    createOrder({
      customerName: `${customerName} (${selectedTable})`,
      phone: '+92 300 0000000',
      email: 'waiter@buzzburgers.pk',
      address: selectedTable,
      city: 'Lahore',
      orderType: 'Dine-in',
      tableNumber: selectedTable,
      status: 'Preparing',
      paymentMethod: 'Cash',
      paymentStatus: 'Pending',
      items: waiterCart,
      subtotal,
      tax: (subtotal * 16) / 100,
      deliveryFee: 0,
      discount: 0,
      total: subtotal + (subtotal * 16) / 100,
      waiterName: adminUser?.name || 'Waiter'
    });

    if (currentWaiterObj) {
      recordWaiterSale(currentWaiterObj.id, subtotal);
    }

    showToast(`Order sent to Kitchen for ${selectedTable}! 👨‍🍳`, 'success');
    setWaiterCart([]);
  };

  const filteredProducts = products.filter(
    (p) => p.isAvailable && (selectedCatId === 'all' || p.categoryId === selectedCatId)
  );

  return (
    <div className="space-y-6 text-white max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl glass-panel border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-buzz-yellow text-buzz-black flex items-center justify-center font-black shadow-buzz-glow">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black font-display tracking-tight text-white">
                WAITER TABLE PAD
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-buzz-yellow/10 text-buzz-yellow text-[10px] font-bold border border-buzz-yellow/30">
                FLOOR SERVICE
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Logged in as <span className="text-buzz-yellow font-bold">{adminUser?.name || 'Waiter'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs">
            <span className="text-[10px] text-zinc-400 block font-bold">Today's Sales</span>
            <span className="font-black font-mono text-emerald-400 text-sm">
              Rs. {Math.round(totalSalesRecorded).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Tables Selection Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Select Dining Table</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {tables.map((tbl) => {
            const isSelected = selectedTable === tbl.name;
            return (
              <button
                key={tbl.name}
                onClick={() => setSelectedTable(tbl.name)}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'bg-buzz-yellow text-buzz-black border-buzz-yellow font-black shadow-buzz-glow scale-105'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <UtensilsCrossed className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-buzz-black' : 'text-buzz-yellow'}`} />
                <span className="block font-bold text-xs">{tbl.name}</span>
                <span className="text-[10px] opacity-70 block">{tbl.seats} Seats</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Order Creation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category & Product List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCatId('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${
                selectedCatId === 'all' ? 'bg-buzz-yellow text-buzz-black font-black' : 'bg-zinc-900 text-zinc-400'
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${
                  selectedCatId === cat.id ? 'bg-buzz-yellow text-buzz-black font-black' : 'bg-zinc-900 text-zinc-400'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => addToWaiterCart(prod)}
                className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-buzz-yellow cursor-pointer transition-all space-y-2"
              >
                <div className="h-20 rounded-xl overflow-hidden bg-zinc-950">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{prod.name}</h4>
                  <span className="text-[11px] font-mono text-buzz-yellow font-bold">
                    Rs. {(prod.salePrice ?? prod.price).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Waiter Current Cart */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="font-black text-sm text-white">Order for {selectedTable}</span>
              <span className="text-xs text-buzz-yellow font-bold">{waiterCart.length} items</span>
            </div>

            {waiterCart.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {waiterCart.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs flex justify-between">
                    <div>
                      <span className="font-bold text-white block">{item.name}</span>
                      <span className="text-[10px] text-zinc-400">{item.quantity}x Rs. {item.price}</span>
                    </div>
                    <span className="font-bold text-buzz-yellow">Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-zinc-500 text-xs">Tap items to add order</div>
            )}
          </div>

          <div className="space-y-3 pt-3 border-t border-zinc-800">
            <div className="flex justify-between text-xs font-bold text-white">
              <span>Subtotal:</span>
              <span className="text-buzz-yellow">Rs. {Math.round(subtotal).toLocaleString()}</span>
            </div>

            <button
              onClick={handleSendToKitchen}
              disabled={waiterCart.length === 0}
              className="w-full py-3.5 rounded-2xl bg-buzz-yellow hover:bg-buzz-yellow-light text-buzz-black font-black text-xs shadow-buzz-glow flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" /> SEND ORDER TO KITCHEN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
