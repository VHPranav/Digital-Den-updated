'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Globe, Shield, Sparkles, X, ArrowRight, CheckCircle2, Building, Mail, User } from 'lucide-react';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ActionModal({ isOpen, onClose }: ActionModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [marketInterest, setMarketInterest] = useState('Global Liquidity');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  const handleResetClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/20 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white">
        {/* Close Button */}
        <button
          onClick={handleResetClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-widest mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Global Market Access</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Get Started with Gateway</h3>
              <p className="text-slate-400 text-xs mt-1">
                Connect with our market expansion advisors to explore custom liquidity & cross-border solutions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="alex@enterprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Company / Organization
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Venture Capital Ltd."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Primary Market Focus
                </label>
                <select
                  value={marketInterest}
                  onChange={(e) => setMarketInterest(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm font-medium text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Global Liquidity">Global Liquidity & Foreign Exchange</option>
                  <option value="Cross Border Settlement">Cross-Border Settlement Infrastructure</option>
                  <option value="Institutional Custody">Institutional Custody & Vaults</option>
                  <option value="Algorithmic Routing">Algorithmic Smart Order Routing</option>
                </select>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-sky-500 text-slate-950 font-bold text-sm uppercase tracking-wider shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <span>Submit Inquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-bold text-white">Inquiry Received</h4>
            <p className="text-slate-300 text-sm">
              Thank you, <strong className="text-white">{name}</strong>. Our institutional market team will contact you at <span className="text-teal-400">{email}</span> within 2 hours.
            </p>
            <button
              onClick={handleResetClose}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors mt-4"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
