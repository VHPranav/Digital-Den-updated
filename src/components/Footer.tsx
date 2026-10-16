'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUp, Mail, MapPin, Phone } from 'lucide-react';
import { contact, legal } from '@/lib/homeContent';
import { FadeIn } from '@/components/FadeIn';

// Final contact section (Home Page final changes): one "Get in Touch" title, a single row of
// icon links (location, email, phone, LinkedIn, Facebook, Instagram), a newsletter field,
// then © / back to top and the large Digital Den wordmark. No logo, slogan or nav links.

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

const iconSvg = (k: keyof typeof contact.socials) => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
    {icons[k]}
  </svg>
);

const lucide = 'h-6 w-6';

type ContactItem = { key: string; label: string; detail: string; href: string; icon: React.ReactNode; external?: boolean };

const items: ContactItem[] = [
  contact.address && {
    key: 'location',
    label: 'Location',
    detail: contact.address.split(',').slice(-2).join(',').trim(),
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`,
    icon: <MapPin className={lucide} />,
    external: true,
  },
  contact.email && { key: 'email', label: 'Email', detail: contact.email, href: `mailto:${contact.email}`, icon: <Mail className={lucide} /> },
  contact.phone && {
    key: 'phone',
    label: 'Phone',
    detail: contact.phone,
    href: `tel:${contact.phone.replace(/[^+\d]/g, '')}`,
    icon: <Phone className={lucide} />,
  },
  contact.socials.linkedin && { key: 'linkedin', label: 'LinkedIn', detail: 'Follow us', href: contact.socials.linkedin, icon: iconSvg('linkedin'), external: true },
  contact.socials.facebook && { key: 'facebook', label: 'Facebook', detail: 'Follow us', href: contact.socials.facebook, icon: iconSvg('facebook'), external: true },
  contact.socials.instagram && { key: 'instagram', label: 'Instagram', detail: 'Follow us', href: contact.socials.instagram, icon: iconSvg('instagram'), external: true },
].filter(Boolean) as ContactItem[];

const headingGradient: React.CSSProperties = {
  background: 'linear-gradient(100deg, #FFFFFF 0%, #FFFFFF 40%, #E9D5FF 58%, #C084FC 78%, #8B5CF6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

// Contact item: ombre-ring icon circle with label + detail beneath. Light, no card chrome.
function ContactCard({ it, index }: { it: ContactItem; index: number }) {
  return (
    <FadeIn animation="slideUp" delay={0.1 + index * 0.08} duration={0.9}>
      <a
        href={it.href}
        {...(it.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="group flex flex-col items-center gap-3 text-center"
      >
        <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-gradient-to-br from-purple-300/80 via-purple-600/50 to-indigo-900/20 p-px transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:from-purple-200 group-hover:via-purple-500 group-hover:shadow-[0_10px_34px_-8px_rgba(168,85,247,0.7)]">
          <span className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#2a1450] via-[#150b2b] to-[#0b0b0c] text-white">
            {it.icon}
          </span>
        </span>
        <span className="text-sm font-semibold tracking-tight text-white">{it.label}</span>
        <span className="-mt-2 text-[13px] leading-snug text-white/55 transition-colors duration-300 group-hover:text-white">{it.detail}</span>
      </a>
    </FadeIn>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  return (
    <footer className="relative z-30 w-full overflow-hidden bg-den text-[#f3f0ea]">
      {/* Top edge: brand gradient hairline */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />
      {/* One soft light behind the heading */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[60%] -translate-x-1/2 -translate-y-1/3 rounded-full bg-purple-600/[0.14] blur-[130px]" />

      <div className="relative mx-auto max-w-[1450px] px-6 lg:px-12">
        <div className="flex flex-col items-center py-24 text-center lg:py-32">
          <FadeIn animation="fadeIn" duration={1}>
            <h2 className="text-5xl font-medium leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[56px]" style={headingGradient}>
              Get in Touch
            </h2>
          </FadeIn>

          {/* Contact options: one horizontal row of glass cards, icons first */}
          <ul className="mt-14 flex flex-wrap items-start justify-center gap-x-10 gap-y-10 lg:flex-nowrap lg:gap-x-12">
            {items.map((it, i) => (
              <li key={it.key} className="w-[132px]">
                <ContactCard it={it} index={i} />
              </li>
            ))}
          </ul>

          {/* Newsletter */}
          <FadeIn animation="slideUp" delay={0.5} duration={0.9} className="mt-20 flex w-full flex-col items-center">
            <p className="text-lg font-medium tracking-tight text-white">Subscribe to our newsletter</p>
            {subscribed ? (
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-purple-300/30 bg-purple-500/10 px-5 py-3 text-sm text-purple-100">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-400 text-[11px] text-white">✓</span>
                You&apos;re on the list.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) {
                    setSubscribed(true);
                    setEmail('');
                  }
                }}
                className="group/form mt-6 w-full max-w-[480px] rounded-full bg-gradient-to-r from-white/15 via-white/5 to-white/15 p-px transition-all duration-500 focus-within:from-purple-400 focus-within:via-fuchsia-400/70 focus-within:to-sky-400 focus-within:shadow-[0_0_40px_-8px_rgba(168,85,247,0.6)]"
              >
                <div className="flex items-center gap-2 rounded-full bg-[#0f0c18]/90 py-1.5 pl-6 pr-1.5 backdrop-blur-xl">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    aria-label="Email address"
                    className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="group/btn flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 text-white shadow-[0_6px_20px_-4px_rgba(168,85,247,0.8)] transition-transform duration-300 hover:scale-105"
                  >
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" strokeWidth={2.2} />
                  </button>
                </div>
              </form>
            )}
          </FadeIn>
        </div>

        {/* Legal line: Privacy Policy, Terms of Service (once supplied) and Back to top */}
        <div className="flex flex-col items-center gap-4 border-t border-white/10 py-6 text-[13px] text-white/45 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Digital Den. All rights reserved.</p>
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

      {/* Digital Den wordmark at the end of the page (kept per DD; large and wide so it reads clearly) */}
      <div aria-hidden="true" className="pointer-events-none relative select-none overflow-hidden">
        <p className="relative -mb-[0.13em] whitespace-nowrap text-center text-[20vw] font-medium leading-[0.9] tracking-[-0.07em] text-transparent [background-clip:text] [-webkit-background-clip:text] bg-gradient-to-b from-white/[0.26] via-white/[0.10] to-transparent">
          Digital Den
        </p>
      </div>
    </footer>
  );
}
