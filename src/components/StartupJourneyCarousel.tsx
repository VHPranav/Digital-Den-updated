'use client';

import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const SpinalCordBackground = dynamic(() => import('./SpinalCordBackground'), { ssr: false });



/* ─── High-Performance Responsive Card Video Loop ─── */
function CardVideo({ src, isActive }: { src: string; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = true;
    (v as HTMLVideoElement & { defaultMuted: boolean }).defaultMuted = true;
    v.playsInline = true;

    if (!isActive) {
      v.pause();
      return;
    }

    v.play().catch(() => {});

    const onVisibility = () => {
      if (document.hidden) v.pause();
      else if (isActive) v.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
  );
}

/* ─── 4 Glass Orbit Cards (intro copy) ─── */
const journeyCards = [
  {
    step: '01',
    title: 'BUILD',
    body: 'Supporting founders from early potential to stronger, market-ready ventures.',
    videoUrl: '/videos/card-v1.mp4',
    accentColor: '#00F5D4',
  },
  {
    step: '02',
    title: 'CONNECT',
    body: 'Opening access to mentors, partners, companies and the wider innovation ecosystem.',
    videoUrl: '/videos/card-v2.mp4',
    accentColor: '#C084FC',
  },
  {
    step: '03',
    title: 'ACCESS CAPITAL',
    body: 'Preparing startups for investment opportunities and connecting them with relevant capital.',
    videoUrl: '/videos/card-v3.mp4',
    accentColor: '#38BDF8',
  },
  {
    step: '04',
    title: 'GO GLOBAL',
    body: 'Creating pathways to new markets through international programs, partnerships and soft-landing opportunities.',
    videoUrl: '/videos/card-v4.mp4',
    accentColor: '#BB9DEE',
  },
];

const TOTAL_CARDS = journeyCards.length;
const ANGLE_STEP = 90;  // 360° / 4 cards = 90° rotation per step along helix
const RADIUS = 520; // px — circular radius around spine (expanded for bigger reference cards)
const STEP_Y = 200; // px — vertical step height along spine
// Phones: a much tighter orbit, shorter steps and a deeper perspective so the front card stays fully on screen.
const layoutFor = (w: number) =>
  w < 768
    ? { radius: 170, stepY: 130, perspective: 1400 }
    : w < 1100
      ? { radius: 380, stepY: 170, perspective: 1100 }
      : { radius: RADIUS, stepY: STEP_Y, perspective: 1000 };

export default function StartupJourneyCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rawRef = useRef(0); // target float index
  const progressRef = useRef(0); // smoothed float index passed to WebGL
  const targetCurtainRef = useRef(0);
  const curtainSmoothRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let smooth = 0;
    let lastSnapped = -1;
    let rafId = 0;
    let layout = layoutFor(window.innerWidth);
    const applyLayout = () => {
      layout = layoutFor(window.innerWidth);
      const stage = carouselRef.current?.parentElement;
      if (stage) stage.style.perspective = `${layout.perspective}px`;
    };
    applyLayout();
    window.addEventListener('resize', applyLayout);

    /* ── Read scroll position ── */
    const computeScrollTargets = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const scrollable = rect.height - windowH;
      if (scrollable <= 0) return;

      const scrolled = Math.max(0, -rect.top);
      // Dedicated scroll distance for the slanted curtain reveal
      const revealDist = windowH * 1.0;
      const cardScrollable = Math.max(1, scrollable - revealDist);

      if (scrolled <= 0) {
        targetCurtainRef.current = 0;
        rawRef.current = 0;
      } else if (scrolled < revealDist) {
        targetCurtainRef.current = Math.min(1, scrolled / revealDist);
        rawRef.current = 0;
      } else {
        targetCurtainRef.current = 1;
        const cardScrolled = scrolled - revealDist;
        rawRef.current = Math.min(
          TOTAL_CARDS - 1,
          Math.max(0, (cardScrolled / cardScrollable) * (TOTAL_CARDS - 1))
        );
      }
    };

    // Coalesce bursts of scroll events (fast trackpad/wheel input can fire several
    // per animation frame) into one getBoundingClientRect() read per frame — the
    // per-frame tick() below already reads these refs at most once per frame anyway.
    let scrollTicking = false;
    const onScroll = () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        scrollTicking = false;
        computeScrollTargets();
      });
    };

    /* ── Animation ticker (60-120 fps butter-smooth DOM updates without React re-renders) ── */
    const tick = () => {
      // 1. Smoothly interpolate carousel card rotation
      smooth += (rawRef.current - smooth) * 0.12;
      progressRef.current = smooth;
      const snapped = Math.round(smooth);

      // 2. Smoothly interpolate slanted curtain reveal progress
      const targetCurtain = targetCurtainRef.current;
      curtainSmoothRef.current += (targetCurtain - curtainSmoothRef.current) * 0.15;
      const p = Math.max(0, Math.min(1, curtainSmoothRef.current));

      // 3. Update dynamic straight horizontal clip path on the sticky stage
      if (stageRef.current) {
        const style = stageRef.current.style;
        if (p >= 0.998) {
          style.clipPath = 'none';
          style.setProperty('-webkit-clip-path', 'none');
        } else if (p <= 0.002) {
          const val = 'inset(100% 0 0 0)';
          style.clipPath = val;
          style.setProperty('-webkit-clip-path', val);
        } else {
          const curtainY = ((1 - p) * 100).toFixed(3);
          const clipStr = `inset(${curtainY}% 0 0 0)`;
          style.clipPath = clipStr;
          style.setProperty('-webkit-clip-path', clipStr);
        }
      }

      /* Rotate the overall carousel container around Y-axis */
      if (carouselRef.current) {
        carouselRef.current.style.transform = `rotateY(${-smooth * ANGLE_STEP}deg)`;
      }

      /* Update per-card helical Y position, rotation, scale, opacity */
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const relPosition = i - smooth;
        const dist = Math.abs(relPosition);
        const yOffset = relPosition * layout.stepY;

        const scale = Math.max(0.5, 1 - dist * 0.22);
        let opa = Math.max(0.08, 1 - dist * 0.42);

        // While curtain is revealing, subtly fade in card 0
        if (i === 0 && p < 1) {
          opa *= Math.max(0.1, p);
        }

        // Optical glass slab drop shadow + clean bevel reflections (no outer glow around card)
        const baseShadow =
          'inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.3), inset 0 -1.5px 2px 0 rgba(0, 0, 0, 0.75), 0 25px 60px -12px rgba(0, 0, 0, 0.92)';
        const activeShadow = snapped === i && dist < 0.6
          ? 'inset 0 2px 3px 0 rgba(255, 255, 255, 0.6), inset 0 -2px 3px 0 rgba(0, 0, 0, 0.85), 0 35px 80px -10px rgba(0, 0, 0, 0.98)'
          : baseShadow;

        card.style.opacity = String(opa);
        card.style.boxShadow = activeShadow;
        card.style.transform =
          `translateX(-50%) translateY(calc(-50% + ${yOffset}px)) rotateY(${i * ANGLE_STEP}deg) translateZ(${layout.radius}px) scale(${scale})`;
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
      window.removeEventListener('resize', applyLayout);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-30 w-full h-[650vh] -mt-[100vh] overflow-visible bg-transparent pointer-events-none"
    >
      {/* ── Sticky full-screen 100vh stage (Masked with straight horizontal curtain reveal) ── */}
      <div
        ref={stageRef}
        className="sticky top-0 w-full h-screen flex flex-col overflow-hidden bg-den pointer-events-auto"
        style={{
          clipPath: 'inset(100% 0 0 0)',
          WebkitClipPath: 'inset(100% 0 0 0)',
          willChange: 'clip-path',
        }}
      >

        {/* ── WebGL Spine + vignette ── */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <SpinalCordBackground progressRef={progressRef} />
          {/* Subtle dark ambient flare matching theme */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background:
                'radial-gradient(circle at 18% 15%, rgba(187, 157, 238, 0.14) 0%, transparent 60%), radial-gradient(circle at 85% 85%, rgba(124, 58, 237, 0.12) 0%, transparent 50%)',
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

        {/* ── Seamless Slanted Black Dissolve Gradient Overlay (Top of Spine) ── */}
        {/* <div
          className="absolute top-0 inset-x-0 h-[50vh] sm:h-[80vh] pointer-events-none z-[5]"
          style={{
            background: `linear-gradient(${180 - Math.atan2(8.5, 100) * (180 / Math.PI)}deg, #0b0b0c 0%, #0b0b0c 7.5vw, rgba(11, 11, 12, 0.96) 15vw, rgba(11, 11, 12, 0.75) 25vw, rgba(11, 11, 12, 0.3) 38vw, transparent 100%)`,
          }}
          aria-hidden="true"
        /> */}

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
                  width: 'min(370px, calc(100vw - 72px))',
                  aspectRatio: '16 / 10',
                  transformStyle: 'preserve-3d',
                  transform: `translateX(-50%) translateY(calc(-50% + ${i * STEP_Y}px)) rotateY(${i * ANGLE_STEP}deg) translateZ(${RADIUS}px)`,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  willChange: 'transform, opacity, box-shadow',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, rgba(6, 10, 18, 0.08) 0%, rgba(10, 16, 26, 0.15) 100%)',
                  border: '1.2px solid rgba(255, 255, 255, 0.22)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  boxShadow:
                    'inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.3), inset 0 -1.5px 2px 0 rgba(0, 0, 0, 0.6), 0 20px 50px -10px rgba(0, 0, 0, 0.8)',
                }}
              >
                {/* ── 1. Sci-Fi Motion Video Overlay (Vivid Glass Refraction) ── */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1,
                    opacity: 0.45,
                    mixBlendMode: 'screen',
                    filter: 'contrast(1.2) brightness(1.1)',
                    pointerEvents: 'none',
                    overflow: 'hidden',
                  }}
                >
                  <CardVideo src={card.videoUrl} isActive={Math.abs(activeIndex - i) <= 1} />
                </div>

                {/* ── 2. Specular Diagonal Glass Reflection Sheen ── */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 2,
                    pointerEvents: 'none',
                    background:
                      'linear-gradient(125deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 30%, transparent 60%)',
                  }}
                />

                {/* ── 3. Luminous Refractive Bevel Highlight Line ── */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '6%',
                    right: '6%',
                    height: '1.5px',
                    zIndex: 3,
                    pointerEvents: 'none',
                    background: `linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.7) 25%, ${card.accentColor} 50%, rgba(255, 255, 255, 0.7) 75%, transparent 100%)`,
                  }}
                />

                {/* ── Title + Description Centered Layer ── */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '16px 26px',
                    textAlign: 'center',
                    zIndex: 10,
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 'clamp(17px, 3.2vw, 23px)',
                      fontWeight: 800,
                      color: '#ffffff',
                      lineHeight: 1.22,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      textShadow:
                        '0 2px 18px rgba(0, 0, 0, 0.95), 0 0 24px rgba(255, 255, 255, 0.4)',
                      fontFamily: 'var(--font-plus-jakarta), sans-serif',
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      maxWidth: '290px',
                      fontSize: 'clamp(12px, 2.4vw, 14px)',
                      fontWeight: 500,
                      color: 'rgba(255, 255, 255, 0.88)',
                      lineHeight: 1.5,
                      textShadow: '0 2px 14px rgba(0, 0, 0, 0.95)',
                      fontFamily: 'var(--font-plus-jakarta), sans-serif',
                    }}
                  >
                    {card.body}
                  </p>
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

      {/* ── Seamless Slanted Black Dissolve Gradient Overlay (Bottom of Section — Appears only at end of scroll) ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-[40vh] sm:h-[65vh] pointer-events-none z-30"
        style={{
          background: `linear-gradient(${(Math.atan2(6, 100) * (180 / Math.PI)).toFixed(2)}deg, #0b0b0c 0%, transparent 100%)`,
        }}
        aria-hidden="true"
      />
    </section>
  );
}
