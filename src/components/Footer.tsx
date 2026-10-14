'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUp } from 'lucide-react';
import { contact, legal } from '@/lib/homeContent';

// Simplified footer (Home Page notes, 7 Oct 2026): brand, navigation, verified
// contact/social links and a light newsletter field. No metrics or descriptor labels.

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

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const socials = (Object.keys(contact.socials) as (keyof typeof contact.socials)[]).filter((k) => contact.socials[k]);

  return (
    <footer className="relative z-30 w-full overflow-hidden border-t border-white/10 bg-[#0b0b0c] text-[#f3f0ea]">
      <div className="mx-auto max-w-[1450px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-3 lg:py-20">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" aria-label="Digital Den home" className="inline-block">
              <Image src="/logoden.svg" alt="Digital Den" width={257} height={52} className="h-7 w-auto brightness-0 invert" />
            </Link>
            <p className="text-[15px] text-white/60">Your Gateway to Global Markets.</p>
            <p className="text-[13px] text-white/45">&copy; {new Date().getFullYear()} Digital Den. All rights reserved.</p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-[15px]">
              {explore.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-white/75 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div className="space-y-6">
            <address className="space-y-1.5 text-[15px] not-italic leading-[1.6] text-white/80">
              {contact.address && <p>{contact.address}</p>}
              <a href={`mailto:${contact.email}`} className="block transition-colors hover:text-purple-200">
                {contact.email}
              </a>
              {contact.phone && (
                <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} className="block transition-colors hover:text-purple-200">
                  {contact.phone}
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
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/75 transition-colors hover:border-white hover:text-white"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
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
                className="flex max-w-[320px] items-center gap-3 border-b border-white/25 pb-2.5 transition-colors focus-within:border-white"
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
                  className="flex h-6 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-purple-300"
                >
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Legal line: Privacy Policy, Terms of Service (once supplied) and Back to top */}
        <div className="flex border-t border-white/10 py-7 text-[13px] text-white/45 sm:justify-end">
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
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/30 transition-colors group-hover:border-white">
                <ArrowUp className="h-3 w-3" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Digital Den sign at the end of the page (kept per DD; compact height) */}
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
        <p className="-mb-[0.2em] whitespace-nowrap text-center text-[13vw] font-medium leading-[0.9] tracking-[-0.07em] text-transparent [background-clip:text] [-webkit-background-clip:text] bg-gradient-to-b from-white/[0.12] via-purple-300/[0.08] to-transparent">
          Digital Den
        </p>
      </div>
    </footer>
  );
}
