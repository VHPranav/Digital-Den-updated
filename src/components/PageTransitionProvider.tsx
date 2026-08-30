'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';

export default function PageTransitionProvider() {
  const pathname = usePathname();
  const router = useRouter();
  const columnsRef = useRef<HTMLDivElement[]>([]);
  const isTransitioningRef = useRef(false);

  // Set initial state
  useEffect(() => {
    // When the pathname changes, animate the columns out (reveal the new page)
    const columns = columnsRef.current.filter(Boolean);
    if (columns.length === 0) return;

    // Reset origin to bottom so it wipes out downwards
    gsap.set(columns, {
      transformOrigin: 'bottom',
      scaleY: 1,
    });

    gsap.to(columns, {
      scaleY: 0,
      duration: 0.55,
      stagger: 0.04,
      ease: 'power4.inOut',
      onComplete: () => {
        isTransitioningRef.current = false;
        gsap.set(columns, { pointerEvents: 'none' });
      },
    });
  }, [pathname]);

  // Global click interceptor for internal links
  useEffect(() => {
    const handleGlobalLinkClick = (e: MouseEvent) => {
      // Find the closest anchor element
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');

      if (!anchor) return;

      const href = anchor.getAttribute('href');
      const targetAttr = anchor.getAttribute('target');

      // Ignore external links, mailto, tel, hash links, or new-tab clicks
      if (
        !href ||
        href.startsWith('http') && !href.startsWith(window.location.origin) ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        targetAttr === '_blank' ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Convert href to relative path for check
      const url = new URL(anchor.href, window.location.origin);
      const targetPath = url.pathname;

      // If it's the exact same page, don't trigger transition
      if (targetPath === pathname) return;

      // Prevent immediate navigation
      e.preventDefault();

      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      const columns = columnsRef.current.filter(Boolean);
      if (columns.length === 0) {
        router.push(targetPath);
        return;
      }

      // Wipe in from top
      gsap.set(columns, {
        transformOrigin: 'top',
        scaleY: 0,
        pointerEvents: 'auto',
      });

      gsap.to(columns, {
        scaleY: 1,
        duration: 0.5,
        stagger: 0.04,
        ease: 'power4.inOut',
        onComplete: () => {
          router.push(targetPath);
        },
      });
    };

    document.addEventListener('click', handleGlobalLinkClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleGlobalLinkClick, { capture: true });
    };
  }, [pathname, router]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[99999] flex w-full h-full"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) columnsRef.current[i] = el;
          }}
          className="flex-1 h-full bg-[#080214] border-r border-purple-500/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
          style={{
            transform: 'scaleY(0)',
            transformOrigin: 'top',
          }}
        >
          {/* Internal ambient glowing flare in each column */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-[#100318]/60 to-black pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[300px] bg-purple-600/10 blur-[60px] pointer-events-none" />
        </div>
      ))}
    </div>
  );
}
