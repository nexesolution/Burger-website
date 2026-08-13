import React, { useState } from 'react';
import { Plus, Key, Edit, Trash2, UserCheck, ShieldAlert, X } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';
import { Staff, StaffRole } from '../../types';

export const StaffPage: React.FC = () => {
  const staff = useBuzzStore((state) => state.staff);
  const addStaff = useBuzzStore((state) => state.addStaff);
  const updateStaff = useBuzzStore((state) => state.updateStaff);
  const deleteStaff = useBuzzStore((state) => state.deleteStaff);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffRole>('Rider');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const openCreateModal = () => {
    setEditingStaffId(null);
    setName('');
    setEmail('');
    setUsername('');
    setPassword('');
    setPhone('');
    setRole('Rider');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (s: Staff) => {
    setEditingStaffId(s.id);
    setName(s.name);
    setEmail(s.email);
    setUsername(s.username || s.email.split('@')[0]);
    setPassword(s.password || 'staff123');
    setPhone(s.phone);
    setRole(s.role);
    setStatus(s.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUsername = username.trim() || email.split('@')[0] || name.toLowerCase().replace(/\s+/g, '');
    const finalPassword = password.trim() || 'staff123';

    if (editingStaffId) {
      updateStaff(editingStaffId, {
        name,
        email,
        username: finalUsername,
        password: finalPassword,
        phone,
        role,
        status
      });
    } else {
      addStaff({
        name,
        email,
        username: finalUsername,
        password: finalPassword,
        phone,
        role,
        status,
        joiningDate: new Date().toISOString().split('T')[0]
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, staffName: string) => {
    if (window.confirm(`Are you sure you want to permanently delete staff account for ${staffName}?`)) {
      deleteStaff(id);
    }
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            STAFF & <span className="text-buzz-yellow">CREDENTIALS MANAGEMENT</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Create, edit, and manage staff accounts, usernames, passwords & role permissions.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-buzz-yellow text-buzz-black font-extrabold text-xs shadow-buzz-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> ADD NEW STAFF MEMBER
        </button>
      </div>

      <div className="p-6 rounded-3xl glass-panel border border-zinc-800 overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="text-[10px] font-bold text-zinc-400 uppercase border-b border-zinc-800 pb-2">
            <tr>
              <th className="pb-3">Staff Name</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Login Username</th>
              <th className="pb-3">Password</th>
              <th className="pb-3">Contact</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {staff.map((s) => (
              <tr key={s.id} className="hover:bg-zinc-900/50 transition-colors">
                <td className="py-3 font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-buzz-yellow" />
                  {s.name}
                </td>
                <td className="py-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-buzz-yellow/10 text-buzz-yellow border border-buzz-yellow/30 font-bold text-[10px]">
                    {s.role}
                  </span>
                </td>
                <td className="py-3 font-mono font-bold text-emerald-400">
                  {s.username || s.email.split('@')[0]}
                </td>
                <td className="py-3 font-mono text-zinc-400">
                  <span className="bg-zinc-900 px-2 py-1 rounded border border-zinc-800 text-[11px]">
                    {s.password || 'staff123'}
                  </span>
                </td>
                <td className="py-3 font-mono text-zinc-400">{s.phone}</td>
                <td className="py-3">
                  <span
                    className={`font-bold ${
                      s.status === 'Active' ? 'text-emerald-400' : 'text-zinc-500'
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="py-3 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(s)}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-buzz-yellow transition-colors"
                    title="Edit Staff Member"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id, s.name)}
                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"
                    title="Remove Staff Account"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-buzz-yellow" />
                {editingStaffId ? 'Edit Staff Credentials' : 'Add New Staff Credentials'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shahid Iqbal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs focus:border-buzz-yellow focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Login Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. rider_shahid"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs font-mono focus:border-buzz-yellow focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Login Password *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. rider123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs font-mono focus:border-buzz-yellow focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="shahid@buzzrestaurant.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs focus:border-buzz-yellow focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Role *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as StaffRole)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs focus:border-buzz-yellow focus:outline-none"
                  >
                    {['Admin', 'Manager', 'Cashier', 'Kitchen', 'Waiter', 'Rider'].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 302 6667777"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs focus:border-buzz-yellow focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Account Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs focus:border-buzz-yellow focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-zinc-800 text-xs font-bold text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-buzz-yellow text-buzz-black font-black text-xs shadow-buzz-glow"
                >
                  {editingStaffId ? 'Update Staff Account' : 'Create Staff Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
