'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { ArrowUpRight } from 'lucide-react';
import { hasProjectVisibility, isOfficialUrl, ordered, type InternationalProject } from '@/lib/programsContent';
import { ExternalAction, Logos } from './ProgramExplorer';

function CardDetails({project, open, onToggle}: {project: InternationalProject; open: boolean; onToggle: () => void}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.to(el, {height: open ? 'auto' : 0, opacity: open ? 1 : 0, duration: reduced ? 0 : .5, ease: 'power3.out', overwrite: true});
    return () => {gsap.killTweensOf(el);};
  }, [open]);
  const ready = hasProjectVisibility(project);
  return <>
    <button type="button" aria-expanded={open} onClick={onToggle} className="mt-6 inline-flex cursor-pointer items-center gap-4 rounded-full border border-purple-200/40 px-5 py-3 text-sm text-purple-200 hover:bg-purple-200 hover:text-black">{open ? 'Close details' : 'Explore project'}<ArrowUpRight className="h-4 w-4" /></button>
    <div ref={ref} inert={!open} style={{height: 0, opacity: 0, overflow: 'hidden'}}><div className="space-y-6 pt-6">
      {ready && <><Logos title="Project partners" logos={project.partners} /><Logos title="Funders" logos={project.funders} />
        {project.acknowledgement && <p className="text-sm leading-relaxed text-white/65">{project.acknowledgement}</p>}
        {isOfficialUrl(project.officialUrl) && <ExternalAction href={project.officialUrl}>Official project website</ExternalAction>}
      </>}
      {!ready && <p className="text-sm text-white/50">Project information coming soon.</p>}
      {project.id.startsWith('orbit-preview-') && <p className="text-sm text-white/50">Preview only</p>}
    </div></div>
  </>;
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
  const previews: InternationalProject[] = [1, 2, 3].map(n => ({id: `orbit-preview-${n}`, order: 900 + n, title: `Project preview ${n}`, description: 'Blank project for carousel preview.', partners: [], funders: [], requiresFundingVisibility: false}));
  const projects = ordered([...projectItems, ...previews]).map((project, index) =>
    index === 0 && !project.image
      ? { ...project, image: { src: '/images/platform/expertise.jpg', alt: 'Reference project image' } }
      : project,
  );
  const [selection, setSelection] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
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

  const selectCard = (index: number) => {
    if (suppressClick.current) return;
    let delta = index - activeIndex;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    setExpandedId(null);
    setSelection(value => value + delta);
  };

  return <div data-noreveal className="project-orbit">
    <div ref={orbitRef} className="project-orbit-stage" role="region" aria-label="Project carousel" aria-roledescription="carousel" tabIndex={0}
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
            {project.image ? <Image src={project.image.src} alt={project.image.alt} fill sizes="(max-width:640px) 86vw, 55vw" className="object-cover" draggable={false} /> : <div className="absolute inset-0 bg-gradient-to-br from-[#603388] via-[#2b163d] to-[#100b18]" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
            <button type="button" className="absolute inset-0 cursor-pointer" tabIndex={i === activeIndex ? 0 : -1} aria-label={`Open ${project.title} details`} onClick={() => { if (!suppressClick.current) setExpandedId(expandedId === project.id ? null : project.id); }} />
            <div className="project-orbit-copy" style={{opacity: i === activeIndex ? 1 : 0, visibility: i === activeIndex ? 'visible' : 'hidden'}} inert={i !== activeIndex}>
              <h3 className="text-2xl font-medium tracking-tight text-white sm:text-4xl">{project.title}</h3>
              <div className="mt-3 flex gap-4 text-xs text-purple-200">{project.status && <span className="capitalize">{project.status}</span>}{project.period && <span>{project.period}</span>}</div>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">{hasProjectVisibility(project) && project.description ? project.description : 'Project information coming soon.'}</p>
              {i === activeIndex && <CardDetails key={project.id} project={project} open={expandedId === project.id} onToggle={() => setExpandedId(expandedId === project.id ? null : project.id)} />}
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
