import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginAdmin = useBuzzStore((state) => state.loginAdmin);

  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const redirectByRole = (role?: string) => {
    const r = role?.toLowerCase();
    if (r === 'rider') {
      navigate('/admin/rider-workspace');
    } else if (r === 'kitchen') {
      navigate('/admin/kds');
    } else if (r === 'waiter') {
      navigate('/admin/waiter-workspace');
    } else {
      navigate('/admin');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!usernameInput.trim() || !password.trim()) {
      setError('Please enter your username/email and password.');
      return;
    }

    const ok = loginAdmin(usernameInput, password);
    if (ok) {
      const currentUser = useBuzzStore.getState().adminUser;
      redirectByRole(currentUser?.role);
    } else {
      setError('Invalid username or password. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-buzz-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-buzz-yellow/15 via-buzz-black to-buzz-black pointer-events-none" />

      <div className="w-full max-w-md p-8 rounded-3xl glass-panel border border-buzz-yellow/30 shadow-buzz-glow space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-buzz-yellow text-buzz-black font-black font-display text-lg flex items-center justify-center mx-auto shadow-buzz-glow">
            BUZZ
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white leading-tight">
            BUZZ BURGER <span className="text-buzz-yellow font-display">TERMINAL</span>
          </h1>
          <span className="inline-block text-[10px] uppercase font-bold text-buzz-yellow tracking-widest">
            Staff & Management Login
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold">Username or Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                autoComplete="off"
                placeholder="Username or email"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-buzz-yellow font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoComplete="off"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-buzz-yellow font-mono"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-400 font-medium text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-buzz-yellow hover:bg-buzz-yellow-light text-buzz-black font-black text-xs tracking-wider shadow-buzz-glow flex items-center justify-center gap-2 transition-all"
          >
            SIGN IN TO WORKSPACE <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted POS Session & Supabase Sync Enabled</span>
        </div>
      </div>
    </div>
  );
};
