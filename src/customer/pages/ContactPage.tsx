import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

export const ContactPage: React.FC = () => {
  const storeSettings = useBuzzStore((state) => state.storeSettings);
  const showToast = useBuzzStore((state) => state.showToast);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Feedback received! We will get back to you shortly.');
  };

  return (
    <div className="min-h-screen pt-32 pb-24 text-white bg-buzz-black space-y-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center space-y-4">
        <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight">
          GET IN <span className="text-buzz-yellow">TOUCH</span>
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Have a question about an order, catering event, or partnership? Send us a message!
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Info Box */}
        <div className="lg:col-span-5 space-y-6 p-8 rounded-3xl glass-panel border border-zinc-800">
          <h2 className="text-2xl font-bold font-display text-white">Contact Info</h2>
          <div className="space-y-4 text-xs text-zinc-300">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-buzz-yellow" />
              <span>{storeSettings.address}, {storeSettings.city}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-buzz-yellow" />
              <span>{storeSettings.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-buzz-yellow" />
              <span>{storeSettings.email}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7 p-8 rounded-3xl glass-card border border-zinc-800">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-buzz-yellow mx-auto" />
              <h3 className="text-xl font-bold text-white">Message Delivered</h3>
              <p className="text-xs text-zinc-400">Thank you for writing to BUZZ team!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-buzz-yellow"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-buzz-yellow"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-semibold">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-buzz-yellow"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-buzz-yellow text-buzz-black font-extrabold text-xs tracking-wider shadow-buzz-glow flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> SEND MESSAGE
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
