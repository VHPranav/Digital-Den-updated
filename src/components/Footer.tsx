'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUp, ArrowUpRight } from 'lucide-react';

// Editorial footer matching the inner pages: near-black, hairline dividers,
// oversized type, number pills and a giant wordmark.

const explore = [
  { href: '/platform', label: 'Platform', note: 'Venture Studio' },
  { href: '/programs', label: 'Programs', note: 'Incubation & Acceleration' },
  { href: '/projects', label: 'Projects', note: 'Project Activities' },
  { href: '/portfolio', label: 'Portfolio', note: 'Proof of Growth' },
  { href: '/opportunities', label: 'Opportunities', note: 'Matchmaking' },
  { href: '/partners', label: 'Partners', note: 'Global Network' },
  { href: '/events', label: 'Events', note: 'Summits & Loops' },
];

const socials = [
  { href: 'https://instagram.com', label: 'Instagram' },
  { href: 'https://linkedin.com', label: 'LinkedIn' },
  { href: 'https://facebook.com', label: 'Facebook' },
];

const stats = [
  { value: '11k', label: 'Community across all platforms' },
  { value: '50+', label: 'Startup inquiries & applications daily' },
  { value: '50', label: 'Balkan startups scaling globally' },
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-[22px] min-w-[30px] items-center justify-center rounded-full border border-current px-2 text-[11px] tabular-nums leading-none">
      {children}
    </span>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="relative z-30 w-full overflow-hidden border-t border-white/10 bg-[#0b0b0c] text-[#f3f0ea]">
      <div className="mx-auto max-w-[1480px] px-6 lg:px-10">
        {/* ─── Statement ─── */}
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 py-20 lg:grid-cols-12 lg:py-28">
          <h2 className="text-[clamp(2.75rem,6vw,6rem)] font-medium leading-[0.92] tracking-[-0.055em] lg:col-span-8">
            Your gateway to <span className="font-light italic text-purple-200/90">global markets.</span>
          </h2>
          <div className="self-end lg:col-span-4">
            <p className="text-[15px] leading-[1.6] text-white/60">
              Connecting founders mainly from the Western Balkans with programs, strategic partners, capital and
              high-growth international markets.
            </p>
            <Link href="/opportunities#join" className="group mt-8 inline-flex items-center gap-3 text-[15px]">
              <span className="border-b border-current pb-0.5">Join the network</span>
              <span className="flex h-6 w-9 items-center justify-center rounded-full bg-white text-black transition-colors duration-300 group-hover:bg-purple-300">
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
              </span>
            </Link>
          </div>
        </div>

        {/* ─── Columns ─── */}
        <div className="grid grid-cols-1 gap-14 py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-10 lg:py-20">
          {/* Explore */}
          <nav aria-label="Footer" className="lg:col-span-5">
            <p className="mb-6 flex items-center gap-2 text-[13px] text-white/60">
              <Pill>01</Pill> Explore
            </p>
            <ul>
              {explore.map(({ href, label, note }) => (
                <li key={href} className="border-t border-white/10 last:border-b">
                  <Link href={href} className="group flex items-baseline justify-between gap-6 py-3.5">
                    <span className="text-[clamp(1.5rem,2.2vw,2rem)] font-medium tracking-[-0.035em] text-white/85 transition-colors duration-300 group-hover:text-white">
                      {label}
                    </span>
                    <span className="flex items-center gap-3 text-[13px] text-white/40 transition-colors group-hover:text-purple-200">
                      <span className="hidden sm:inline">{note}</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect + community */}
          <div className="lg:col-span-3 lg:col-start-7">
            <p className="mb-6 flex items-center gap-2 text-[13px] text-white/60">
              <Pill>02</Pill> Connect
            </p>
            <address className="space-y-1.5 text-[15px] not-italic leading-[1.6] text-white/80">
              <p>Podgorica, Montenegro</p>
              <a href="tel:+38220123456" className="block transition-colors hover:text-purple-200">
                +382 (0)20 123 456
              </a>
              <a href="mailto:info@digitalden.me" className="block underline decoration-white/30 underline-offset-4 transition-colors hover:text-purple-200">
                info@digitalden.me
              </a>
            </address>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-white/70 transition-colors hover:text-white"
                  >
                    {s.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>

            <dl className="mt-10 space-y-4 border-t border-white/10 pt-6">
              {stats.map((s) => (
                <div key={s.label} className="flex items-baseline gap-4">
                  <dt className="w-14 shrink-0 text-2xl font-medium tracking-[-0.04em]">{s.value}</dt>
                  <dd className="text-[13px] leading-snug text-white/50">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2 lg:col-span-3 lg:col-start-10">
            <p className="mb-6 flex items-center gap-2 text-[13px] text-white/60">
              <Pill>03</Pill> Stay informed
            </p>
            <p className="text-[15px] leading-[1.6] text-white/60">
              Subscribe to Digital Den updates for upcoming opportunities, programs, and ecosystem news.
            </p>
            {subscribed ? (
              <p className="mt-8 border-b border-white/20 pb-3 text-[15px] text-purple-200">You&apos;re on the list.</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) {
                    setSubscribed(true);
                    setEmail('');
                  }
                }}
                className="mt-8 flex items-center gap-3 border-b border-white/25 pb-3 transition-colors focus-within:border-white"
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
            )}
          </div>
        </div>

        {/* ─── Bottom bar ─── */}
        <div className="flex flex-col gap-6 border-t border-white/10 py-8 text-[13px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Digital Den home">
              <Image src="/logoden.svg" alt="Digital Den" width={257} height={52} className="h-5 w-auto brightness-0 invert opacity-80 transition-opacity hover:opacity-100" />
            </Link>
            <span>&copy; {new Date().getFullYear()} Digital Den. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
            >
              Back to top
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/30 transition-colors group-hover:border-white">
                <ArrowUp className="h-3 w-3" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Giant wordmark ─── */}
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
        <p className="-mb-[0.22em] whitespace-nowrap text-center text-[19.5vw] font-medium leading-[0.9] tracking-[-0.07em] text-transparent [background-clip:text] [-webkit-background-clip:text] bg-gradient-to-b from-white/[0.14] via-purple-300/[0.10] to-transparent">
          Digital Den
        </p>
      </div>
    </footer>
  );
}
