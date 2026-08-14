import React, { useState } from 'react';
import { Plus, Bike, Star, DollarSign, PackageCheck, Phone, Mail, Shield, Trash2, Edit, X, CheckCircle2 } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';
import { Rider } from '../../types';

export const RidersPage: React.FC = () => {
  const riders = useBuzzStore((state) => state.riders);
  const orders = useBuzzStore((state) => state.orders);
  const addRider = useBuzzStore((state) => state.addRider);
  const updateRider = useBuzzStore((state) => state.updateRider);
  const showToast = useBuzzStore((state) => state.showToast);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRiderId, setEditingRiderId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicle, setVehicle] = useState('Honda CG125 Bike');
  const [licensePlate, setLicensePlate] = useState('');
  const [cnic, setCnic] = useState('');
  const [status, setStatus] = useState<'Available' | 'Busy' | 'Offline'>('Available');

  const openCreateModal = () => {
    setEditingRiderId(null);
    setName('');
    setPhone('');
    setEmail('');
    setVehicle('Honda CG125 Bike');
    setLicensePlate('');
    setCnic('');
    setStatus('Available');
    setIsModalOpen(true);
  };

  const openEditModal = (r: Rider) => {
    setEditingRiderId(r.id);
    setName(r.name);
    setPhone(r.phone);
    setEmail(r.email || '');
    setVehicle(r.vehicle);
    setLicensePlate(r.licensePlate || '');
    setCnic(r.cnic || '');
    setStatus(r.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingRiderId) {
      updateRider(editingRiderId, {
        name,
        phone,
        email,
        vehicle,
        licensePlate,
        cnic,
        status
      });
      showToast(`Rider profile for ${name} updated!`);
    } else {
      addRider({
        name,
        phone,
        email: email || `${name.toLowerCase().replace(/\s+/g, '')}@buzzburgers.pk`,
        vehicle,
        licensePlate,
        cnic,
        status: 'Available',
        currentOrders: 0,
        rating: 5.0,
        totalCashCollected: 0,
        totalDeliveries: 0
      });
    }

    setIsModalOpen(false);
  };

  // Compute rider stats dynamically from orders
  const getRiderMetrics = (rider: Rider) => {
    const riderNameLower = rider.name.toLowerCase();
    const assignedOrders = orders.filter(
      (o) => o.riderId === rider.id || (o.riderName && o.riderName.toLowerCase() === riderNameLower)
    );

    const activeOrders = assignedOrders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled');
    const completedOrders = assignedOrders.filter((o) => o.status === 'Delivered');

    const totalCash = completedOrders.reduce((sum, o) => sum + o.total, 0);

    return {
      activeCount: activeOrders.length,
      completedCount: completedOrders.length,
      cashCollected: totalCash
    };
  };

  const grandTotalCashCollected = riders.reduce((sum, r) => sum + getRiderMetrics(r).cashCollected, 0);
  const grandTotalDeliveries = riders.reduce((sum, r) => sum + getRiderMetrics(r).completedCount, 0);

  return (
    <div className="space-y-6 text-white">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            DELIVERY <span className="text-buzz-yellow">RIDERS ROSTER & CASH LEDGER</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Track rider fleet status, active delivery tasks, and real-time cash collected (COD).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-buzz-yellow text-buzz-black font-extrabold text-xs shadow-buzz-glow flex items-center gap-2 hover:bg-yellow-400 transition-colors"
        >
          <Plus className="w-4 h-4" /> REGISTER NEW RIDER PROFILE
        </button>
      </div>

      {/* Fleet Summary Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Registered Rider Fleet
          </span>
          <span className="text-2xl font-black font-display text-white">{riders.length} Riders</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Active Deliveries Now
          </span>
          <span className="text-2xl font-black font-display text-sky-400">
            {riders.reduce((a, b) => a + (b.currentOrders || 0), 0)} Active
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Deliveries Completed
          </span>
          <span className="text-2xl font-black font-display text-emerald-400">
            {grandTotalDeliveries} Completed
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Total Rider Cash Collected
          </span>
          <span className="text-2xl font-black font-display text-buzz-yellow font-mono">
            Rs. {Math.round(grandTotalCashCollected).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Riders Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {riders.map((r) => {
          const metrics = getRiderMetrics(r);

          return (
            <div
              key={r.id}
              className="p-6 rounded-3xl glass-card border border-zinc-800 space-y-5 shadow-xl hover:border-buzz-yellow/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Rider Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-buzz-yellow/10 text-buzz-yellow flex items-center justify-center font-black border border-buzz-yellow/20">
                      <Bike className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black font-display text-white">{r.name}</h3>
                      <span className="text-[11px] text-zinc-400 font-mono block">{r.vehicle}</span>
                      {r.licensePlate && (
                        <span className="text-[10px] text-buzz-yellow font-mono font-bold">
                          Plate: {r.licensePlate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rider Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                      r.status === 'Available'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : r.status === 'Busy'
                        ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>

                {/* Cash & Delivery Metrics Banner */}
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">
                      Cash Collected (COD)
                    </span>
                    <span className="text-base font-black text-buzz-yellow font-mono block">
                      Rs. {Math.round(metrics.cashCollected).toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-0.5 text-right">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">
                      Completed Orders
                    </span>
                    <span className="text-base font-black text-emerald-400 font-mono block">
                      {metrics.completedCount} Delivered
                    </span>
                  </div>
                </div>

                {/* Rider Contact & Profile Info */}
                <div className="space-y-1.5 text-xs text-zinc-400">
                  <p className="flex items-center gap-2 font-mono">
                    <Phone className="w-3.5 h-3.5 text-buzz-yellow" />
                    <span>{r.phone}</span>
                  </p>
                  {r.email && (
                    <p className="flex items-center gap-2 font-mono text-[11px]">
                      <Mail className="w-3.5 h-3.5 text-buzz-yellow" />
                      <span>{r.email}</span>
                    </p>
                  )}
                  {r.cnic && (
                    <p className="flex items-center gap-2 font-mono text-[10px]">
                      <Shield className="w-3.5 h-3.5 text-buzz-yellow" />
                      <span>CNIC: {r.cnic}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-zinc-900 flex items-center justify-between gap-2">
                <span className="text-xs text-buzz-yellow font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-buzz-yellow" /> {r.rating || 5.0} Rating
                </span>

                <button
                  onClick={() => openEditModal(r)}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs border border-zinc-800 flex items-center gap-1.5 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5 text-buzz-yellow" /> Edit Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE & EDIT RIDER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Bike className="w-5 h-5 text-buzz-yellow" />
                <h3 className="text-lg font-black font-display text-white">
                  {editingRiderId ? 'EDIT RIDER PROFILE' : 'REGISTER NEW DELIVERY RIDER'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Rider Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Shahid Iqbal"
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
                    placeholder="+92 302 6667777"
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-3 focus:border-buzz-yellow focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Email Address (App Login)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rider@buzzburgers.pk"
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-3 focus:border-buzz-yellow focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Vehicle & Model</label>
                  <select
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-3 focus:border-buzz-yellow focus:outline-none font-bold"
                  >
                    <option value="Honda CG125 Bike">Honda CG125 Bike</option>
                    <option value="Honda CD70 Bike">Honda CD70 Bike</option>
                    <option value="Yamaha YBR125">Yamaha YBR125</option>
                    <option value="Suzuki GS150">Suzuki GS150</option>
                    <option value="Electric Scooter">Electric Scooter</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">License Plate Number</label>
                  <input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    placeholder="LEC-2026-9821"
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-3 focus:border-buzz-yellow focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">CNIC Number</label>
                  <input
                    type="text"
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    placeholder="35202-1234567-8"
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-3 focus:border-buzz-yellow focus:outline-none font-mono"
                  />
                </div>
              </div>

              {editingRiderId && (
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Duty Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-3 focus:border-buzz-yellow focus:outline-none font-bold"
                  >
                    <option value="Available">Available (Online)</option>
                    <option value="Busy">Busy (Delivering Order)</option>
                    <option value="Offline">Offline (Off Shift)</option>
                  </select>
                </div>
              )}

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
                  {editingRiderId ? 'UPDATE RIDER' : 'SAVE RIDER PROFILE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
