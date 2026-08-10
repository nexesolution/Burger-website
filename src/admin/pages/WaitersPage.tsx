import React, { useState } from 'react';
import { Plus, UserCheck, Check, Phone, Table, Edit2 } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

const RESTAURANT_TABLES = [
  'Table 01',
  'Table 02',
  'Table 03',
  'Table 04',
  'Table 05',
  'Table 06',
  'Table 07',
  'Table 08',
  'VIP Booth A',
  'VIP Booth B'
];

export const WaitersPage: React.FC = () => {
  const waiters = useBuzzStore((state) => state.waiters);
  const addWaiter = useBuzzStore((state) => state.addWaiter);
  const updateWaiter = useBuzzStore((state) => state.updateWaiter);
  const recordWaiterSale = useBuzzStore((state) => state.recordWaiterSale);

  // Add Waiter Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Record Sale Modal
  const [selectedWaiterId, setSelectedWaiterId] = useState<string | null>(null);
  const [saleAmount, setSaleAmount] = useState<string>('');

  // Manage Tables Modal
  const [tableModalWaiterId, setTableModalWaiterId] = useState<string | null>(null);
  const [tempAssignedTables, setTempAssignedTables] = useState<string[]>([]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addWaiter({
      name,
      phone,
      status: 'On Shift',
      assignedTables: ['Table 01', 'Table 02'],
      totalSales: 0
    });
    setName('');
    setPhone('');
    setIsAddModalOpen(false);
  };

  const handleRecordSale = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(saleAmount);
    if (selectedWaiterId && !isNaN(amountNum) && amountNum > 0) {
      recordWaiterSale(selectedWaiterId, amountNum);
      setSelectedWaiterId(null);
      setSaleAmount('');
    }
  };

  const openTableModal = (waiterId: string, currentTables: string[]) => {
    setTableModalWaiterId(waiterId);
    setTempAssignedTables([...currentTables]);
  };

  const toggleTableSelection = (table: string) => {
    if (tempAssignedTables.includes(table)) {
      setTempAssignedTables(tempAssignedTables.filter((t) => t !== table));
    } else {
      setTempAssignedTables([...tempAssignedTables, table]);
    }
  };

  const handleSaveTables = () => {
    if (tableModalWaiterId) {
      updateWaiter(tableModalWaiterId, { assignedTables: tempAssignedTables });
      setTableModalWaiterId(null);
    }
  };

  return (
    <div className="space-y-6 text-white max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            WAITSTAFF <span className="text-buzz-yellow">MANAGEMENT</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Assign dining tables, manage shift status, and track waiter sales performance.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-buzz-yellow text-buzz-black font-extrabold text-xs shadow-buzz-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> ADD NEW WAITER
        </button>
      </div>

      {/* Waiters Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {waiters.map((w) => (
          <div key={w.id} className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-5 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-buzz-yellow/15 text-buzz-yellow shadow-buzz-glow">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-display text-white">{w.name}</h3>
                    <span className="text-xs text-zinc-400 font-mono">{w.phone}</span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    updateWaiter(w.id, {
                      status: w.status === 'On Shift' ? 'Off Shift' : 'On Shift'
                    })
                  }
                  className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase border transition-colors ${
                    w.status === 'On Shift'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  }`}
                >
                  {w.status}
                </button>
              </div>

              {/* Assigned Tables Panel */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block flex items-center gap-1">
                    <Table className="w-3 h-3 text-buzz-yellow" /> Assigned Tables
                  </span>
                  <button
                    onClick={() => openTableModal(w.id, w.assignedTables)}
                    className="text-[10px] text-buzz-yellow font-bold hover:underline flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Tables
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {w.assignedTables.length > 0 ? (
                    w.assignedTables.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-200 font-mono font-bold">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-zinc-500 italic">No tables assigned</span>
                  )}
                </div>
              </div>

              {/* Total Shift Sales */}
              <div className="border-t border-zinc-900 pt-3 text-xs space-y-1">
                <span className="text-zinc-400 block text-[11px]">Total Shift Sales</span>
                <span className="text-2xl font-black font-display text-buzz-yellow block">
                  Rs. {Math.round(w.totalSales).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => openTableModal(w.id, w.assignedTables)}
                className="py-2.5 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-buzz-yellow text-zinc-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1 transition-all"
              >
                <Table className="w-3.5 h-3.5 text-buzz-yellow" /> Assign Tables
              </button>
              <button
                onClick={() => setSelectedWaiterId(w.id)}
                className="py-2.5 px-3 rounded-xl bg-buzz-yellow text-buzz-black font-extrabold text-xs shadow-buzz-glow flex items-center justify-center gap-1 transition-all"
              >
                + Record Sale
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Table Assignment Modal */}
      {tableModalWaiterId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Table className="w-5 h-5 text-buzz-yellow" /> Assign Dining Tables
              </h3>
              <p className="text-xs text-zinc-400">
                Select tables assigned to{' '}
                <strong className="text-white">
                  {waiters.find((w) => w.id === tableModalWaiterId)?.name}
                </strong>
              </p>
            </div>

            {/* Table Selection Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 py-2">
              {RESTAURANT_TABLES.map((t) => {
                const isSelected = tempAssignedTables.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTableSelection(t)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-buzz-yellow/15 border-buzz-yellow text-buzz-yellow shadow-buzz-glow'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    <span>{t}</span>
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setTableModalWaiterId(null)}
                className="flex-1 py-3 rounded-xl bg-zinc-800 text-xs font-bold text-zinc-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveTables}
                className="flex-1 py-3 rounded-xl bg-buzz-yellow text-buzz-black font-black text-xs shadow-buzz-glow"
              >
                Save Assigned Tables
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Waiter Sale Modal */}
      {selectedWaiterId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-display text-white">Record Waiter Sale</h3>
              <p className="text-xs text-zinc-400">
                Enter sale amount to add to{' '}
                <strong className="text-white">
                  {waiters.find((w) => w.id === selectedWaiterId)?.name}
                </strong>
              </p>
            </div>

            <form onSubmit={handleRecordSale} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-semibold">Sale Amount (Rs.) *</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 3500"
                  value={saleAmount}
                  onChange={(e) => setSaleAmount(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-3 text-sm font-mono focus:outline-none focus:border-buzz-yellow"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedWaiterId(null)}
                  className="flex-1 py-3 rounded-xl bg-zinc-800 text-xs font-bold text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-buzz-yellow text-buzz-black font-black text-xs shadow-buzz-glow"
                >
                  Save Sale Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Waiter Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold font-display text-white">Add New Waiter</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-semibold">Waiter Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kamran Ali"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-buzz-yellow"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-semibold">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +92 300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-buzz-yellow"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-zinc-800 text-xs font-bold text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-buzz-yellow text-buzz-black font-black text-xs shadow-buzz-glow"
                >
                  Save Waiter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
