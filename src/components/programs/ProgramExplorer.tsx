'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { withoutTrailingPeriod, hasActiveCall, isOfficialUrl, type OrganizationLogo, type ProgramStatus, type StartupProgram } from '@/lib/programsContent';

const statuses: Record<ProgramStatus, { label: string; dot: string }> = {
  open: { label: 'Open', dot: 'bg-purple-300' },
  ongoing: { label: 'Ongoing', dot: 'bg-amber-200' },
  past: { label: 'Past', dot: 'bg-white/40' },
};

function publicStatus(program: StartupProgram, now: number): ProgramStatus | null {
  if (program.status === 'open' && (!now || !hasActiveCall(program, now))) return null;
  return program.status;
}

function StatusBadge({ status }: { status: ProgramStatus | null }) {
  if (!status) return <span className="text-[12px] text-white/50">Details to follow</span>;
  return <span className="inline-flex items-center gap-2 text-[12px] text-white/75"><span className={`h-1.5 w-1.5 rounded-full ${statuses[status].dot}`} />{statuses[status].label}</span>;
}

export function ExternalAction({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 text-[15px] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-300">
      <span className="border-b border-current pb-0.5">{children}</span>
      <span className="flex h-6 w-9 items-center justify-center rounded-full bg-white text-black transition-colors group-hover:bg-purple-300"><ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function Logos({ title, logos }: { title: string; logos: OrganizationLogo[] }) {
  const imageLogos = logos.filter((logo) => Boolean(logo.src));
  if (!imageLogos.length) return null;
  return (
    <div>
      <h4 className="mb-5 uppercase text-white/50 text-[1.125rem] font-medium leading-snug tracking-tight">{title}</h4>
      <ul className="flex flex-wrap gap-3">
        {imageLogos.map((logo) => (
          <li key={`${logo.name}-${logo.src}`}>
            {isOfficialUrl(logo.href) ? (
              <a href={logo.href} target="_blank" rel="noopener noreferrer" aria-label={`${logo.name} (opens in a new tab)`} className="relative block h-20 w-36 rounded-sm bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-300">
                <Image src={logo.src} alt={logo.alt || logo.name} fill sizes="144px" className="object-contain p-4" />
              </a>
            ) : (
              <div className="relative h-20 w-36 rounded-sm bg-white"><Image src={logo.src} alt={logo.alt || logo.name} fill sizes="144px" className="object-contain p-4" /></div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProgramDetails({ program, now }: { program: StartupProgram; now: number }) {
  const facts = [
    ['Market / Location', program.location], ['Format', program.format],
    ['Duration', program.duration], ['Who it’s for', program.audience],
  ];
  const status = publicStatus(program, now);
  return (
    <div data-noreveal>
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5 sm:aspect-[16/10]">
        <Image key={program.image.src} src={program.image.src} alt={program.image.alt} fill sizes="(max-width: 1024px) 100vw, 65vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
          <StatusBadge status={status} />
          <h3 className="mt-4 max-w-2xl text-[1.125rem] font-medium leading-snug tracking-tight">{withoutTrailingPeriod(program.title)}</h3>
          {program.location && <p className="mt-4 text-white/65 text-[13px] leading-relaxed">{program.location}</p>}
        </div>
      </div>
      <div className="space-y-8 border-x border-b border-white/10 p-6 sm:p-10">
        <p className="max-w-2xl text-white/70 text-[16px] leading-[1.6]">{program.overview || 'Program details coming soon.'}</p>
        <dl className="grid gap-x-8 gap-y-6 border-y border-white/15 py-7 sm:grid-cols-2">
          {facts.map(([label, value]) => <div key={label}><dt className="text-[11px] uppercase tracking-[0.18em] text-white/45">{label}</dt><dd className="mt-2 text-[15px] leading-relaxed text-white/85">{value || '—'}</dd></div>)}
        </dl>
        {program.benefits.length > 0 && (
          <div>
            <h4 className="mb-4 uppercase text-white/50 text-[1.125rem] font-medium leading-snug tracking-tight">Program elements</h4>
            <ul className="space-y-3">{program.benefits.map((benefit) => <li key={benefit} className="flex gap-3 text-[15px] leading-relaxed text-white/75"><ArrowRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-purple-300" />{benefit}</li>)}</ul>
          </div>
        )}
        <Logos title="Partners & Sponsors" logos={program.partners} />
        {program.gallery.length > 0 && (
          <div>
            <h4 className="mb-5 uppercase text-white/50 text-[1.125rem] font-medium leading-snug tracking-tight">Gallery</h4>
            <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3">
              {program.gallery.map((photo) => <li key={photo.src} className="relative aspect-[4/3] w-[85%] shrink-0 snap-start overflow-hidden sm:w-[60%]"><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 80vw, 40vw" className="object-cover" /></li>)}
            </ul>
          </div>
        )}
        {status === 'open' && program.application && <ExternalAction href={program.application.href}>Apply Now</ExternalAction>}
        {status === 'ongoing' && <p className="text-white/45 text-[13px] leading-relaxed">Program in progress.</p>}
        {status === 'past' && <p className="text-white/45 text-[13px] leading-relaxed">Past program · Applications closed.</p>}
      </div>
    </div>
  );
}

/* ─── Program details drawer (slides in from the right, like the Gemstrat case studies) ─── */

function DetailsModal({ program, now, onClose }: { program: StartupProgram; now: number; onClose: () => void }) {
  const panelRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

  const close = React.useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.to(panelRef.current, { xPercent: 100, duration: reduced ? 0 : .45, ease: 'power3.in' });
    gsap.to(backdropRef.current, { opacity: 0, duration: reduced ? 0 : .45, onComplete: onClose });
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.fromTo(panelRef.current, { xPercent: 100 }, { xPercent: 0, duration: reduced ? 0 : .6, ease: 'power3.out' });
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: reduced ? 0 : .5 });
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [close]);

  const status = publicStatus(program, now);
  return (
    <div className="fixed inset-0 z-[90]">
      <div ref={backdropRef} className="absolute inset-0 bg-black/60 backdrop-blur-[6px]" onClick={close} aria-hidden="true" />
      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`${program.title} details`}
        data-lenis-prevent
        className="program-drawer absolute inset-y-0 right-0 w-full max-w-[640px] overflow-y-auto border-l border-white/10 bg-[#100d15] outline-none"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-white/5">
          <Image src={program.image.src} alt={program.image.alt} fill sizes="640px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#100d15] via-transparent to-black/20" />
          <button type="button" onClick={close} className="absolute right-0 top-0 flex cursor-pointer items-center gap-3 bg-black/80 px-5 py-3.5 text-[12px] uppercase tracking-[.16em] text-white backdrop-blur hover:bg-black focus-visible:outline-2 focus-visible:outline-purple-300">
            Close <span aria-hidden="true" className="text-[14px]">✕</span>
          </button>
        </div>
        <div className="px-6 pb-2 pt-6 sm:px-10">
          <span className="inline-flex rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5"><StatusBadge status={status} /></span>
          {program.location && <p className="mt-6 text-[11px] uppercase tracking-[.18em] text-purple-200">{program.location}</p>}
          <h3 className="dd-h2 mt-3 font-medium">{withoutTrailingPeriod(program.title)}</h3>
        </div>
        <div className="program-expanded-details"><ProgramDetails program={program} now={now} /></div>
      </aside>
    </div>
  );
}

/* ─── Stacked program cards: each card pins and the next one slides over it ─── */

export default function ProgramExplorer({ programs, now }: { programs: StartupProgram[]; now: number }) {
  const [detailId, setDetailId] = useState<string | null>(null);
  const detail = programs.find((p) => p.id === detailId);
  const closeDetail = React.useCallback(() => setDetailId(null), []);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);

  // As the next card slides over, the one underneath scales down and dims slightly.
  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean) as HTMLElement[];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || cards.length < 2) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        const inner = card.firstElementChild as HTMLElement | null;
        if (!inner) return;
        if (!next) { inner.style.transform = ''; inner.style.filter = ''; return; }
        const top = next.getBoundingClientRect().top;
        const p = Math.min(1, Math.max(0, 1 - (top - vh * 0.12) / (vh * 0.75)));
        inner.style.transform = `scale(${1 - p * 0.06})`;
        inner.style.filter = `brightness(${1 - p * 0.45})`;
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [programs.length]);

  if (!programs.length) {
    return <p role="status" className="mx-auto max-w-[1480px] border-y border-white/15 px-6 py-16 text-white/60 lg:px-10">Program information coming soon.</p>;
  }

  return (
    <div className="mx-auto max-w-[1480px] px-6 lg:px-10" data-noreveal>
      <ol className="program-stack" aria-label="Startup programs">
        {programs.map((program, i) => {
          const meta = [program.duration, program.format].filter(Boolean).join(' · ');
          return (
            <li key={program.id} ref={(el) => { cardsRef.current[i] = el; }} className="program-stack-item" style={{ zIndex: i + 1 }}>
              <article className="program-stack-card">
                <div className="program-stack-media">
                  <Image src={program.image.src} alt={program.image.alt} fill sizes="(max-width: 1023px) 100vw, 50vw" className="dd-media-grade object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                </div>
                <div className="program-stack-body">
                  {/* Quiet backdrop for the text side: dot grid, soft glow and a large outlined number */}
                  <div className="program-stack-deco" aria-hidden="true">
                    <span className="program-stack-number">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="relative mt-auto pt-6 lg:pt-10">
                    {program.location && <p className="text-[11px] uppercase tracking-[.18em] text-purple-200">{program.location}</p>}
                    <h3 className="dd-h2 mt-4 font-medium">{withoutTrailingPeriod(program.title)}</h3>
                    <p className="program-stack-summary">{program.overview || 'Program details coming soon.'}</p>
                    {meta && <p className="mt-5 text-[13px] text-white/45">{meta}</p>}
                    <button type="button" onClick={() => setDetailId(program.id)} className="program-stack-action">
                      <span>Explore Program</span>
                      <span className="program-stack-arrow"><ArrowUpRight className="h-4 w-4" /></span>
                    </button>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
      {/* Portal to <body> so the modal sits above the fixed navbar (sections create their own stacking context) */}
      {detail && createPortal(<DetailsModal program={detail} now={now} onClose={closeDetail} />, document.body)}
    </div>
  );
}
