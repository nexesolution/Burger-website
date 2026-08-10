import React, { useState } from 'react';
import { Plus, Users, Shield } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';
import { StaffRole } from '../../types';

export const StaffPage: React.FC = () => {
  const staff = useBuzzStore((state) => state.staff);
  const addStaff = useBuzzStore((state) => state.addStaff);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffRole>('Cashier');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addStaff({
      name,
      email,
      phone,
      role,
      status: 'Active',
      joiningDate: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            STAFF & <span className="text-buzz-yellow">ROLES</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Employee roster, system permissions & role assignments.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-buzz-yellow text-buzz-black font-extrabold text-xs shadow-buzz-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> ADD STAFF MEMBER
        </button>
      </div>

      <div className="p-6 rounded-3xl glass-panel border border-zinc-800 overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="text-[10px] font-bold text-zinc-400 uppercase border-b border-zinc-800 pb-2">
            <tr>
              <th className="pb-3">Name</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Phone</th>
              <th className="pb-3">Joining Date</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {staff.map((s) => (
              <tr key={s.id} className="hover:bg-zinc-900/50">
                <td className="py-3 font-bold text-white">{s.name}</td>
                <td className="py-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-buzz-yellow/10 text-buzz-yellow border border-buzz-yellow/30 font-bold text-[10px]">
                    {s.role}
                  </span>
                </td>
                <td className="py-3 text-zinc-400">{s.email}</td>
                <td className="py-3 font-mono">{s.phone}</td>
                <td className="py-3 text-zinc-500">{s.joiningDate}</td>
                <td className="py-3 text-emerald-400 font-bold">{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold font-display text-white">Add Staff Member</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as StaffRole)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                  >
                    {['Admin', 'Manager', 'Cashier', 'Kitchen', 'Waiter', 'Rider'].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-zinc-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-buzz-yellow text-buzz-black font-black text-xs shadow-buzz-glow"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
