"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

export type ScrollState = {
  rotY: number;
  rotX: number;
  posY: number;
  scale: number;
  progress: number;
};

/**
 * Scroll timeline: the emblem's position stays pinned until ~65% scroll,
 * and during the final 65%->100% scroll range it accelerates and plunges
 * down out of the viewport into the next section.
 */
export function useScrollTimeline(
  triggerRef: RefObject<HTMLElement | null>,
  scrollState: RefObject<ScrollState>,
) {
  useEffect(() => {
    if (!triggerRef.current) return;

    const progress = { value: 0 };

    const tween = gsap.to(progress, {
      value: 1,
      ease: "none",
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.0,
      },
      onUpdate: () => {
        const p = progress.value;
        scrollState.current.progress = p;
        const baseRotY = p * Math.PI * 2;

        if (p <= 0.70) {
          scrollState.current.rotY = baseRotY;
          scrollState.current.rotX = 0;
          scrollState.current.posY = 0;
          scrollState.current.scale = 1.0;
        } else {
          // As the section end approaches and reaches the top of the viewport (0.70 -> 1.0):
          // The emblem moves down out of the frame
          const exitT = (p - 0.70) / 0.30; // 0 to 1
          const exitEase = 1 - Math.pow(1 - exitT, 2); // smooth curve

          scrollState.current.posY = -exitEase * 6.5;
          scrollState.current.rotX = exitEase * 0.5;
          scrollState.current.rotY = baseRotY + exitEase * 1.2;
          scrollState.current.scale = 1.0 - exitEase * 0.12;
        }
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [triggerRef, scrollState]);
}
