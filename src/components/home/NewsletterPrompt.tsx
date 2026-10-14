'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

const SEEN_KEY = 'dd-newsletter-prompt-seen';
const DELAY_MS = 6000;

// Small corner prompt shown a few seconds after the intro ends (or Skip Intro),
// i.e. once the Hero is reached. Never covers the Hero; shown once per session.
export default function NewsletterPrompt({ triggerId }: { triggerId: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {}
    const target = document.getElementById(triggerId);
    if (!target) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = setTimeout(() => {
          setOpen(true);
          try {
            sessionStorage.setItem(SEEN_KEY, '1');
          } catch {}
        }, DELAY_MS);
      },
      { threshold: 0.5 }
    );
    observer.observe(target);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [triggerId]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Subscribe to Digital Den updates"
      className="fixed bottom-6 left-4 right-4 z-[9995] sm:left-8 sm:right-auto sm:w-[360px] animate-fade-in rounded-2xl border border-white/15 bg-black/80 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
    >
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Close"
        className="absolute right-3 top-3 rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
      {done ? (
        <p className="pr-6 text-[15px] text-purple-200">You&apos;re on the list.</p>
      ) : (
        <>
          <p className="pr-6 text-[15px] font-semibold tracking-tight">Stay informed</p>
          <p className="mt-1 text-sm leading-[1.5] text-white/60">
            Subscribe to Digital Den updates for upcoming opportunities, programs, and ecosystem news.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setDone(true);
            }}
            className="mt-4 flex items-center gap-3 border-b border-white/25 pb-2.5 transition-colors focus-within:border-white"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              aria-label="Email address"
              className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-white/35"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="flex h-6 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-purple-300"
            >
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
