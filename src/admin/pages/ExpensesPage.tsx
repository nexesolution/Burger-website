import React, { useState } from 'react';
import { Plus, Receipt, Trash2 } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';
import { ExpenseCategory } from '../../types';

export const ExpensesPage: React.FC = () => {
  const expenses = useBuzzStore((state) => state.expenses);
  const addExpense = useBuzzStore((state) => state.addExpense);
  const deleteExpense = useBuzzStore((state) => state.deleteExpense);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Rent');
  const [amount, setAmount] = useState(500);
  const [description, setDescription] = useState('');

  const totalExpenseAmount = expenses.reduce((acc, e) => acc + e.amount, 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      title,
      category,
      amount,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Corporate Card',
      description
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            EXPENSE <span className="text-buzz-yellow">TRACKER</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Log operational expenses (Rent, Utilities, Salaries, Maintenance).
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-buzz-yellow text-buzz-black font-extrabold text-xs shadow-buzz-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> RECORD EXPENSE
        </button>
      </div>

      <div className="p-6 rounded-3xl glass-card border border-zinc-800 flex items-center justify-between">
        <div>
          <span className="text-xs text-zinc-400 uppercase font-bold">Total Monthly Expenses</span>
          <span className="block text-3xl font-black font-display text-buzz-yellow mt-1">
            Rs. {Math.round(totalExpenseAmount).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="p-6 rounded-3xl glass-panel border border-zinc-800 overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="text-[10px] font-bold text-zinc-400 uppercase border-b border-zinc-800 pb-2">
            <tr>
              <th className="pb-3">Title</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Description</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-zinc-900/50">
                <td className="py-3 font-bold text-white">{exp.title}</td>
                <td className="py-3 text-zinc-400">{exp.category}</td>
                <td className="py-3 font-bold text-buzz-yellow">Rs. {Math.round(exp.amount).toLocaleString()}</td>
                <td className="py-3 text-zinc-500">{exp.date}</td>
                <td className="py-3 text-zinc-400 max-w-xs truncate">{exp.description}</td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => deleteExpense(exp.id)}
                    className="p-1.5 rounded-lg bg-zinc-900 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold font-display text-white">Record Expense</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Expense Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Amount (Rs.)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 text-xs"
                  >
                    {['Rent', 'Utilities', 'Salaries', 'Supplies', 'Marketing', 'Maintenance', 'Other'].map(
                      (c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      )
                    )}
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
