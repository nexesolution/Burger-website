import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginAdmin = useBuzzStore((state) => state.loginAdmin);

  const [email, setEmail] = useState('admin@buzzrestaurant.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const ok = loginAdmin(email, password);
    if (ok) {
      navigate('/admin');
    } else {
      setError('Invalid credentials. Please use admin@buzzrestaurant.com / admin123');
    }
  };

  const handleQuickDemoLogin = () => {
    loginAdmin('admin@buzzrestaurant.com', 'admin123');
    navigate('/admin');
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
            BUZZ BURGER <span className="text-buzz-yellow">POS</span>
          </h1>
          <span className="inline-block text-[10px] uppercase font-bold text-buzz-yellow tracking-widest">
            Management System & Terminal
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-buzz-yellow"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-buzz-yellow"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-400 font-medium text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-buzz-yellow hover:bg-buzz-yellow-light text-buzz-black font-black text-xs tracking-wider shadow-buzz-glow flex items-center justify-center gap-2 transition-all"
          >
            SIGN IN TO ADMIN POS <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access Box */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center space-y-2">
          <span className="text-[11px] text-zinc-400 font-semibold block">
            DEMO PRE-CONFIGURED CREDENTIALS
          </span>
          <div className="text-xs font-mono text-buzz-yellow">
            admin@buzzrestaurant.com / admin123
          </div>
          <button
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all mt-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-buzz-yellow" /> Quick 1-Click Demo Login
          </button>
        </div>
      </div>
    </div>
  );
};
