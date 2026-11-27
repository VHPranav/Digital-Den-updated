'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './FlowWall.module.css';

// Ported from Gemstrat's Theory hero (FocusScene). Every slot has a home position; its item
// continuously flies outward from the centre, fading in near the middle, drifting out while
// growing slightly and fading away, then comes back as the next item. Scrolling speeds it up.
// [x%, y%, size, softness]
const WALL: [number, number, number, number][] = [
  [8, 20, 1.4, 1], [30, 13, 1, 3], [56, 17, 1.7, 0], [80, 24, 1.1, 2],
  [5, 44, 1, 2], [22, 32, 1.2, 4], [75, 40, 1.5, 1], [90, 52, 1, 3],
  [12, 66, 1.6, 0], [33, 78, 1, 2], [62, 70, 1.2, 3], [84, 74, 1.4, 1],
  [46, 88, .9, 4], [20, 90, 1.1, 1], [70, 90, 1, 2], [48, 8, 1, 2],
  [16, 10, .9, 3], [71, 9, 1, 2], [93, 18, 1.2, 4], [39, 27, .9, 2],
  [64, 29, 1.1, 3], [8, 56, .9, 2], [18, 78, 1, 3], [94, 65, 1.1, 2],
  [94, 87, .9, 4], [57, 94, 1, 3], [6, 84, .9, 2], [77, 59, 1, 4],
];
const span = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));

type FlowProps = {
  count: number;
  renderItem: (index: number, size: number) => React.ReactNode;
  opacity?: number;
  itemClassName?: string;
  /** Fade the items out as the layer scrolls off the top (off when the layer sits in a pinned/sticky stage). */
  fadeOnScroll?: boolean;
};

/** Just the moving layer: fills its positioned parent. */
export function FlowLayer({ count, renderItem, opacity = .9, itemClassName = '', fadeOnScroll = true }: FlowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const slots = WALL.slice(0, Math.min(WALL.length, count));
  const [assigned, setAssigned] = useState(() => slots.map((_, i) => i));

  useEffect(() => {
    const el = ref.current;
    if (!el || !count) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-flow-item]'));
    const cycles = items.map(() => 0);
    const current = items.map((_, i) => i);
    let pointer = items.length % count;
    let elapsed = 0, speed = 1, prevScroll = window.scrollY, last = performance.now(), frame = 0;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const seconds = Math.min(now - last, 50) / 1000;
      last = now;
      if (document.hidden) return;
      const scrolled = Math.abs(window.scrollY - prevScroll);
      prevScroll = window.scrollY;
      const target = 1 + Math.min(4, scrolled / Math.max(seconds, .001) / 400);
      speed += (target - speed) * (1 - Math.exp(-seconds * 5));
      if (!motion.matches) elapsed += seconds * speed / 12;
      const w = el.clientWidth, h = el.clientHeight;
      const out = fadeOnScroll ? span(-el.getBoundingClientRect().top, 0, h * .7) : 0;
      const finished: number[] = [];
      items.forEach((item, i) => {
        const phase = elapsed + i * .618;
        const progress = motion.matches ? .4 : phase % 1;
        const distance = .45 + progress * 2.7;
        const [x, y, , softness] = WALL[i];
        const ox = (x / 100 - .5) * w * (distance - 1);
        const oy = (y / 100 - .5) * h * (distance - 1);
        const visibility = span(progress, 0, .15) * (1 - span(progress, .8, 1));
        item.style.opacity = String(opacity * visibility * (1 - out));
        item.style.filter = motion.matches ? 'none' : `blur(${softness}px)`;
        item.style.transform = motion.matches ? 'none' : `translate3d(${ox}px, ${oy}px, 0) scale(${1 + .08 * progress})`;
        const cycle = Math.floor(phase);
        if (cycle !== cycles[i]) { cycles[i] = cycle; finished.push(i); }
      });
      // A slot that finished a pass comes back with the next item not already on screen.
      if (finished.length && count > items.length) {
        finished.forEach((i) => {
          for (let k = 0; k < count; k++) {
            const next = (pointer + k) % count;
            if (!current.includes(next)) { current[i] = next; pointer = next + 1; break; }
          }
        });
        setAssigned([...current]);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [count, opacity, fadeOnScroll]);

  return (
    <div ref={ref} className={styles.wall} aria-hidden="true">
      {slots.map(([x, y, size], i) => (
        <span key={i} data-flow-item className={`${styles.item} ${itemClassName}`} style={{ left: `${x}%`, top: `${y}%`, '--size': size } as React.CSSProperties}>
          {renderItem(assigned[i] ?? i, size)}
        </span>
      ))}
    </div>
  );
}

/** A full hero: the moving layer with centred content on top. */
export default function FlowWall({ className = '', children, labelledBy, ...flow }: FlowProps & {
  className?: string;
  children: React.ReactNode;
  labelledBy?: string;
}) {
  return (
    <section className={`${styles.flow} ${className}`} aria-labelledby={labelledBy}>
      <FlowLayer {...flow} />
      <div className={styles.content}>{children}</div>
    </section>
  );
}
