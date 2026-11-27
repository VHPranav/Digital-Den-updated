'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import PageShell from '@/components/site/PageShell';
import SplitWords from '@/components/site/SplitWords';
import { PrimaryButton } from '@/components/site/ui';
import FlowWall from '@/components/site/FlowWall';
import type { PortfolioStartup } from '@/lib/portfolio';
import styles from './PortfolioPage.module.css';

function StartupTile({ startup }: { startup: PortfolioStartup }) {
  const inner = (
    <>
      <div className={styles.panel}>
        <span className={styles.logo}>
          <Image src={startup.logo} alt={`${startup.name} logo`} fill sizes="(max-width: 640px) 70vw, 260px" className="object-contain" />
        </span>
        {startup.website && <span className={styles.chip} aria-hidden="true"><ArrowUpRight size={16} /></span>}
      </div>
      <div className={styles.meta}>
        {startup.sector && <p className={styles.sector}>{startup.sector}</p>}
        <h2 data-plain className={styles.name}>{startup.name}</h2>
        {startup.description && <p className={styles.description}>{startup.description}</p>}
      </div>
    </>
  );
  return startup.website ? (
    <a href={startup.website} target="_blank" rel="noopener noreferrer" aria-label={`${startup.name} website (opens in a new tab)`} className={styles.tile}>{inner}</a>
  ) : (
    <article className={styles.tile}>{inner}</article>
  );
}

export default function PortfolioPage({ startups }: { startups: PortfolioStartup[] }) {
  const gridRef = useRef<HTMLUListElement>(null);

  // Fade tiles up as they enter, staggered by column.
  useEffect(() => {
    const items = Array.from(gridRef.current?.children ?? []) as HTMLElement[];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((el) => el.setAttribute('data-in', ''));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute('data-in', '');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [startups]);

  return (
    <PageShell minimalFooter>
      {(openAction) => (
        <div className={styles.page}>
          {/* Hero: Nina's copy centred inside a Gemstrat-style flow of the portfolio's logos */}
          <FlowWall labelledBy="portfolio-title" count={startups.length} itemClassName={styles.wallItem}
            renderItem={(i) => <span className={styles.wallLogo}><Image src={startups[i].logo} alt="" fill sizes="200px" className="object-contain" /></span>}>
            <h1 id="portfolio-title" data-plain className="dd-h1 font-medium">Startup Portfolio</h1>
            <p data-noreveal className={styles.heroBody}>Meet the startups that make up the Digital Den portfolio.</p>
          </FlowWall>

          <section data-noreveal className={styles.showcase} aria-label="Portfolio startups">
            <ul ref={gridRef} className={styles.grid}>
              {startups.map((startup, i) => (
                <li key={`${startup.name}-${i}`} className={styles.item} style={{ '--d': `${(i % 3) * 90}ms` } as React.CSSProperties}>
                  <StartupTile startup={startup} />
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.closing} aria-labelledby="portfolio-cta">
            <h2 id="portfolio-cta" className="dd-h2 font-medium"><SplitWords>Building something ambitious?</SplitWords></h2>
            <div className="mt-10 flex justify-center">
              <PrimaryButton onClick={openAction}>Apply as Startup</PrimaryButton>
            </div>
          </section>
        </div>
      )}
    </PageShell>
  );
}
