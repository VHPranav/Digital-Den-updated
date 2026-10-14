'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { contact, legal } from '@/lib/homeContent';

// Simplified footer (Home Page notes, 7 Oct 2026): brand (logo, tagline, ©), navigation,
// contact + Instagram / LinkedIn / Facebook icons, a light newsletter field and the
// Digital Den sign at the end. No metrics or descriptor labels.

const explore = [
  { href: '/platform', label: 'Platform' },
  { href: '/programs', label: 'Programs' },
  { href: '/partners', label: 'Partners' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/projects', label: 'Projects' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/events', label: 'Events' },
];

const icons: Record<keyof typeof contact.socials, React.ReactNode> = {
  instagram: (
    <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 4.6a5.2 5.2 0 1 0 0 10.4 5.2 5.2 0 0 0 0-10.4zm0 8.6a3.4 3.4 0 1 1 0-6.8 3.4 3.4 0 0 1 0 6.8zm5.4-9.9a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z" />
  ),
  linkedin: (
    <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.5H3.6V9h3.5v11.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z" />
  ),
  facebook: (
    <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1c0 6 4.4 11 10.1 11.9v-8.4H7.1v-3.5h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.3h3.4l-.5 3.5h-2.9V24C19.6 23.1 24 18.1 24 12.1z" />
  ),
};

const socialLabels: Record<keyof typeof contact.socials, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
};

const taglineGradient: React.CSSProperties = {
  background: 'linear-gradient(90deg, #FFFFFF 0%, #F3E8FF 40%, #C084FC 75%, #38BDF8 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const socials = (Object.keys(contact.socials) as (keyof typeof contact.socials)[]).filter((k) => contact.socials[k]);

  return (
    <footer className="relative z-30 w-full overflow-hidden bg-den text-[#f3f0ea]">
      {/* Top edge: brand gradient hairline + soft glow */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[90px]" />

      <div className="relative mx-auto max-w-[1450px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-14 py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-10 lg:py-24">
          {/* Brand */}
          <div className="flex flex-col gap-6 md:col-span-2 lg:col-span-5">
            <Link href="/" aria-label="Digital Den home" className="inline-block w-fit">
              <Image src="/logoden.svg" alt="Digital Den" width={257} height={52} className="h-8 w-auto brightness-0 invert" />
            </Link>
            <p className="max-w-sm text-[28px] font-medium leading-[1.15] tracking-tight sm:text-[34px]" style={taglineGradient}>
              Your Gateway to Global Markets.
            </p>
            <p className="mt-auto text-[13px] text-white/40">&copy; {new Date().getFullYear()} Digital Den. All rights reserved.</p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer" className="lg:col-span-3">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3.5 text-[15px] lg:grid-cols-1">
              {explore.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="group inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white">
                    <span>{label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect: contact, socials, newsletter */}
          <div className="flex flex-col gap-7 lg:col-span-4">
            <address className="space-y-3 text-[15px] not-italic leading-[1.5] text-white/75">
              {contact.address && (
                <p className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-purple-300" />
                  <span>{contact.address}</span>
                </p>
              )}
              <a href={`mailto:${contact.email}`} className="flex items-center gap-3 transition-colors hover:text-white">
                <Mail className="h-4 w-4 shrink-0 text-purple-300" />
                <span>{contact.email}</span>
              </a>
              {contact.phone && (
                <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} className="flex items-center gap-3 transition-colors hover:text-white">
                  <Phone className="h-4 w-4 shrink-0 text-purple-300" />
                  <span>{contact.phone}</span>
                </a>
              )}
            </address>

            {socials.length > 0 && (
              <ul className="flex items-center gap-3">
                {socials.map((k) => (
                  <li key={k}>
                    <a
                      href={contact.socials[k]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={socialLabels[k]}
                      className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/[0.04] text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:text-white"
                    >
                      <span className="absolute inset-0 bg-gradient-to-br from-purple-500 to-sky-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <svg viewBox="0 0 24 24" className="relative h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
                        {icons[k]}
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {subscribed ? (
              <p className="text-sm text-purple-200">You&apos;re on the list.</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) {
                    setSubscribed(true);
                    setEmail('');
                  }
                }}
                className="flex max-w-[340px] items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] py-1.5 pl-5 pr-1.5 transition-colors focus-within:border-white/40"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Subscribe to our newsletter"
                  aria-label="Email address"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/40"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-purple-200"
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Legal line: Privacy Policy, Terms of Service (once supplied) and Back to top */}
        <div className="flex border-t border-white/10 py-6 text-[13px] text-white/45 sm:justify-end">
          <div className="flex items-center gap-6">
            {legal.privacy && (
              <Link href={legal.privacy} className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
            )}
            {legal.terms && (
              <Link href={legal.terms} className="transition-colors hover:text-white">
                Terms of Service
              </Link>
            )}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
            >
              Back to top
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-white">
                <ArrowUp className="h-3.5 w-3.5" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Digital Den sign at the end of the page (kept per DD; compact height) */}
      <div aria-hidden="true" className="pointer-events-none relative select-none overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 mx-auto h-2/3 w-2/3 rounded-full bg-purple-600/[0.08] blur-[100px]" />
        <p className="relative -mb-[0.2em] whitespace-nowrap text-center text-[13vw] font-medium leading-[0.9] tracking-[-0.07em] text-transparent [background-clip:text] [-webkit-background-clip:text] bg-gradient-to-b from-white/[0.16] via-purple-300/[0.10] to-transparent">
          Digital Den
        </p>
      </div>
    </footer>
  );
}
