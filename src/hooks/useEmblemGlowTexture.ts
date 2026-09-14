"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export const EMBLEM_GLOW_VIDEO_PATH = "/videos/emblem-glow-nebula.mp4";

type Particle = {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
};

type SharedGlow = {
  video: HTMLVideoElement;
  videoTexture: THREE.VideoTexture;
  canvas: HTMLCanvasElement;
  canvasTexture: THREE.CanvasTexture;
  particles: Particle[];
  isVideoPlaying: { current: boolean };
  refCount: number;
};

let shared: SharedGlow | null = null;

function createParticles(): Particle[] {
  return Array.from({ length: 48 }, () => ({
    x: Math.random() * 512,
    y: Math.random() * 512,
    radius: 10 + Math.random() * 34,
    speedX: (Math.random() - 0.5) * 5.5,
    speedY: -2.2 - Math.random() * 6.0, // Fast upward streak
    color:
      Math.random() < 0.15
        ? "rgba(0, 245, 212, " // Subtle Turquoise accent (#00F5D4)
        : [
            "rgba(224, 212, 252, ", // Light Pastel Violet
            "rgba(187, 157, 238, ", // Signature Lavender (#BB9DEE)
            "rgba(168, 85, 247, ",  // Electric Orchid Purple (#A855F7)
            "rgba(124, 58, 237, ",  // Deep Royal Amethyst (#7C3AED)
          ][Math.floor(Math.random() * 4)],
    alpha: 0.35 + Math.random() * 0.65,
    pulseSpeed: 1.2 + Math.random() * 3.5,
  }));
}

function getOrCreateShared(videoSrc: string): SharedGlow {
  if (shared) return shared;

  const video = document.createElement("video");
  video.src = videoSrc;
  video.crossOrigin = "anonymous";
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.autoplay = true;

  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.colorSpace = THREE.SRGBColorSpace;
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.generateMipmaps = false;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;

  const canvasTexture = new THREE.CanvasTexture(canvas);
  canvasTexture.colorSpace = THREE.SRGBColorSpace;
  canvasTexture.minFilter = THREE.LinearFilter;
  canvasTexture.magFilter = THREE.LinearFilter;
  canvasTexture.generateMipmaps = false;

  shared = {
    video,
    videoTexture,
    canvas,
    canvasTexture,
    particles: createParticles(),
    isVideoPlaying: { current: false },
    refCount: 0,
  };
  return shared;
}

/**
 * Generates (and shares) the emblem's emissive glow texture across every
 * consumer on the page (the Hero emblem and the CreativeTransition emblem
 * both display the same nebula loop) — a single <video> decodes the footage
 * once instead of once per consumer.
 * - Plays `/videos/emblem-glow-nebula.mp4` (a color-graded turquoise/violet nebula loop,
 *   on-theme with the site's lavender/violet/turquoise palette) with full autoplay/muted/loop.
 * - If the video is loading or blocked by autoplay policy, falls back to a procedural
 *   canvas bokeh field in the same palette, so the emblem is never left without a glow.
 */
export function useEmblemGlowTexture(videoSrc: string = EMBLEM_GLOW_VIDEO_PATH) {
  // Exposed as state (read during render), matching the original per-component
  // hook's contract — the shared instance itself lives in a ref for useFrame.
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);
  const instanceRef = useRef<SharedGlow | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const s = getOrCreateShared(videoSrc);
    s.refCount += 1;
    instanceRef.current = s;
    setTexture(s.videoTexture);

    const onPlay = () => {
      s.isVideoPlaying.current = true;
    };
    s.video.addEventListener("playing", onPlay);
    s.video.addEventListener("loadeddata", onPlay);
    s.video.play().catch(() => {
      s.isVideoPlaying.current = false;
    });

    // Stop decoding while the tab is backgrounded — pausing the R3F canvas frameloop
    // alone doesn't stop the underlying <video> element's own background decode work.
    const onVisibility = () => {
      if (document.hidden) s.video.pause();
      else s.video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      s.video.removeEventListener("playing", onPlay);
      s.video.removeEventListener("loadeddata", onPlay);
      document.removeEventListener("visibilitychange", onVisibility);
      instanceRef.current = null;

      s.refCount -= 1;
      if (s.refCount <= 0) {
        s.video.pause();
        s.video.removeAttribute("src");
        s.video.load();
        s.videoTexture.dispose();
        s.canvasTexture.dispose();
        shared = null;
      }
    };
  }, [videoSrc]);

  useFrame((state) => {
    const s = instanceRef.current;
    if (!s) return;

    if (s.isVideoPlaying.current) {
      s.videoTexture.needsUpdate = true;
      return;
    }

    const ctx = s.canvas.getContext("2d");
    if (!ctx) return;

    const t = state.clock.elapsedTime;

    // Dark backdrop with subtle motion trail fade
    ctx.fillStyle = "rgba(4, 6, 12, 0.28)";
    ctx.fillRect(0, 0, 512, 512);
    ctx.globalCompositeOperation = "screen";

    s.particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < -60) p.x = 572;
      if (p.x > 572) p.x = -60;
      if (p.y < -60) p.y = 572;

      const dynamicAlpha = (p.alpha * (0.65 + 0.35 * Math.sin(t * p.pulseSpeed))).toFixed(2);
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      grad.addColorStop(0, `${p.color}${dynamicAlpha})`);
      grad.addColorStop(0.65, `${p.color}${(Number(dynamicAlpha) * 0.35).toFixed(2)})`);
      grad.addColorStop(1, `${p.color}0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    ctx.globalCompositeOperation = "source-over";
    s.canvasTexture.needsUpdate = true;
  });

  // Mirrors the original per-component hook's selection: once the video
  // texture exists it's preferred outright (the canvas fallback is only
  // ever actually rendered-into in the brief window before this effect commits).
  return texture;
}
