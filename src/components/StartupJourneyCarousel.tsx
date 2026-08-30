'use client';

import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const SpinalCordBackground = dynamic(() => import('./SpinalCordBackground'), { ssr: false });

/* ─── Procedural 60 FPS Ambient Motion Canvas Background (Zero 403 / Network Errors) ─── */
function AutoPlayVideo({ src, step }: { src?: string; step: string; poster?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef  = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Try video first; if video fails or is 403, fallback seamlessly to procedural ambient loop
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src) return;

    v.muted = true;
    (v as HTMLVideoElement & { defaultMuted: boolean }).defaultMuted = true;
    v.playsInline = true;

    const handlePlay = () => {
      v.play().then(() => setVideoLoaded(true)).catch(() => setVideoLoaded(false));
    };

    handlePlay();
    v.addEventListener('canplay', handlePlay);
    return () => {
      v.removeEventListener('canplay', handlePlay);
    };
  }, [src]);

  // Procedural 60FPS Ambient Motion Loop (Matrix lines, Cyber grid, 3D particles, Telemetry)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let time = 0;
    const stepNum = parseInt(step, 10) || 1;

    const resize = () => {
      canvas.width  = canvas.clientWidth  || 440;
      canvas.height = canvas.clientHeight || 275;
    };
    resize();

    // Particle nodes for ambient simulation
    const nodeCount = 35;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * 440,
      y: Math.random() * 275,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      r: 1.5 + Math.random() * 2.5,
    }));

    const render = () => {
      time += 0.02;
      const w = canvas.width;
      const h = canvas.height;

      // Dark glass background with subtle gradient pulse
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, '#06030e');
      bgGrad.addColorStop(0.5, '#0a0518');
      bgGrad.addColorStop(1, '#030107');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Render custom ambient motion based on step
      if (stepNum === 1 || stepNum === 6) {
        // Step 01 & 06: Cybernetic Sine Wave Lines
        ctx.lineWidth = 1.5;
        for (let j = 0; j < 4; j++) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 + j * 0.05})`;
          ctx.beginPath();
          for (let x = 0; x <= w; x += 15) {
            const y = h * 0.5 + Math.sin(x * 0.015 + time * 1.5 + j) * (20 + j * 10);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else if (stepNum === 2) {
        // Step 02: Code Stream Digital Matrix Grid
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.font = '10px monospace';
        for (let col = 0; col < 12; col++) {
          const x = 30 + col * 35;
          const y = ((time * 40 + col * 55) % (h + 40)) - 20;
          ctx.fillText(`010${col}`, x, y);
        }
      } else if (stepNum === 3) {
        // Step 03: Global Network Constellation Links
        nodes.forEach((n) => {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;

          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        for (let i = 0; i < nodeCount; i++) {
          for (let j = i + 1; j < nodeCount; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 85) {
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }
      } else if (stepNum === 4 || stepNum === 5) {
        // Step 04 & 05: Telemetry Dashboard Pulsing Ring & Bars
        const centerX = w * 0.5;
        const centerY = h * 0.5;
        const radius  = 45 + Math.sin(time * 2) * 8;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        for (let b = 0; b < 8; b++) {
          const barH = 15 + Math.sin(time * 3 + b) * 12;
          ctx.fillRect(w - 70 + b * 7, h - 30 - barH, 4, barH);
        }
      }

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [step]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 60 FPS Procedural Ambient Canvas Loop */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          opacity: videoLoaded ? 0.3 : 1.0,
          transition: 'opacity 0.5s ease',
        }}
      />
      {/* Direct Video Loop if accessible */}
      {src && (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: videoLoaded ? 0.85 : 0,
            transition: 'opacity 0.5s ease',
            zIndex: 2,
          }}
        />
      )}
    </div>
  );
}

/* ─── 6 Journey Orbit Cards ─── */
const journeyCards = [
  {
    step: '01',
    title: 'PROMETHEUS',
    subtitle: 'Innovation. Inspiration. Investment. The gateway for startups to global markets.',
    videoUrl: '/videos/cyberpunk-nightcity.mp4',
    highlights: ['Hero brand card set at the top of the orbit.'],
  },
  {
    step: '02',
    title: 'Rub the Hub',
    subtitle:
      'Accelerating and soft-landing 50 Balkan startups into international markets within 5 years.',
    videoUrl: '/videos/cyberpunk-nightcity.mp4',
    tags: ['Startup Readiness', 'Balkans', 'MTSB USA', 'MTSB Europe'],
  },
  {
    step: '03',
    title: 'Global Connections',
    subtitle:
      'Direct bridges linking Western Balkan founders with key hubs across the US and Europe.',
    videoUrl: '/videos/cyberpunk-nightcity.mp4',
    tags: ['Texas', 'New York', 'Colorado', 'Netherlands', 'Luxembourg'],
  },
  {
    step: '04',
    title: 'Portfolio Highlights',
    subtitle:
      'Real science meeting real impact—featuring WIPO Award winner Dr. Knight and market-ready tech.',
    videoUrl: '/videos/cyberpunk-nightcity.mp4',
    tags: ['Dr. Knight', 'WIPO Award', 'Success Stories'],
  },
  {
    step: '05',
    title: 'Strategic Alliances',
    subtitle:
      'Partnering with German development initiatives, regional incubators, and top EU venture funds.',
    videoUrl: '/videos/cyberpunk-nightcity.mp4',
    tags: ['Luxembourg Venture Days', 'BMZ Desk', 'Regional Growth'],
  },
  {
    step: '06',
    title: 'Ready to Scale?',
    subtitle:
      'Connect with our founders, investors, and mentors in Podgorica and beyond.',
    videoUrl: '/videos/cyberpunk-nightcity.mp4',
    ctaLink: 'https://digitalden.me/',
    ctaText: 'JOIN US / Contact Digital Den',
  },
];

const TOTAL_CARDS = journeyCards.length;
const ANGLE_STEP  = 60;  // 360° / 6 cards = 60° rotation per step along helix
const RADIUS      = 420; // px — circular radius around spine
const STEP_Y      = 160; // px — vertical step height along spine

export default function StartupJourneyCarousel() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const rawRef      = useRef(0); // target float index
  const progressRef = useRef(0); // smoothed float index passed to WebGL
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let smooth = 0;
    let lastSnapped = -1;
    let rafId  = 0;

    /* ── Read scroll position ── */
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      rawRef.current = Math.max(0, Math.min(TOTAL_CARDS - 1,
        (-rect.top / scrollable) * (TOTAL_CARDS - 1),
      ));
    };

    /* ── Animation ticker (60-120 fps butter-smooth DOM updates without React re-renders) ── */
    const tick = () => {
      smooth += (rawRef.current - smooth) * 0.12;
      progressRef.current = smooth;
      const snapped = Math.round(smooth);

      /* Rotate the overall carousel container around Y-axis */
      if (carouselRef.current) {
        carouselRef.current.style.transform = `rotateY(${-smooth * ANGLE_STEP}deg)`;
      }

      /* Update per-card helical Y position, rotation, scale, opacity */
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const relPosition = i - smooth;
        const dist = Math.abs(relPosition);
        const yOffset = relPosition * STEP_Y;

        const scale = Math.max(0.55, 1 - dist * 0.2);
        const opa   = Math.max(0.15, 1 - dist * 0.35);

        // Realistic optical glass shadow + bevel reflections
        const baseShadow =
          'inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.35), inset 0 -1.5px 1px 0 rgba(0, 0, 0, 0.5), 0 25px 50px -12px rgba(0, 0, 0, 0.85)';
        const activeShadow = snapped === i && dist < 0.6
          ? 'inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.55), inset 0 -1.5px 1px 0 rgba(0, 0, 0, 0.6), 0 30px 60px -12px rgba(0, 0, 0, 0.95)'
          : baseShadow;

        card.style.opacity   = String(opa);
        card.style.boxShadow = activeShadow;
        card.style.transform =
          `translateX(-50%) translateY(calc(-50% + ${yOffset}px)) rotateY(${i * ANGLE_STEP}deg) translateZ(${RADIUS}px) scale(${scale})`;
      });

      // Only trigger React re-render when the active step index actually changes
      if (snapped !== lastSnapped) {
        lastSnapped = snapped;
        setActiveIndex(snapped);
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-30 w-full h-[800vh] -mt-[8.5vw] overflow-visible bg-black"
      style={{
        clipPath: 'polygon(0 8.5vw, 100% 0, 100% 100%, 0 100%)',
        WebkitClipPath: 'polygon(0 8.5vw, 100% 0, 100% 100%, 0 100%)',
      }}
    >
      {/* ── Sticky full-screen 100vh stage (Clean without clipping inside viewport) ── */}
      <div className="sticky top-0 w-full h-screen flex flex-col overflow-hidden bg-black">

        {/* ── WebGL Spine + vignette ── */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <SpinalCordBackground progressRef={progressRef} />
          {/* Subtle dark ambient flare matching theme */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background:
                'radial-gradient(circle at 18% 15%, rgba(0, 245, 212, 0.12) 0%, transparent 60%), radial-gradient(circle at 85% 85%, rgba(192, 132, 252, 0.10) 0%, transparent 50%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 90% 75% at 50% 55%, transparent 18%, rgba(0,0,0,0.65) 100%)',
            }}
          />
        </div>

        {/* ── 3-D Helical Carousel Stage ── */}
        <div
          className="relative z-10 flex-1 flex items-center justify-center"
          style={{ perspective: '1000px', perspectiveOrigin: '50% 50%' }}
        >
          <div
            ref={carouselRef}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 0,
              height: 0,
              transformStyle: 'preserve-3d',
              transform: 'rotateY(0deg)',
            }}
          >
            {journeyCards.map((card, i) => (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '370px',
                  height: '235px',
                  transformStyle: 'preserve-3d',
                  transform: `translateX(-50%) translateY(calc(-50% + ${i * STEP_Y}px)) rotateY(${i * ANGLE_STEP}deg) translateZ(${RADIUS}px)`,
                  borderRadius: '32px',
                  overflow: 'hidden',
                  willChange: 'transform, opacity, box-shadow',
                  cursor: 'pointer',
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 40%, rgba(12, 12, 18, 0.45) 100%)',
                  border: '1px solid rgba(0, 245, 212, 0.22)',
                  backdropFilter: 'blur(30px) saturate(190%)',
                  WebkitBackdropFilter: 'blur(30px) saturate(190%)',
                  boxShadow:
                    'inset 0 1.5px 1px 0 rgba(192, 132, 252, 0.4), inset 0 -1.5px 1px 0 rgba(0, 0, 0, 0.6), 0 25px 50px -12px rgba(0, 0, 0, 0.85)',
                }}
              >
                {/* ── Background video layer ── */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 0.6 }}>
                  <AutoPlayVideo src={card.videoUrl} step={card.step} />
                </div>

                {/* ── Glass tint gradient ── */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 2,
                    background:
                      'radial-gradient(circle at 40% 30%, rgba(0, 245, 212, 0.05) 0%, rgba(5, 5, 10, 0.6) 100%)',
                  }}
                />

                {/* ── Specular diagonal glass sheen reflection ── */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 3,
                    pointerEvents: 'none',
                    background:
                      'linear-gradient(120deg, rgba(192, 132, 252, 0.15) 0%, rgba(0, 245, 212, 0.04) 30%, transparent 60%)',
                  }}
                />

                {/* ── Top edge refractive highlight line ── */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '12%',
                    right: '12%',
                    height: '1px',
                    zIndex: 4,
                    pointerEvents: 'none',
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(0, 245, 212, 0.8) 50%, transparent 100%)',
                  }}
                />

                {/* ── Centered Main Content ── */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '18px 22px',
                    zIndex: 10,
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                  }}
                >
                  {/* Step & Title */}
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '21px',
                      fontWeight: 800,
                      color: '#ffffff',
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                      textShadow: '0 2px 14px rgba(0, 0, 0, 0.95)',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    <span style={{ color: '#00F5D4', marginRight: '6px' }}>{card.step}.</span>
                    {card.title}
                  </h3>

                  {/* Subtitle */}
                  <p
                    style={{
                      margin: '6px 0 8px',
                      color: 'rgba(233, 213, 255, 0.9)',
                      fontSize: '11.5px',
                      fontWeight: 500,
                      lineHeight: 1.35,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      maxWidth: '310px',
                      textShadow: '0 1px 8px rgba(0, 0, 0, 0.9)',
                    }}
                  >
                    {card.subtitle}
                  </p>

                  {/* Highlights / Tags / CTA */}
                  {card.highlights && (
                    <p
                      style={{
                        margin: '2px 0 0',
                        fontSize: '10px',
                        color: 'rgba(0, 245, 212, 0.85)',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontStyle: 'italic',
                      }}
                    >
                      {card.highlights[0]}
                    </p>
                  )}

                  {card.tags && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
                      {card.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '9.5px',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: 'rgba(192, 132, 252, 0.12)',
                            border: '1px solid rgba(0, 245, 212, 0.3)',
                            color: '#E9D5FF',
                            fontWeight: 600,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            boxShadow: 'inset 0 0 6px rgba(0, 245, 212, 0.15)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {card.ctaLink && (
                    <a
                      href={card.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginTop: '8px',
                        padding: '6px 18px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, rgba(0, 245, 212, 0.25) 0%, rgba(192, 132, 252, 0.3) 100%)',
                        border: '1px solid rgba(0, 245, 212, 0.5)',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 700,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        textDecoration: 'none',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 18px rgba(0, 245, 212, 0.25)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      {card.ctaText} →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Step indicator dots ── */}
        <div
          className="relative z-20 flex justify-center items-center gap-2.5 pb-5 shrink-0"
        >
          {journeyCards.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === activeIndex ? '24px' : '5px',
                height: '5px',
                borderRadius: '3px',
                background: i === activeIndex ? '#00F5D4' : 'rgba(192, 132, 252, 0.3)',
                transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)',
                boxShadow:
                  i === activeIndex
                    ? '0 0 10px #00F5D4, 0 0 20px rgba(192, 132, 252, 0.6)'
                    : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
