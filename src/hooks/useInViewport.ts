"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Tracks whether an element is within (or near) the viewport, so scroll-driven
 * WebGL render loops can pause entirely once their section is scrolled away.
 * `rootMargin` defaults to a generous pre/post buffer so the scene is already
 * live by the time the section reaches the sticky stage.
 */
export function useInViewport<T extends HTMLElement>(
  ref: RefObject<T | null>,
  rootMargin = "50% 0px 50% 0px",
) {
  const [isInViewport, setIsInViewport] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return isInViewport;
}
