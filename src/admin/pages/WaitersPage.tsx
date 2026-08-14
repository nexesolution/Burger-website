import React, { useState } from 'react';
import { Plus, UserCheck, Check, Phone, Table, Edit2, Key, Trash2, Edit, X, User, Mail, DollarSign } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';
import { Waiter, Staff } from '../../types';

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
  const staff = useBuzzStore((state) => state.staff);
  const addWaiter = useBuzzStore((state) => state.addWaiter);
  const updateWaiter = useBuzzStore((state) => state.updateWaiter);
  const deleteWaiter = useBuzzStore((state) => state.deleteWaiter);
  const addStaff = useBuzzStore((state) => state.addStaff);
  const updateStaff = useBuzzStore((state) => state.updateStaff);
  const recordWaiterSale = useBuzzStore((state) => state.recordWaiterSale);
  const showToast = useBuzzStore((state) => state.showToast);

  // Add/Edit Waiter Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWaiterId, setEditingWaiterId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'Available' | 'On Shift' | 'Off Shift'>('On Shift');
  const [selectedTables, setSelectedTables] = useState<string[]>(['Table 01', 'Table 02']);

  // Record Sale Modal
  const [selectedWaiterId, setSelectedWaiterId] = useState<string | null>(null);
  const [saleAmount, setSaleAmount] = useState<string>('');

  // Manage Tables Modal
  const [tableModalWaiterId, setTableModalWaiterId] = useState<string | null>(null);
  const [tempAssignedTables, setTempAssignedTables] = useState<string[]>([]);

  const openCreateModal = () => {
    setEditingWaiterId(null);
    setName('');
    setPhone('');
    setEmail('');
    setUsername('');
    setPassword('waiter123');
    setStatus('On Shift');
    setSelectedTables(['Table 01', 'Table 02']);
    setIsModalOpen(true);
  };

  const openEditModal = (w: Waiter) => {
    setEditingWaiterId(w.id);
    setName(w.name);
    setPhone(w.phone);
    setEmail(w.email || '');

    const matchedStaff = staff.find(
      (s) => (s.email && w.email && s.email.toLowerCase() === w.email.toLowerCase()) || s.name.toLowerCase() === w.name.toLowerCase()
    );
    setUsername(matchedStaff ? matchedStaff.username || '' : w.name.toLowerCase().replace(/\s+/g, ''));
    setPassword(matchedStaff ? matchedStaff.password || '' : 'waiter123');

    setStatus(w.status);
    setSelectedTables(w.assignedTables || []);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalEmail = email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@buzzburgers.pk`;
    const finalUsername = username.trim() || name.toLowerCase().replace(/\s+/g, '');
    const finalPassword = password.trim() || 'waiter123';

    if (editingWaiterId) {
      updateWaiter(editingWaiterId, {
        name,
        phone,
        email: finalEmail,
        status,
        assignedTables: selectedTables
      });

      const matchedStaff = staff.find(
        (s) => (s.email && email && s.email.toLowerCase() === email.toLowerCase()) || s.name.toLowerCase() === name.toLowerCase()
      );
      if (matchedStaff) {
        updateStaff(matchedStaff.id, {
          name,
          email: finalEmail,
          username: finalUsername,
          password: finalPassword,
          phone,
          role: 'Waiter',
          status: status === 'Off Shift' ? 'Inactive' : 'Active'
        });
      } else {
        addStaff({
          name,
          email: finalEmail,
          username: finalUsername,
          password: finalPassword,
          phone,
          role: 'Waiter',
          status: 'Active',
          joiningDate: new Date().toISOString().split('T')[0]
        });
      }

      showToast(`Waiter profile & login credentials for ${name} updated!`);
    } else {
      addWaiter({
        name,
        phone,
        email: finalEmail,
        status,
        assignedTables: selectedTables,
        totalSales: 0
      });

      const existingStaff = staff.find((s) => s.email.toLowerCase() === finalEmail.toLowerCase() || s.username === finalUsername);
      if (!existingStaff) {
        addStaff({
          name,
          email: finalEmail,
          username: finalUsername,
          password: finalPassword,
          phone,
          role: 'Waiter',
          status: 'Active',
          joiningDate: new Date().toISOString().split('T')[0]
        });
      }

      showToast(`Waiter ${name} registered! Username: ${finalUsername}`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, waiterName: string) => {
    if (window.confirm(`Are you sure you want to permanently delete waiter profile for ${waiterName}?`)) {
      deleteWaiter(id);
    }
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

  const toggleTableSelection = (table: string, list: string[], setList: (l: string[]) => void) => {
    if (list.includes(table)) {
      setList(list.filter((t) => t !== table));
    } else {
      setList([...list, table]);
    }
  };

  const handleSaveTables = () => {
    if (tableModalWaiterId) {
      updateWaiter(tableModalWaiterId, { assignedTables: tempAssignedTables });
      setTableModalWaiterId(null);
    }
  };

  const totalWaiterSales = waiters.reduce((sum, w) => sum + (w.totalSales || 0), 0);
  const onShiftCount = waiters.filter((w) => w.status === 'On Shift').length;

  return (
    <div className="space-y-6 text-white max-w-6xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            WAITSTAFF <span className="text-buzz-yellow">ROSTER & CREDENTIALS</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Register waitstaff profiles, login usernames/passwords, assign dining tables, & track sales volume.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-buzz-yellow text-buzz-black font-extrabold text-xs shadow-buzz-glow flex items-center gap-2 hover:bg-yellow-400 transition-colors"
        >
          <Plus className="w-4 h-4" /> REGISTER NEW WAITER & CREDENTIALS
        </button>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Waitstaff Roster Total
          </span>
          <span className="text-2xl font-black font-display text-white">{waiters.length} Waiters</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            On Shift Now
          </span>
          <span className="text-2xl font-black font-display text-emerald-400">
            {onShiftCount} Active
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1 col-span-2 md:col-span-1">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Total Waitstaff Shift Sales
          </span>
          <span className="text-2xl font-black font-display text-buzz-yellow font-mono">
            Rs. {Math.round(totalWaiterSales).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Waiters Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {waiters.map((w) => {
          const matchedStaff = staff.find(
            (s) => (s.email && w.email && s.email.toLowerCase() === w.email.toLowerCase()) || s.name.toLowerCase() === w.name.toLowerCase()
          );

          return (
            <div key={w.id} className="p-6 rounded-3xl glass-panel border border-zinc-800 space-y-5 flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-buzz-yellow/15 text-buzz-yellow shadow-buzz-glow">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold font-display text-white">{w.name}</h3>
                      <span className="text-xs text-zinc-400 font-mono block">{w.phone}</span>
                      {matchedStaff && (
                        <span className="text-[10px] text-emerald-400 font-mono font-bold block">
                          Login: {matchedStaff.username}
                        </span>
                      )}
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
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Table className="w-3 h-3 text-buzz-yellow" /> Assigned Dining Tables
                    </span>
                    <button
                      onClick={() => openTableModal(w.id, w.assignedTables)}
                      className="text-[10px] text-buzz-yellow font-bold hover:underline flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" /> Edit Tables
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {w.assignedTables && w.assignedTables.length > 0 ? (
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
                  <span className="text-2xl font-black font-display text-buzz-yellow font-mono block">
                    Rs. {Math.round(w.totalSales || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-zinc-900">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openEditModal(w)}
                    className="py-2.5 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-buzz-yellow text-zinc-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1 transition-all"
                  >
                    <Edit className="w-3.5 h-3.5 text-buzz-yellow" /> Edit Profile
                  </button>
                  <button
                    onClick={() => setSelectedWaiterId(w.id)}
                    className="py-2.5 px-3 rounded-xl bg-buzz-yellow text-buzz-black font-extrabold text-xs shadow-buzz-glow flex items-center justify-center gap-1 transition-all"
                  >
                    + Record Sale
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(w.id, w.name)}
                  className="w-full py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Waiter Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE & EDIT WAITER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-buzz-yellow" />
                <h3 className="text-lg font-black font-display text-white">
                  {editingWaiterId ? 'EDIT WAITER PROFILE & CREDENTIALS' : 'REGISTER NEW WAITER & CREDENTIALS'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Login Credentials */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-buzz-yellow font-bold text-xs uppercase tracking-wider">
                  <Key className="w-4 h-4" /> APP LOGIN CREDENTIALS
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-zinc-400 font-semibold">Login Username *</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="waiter_kamran"
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-2.5 focus:border-buzz-yellow focus:outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-400 font-semibold">Login Password *</label>
                    <input
                      type="text"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="waiter123"
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-2.5 focus:border-buzz-yellow focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Waiter Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Kamran Ali"
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-3 focus:border-buzz-yellow focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 301 5556666"
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-3 focus:border-buzz-yellow focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="waiter@buzzburgers.pk"
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-3 focus:border-buzz-yellow focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Shift Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-3 focus:border-buzz-yellow focus:outline-none font-bold"
                  >
                    <option value="On Shift">On Shift (Active)</option>
                    <option value="Available">Available</option>
                    <option value="Off Shift">Off Shift (Inactive)</option>
                  </select>
                </div>
              </div>

              {/* Table Assignments */}
              <div className="space-y-1 pt-1">
                <label className="text-zinc-400 font-semibold block">Select Assigned Tables</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {RESTAURANT_TABLES.map((t) => {
                    const isSelected = selectedTables.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTableSelection(t, selectedTables, setSelectedTables)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-buzz-yellow/15 border-buzz-yellow text-buzz-yellow shadow-buzz-glow'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                        }`}
                      >
                        <span>{t}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-zinc-800 text-xs font-bold hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-buzz-yellow text-buzz-black font-black text-xs shadow-buzz-glow hover:bg-yellow-400"
                >
                  {editingWaiterId ? 'SAVE WAITER' : 'CREATE WAITER & CREDENTIALS'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table Assignment Quick Modal */}
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

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 py-2">
              {RESTAURANT_TABLES.map((t) => {
                const isSelected = tempAssignedTables.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTableSelection(t, tempAssignedTables, setTempAssignedTables)}
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
    </div>
  );
};
