'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { withoutTrailingPeriod, hasProjectVisibility, isOfficialUrl, ordered, type InternationalProject } from '@/lib/programsContent';
import { ExternalAction } from './ProgramExplorer';

const statusLabel: Record<NonNullable<InternationalProject['status']>, string> = { ongoing: 'Ongoing', upcoming: 'Upcoming', past: 'Completed' };

function LogoStrip({ title, logos }: { title: string; logos: InternationalProject['partners'] }) {
  const items = logos.filter((l) => Boolean(l.src));
  if (!items.length) return null;
  return (
    <div>
      <p className="mb-3 text-[12px] uppercase tracking-[.16em] text-white/65">{title}</p>
      <ul className="flex flex-wrap gap-2">
        {items.map((logo) => {
          const tile = <span className="relative block h-12 w-36 rounded-lg bg-white"><Image src={logo.src} alt={logo.alt || logo.name} fill sizes="144px" className="object-contain p-2.5" /></span>;
          return <li key={`${logo.name}-${logo.src}`}>{isOfficialUrl(logo.href) ? <a href={logo.href} target="_blank" rel="noopener noreferrer" aria-label={`${logo.name} (opens in a new tab)`}>{tile}</a> : tile}</li>;
        })}
      </ul>
    </div>
  );
}

// Everything Digital Den needs for project visibility, shown on the active card itself.
function ProjectCopy({ project }: { project: InternationalProject }) {
  const ready = hasProjectVisibility(project);
  const funders = project.funders.filter((l) => Boolean(l.src));
  const partners = project.partners.filter((l) => Boolean(l.src));
  const hasLogos = ready && (funders.length > 0 || partners.length > 0);
  return (
    <div className="project-copy-grid">
      {/* Left: name + description */}
      <div className="project-copy-left">
        <h3 className="dd-h2 font-medium text-white">{withoutTrailingPeriod(project.title)}</h3>
        <p className="mt-4 line-clamp-4 max-w-md text-[15px] leading-[1.65] text-white/80">{ready && project.description ? project.description : 'Project information coming soon.'}</p>
      </div>

      {/* Right: status, period, funders, partners, acknowledgement, website */}
      <div className="project-copy-right">
        <div className="flex flex-wrap items-center gap-2 text-[14px]">
          {project.status && <span className="rounded-full bg-purple-300 px-4 py-1.5 font-medium text-[#180b26]">{statusLabel[project.status]}</span>}
          {project.period && <span className="rounded-full border border-white/25 bg-black/25 px-4 py-1.5 text-white/85">{project.period}</span>}
        </div>
        <div className="mt-auto">
          {hasLogos && (
            <div className="space-y-5">
              {funders.length > 0 && <LogoStrip title="Funded by" logos={funders} />}
              {partners.length > 0 && <LogoStrip title="Project partners" logos={partners} />}
              {project.acknowledgement && <p className="line-clamp-4 text-[13px] leading-relaxed text-white/65">{project.acknowledgement}</p>}
            </div>
          )}
          {isOfficialUrl(project.officialUrl) && <div className={hasLogos ? 'mt-6 border-t border-white/12 pt-5' : ''}><ExternalAction href={project.officialUrl}>Visit project website</ExternalAction></div>}
        </div>
      </div>
    </div>
  );
}

// A rounded curved mask, measured from the reference's vertically stretched
// side cards. The inner edge stays level with the centre; the outer edge fans out.
function curvePath(width: number, height: number, distance: number) {
  const bend = Math.min(1, Math.abs(distance));
  const stretch = 1 + .58 * bend;
  const inset = height * .5 * (1 - 1 / stretch);
  const radius = Math.min(24, width * .04);
  const ry = radius / stretch;
  const top = (x: number) => {
    const u = distance > 0 ? 1 - x / width : x / width;
    return inset * (2 * u - u * u);
  };
  let path = `M 0 ${top(0) + ry} Q 0 ${top(0)} ${radius} ${top(radius)}`;
  for (let n = 1; n <= 32; n++) {
    const x = radius + (width - radius * 2) * n / 32;
    path += ` L ${x} ${top(x)}`;
  }
  path += ` Q ${width} ${top(width)} ${width} ${top(width) + ry} L ${width} ${height - top(width) - ry} Q ${width} ${height - top(width)} ${width - radius} ${height - top(width - radius)}`;
  for (let n = 1; n <= 32; n++) {
    const x = width - radius - (width - radius * 2) * n / 32;
    path += ` L ${x} ${height - top(x)}`;
  }
  path += ` Q 0 ${height - top(0)} 0 ${height - top(0) - ry} Z`;
  return {stretch, path};
}

export default function ProjectsSection({ projects: projectItems }: { projects: InternationalProject[] }) {
  const projects = ordered(projectItems).map((project, index) =>
    index === 0 && !project.image
      ? { ...project, image: { src: '/images/platform/expertise.jpg', alt: 'Reference project image' } }
      : project,
  );
  const [selection, setSelection] = useState(0);
  const count = projects.length;
  const activeIndex = ((selection % count) + count) % count;
  const orbitRef = useRef<HTMLDivElement>(null);
  const phase = useRef({value: 0});
  const paintRef = useRef<() => void>(() => {});
  const drag = useRef<{x: number; y: number} | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    const root = orbitRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-orbit-card]'));
    const paint = () => {
      const width = cards[0]?.offsetWidth ?? 0;
      const height = cards[0]?.offsetHeight ?? 0;
      const step = width + 20;
      cards.forEach((card, index) => {
        // Wrap only beyond the visible neighbours, never tween a recycled card
        // through the centre of the carousel.
        const d = ((index - phase.current.value + count * 1000 + count / 2) % count) - count / 2;
        const visual = card.querySelector<HTMLElement>('[data-curve]')!;
        const {stretch, path} = curvePath(width, height, d);
        card.style.transform = `translate3d(${d * step - width / 2}px,0,0)`;
        card.style.visibility = Math.abs(d * step) > root.clientWidth / 2 + width / 2 ? 'hidden' : 'visible';
        visual.style.transform = `scaleY(${stretch})`;
        visual.style.clipPath = `path("${path}")`;
        const copy = card.querySelector<HTMLElement>('.project-orbit-copy');
        if (copy) {
          const reveal = Math.max(0, 1 - Math.abs(d) / .18);
          copy.style.opacity = String(reveal);
          copy.style.visibility = reveal > 0 ? 'visible' : 'hidden';
          copy.style.pointerEvents = reveal > .95 ? 'auto' : 'none';
        }
      });
    };
    paintRef.current = paint;
    const resize = new ResizeObserver(paint);
    resize.observe(root);
    paint();
    return () => { resize.disconnect(); paintRef.current = () => {}; };
  }, [count]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tween = gsap.to(phase.current, { value: selection, duration: reduced ? 0 : .85,
      ease: 'power3.inOut', onUpdate: () => paintRef.current(), onComplete: () => paintRef.current() });
    return () => { tween.kill(); };
  }, [selection]);

  // Autoplay: advance every 6s; pause while hovered/focused, off-screen, or for reduced-motion users.
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const root = orbitRef.current;
    if (!root) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.4 });
    io.observe(root);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (paused || !onScreen || count < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => setSelection((value) => value + 1), 6000);
    return () => window.clearTimeout(timer);
  }, [paused, onScreen, count, selection]);

  const selectCard = (index: number) => {
    if (suppressClick.current) return;
    let delta = index - activeIndex;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    setSelection(value => value + delta);
  };

  return <div data-noreveal className="project-orbit">
    <div ref={orbitRef} className="project-orbit-stage" role="region" aria-label="Project carousel" aria-roledescription="carousel" tabIndex={0}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false); }}
      onKeyDown={event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault(); setSelection(value => value + (event.key === 'ArrowRight' ? 1 : -1));
        }
      }}
      onPointerDown={event => { suppressClick.current = false; if (!(event.target as HTMLElement).closest('button,a')) {drag.current = {x:event.clientX,y:event.clientY};} }}
      onPointerUp={event => {
        if (!drag.current) return;
        const dx = event.clientX - drag.current.x;
        const dy = event.clientY - drag.current.y;
        drag.current = null;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
          suppressClick.current = true; setSelection(value => value + (dx < 0 ? 1 : -1));
        }
      }} onPointerCancel={() => {drag.current = null;}}>
      {projects.map((project, i) => <article key={project.id} data-orbit-card className="project-orbit-card" role="group" aria-roledescription="slide" aria-label={`${project.title}, ${i + 1} of ${count}`}>
        <div data-curve className="project-orbit-curve">
          <div className="project-orbit-frame">
            {/* Split card: clean image on the left, every project detail in the panel on the right */}
            <div className="project-orbit-media">
              {project.image ? <Image src={project.image.src} alt={project.image.alt} fill sizes="(max-width:640px) 86vw, 72vw" className="dd-media-grade object-cover" draggable={false} /> : <div className="absolute inset-0 bg-gradient-to-br from-[#603388] via-[#2b163d] to-[#100b18]" />}
            </div>
            <div className="project-orbit-panel">
              <div className="project-orbit-copy" style={{opacity: i === activeIndex ? 1 : 0, visibility: i === activeIndex ? 'visible' : 'hidden'}} inert={i !== activeIndex}>
                <ProjectCopy project={project} />
              </div>
            </div>
            {i !== activeIndex && <button type="button" onClick={() => selectCard(i)} aria-label={`Show ${project.title}`} className="absolute inset-0 cursor-pointer" />}
          </div>
        </div>
      </article>)}
      <button type="button" aria-label="Previous project" onClick={() => setSelection(value => value - 1)} className="project-orbit-arrow project-orbit-prev">←</button>
      <button type="button" aria-label="Next project" onClick={() => setSelection(value => value + 1)} className="project-orbit-arrow project-orbit-next">→</button>
    </div>
  </div>;
}
