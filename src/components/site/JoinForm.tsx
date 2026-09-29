'use client';

import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

// Lead form shared by Opportunities and the vertical pages. There is no backend
// endpoint yet, so submission only switches to a confirmation state.
export type Field =
  | { type: 'text' | 'email'; name: string; label: string }
  | { type: 'select'; name: string; label: string; options: string[] }
  | { type: 'textarea'; name: string; label: string };

const inputClass =
  'w-full border-0 border-b border-white/15 bg-transparent px-0 pb-3 pt-1 text-base text-white outline-none transition-colors placeholder:text-white/25 focus:border-white';

export default function JoinForm({ fields, submitLabel = 'Submit Application' }: { fields: Field[]; submitLabel?: string }) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="border-t border-white/15 pt-10">
        <p className="text-2xl font-semibold tracking-[-0.02em]">Application received.</p>
        <p className="mt-3 max-w-md text-[15px] leading-[1.75] text-white/50">
          Thank you. The Digital Den team will be in touch about the next matchmaking cycle.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10"
    >
      {fields.map((field) => (
        <label key={field.name} className={`block ${field.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
          <span className="block mb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-white/40">{field.label}</span>
          {field.type === 'select' ? (
            <select name={field.name} required defaultValue="" className={`${inputClass} appearance-none cursor-pointer`}>
              <option value="" disabled className="bg-black">
                Select
              </option>
              {field.options.map((option) => (
                <option key={option} value={option} className="bg-black">
                  {option}
                </option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea name={field.name} rows={3} className={`${inputClass} resize-none`} />
          ) : (
            <input name={field.name} type={field.type} required className={inputClass} />
          )}
        </label>
      ))}
      <div className="sm:col-span-2 pt-2">
        <button
          type="submit"
          className="group inline-flex items-center gap-3 rounded-full bg-white pl-6 pr-2 py-2 text-sm font-medium text-black transition-colors hover:bg-purple-100"
        >
          {submitLabel}
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </button>
      </div>
    </form>
  );
}
