'use client';

import { useEffect, useRef } from 'react';

// Services hero artwork, ported from Gemstrat's DotMatrixApproach (DotScenes.tsx): the screen is a
// grid of square dots; each concept word (BUILD → GROW → CONNECT → EXPAND) lights up in dots and
// shimmers dot by dot into the next, on a loop. Clicking sends a ripple.
// The current step is published on the element as data-step (0-based) for captions.

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const span = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
const ease = (t: number) => (t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const rand = (seed: number) => { const v = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

type Grid = { cols: number; rows: number; cell: number; ratio: number; w: number; h: number };

function fitGrid(canvas: HTMLCanvasElement): Grid {
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = Math.round(w * ratio);
  canvas.height = Math.round(h * ratio);
  const cell = w < 700 ? 9 : Math.max(10, Math.round(w / 128));
  return { cols: Math.ceil(w / cell), rows: Math.ceil(h / cell), cell, ratio, w, h };
}

/** Which cells a word covers (0–1), set large in a band of the grid */
function sampleWord(word: string, cols: number, rows: number, band: { top: number; bottom: number }, font: string) {
  const c = document.createElement('canvas');
  c.width = cols; c.height = rows;
  const x = c.getContext('2d', { willReadFrequently: true })!;
  let size = (band.bottom - band.top) * rows * .9;
  x.font = `600 ${size}px ${font}`;
  const fit = x.measureText(word).width;
  if (fit > cols * .9) size *= cols * .9 / fit;
  x.font = `600 ${size}px ${font}`;
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff';
  x.fillText(word, cols / 2, (band.top + band.bottom) / 2 * rows);
  const d = x.getImageData(0, 0, cols, rows).data;
  const out = new Float32Array(cols * rows);
  for (let i = 0; i < out.length; i++) out[i] = d[i * 4 + 3] / 255;
  return out;
}

export default function DotBoard({ words, className = '' }: { words: string[]; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !words.length) return;
    const n = words.length;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let board: { g: Grid; masks: Float32Array[]; delay: Float32Array } | null = null;

    const build = () => {
      if (!canvas.clientWidth || !canvas.clientHeight) return;
      const g = fitGrid(canvas);
      const font = getComputedStyle(canvas).fontFamily || 'sans-serif';
      const band = g.w < 760 ? { top: .3, bottom: .5 } : { top: .26, bottom: .62 };
      board = { g, masks: words.map((w) => sampleWord(w, g.cols, g.rows, band, font)), delay: new Float32Array(g.cols * g.rows).map((_, i) => rand(i + 7) * .45) };
    };

    // Words cycle on their own: hold each one, then shimmer into the next (EXPAND loops back to BUILD).
    const start = performance.now();
    const WORD_MS = 2400;

    const ripple = { at: -10, x: 0, y: 0 };
    const click = (e: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      if (e.clientY < box.top || e.clientY > box.bottom) return;
      Object.assign(ripple, { at: performance.now() / 1000, x: e.clientX - box.left, y: e.clientY - box.top });
    };

    const paint = (time: number, value: (i: number) => number, jitter: (i: number) => number) => {
      const g = board!.g;
      context.setTransform(g.ratio, 0, 0, g.ratio, 0, 0);
      context.clearRect(0, 0, g.w, g.h);
      const since = time - ripple.at, front = since * 760, size = 22 * Math.exp(-since * 1.6);
      for (let row = 0; row < g.rows; row++) {
        for (let col = 0; col < g.cols; col++) {
          const i = row * g.cols + col;
          const v = value(i);
          const phase = rand(i) * Math.PI * 2;
          let x = col * g.cell + g.cell / 2, y = row * g.cell + g.cell / 2;
          const j = jitter(i);
          if (j > .001) { x += Math.sin(time * 3 + phase * 3) * j; y += Math.cos(time * 2.6 + phase * 5) * j; }
          if (size > .3) {
            const dx = x - ripple.x, dy = y - ripple.y, r = Math.hypot(dx, dy) || 1;
            const wave = Math.exp(-((r - front) ** 2) / (2 * 70 * 70)) * Math.sin((r - front) / 24);
            x += dx / r * wave * size; y += dy / r * wave * size;
          }
          const twinkle = .8 + .2 * Math.sin(time * 2.2 + phase);
          const alpha = (.06 + v * .9) * twinkle;
          if (alpha < .02) continue;
          // Lit dots take the Digital Den lavender; a few shimmer teal. The rest of the grid stays a faint grey.
          context.fillStyle = v > .2 ? (rand(i + 3) < .12 ? `rgba(100,223,208,${alpha.toFixed(3)})` : `rgba(216,180,254,${alpha.toFixed(3)})`) : `rgba(255,255,255,${alpha.toFixed(3)})`;
          const radius = Math.max(.7, (.14 + v ** 1.3 * .34) * g.cell);
          context.beginPath();
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fill();
        }
      }
    };

    let frame = 0, visible = false;
    const loop = (now: number) => {
      if (visible) frame = requestAnimationFrame(loop);
      if (!board) return;
      const cycle = (now - start) / WORD_MS;
      const k = Math.floor(cycle) % n;
      const local = cycle % 1;
      // Reduced motion: a plain switch at the end of each hold instead of the shimmer.
      const change = still ? (local > .9 ? 1 : 0) : span(local, .62, 1);
      const step = change > .5 ? (k + 1) % n : k;
      if (canvas.dataset.step !== String(step)) {
        canvas.dataset.step = String(step);
        canvas.dispatchEvent(new CustomEvent('dotstep', { bubbles: true, detail: step }));
      }
      const from = board.masks[k], to = board.masks[(k + 1) % n], delay = board.delay;
      paint(now / 1000,
        (i) => mix(from[i], to[i], ease(clamp((change - delay[i]) / .5))),
        (i) => { const m = clamp((change - delay[i]) / .5); return Math.abs(from[i] - to[i]) * 4 * m * (1 - m) * board!.g.cell * 1.6; });
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(loop);
    });
    const resize = new ResizeObserver(build);
    document.fonts.ready.then(() => { build(); observer.observe(canvas); resize.observe(canvas); });
    window.addEventListener('pointerdown', click);
    return () => { observer.disconnect(); resize.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('pointerdown', click); };
  }, [words]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
