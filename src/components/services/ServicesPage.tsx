'use client';

import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import PageShell from '@/components/site/PageShell';
import SplitWords from '@/components/site/SplitWords';
import { FadeIn } from '@/components/FadeIn';
import { useLoaderGone } from '@/components/site/SiteLoader';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { contact } from '@/lib/homeContent';
import { defaultServicesContent, type ServiceChapter, type ServicesPageContent } from '@/lib/servicesContent';
import DotBoard from './DotBoard';
import styles from './ServicesPage.module.css';

const contactHref = `mailto:${contact.email}?subject=${encodeURIComponent('Digital Den services inquiry')}`;

function TalkLink() {
  return (
    <a href={contactHref} className={styles.talkLink}>
      Talk to Our Team
      <span><ArrowUpRight size={18} aria-hidden="true" /></span>
    </a>
  );
}

const chapterArt: Record<string, { word: string; position: string }> = {
  'startup-setup': { word: 'BUILD', position: '54% 47%' },
  'growth-investment': { word: 'GROW', position: '48% 43%' },
  'corporate-innovation': { word: 'CONNECT', position: '52% 44%' },
  'market-entry': { word: 'EXPAND', position: '53% 46%' },
};
const openingWords = Object.values(chapterArt).map(({ word }) => word);
const formatAct = (index: number) => String(index + 1).padStart(2, '0');

function ChapterMedia({ chapter }: { chapter: ServiceChapter }) {
  return (
    <div className={styles.media} data-act-media>
      <div className={styles.imageMotion} data-image-motion>
        <Image
          src={chapter.image.src}
          alt={chapter.image.alt}
          fill
          sizes="100vw"
          className={styles.imageGrade}
          style={{ objectPosition: chapterArt[chapter.id]?.position }}
        />
      </div>
    </div>
  );
}

function OpeningTitles({ content, ready }: { content: ServicesPageContent; ready: boolean }) {
  return (
    <section className={styles.hero} aria-labelledby="services-title" data-ready={ready} data-noreveal>
      {/* Dot-matrix board (ported from Gemstrat): BUILD, GROW, CONNECT, EXPAND light up in dots in turn */}
      <div className={styles.dotStage} aria-hidden="true">
        <DotBoard words={openingWords} className={styles.dotCanvas} />
      </div>
      <div className={styles.heroInner}>
        {/* Headline bottom-left; supporting copy and actions bottom-right */}
        <div className={styles.heroIntro}>
          <h1 id="services-title" data-plain className="dd-h1 font-medium">
            <SplitWords>{content.hero.title}</SplitWords>
          </h1>
        </div>
        <div className={`${styles.heroIntro} ${styles.heroAside}`}>
          <p className={styles.heroBody}>{content.hero.body}</p>
          <div className={styles.heroActions}>
            <TalkLink />
            <a href="#services-overview" className={styles.exploreLink}>Explore Services <ArrowDown size={17} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Act({ chapter, index, count, onOpen }: {
  chapter: ServiceChapter;
  index: number;
  count: number;
  onOpen: (chapter: ServiceChapter, button: HTMLButtonElement) => void;
}) {
  return (
    <article id={chapter.id} className={styles.act} data-act aria-labelledby={`${chapter.id}-title`}>
      <ChapterMedia chapter={chapter} />
      <div className={styles.actWord} data-act-word aria-hidden="true">{chapterArt[chapter.id]?.word}</div>
      <div className={styles.actCopy} data-act-copy>
        <p className={styles.actNumber}>Act {formatAct(index)} / {formatAct(count - 1)}</p>
        <h2 id={`${chapter.id}-title`} className="dd-h2 font-medium">{chapter.title}</h2>
        <p className={styles.description}>{chapter.description}</p>
        <ul className={styles.pills}>
          {chapter.keyServices.slice(0, 3).map((service, i) => <li key={i}>{service}</li>)}
        </ul>
        <button type="button" className={styles.detailsButton} aria-haspopup="dialog" onClick={(event) => onOpen(chapter, event.currentTarget)}>
          View all services <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

function DrawerList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className={styles.drawerGroup}>
      <h3 className="dd-h3 font-medium">{title}</h3>
      <ul>{items.map((item, index) => <li key={index}>{item}</li>)}</ul>
    </section>
  );
}

function DetailsDrawer({ chapter, onClose }: { chapter: ServiceChapter; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const closeAnimation = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const modal = dialog.current;
    if (!modal) return;
    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    modal.showModal();
    closeButton.current?.focus({ preventScroll: true });

    const motion = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      gsap.fromTo(panel.current, { xPercent: 100 }, { xPercent: 0, duration: reduced ? 0 : 0.55, ease: 'power3.out' });
      gsap.fromTo(backdrop.current, { opacity: 0 }, { opacity: 1, duration: reduced ? 0 : 0.4 });
    }, modal);

    return () => {
      closeAnimation.current?.kill();
      motion.revert();
      modal.close();
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, []);

  function close() {
    if (closeAnimation.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onClose();
      return;
    }
    closeAnimation.current = gsap.timeline({ onComplete: onClose })
      .to(panel.current, { xPercent: 100, duration: 0.38, ease: 'power3.in', overwrite: true }, 0)
      .to(backdrop.current, { opacity: 0, duration: 0.38, overwrite: true }, 0);
  }

  return (
    <dialog ref={dialog} className={styles.drawer} aria-labelledby="services-drawer-title" data-lenis-prevent
      onCancel={(event) => { event.preventDefault(); close(); }}>
      <div ref={backdrop} className={styles.drawerBackdrop} onClick={close} aria-hidden="true" />
      <div ref={panel} className={styles.drawerPanel}>
        <button type="button" ref={closeButton} className={styles.closeChip} onClick={close}>Close <span aria-hidden="true">×</span></button>
        <h2 id="services-drawer-title" className="dd-h2 font-medium">{chapter.title}</h2>
        <DrawerList title="Key services" items={[...chapter.keyServices, ...chapter.extendedServices]} />
        {chapter.addOns.length > 0 && <DrawerList title="Optional add-ons" items={chapter.addOns} />}
        <DrawerList title="Best for" items={chapter.bestFor} />
      </div>
    </dialog>
  );
}

function StatementWords({ text }: { text: string }) {
  return text.split(/(\s+)/).map((part, index) =>
    /^\s+$/.test(part) ? part : <span key={index} className={styles.statementWord} data-statement-word>{part}</span>,
  );
}

function CinematicServices({ content, ready }: { content: ServicesPageContent; ready: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const openedBy = useRef<HTMLButtonElement | null>(null);
  const [detail, setDetail] = useState<ServiceChapter | null>(null);
  const chapters = content.chapters;

  function openDetails(chapter: ServiceChapter, button: HTMLButtonElement) {
    openedBy.current = button;
    setDetail(chapter);
  }

  function closeDetails() {
    setDetail(null);
  }

  useEffect(() => {
    if (!detail && openedBy.current) {
      openedBy.current.focus({ preventScroll: true });
      openedBy.current = null;
    }
  }, [detail]);

  useEffect(() => {
    const el = root.current;
    if (!el || !chapters.length) return;
    const stage = el.querySelector<HTMLElement>('[data-act-stage]');
    if (!stage) return;

    let disposed = false;
    let resizeTimer: number | undefined;
    let anchorFrame = 0;
    let syncAnchor: (() => void) | undefined;
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const statement = el.querySelector('[data-services-statement]');
        if (!statement) return;
        gsap.from(statement.querySelectorAll('[data-statement-word]'), {
          opacity: 0,
          y: 16,
          filter: 'blur(8px)',
          duration: 0.65,
          stagger: 0.04,
          ease: 'power2.out',
          clearProps: 'opacity,transform,filter',
          scrollTrigger: { trigger: statement, start: 'top 88%', once: true },
        });
      });
      media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        el.setAttribute('data-cinematic', '');
        const scenes = Array.from(stage.querySelectorAll<HTMLElement>('[data-act]'));
        const ticks = Array.from(stage.querySelectorAll<HTMLAnchorElement>('[data-act-tick]'));
        const layers = scenes.map((scene) => ({
          media: scene.querySelector('[data-act-media]'),
          image: scene.querySelector('[data-image-motion]'),
          word: scene.querySelector('[data-act-word]'),
          copy: scene.querySelector('[data-act-copy]'),
        }));
        const clip = 'inset(50% 50% 50% 50% round 24px)';
        const openClip = 'inset(0% 0% 0% 0% round 0px)';
        let active = -1;
        let interactive = -2;
        const ACT_LENGTH = 1.2;
        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: stage, start: 'top top', pin: true, scrub: true,
            end: () => `+=${window.innerHeight * scenes.length * ACT_LENGTH}`,
            onToggle: ({ isActive }) => stage.toggleAttribute('data-playing', isActive),
          },
        });
        layers.forEach(({ media: imageLayer, image, word, copy }, index) => {
          const start = index * ACT_LENGTH;
          const incoming = [word, copy];
          timeline.addLabel(`act${index + 1}`, index ? start + 0.2 : 0);
          if (index) {
            gsap.set(imageLayer, { clipPath: clip, visibility: 'hidden' });
            gsap.set(incoming, { autoAlpha: 0, y: 20 });
            timeline.set(imageLayer, { visibility: 'visible' }, start - 0.33)
              .to(imageLayer, { clipPath: openClip, duration: 0.33, ease: 'power2.inOut' }, start - 0.33)
              .set(layers[index - 1].media, { visibility: 'hidden' }, start)
              .to(incoming, { autoAlpha: 1, y: 0, duration: 0.17 }, start + 0.02);
          }
          timeline.fromTo(image, { scale: 1 }, { scale: 1.08, duration: ACT_LENGTH, immediateRender: false }, start)
            .fromTo(word, { xPercent: -1 }, { xPercent: 2, duration: index ? 0.68 : 0.87, immediateRender: false }, start);
          if (index < layers.length - 1) {
            timeline.to(incoming, { autoAlpha: 0, y: -20, duration: 0.2 }, start + 0.6);
          }
        });

        function syncAct() {
          const time = timeline.time();
          const index = Math.min(scenes.length - 1, Math.floor(time / ACT_LENGTH));
          const local = time - index * ACT_LENGTH;
          const selected = local >= 0.87 && index + 1 < scenes.length ? index + 1 : index;
          const visible = (index === 0 || local >= 0.19) && (index === scenes.length - 1 || local < 0.6) ? index : -1;
          if (selected !== active) {
            ticks[active]?.removeAttribute('aria-current');
            ticks[selected]?.setAttribute('aria-current', 'step');
            active = selected;
          }
          if (visible !== interactive) {
            scenes.forEach((scene, i) => { scene.inert = i !== visible; });
            interactive = visible;
          }
        }
        timeline.eventCallback('onUpdate', syncAct);
        syncAct();

        function seek(hash: string, behavior: ScrollBehavior) {
          const index = chapters.findIndex((chapter) => `#${chapter.id}` === hash);
          const trigger = timeline.scrollTrigger;
          if (index < 0 || !trigger) return false;
          const offset = timeline.labels[`act${index + 1}`] / timeline.duration();
          window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * offset, behavior });
          return true;
        }

        function onClick(event: MouseEvent) {
          if (!(event.target instanceof Element) || event.defaultPrevented || event.button !== 0 ||
              event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
          if (!anchor || !seek(anchor.hash, 'smooth')) return;
          event.preventDefault();
          if (window.location.hash !== anchor.hash) window.history.pushState(null, '', anchor.hash);
        }

        function onHashChange() {
          seek(window.location.hash, 'instant');
        }

        syncAnchor = onHashChange;
        anchorFrame = window.requestAnimationFrame(() => {
          anchorFrame = window.requestAnimationFrame(onHashChange);
        });
        el.addEventListener('click', onClick);
        window.addEventListener('hashchange', onHashChange);
        return () => {
          el.removeEventListener('click', onClick);
          window.removeEventListener('hashchange', onHashChange);
          window.cancelAnimationFrame(anchorFrame);
          syncAnchor = undefined;
          el.removeAttribute('data-cinematic');
          stage.removeAttribute('data-playing');
          scenes.forEach((scene) => { scene.inert = false; });
          ticks.forEach((tick) => tick.removeAttribute('aria-current'));
        };
      });
    }, el);

    function refresh() {
      ScrollTrigger.refresh();
    }
    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(refresh, 150);
    }
    window.addEventListener('resize', onResize);
    void document.fonts.ready.then(() => {
      if (disposed) return;
      refresh();
      syncAnchor?.();
    });

    return () => {
      disposed = true;
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      context.revert();
    };
  }, [chapters]);

  return (
    <div ref={root} className={styles.cinematic}>
      <OpeningTitles content={content} ready={ready} />
      <div className={styles.programsClarification} data-noreveal>
        <p data-services-statement>
          <StatementWords text="Our programs follow a" />{' '}
          <strong><StatementWords text="defined structure and timeline." /></strong>{' '}
          <StatementWords text="Our services are tailored around the" />{' '}
          <strong><StatementWords text="specific needs, stage and goals" /></strong>{' '}
          <StatementWords text="of each client." />
        </p>
      </div>
      <section id="services-overview" className={styles.stage} data-act-stage aria-label="Services overview" data-noreveal>
        {chapters.map((chapter, index) => (
          <Act key={chapter.id} chapter={chapter} index={index} count={chapters.length} onOpen={openDetails} />
        ))}
        <nav className={styles.actNav} aria-label="Service acts">
          {chapters.map((chapter, index) => (
            <a key={chapter.id} href={`#${chapter.id}`} data-act-tick aria-label={`Act ${formatAct(index)}: ${chapter.title}`} />
          ))}
        </nav>
      </section>
      {detail && createPortal(<DetailsDrawer chapter={detail} onClose={closeDetails} />, document.body)}
    </div>
  );
}

function Credits({ children }: { children: ReactNode }) {
  return <FadeIn animation="slideUp" className={styles.credit}>{children}</FadeIn>;
}

export default function ServicesPage({ content = defaultServicesContent }: { content?: ServicesPageContent }) {
  const loaderGone = useLoaderGone();

  return (
    <PageShell minimalFooter>
      {() => (
        <div className={styles.page}>
          <CinematicServices content={content} ready={loaderGone} />

          <section className={styles.glance} aria-label="Services at a glance" data-noreveal>
            {content.glance.map((item) => (
              <Credits key={item.label}>
                <h2 data-plain className={styles.glanceLabel}>{item.label}</h2>
                <p>{item.text.split('·').map((part, index) => (
                  <Fragment key={index}>
                    {index > 0 && <span className={styles.glanceDot}>·</span>}
                    {part}
                  </Fragment>
                ))}</p>
              </Credits>
            ))}
          </section>

          <section className={styles.closing} aria-labelledby="services-closing-title">
            <FadeIn animation="slideUp">
              <h2 id="services-closing-title" className="dd-h2 font-medium"><SplitWords>{content.closing.title}</SplitWords></h2>
              <p>{content.closing.body}</p>
              <TalkLink />
            </FadeIn>
          </section>
        </div>
      )}
    </PageShell>
  );
}
