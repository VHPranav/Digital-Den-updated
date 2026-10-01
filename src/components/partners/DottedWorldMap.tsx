'use client';

import React, { useEffect, useRef } from 'react';

// Full-bleed dotted world map (Miller projection, dots precomputed by
// scripts/build-map-dots.mjs) with "data transfer" pulses: light travels along
// arcs between the Montenegro hub and partner countries, alternating direction, and
// the receiving city flashes on arrival. Canvas 2D; the dot field is cached.

type MapData = { cols: number; aspect: number; latTop: number; latBottom: number; dots: number[] };
// `label` places the name: 'right' (default), or to the left above / below for crowded spots.
export type City = { name: string; lat: number; lng: number; label?: 'right' | 'left-up' | 'left-down' };

// Points sit near each country's centre, so labels read as countries/regions.
const HUB: City = { name: 'Montenegro', lat: 42.7, lng: 19.3 };
const PARTNER_CITIES: City[] = [
  { name: 'United States', lat: 39.5, lng: -98.35 },
  { name: 'United Kingdom', lat: 52.6, lng: -1.5, label: 'left-up' },
  { name: 'France', lat: 46.6, lng: 2.4, label: 'left-down' },
  { name: 'Germany', lat: 51.2, lng: 10.4 },
  { name: 'Jordan', lat: 31.2, lng: 36.5, label: 'left-down' },
  { name: 'Singapore', lat: 1.35, lng: 103.82 },
];

const DEG = Math.PI / 180;
const millerY = (lat: number) => 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * lat * DEG));

const HOVER_RADIUS = 150; // px around the cursor that feel the pull
const MAGNET_PX = 10; // max distance a dot is pulled towards the cursor
const PERIOD = 3.6; // seconds per one-way transfer
const TRAIL = 0.22; // fraction of the arc covered by the glowing trail

export default function DottedWorldMap({
  className = '',
  cities = PARTNER_CITIES,
  fit = 'cover',
  dotColor = 'rgba(236, 230, 255, 0.22)',
  parallax = true,
  magnet = false,
}: {
  className?: string;
  cities?: City[];
  // cover: fill the box, cropped around the hub (hero background).
  // contain: show the whole world inside the box.
  fit?: 'cover' | 'contain';
  dotColor?: string;
  // Drift the map slightly with the pointer.
  parallax?: boolean;
  // Pull the dots around the cursor slightly towards it.
  magnet?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let data: MapData | null = null;
    let disposed = false;
    const dotLayer = document.createElement('canvas');
    const family = getComputedStyle(document.body).fontFamily || 'sans-serif';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Map frame in CSS px (recomputed on resize).
    let W = 0;
    let H = 0;
    let dpr = 1;
    let mapX = 0;
    let mapY = 0;
    let mapW = 0;
    let mapH = 0;
    // Visible dots in canvas CSS px, kept for the magnet effect.
    let dotXY = new Float32Array(0);
    let dotR = 1;

    const project = (lat: number, lng: number) => {
      if (!data) return { x: 0, y: 0 };
      const yTop = millerY(data.latTop);
      const yBottom = millerY(data.latBottom);
      return {
        x: mapX + ((lng + 180) / 360) * mapW,
        y: mapY + ((yTop - millerY(lat)) / (yTop - yBottom)) * mapH,
      };
    };

    type Arc = { a: { x: number; y: number }; b: { x: number; y: number }; c: { x: number; y: number }; offset: number };
    let arcs: Arc[] = [];
    let hub = { x: 0, y: 0 };

    const layout = () => {
      if (!data) return;
      // The canvas overhangs the wrapper slightly for the parallax, so size from it.
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      if (!W || !H) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);

      // Fill the width on desktop; on tall/narrow screens grow the map and keep
      // the Montenegro hub near the centre.
      if (fit === 'contain') {
        mapW = Math.min(W, H * data.aspect);
        mapH = mapW / data.aspect;
        mapX = (W - mapW) / 2;
        mapY = (H - mapH) / 2;
      } else {
        mapW = Math.max(W, H * data.aspect * 0.78);
        mapH = mapW / data.aspect;
        const hubFx = (HUB.lng + 180) / 360;
        mapX = Math.min(0, Math.max(W - mapW, W * 0.52 - hubFx * mapW));
        mapY = (H - mapH) * 0.42;
      }

      // Cache the dot field.
      dotLayer.width = canvas.width;
      dotLayer.height = canvas.height;
      const d = dotLayer.getContext('2d')!;
      d.setTransform(dpr, 0, 0, dpr, 0, 0);
      d.clearRect(0, 0, W, H);
      const pitch = mapW / data.cols;
      const r = Math.max(0.6, pitch * 0.22);
      d.fillStyle = dotColor;
      dotR = r;
      const xy: number[] = [];
      for (let i = 0; i < data.dots.length; i += 2) {
        const x = mapX + data.dots[i] * mapW;
        const y = mapY + data.dots[i + 1] * mapH;
        if (x < -4 || x > W + 4 || y < -4 || y > H + 4) continue;
        xy.push(x, y);
        d.beginPath();
        d.arc(x, y, r, 0, Math.PI * 2);
        d.fill();
      }

      dotXY = new Float32Array(xy);

      hub = project(HUB.lat, HUB.lng);
      arcs = cities.map((c, i) => {
        const b = project(c.lat, c.lng);
        const mx = (hub.x + b.x) / 2;
        const my = (hub.y + b.y) / 2;
        const dist = Math.hypot(b.x - hub.x, b.y - hub.y);
        return { a: hub, b, c: { x: mx, y: my - dist * 0.32 }, offset: (i / cities.length) * PERIOD * 2 };
      });
    };

    const qp = (arc: Arc, t: number) => {
      const u = 1 - t;
      return {
        x: u * u * arc.a.x + 2 * u * t * arc.c.x + t * t * arc.b.x,
        y: u * u * arc.a.y + 2 * u * t * arc.c.y + t * t * arc.b.y,
      };
    };

    const glow = (x: number, y: number, radius: number, alpha: number) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
      g.addColorStop(0, `rgba(233, 213, 255, ${alpha})`);
      g.addColorStop(0.35, `rgba(192, 132, 252, ${alpha * 0.55})`);
      g.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (time: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(dotLayer, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Dots near the cursor drift slightly towards it (magnetic pull).
      // Their originals are cut out of the cached layer, then redrawn displaced.
      if (hoverAmt > 0.01) {
        const R = HOVER_RADIUS;
        for (let i = 0; i < dotXY.length; i += 2) {
          const x = dotXY[i];
          const y = dotXY[i + 1];
          const dx = hoverX - x;
          const dy = hoverY - y;
          if (dx > R || dx < -R || dy > R || dy < -R) continue;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > R) continue;
          const f = 1 - dist / R;
          const pull = dist > 0.001 ? (Math.min(dist * 0.35, MAGNET_PX) * f ** 1.5 * hoverAmt) / dist : 0;

          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.arc(x, y, dotR + 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';

          ctx.fillStyle = dotColor;
          ctx.beginPath();
          ctx.arc(x + dx * pull, y + dy * pull, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Base arcs.
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(196, 165, 255, 0.16)';
      for (const arc of arcs) {
        ctx.beginPath();
        ctx.moveTo(arc.a.x, arc.a.y);
        ctx.quadraticCurveTo(arc.c.x, arc.c.y, arc.b.x, arc.b.y);
        ctx.stroke();
      }

      // Pulses + arrival flashes.
      for (const arc of arcs) {
        const local = (time + arc.offset) / PERIOD;
        const cycle = Math.floor(local);
        const p = local - cycle;
        const outbound = cycle % 2 === 0;
        const head = reduced ? 0.6 : p;
        const tAt = (k: number) => (outbound ? k : 1 - k);

        // Trail: fading segments behind the head.
        const steps = 18;
        for (let s = 0; s < steps; s++) {
          const k0 = head - TRAIL * (s / steps);
          const k1 = head - TRAIL * ((s + 1) / steps);
          if (k0 <= 0) break;
          const p0 = qp(arc, tAt(Math.max(0, k0)));
          const p1 = qp(arc, tAt(Math.max(0, k1)));
          ctx.strokeStyle = `rgba(216, 180, 254, ${0.85 * (1 - s / steps)})`;
          ctx.lineWidth = 1.8 * (1 - s / steps) + 0.4;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }
        const hp = qp(arc, tAt(head));
        glow(hp.x, hp.y, 9, 0.9);

        // Arrival flash at the receiving end during the first part of the next leg.
        if (!reduced && p < 0.28) {
          const f = p / 0.28;
          const target = outbound ? arc.a : arc.b; // previous leg ended where this one starts
          ctx.strokeStyle = `rgba(216, 180, 254, ${0.7 * (1 - f)})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(target.x, target.y, 4 + f * 16, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // City markers + labels.
      ctx.font = `600 14px ${family}`;
      ctx.textBaseline = 'middle';
      // Dark halo behind labels so they stay readable over the dots and arcs.
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 6;
      cities.forEach((c, i) => {
        const pt = arcs[i]?.b;
        if (!pt) return;
        ctx.shadowBlur = 0;
        glow(pt.x, pt.y, 7, 0.55);
        ctx.fillStyle = '#efe7ff';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 6;
        ctx.fillStyle = 'rgba(248, 245, 255, 0.92)';
        const left = c.label === 'left-up' || c.label === 'left-down';
        ctx.textAlign = left ? 'right' : 'left';
        ctx.fillText(c.name, left ? pt.x - 9 : pt.x + 9, c.label === 'left-down' ? pt.y + 12 : pt.y - 11);
      });
      ctx.shadowBlur = 0;

      // Hub.
      const hp = (time % 2.4) / 2.4;
      ctx.strokeStyle = `rgba(216, 180, 254, ${0.6 * (1 - hp)})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(hub.x, hub.y, 5 + hp * 26, 0, Math.PI * 2);
      ctx.stroke();
      glow(hub.x, hub.y, 16, 0.9);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(hub.x, hub.y, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 6;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.font = `700 15px ${family}`;
      ctx.fillText(HUB.name, hub.x + 11, hub.y + 14);
      ctx.shadowBlur = 0;
    };

    // Gentle parallax towards the pointer.
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    const onPointer = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * -14;
      targetY = (e.clientY / window.innerHeight - 0.5) * -10;
    };
    if (!reduced && parallax) window.addEventListener('pointermove', onPointer, { passive: true });

    // Cursor position in canvas space for the magnet; eased so it trails softly.
    let hoverX = -9999;
    let hoverY = -9999;
    let hoverTX = -9999;
    let hoverTY = -9999;
    let hoverAmt = 0;
    let hoverOn = false;
    const onHover = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      hoverTX = e.clientX - rect.left;
      hoverTY = e.clientY - rect.top;
      hoverOn = hoverTX >= 0 && hoverTY >= 0 && hoverTX <= rect.width && hoverTY <= rect.height;
      if (hoverX < -9000) {
        hoverX = hoverTX;
        hoverY = hoverTY;
      }
    };
    const onLeave = () => (hoverOn = false);
    if (!reduced && magnet) {
      window.addEventListener('pointermove', onHover, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(wrap);

    const ro = new ResizeObserver(() => {
      if (!data) return;
      layout();
      draw(performance.now() / 1000);
    });
    ro.observe(wrap);

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!visible || !data) return;
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      canvas.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`;
      hoverX += (hoverTX - hoverX) * 0.2;
      hoverY += (hoverTY - hoverY) * 0.2;
      hoverAmt += ((hoverOn ? 1 : 0) - hoverAmt) * 0.08;
      draw((now - start) / 1000);
    };

    fetch('/data/map-dots.json')
      .then((r) => r.json())
      .then((json: MapData) => {
        if (disposed) return;
        data = json;
        layout();
        canvas.style.opacity = '1';
        if (reduced) draw(0);
        else frame = requestAnimationFrame(tick);
      })
      .catch(() => {});

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointermove', onHover);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [cities, fit, dotColor, parallax, magnet]);

  return (
    <div
      ref={wrapRef}
      className={`overflow-hidden ${className}`}
      role="img"
      aria-label={`Dotted world map showing Digital Den's network exchanging data between Montenegro and ${cities.map((c) => c.name).join(', ')}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] opacity-0 transition-opacity duration-[1600ms]"
      />
    </div>
  );
}
