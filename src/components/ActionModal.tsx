'use client';

import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';

export type ActionMode = 'startup' | 'partner';

interface ActionModalProps {
  isOpen: boolean;
  mode?: ActionMode;
  onClose: () => void;
}

const copy: Record<ActionMode, { title: string; lead: string; org: string; submit: string }> = {
  startup: {
    title: 'Apply as Startup',
    lead: 'Tell us about your startup and the Digital Den team will be in touch.',
    org: 'Startup name',
    submit: 'Submit Application',
  },
  partner: {
    title: 'Partner with Us',
    lead: 'Tell us about your organization and how you would like to work with Digital Den.',
    org: 'Organization',
    submit: 'Send Inquiry',
  },
};

const inputClass =
  'w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-purple-400';

// Lead capture for the Home Page CTAs. There is no backend endpoint yet, so
// submission only switches to a confirmation state.
export default function ActionModal({ isOpen, mode = 'startup', onClose }: ActionModalProps) {
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;
  const c = copy[mode];

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div role="dialog" aria-modal="true" aria-label={c.title} className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#0b0b0c] p-6 text-white shadow-2xl sm:p-8">
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-5 top-5 rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="space-y-4 py-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-purple-300" />
            <h3 className="text-2xl font-semibold tracking-tight">Thank you.</h3>
            <p className="text-sm text-white/60">The Digital Den team will be in touch.</p>
            <button
              onClick={handleClose}
              className="mt-4 w-full rounded-xl bg-white/10 py-3 text-sm font-semibold transition-colors hover:bg-white/20"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">{c.title}</h3>
              <p className="mt-1 text-sm text-white/60">{c.lead}</p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4"
            >
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/60">Full name</span>
                <input name="name" type="text" required className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/60">Email</span>
                <input name="email" type="email" required className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/60">{c.org}</span>
                <input name="organization" type="text" className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/60">Message</span>
                <textarea name="message" rows={3} className={`${inputClass} resize-none`} />
              </label>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-bold text-black transition-colors hover:bg-purple-200"
              >
                <span>{c.submit}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
