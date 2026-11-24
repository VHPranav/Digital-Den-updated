'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight, Plus, Minus } from 'lucide-react';
import PageShell from '@/components/site/PageShell';
import SplitWords from '@/components/site/SplitWords';
import { FadeIn } from '@/components/FadeIn';
import { useLoaderGone } from '@/components/site/SiteLoader';
import { contact } from '@/lib/homeContent';
import { defaultServicesContent, type ServiceChapter, type ServicesPageContent } from '@/lib/servicesContent';
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

function Chapter({ chapter }: { chapter: ServiceChapter }) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = `${chapter.id}-details`;

  return (
    <article id={chapter.id} className={styles.chapter} aria-labelledby={`${chapter.id}-title`}>
      <h3 id={`${chapter.id}-title`} className="dd-h2 font-medium">{chapter.title}</h3>
      <p className={styles.description}>{chapter.description}</p>
      <div className={styles.mobileServiceImage}>
        <Image src={chapter.image.src} alt={chapter.image.alt} fill sizes="(max-width: 900px) 100vw, 1px" />
      </div>
      <div className={styles.chapterLower}>
        <div>
          <h4 className={styles.detailHeading}>Key services</h4>
          <ul className={styles.serviceList}>
            {chapter.keyServices.map((service) => (
              <li key={service}><span className={styles.serviceDot} aria-hidden="true" />{service}</li>
            ))}
          </ul>
          <button
            className={styles.expandButton}
            type="button"
            aria-expanded={expanded}
            aria-controls={detailsId}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show fewer services' : 'View all services'}
            {expanded ? <Minus size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
          </button>
          <div id={detailsId} hidden={!expanded} className={styles.extended}>
            <ul className={styles.moreList}>
              {chapter.extendedServices.map((service) => <li key={service}>{service}</li>)}
            </ul>
            {chapter.addOns.length > 0 && (
              <div className={styles.addOns}>
                <h4 className={styles.detailHeading}>Optional add-ons</h4>
                <ul className={styles.moreList}>
                  {chapter.addOns.map((service) => <li key={service}>{service}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className={styles.bestFor}>
          <h4 className={styles.detailHeading}>Best for</h4>
          <ul>{chapter.bestFor.map((audience) => (
            <li key={audience}><ArrowUpRight size={15} aria-hidden="true" />{audience}</li>
          ))}</ul>
        </div>
      </div>
    </article>
  );
}

const heroPoster = '/images/services/services-hero-poster.webp';

function HeroVideo({ ready }: { ready: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !ready) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function syncPlayback() {
      if (!video) return;
      if (reducedMotion.matches) video.pause();
      else void video.play().catch(() => {});
    }

    syncPlayback();
    reducedMotion.addEventListener('change', syncPlayback);
    return () => reducedMotion.removeEventListener('change', syncPlayback);
  }, [ready]);

  return (
    <video
      ref={videoRef}
      className={styles.heroArtwork}
      src="/videos/services-hero.mp4"
      poster={heroPoster}
      preload="none"
      muted
      loop
      playsInline
      aria-hidden="true"
    />
  );
}

function ServiceOverview({ chapters }: Pick<ServicesPageContent, 'chapters'>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const articles = Array.from(listRef.current?.children ?? []);
    let frame: number | undefined;

    function updateActiveService() {
      frame = undefined;
      const readingLine = window.innerHeight * 0.4;
      const nextArticle = articles.findIndex((article) => article.getBoundingClientRect().bottom > readingLine);
      setActiveIndex(nextArticle === -1 ? Math.max(0, articles.length - 1) : nextArticle);
    }

    function scheduleUpdate() {
      frame ??= window.requestAnimationFrame(updateActiveService);
    }

    const observer = new ResizeObserver(scheduleUpdate);
    articles.forEach((article) => observer.observe(article));
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    scheduleUpdate();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, [chapters]);

  return (
    <section id="services-overview" aria-labelledby="services-overview-title" className={styles.overview}>
      <h2 id="services-overview-title" className="dd-h2 font-medium">How we can help</h2>
      <div className={styles.serviceStory}>
        <div className={styles.stickyPanel} aria-hidden="true">
          <div className={styles.serviceImages}>
            {chapters.map((chapter, index) => (
              <Image
                key={chapter.id}
                src={chapter.image.src}
                alt=""
                fill
                sizes="(min-width: 901px) 42vw, 1px"
                data-active={activeIndex === index}
              />
            ))}
          </div>
        </div>
        <div ref={listRef}>
          {chapters.map((chapter) => <Chapter key={chapter.id} chapter={chapter} />)}
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage({ content = defaultServicesContent }: { content?: ServicesPageContent }) {
  const loaderGone = useLoaderGone();

  return (
    <PageShell minimalFooter>
      {() => (
        <div className={styles.page}>
          <section className={styles.hero} aria-labelledby="services-title" data-ready={loaderGone}>
            <HeroVideo ready={loaderGone} />
            <div className={styles.heroShade} />
            <div className={styles.heroInner}>
              <div className={styles.heroCopy}>
                <h1 id="services-title" data-plain className="dd-h1 font-medium">
                  <SplitWords>{content.hero.title}</SplitWords>
                </h1>
              </div>
              <FadeIn animation="slideUp" delay={0.15} className={styles.heroAside}>
                <p className={styles.heroBody}>{content.hero.body}</p>
                <div className={styles.heroActions}>
                  <TalkLink />
                  <a href="#services-overview" className={styles.exploreLink}>Explore Services <ArrowDown size={17} aria-hidden="true" /></a>
                </div>
              </FadeIn>
            </div>
          </section>

          <ServiceOverview chapters={content.chapters} />

          <section className={styles.glance} aria-label="Services at a glance">
            <div className={styles.glanceInner}>
              {content.glance.map((item) => (
                <div key={item.label}>
                  <h2 data-plain className={styles.detailHeading}>{item.label}</h2>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
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
