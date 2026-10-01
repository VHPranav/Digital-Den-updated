'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLoaderDone } from './SiteLoader';

// Site-wide version of the Events image intro: any element marked
// [data-img-reveal] is unveiled bottom-to-top with a clip-path while the
// image/video inside eases from 1.18x down to its normal scale (see globals.css).
// Only a data-img-state attribute is set, so React-owned markup is untouched.
const DONE_AFTER_MS = 2000;

export default function ImageReveal() {
  const pathname = usePathname();
  // Hold first-load reveals until the site loader has lifted.
  const loaderDone = useLoaderDone();

  useEffect(() => {
    if (!loaderDone) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll<HTMLElement>('[data-img-reveal]').forEach((el) => (el.dataset.imgState = 'done'));
      return;
    }

    const timers = new Set<number>();
    const reveal = (el: HTMLElement) => {
      el.dataset.imgState = 'in';
      const t = window.setTimeout(() => {
        el.dataset.imgState = 'done';
        timers.delete(t);
      }, DONE_AFTER_MS);
      timers.add(t);
    };

    // A scroll check rather than IntersectionObserver, so fast jumps past an
    // image (anchor links, flings) still reveal it.
    let frame = 0;
    const check = () => {
      frame = 0;
      const limit = window.innerHeight * 0.88;
      document.querySelectorAll<HTMLElement>('[data-img-reveal]:not([data-img-state])').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return; // hidden (display:none)
        if (r.top < limit) reveal(el);
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // Images mounted later (tabs, filters, accordions) are picked up too.
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      mo.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [pathname, loaderDone]);

  return null;
}
