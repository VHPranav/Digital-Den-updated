'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { hasActiveCall, isOfficialUrl, type OrganizationLogo, type ProgramStatus, type StartupProgram } from '@/lib/programsContent';

type Filter = 'all' | ProgramStatus;
const statuses: Record<ProgramStatus, { label: string; dot: string }> = {
  open: { label: 'Open', dot: 'bg-purple-300' },
  ongoing: { label: 'Ongoing', dot: 'bg-amber-200' },
  past: { label: 'Past', dot: 'bg-white/40' },
};
const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All Programs' }, { key: 'open', label: 'Open' },
  { key: 'ongoing', label: 'Ongoing' }, { key: 'past', label: 'Past' },
];

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
      <h4 className="mb-5 uppercase text-white/50 text-xl font-medium leading-snug tracking-tight">{title}</h4>
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
          <h3 className="mt-4 max-w-2xl text-xl font-medium leading-snug tracking-tight">{program.title}</h3>
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
            <h4 className="mb-4 uppercase text-white/50 text-xl font-medium leading-snug tracking-tight">Program elements</h4>
            <ul className="space-y-3">{program.benefits.map((benefit) => <li key={benefit} className="flex gap-3 text-[15px] leading-relaxed text-white/75"><ArrowRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-purple-300" />{benefit}</li>)}</ul>
          </div>
        )}
        <Logos title="Partners & Sponsors" logos={program.partners} />
        {program.gallery.length > 0 && (
          <div>
            <h4 className="mb-5 uppercase text-white/50 text-xl font-medium leading-snug tracking-tight">Gallery</h4>
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

export default function ProgramExplorer({ programs, now }: { programs: StartupProgram[]; now: number }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [activeId, setActiveId] = useState(programs[0]?.id);
  const [detailId, setDetailId] = useState<string | null>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const matches = (p: StartupProgram, value: Filter) => value === 'all' || publicStatus(p, now) === value;
  const visible = programs.filter((p) => matches(p, filter));
  const active = visible.find((p) => p.id === activeId) ?? visible[0];
  const detail = visible.find((p) => p.id === detailId);

  useEffect(() => {
    const root = panelsRef.current;
    if (!root) return;
    const cards = root.querySelectorAll<HTMLElement>('[data-program-card]');
    const desktop = window.matchMedia('(min-width: 900px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animate = () => {
      if (!desktop.matches) {
        gsap.set(cards, { clearProps: 'flexGrow' });
        return;
      }
      gsap.to(cards, {
        flexGrow: (i: number) => visible[i]?.id === active?.id ? 2.8 : 1,
        duration: reduced.matches ? 0 : .75,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };
    animate();
    desktop.addEventListener('change', animate);
    reduced.addEventListener('change', animate);
    return () => {
      // Preserve current widths so rapid hover changes continue without snapping.
      gsap.killTweensOf(cards);
      desktop.removeEventListener('change', animate);
      reduced.removeEventListener('change', animate);
    };
  }, [active?.id, filter, programs]);

  useEffect(() => {
    if (!detail || !detailsRef.current) return;
    const el = detailsRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => gsap.fromTo(el, {height: 0, opacity: 0, y: reduced ? 0 : 12}, {height: 'auto', opacity: 1, y: 0, duration: reduced ? 0 : .65, ease: 'power3.out', clearProps: 'height,transform'}), el);
    return () => ctx.revert();
  }, [detail?.id]);

  return (
    <div className="mx-auto max-w-[1480px] px-6 lg:px-10" data-noreveal>
      <div role="group" aria-label="Filter programs by status" className="mb-10 flex flex-wrap gap-2">
        {filters.map(({key, label}) => <button key={key} type="button" aria-pressed={filter === key} onClick={() => {setFilter(key); setDetailId(null);}} className={`cursor-pointer min-h-11 rounded-full border px-5 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-purple-300 ${filter === key ? 'border-purple-300 bg-purple-300 text-black' : 'border-white/20 text-white/60 hover:border-purple-300 hover:text-white'}`}>{label}<span className="ml-3 text-[11px] opacity-50">{String(programs.filter(p => matches(p, key)).length).padStart(2, '0')}</span></button>)}
      </div>
      {active ? <>
        <div ref={panelsRef} className="program-panels" aria-label="Startup programs">
          {visible.map((program, i) => {
            const selected = active.id === program.id;
            const expanded = detailId === program.id;
            return <article key={program.id} data-program-card className={`program-image-panel ${selected ? 'is-selected' : ''}`} onMouseEnter={() => setActiveId(program.id)} onFocus={() => setActiveId(program.id)}>
              <Image src={program.image.src} alt={program.image.alt} fill sizes="(max-width: 899px) 85vw, 60vw" className="program-panel-photo" />
              <div className="program-panel-shade" />
              <div className="program-panel-top"><span className="text-[12px] tabular-nums text-white/65">{String(i + 1).padStart(2, '0')}</span><StatusBadge status={publicStatus(program, now)} /></div>
              <button type="button" className="program-panel-select" aria-label={`Select ${program.title}`} aria-pressed={selected} onClick={() => setActiveId(program.id)} />
              <div className="program-panel-preview" aria-hidden={!selected}>
                <p className="program-panel-preview-label">About the program</p>
                <p className="program-panel-preview-copy">{program.overview || 'Program details coming soon.'}</p>
                {(program.duration || program.format) && <p className="program-panel-preview-meta">{[program.duration, program.format].filter(Boolean).join(' · ')}</p>}
              </div>
              <div className="program-panel-content">
                {program.location && <p className="mb-4 text-[11px] uppercase tracking-[.18em] text-purple-200">{program.location}</p>}
                <h3>{program.title}</h3>
                <button type="button" aria-expanded={expanded} aria-controls="selected-program-details" onClick={() => {setActiveId(program.id); setDetailId(expanded ? null : program.id);}} className="program-panel-action cursor-pointer"><span>{expanded ? 'Close details' : 'Explore Program'}</span><span className="program-panel-arrow"><ArrowUpRight className="h-4 w-4" /></span></button>
              </div>
            </article>;
          })}
        </div>
        {detail && <div ref={detailsRef} id="selected-program-details" className="program-expanded-details overflow-hidden mt-8 border border-white/15 bg-[#100d15]" role="region" aria-label={`${detail.title} details`}>
          <div className="flex items-center justify-between gap-6 border-b border-white/10 p-6 sm:p-10"><h3 className="text-2xl font-medium tracking-tight sm:text-4xl">{detail.title}</h3><button type="button" onClick={() => setDetailId(null)} className="cursor-pointer rounded-full border border-white/25 px-4 py-2 text-sm text-white/70 hover:text-white">Close ×</button></div>
          <ProgramDetails program={detail} now={now} />
        </div>}
      </> : <p role="status" className="border-y border-white/15 py-16 text-white/60">{filter === 'all' ? 'Program information coming soon.' : `No ${filter} programs to display right now.`}</p>}
    </div>
  );
}
