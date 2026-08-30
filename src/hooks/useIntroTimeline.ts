"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { gsap } from "@/lib/gsap";

const IDLE_FLOAT_SPEED = 0.8;
const IDLE_FLOAT_AMPLITUDE = 0.08;

/**
 * Page-load intro:
 * - Runs as soon as the emblem 3D mesh is mounted and ready.
 * - Starts zoomed in close (scale 2.5) with a slight tilt.
 * - Zooms out to normal size (scale 1.0) and levels the rotation over 2.0s.
 * - Hands off to a gentle idle shimmer once the intro settles.
 */
export function useIntroTimeline(emblemGroupRef: RefObject<THREE.Group | null>) {
  const introComplete = useRef(false);

  useEffect(() => {
    const emblem = emblemGroupRef.current;
    if (!emblem) return;

    introComplete.current = false;

    // Pre-load state: close zoom with a slight tilt, half-turned (180deg)
    emblem.scale.set(2.5, 2.5, 2.5);
    emblem.rotation.x = 0.25;
    emblem.rotation.y = Math.PI;

    const tl = gsap.timeline({ defaults: { duration: 2.0, ease: "power3.out" } });

    tl.to(emblem.scale, { x: 1, y: 1, z: 1 }, 0);
    tl.to(emblem.rotation, { x: 0, y: Math.PI * 2 }, 0);

    // Notify particle system that emblem zoom-out is complete, and hand off to idle float
    tl.call(() => {
      introComplete.current = true;
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("emblem-intro-complete"));
      }
    });

    return () => {
      tl.kill();
    };
  }, [emblemGroupRef]);

  // Idle float handoff: gentle sinusoidal shimmer so chrome reflections keep moving
  useFrame((state) => {
    const emblem = emblemGroupRef.current;
    if (!emblem || !introComplete.current) return;
    emblem.rotation.y = Math.sin(state.clock.getElapsedTime() * IDLE_FLOAT_SPEED) * IDLE_FLOAT_AMPLITUDE;
  });
}
