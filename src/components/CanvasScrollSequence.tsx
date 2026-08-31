'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ArrowRight, Calendar, MapPin, Building2, Sparkles } from 'lucide-react';

interface CanvasScrollSequenceProps {
  frameCount?: number;
  containerHeight?: string; // e.g. "h-[600vh]"
  onProgressUpdate?: (progress: number, frameIndex: number) => void;
  onOpenAction?: () => void;
  children?: (progress: number, frameIndex: number) => React.ReactNode;
}

export default function CanvasScrollSequence({
  frameCount = 600,
  containerHeight = 'h-[500vh]',
  onProgressUpdate,
  onOpenAction,
  children,
}: CanvasScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const idleAnimIdRef = useRef<number | null>(null);

  const [imagesLoadedCount, setImagesLoadedCount] = useState(0);
  const [isInitialReady, setIsInitialReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  // WebGL Active Theory Liquid Fluid Physics State Refs
  const webglStateRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    material: THREE.ShaderMaterial;
    texture: THREE.Texture;
  } | null>(null);

  // Helper to get frame path
  const getFramePath = useCallback((index: number) => {
    const frameNum = String(index + 1).padStart(3, '0');
    return `/frames/ezgif-frame-${frameNum}.jpg`;
  }, []);

  // Preload Images with High-Speed Concurrent Pool & Priority Fetching
  const loadSingleImage = useCallback((index: number, onDone?: () => void) => {
    if (index < 0 || index >= frameCount) return;
    if (imagesRef.current[index]) {
      if (onDone) onDone();
      return;
    }
    const img = new Image();
    img.decoding = 'async';
    img.src = getFramePath(index);
    img.onload = () => {
      imagesRef.current[index] = img;
      setImagesLoadedCount((prev) => prev + 1);
      if (index < 5) setIsInitialReady(true);
      if (onDone) onDone();
    };
    img.onerror = () => {
      setImagesLoadedCount((prev) => prev + 1);
      if (onDone) onDone();
    };
  }, [frameCount, getFramePath]);

  useEffect(() => {
    let isMounted = true;
    imagesRef.current = new Array(frameCount);

    // 1. Immediately load first 12 urgent frames
    for (let i = 0; i < Math.min(12, frameCount); i++) {
      loadSingleImage(i);
    }

    // 2. High-speed concurrent worker queue (16 concurrent connections) to load all 600 frames rapidly
    const CONCURRENCY = 16;
    let nextIdx = 12;

    const worker = () => {
      if (!isMounted || nextIdx >= frameCount) return;
      const current = nextIdx++;
      loadSingleImage(current, () => {
        if (isMounted) worker();
      });
    };

    for (let c = 0; c < CONCURRENCY; c++) {
      worker();
    }

    return () => {
      isMounted = false;
    };
  }, [frameCount, loadSingleImage]);

  // WebGL Active Theory Navier-Stokes Fluid Distortion Physics Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL not supported for liquid video distortion', e);
      return;
    }

    const isMobileGPU = typeof window !== 'undefined' && (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobileGPU ? 1.25 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 1. Fluid Velocity FBO Targets (Ping-Pong grid optimized for device)
    const fboSize = isMobileGPU ? 128 : 256;
    const quadGeo = new THREE.PlaneGeometry(2, 2);
    const orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Direct High-Definition Video Frame Display Shader (No cursor distortion)
    const texture = new THREE.Texture();
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    const displayMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D uTexture;
        uniform vec2 uResolution;
        uniform vec2 uImageResolution;
        varying vec2 vUv;

        vec2 getCoverUv(vec2 uv, vec2 screenRes, vec2 texRes) {
          vec2 s = screenRes;
          vec2 i = texRes;
          float rs = s.x / s.y;
          float ri = i.x / i.y;
          vec2 newUv = rs < ri ? vec2(uv.x * s.y / s.x * ri, uv.y) : vec2(uv.x, uv.y * s.x / s.y / ri);
          newUv += (rs < ri ? vec2((1.0 - s.y / s.x * ri) * 0.5, 0.0) : vec2(0.0, (1.0 - s.x / s.y / ri) * 0.5));
          return newUv;
        }

        void main() {
          vec2 uv = getCoverUv(vUv, uResolution, uImageResolution);
          gl_FragColor = texture2D(uTexture, uv);
        }
      `,
      uniforms: {
        uTexture: { value: texture },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uImageResolution: { value: new THREE.Vector2(1280, 720) },
      },
      depthWrite: false,
      depthTest: false,
    });

    const displayScene = new THREE.Scene();
    displayScene.add(new THREE.Mesh(quadGeo, displayMat));

    webglStateRef.current = { renderer, scene: displayScene, camera: orthoCam, material: displayMat, texture };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      displayMat.uniforms.uResolution.value.set(width, height);
      renderer.render(displayScene, orthoCam);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      quadGeo.dispose();
      displayMat.dispose();
      texture.dispose();
      renderer.dispose();
      webglStateRef.current = null;
    };
  }, []);

  // Update WebGL frame texture (with nearest-frame fallback & on-demand trigger)
  const renderFrame = useCallback((frameIndex: number) => {
    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Trigger on-demand priority load if missing
      loadSingleImage(frameIndex);

      // Look for the closest ready frame so the canvas never stalls or blinks
      for (let offset = 1; offset < 40; offset++) {
        const prev = imagesRef.current[frameIndex - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesRef.current[frameIndex + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) {
      img = imagesRef.current[0];
    }
    if (webglStateRef.current) {
      const { renderer, scene, camera, texture, material } = webglStateRef.current;
      texture.image = img;
      texture.needsUpdate = true;
      material.uniforms.uImageResolution.value.set(img.naturalWidth, img.naturalHeight);
      renderer.render(scene, camera);
    }
  }, [loadSingleImage]);

  // Update canvas on frame change
  const requestDrawFrame = useCallback((frameIndex: number) => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    animationFrameIdRef.current = requestAnimationFrame(() => {
      renderFrame(frameIndex);
    });
  }, [renderFrame]);

  // Handle Window Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollableHeight = rect.height - window.innerHeight;

      if (totalScrollableHeight <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollableHeight));

      // Map all 600 frames smoothly across 0% to 80% scroll progress so entire video plays completely
      const videoProgress = Math.max(0, Math.min(1, progress / 0.80));
      const targetFrame = Math.min(frameCount - 1, Math.floor(videoProgress * (frameCount - 1)));

      setScrollProgress(progress);
      setCurrentFrameIndex(targetFrame);

      if (targetFrame !== currentFrameRef.current) {
        currentFrameRef.current = targetFrame;
        requestDrawFrame(targetFrame);
      }

      if (onProgressUpdate) {
        onProgressUpdate(progress, targetFrame);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [frameCount, requestDrawFrame, onProgressUpdate]);

  // Initial draw when first image ready
  useEffect(() => {
    if (isInitialReady) {
      renderFrame(0);
    }
  }, [isInitialReady, renderFrame]);

  // Dynamic scale-down transition: Video stays 100% full-bleed from 0 to 0.78.
  // Scales down smoothly into rounded card from 0.78 to 0.86.
  const scaleProgress = Math.max(0, Math.min(1, (scrollProgress - 0.78) / 0.08));
  const canvasScale = 1 - scaleProgress * 0.12;
  const canvasRadius = scaleProgress * 36;
  const overlayOpacity = scaleProgress * 0.75;
  const paddingClass = scaleProgress > 0.2 ? 'p-4 sm:p-8' : 'p-0';

  // Card content fades in between 0.83 and 0.88, staying fully pinned and readable until 0.99
  const cardTextOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.83) / 0.06));

  // Position mode: fixed while in scroll sequence, absolute bottom-0 only when reaching 0.99
  const isPastSequence = scrollProgress >= 0.99;
  const positionClass = isPastSequence ? 'absolute bottom-0 left-0 w-full h-screen' : 'fixed top-0 left-0 w-full h-screen';

  return (
    <div ref={containerRef} className={`relative w-full ${containerHeight}`}>
      {/* Dynamic Video Canvas Wrapper (100% full-bleed, scales down into rounded card, scrolls up naturally when section ends) */}
      <div
        className={`${positionClass} overflow-hidden z-0 bg-black flex items-center justify-center transition-all duration-300 ease-out ${paddingClass}`}
      >
        <div
          className="w-full h-full relative overflow-hidden transition-all duration-300 ease-out"
          style={{
            transform: `scale(${canvasScale})`,
            borderRadius: `${canvasRadius}px`,
            border: scaleProgress > 0.6 ? '1.5px solid rgba(255, 255, 255, 0.2)' : 'none',
            boxShadow: scaleProgress > 0.6 ? '0 30px 100px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.2)' : 'none',
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full block object-cover"
          />

          {/* Pure Black Slanted Gradient (Directly Over the Video Frame, Below the Text Content, 150vh Span) */}
          <div
            className="absolute top-0 inset-x-0 h-[150vh] pointer-events-none z-[2]"
            style={{
              background: 'linear-gradient(176.5deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.92) 20%,  rgba(0, 0, 0, 0) 100%)',
            }}
            aria-hidden="true"
          />

          {/* Dark shade overlay over video frame when scaled into card mode */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/85 pointer-events-none transition-opacity duration-300"
            style={{ opacity: overlayOpacity }}
          />

          {/* Pinned Card Content: Fades in in-place ONLY after FourPillars cards fully exit and video scaling completes */}
          <div
            className="absolute inset-0 z-20 flex flex-col justify-between items-center text-center p-6 sm:p-10 lg:p-12 transition-opacity duration-500 max-w-5xl mx-auto"
            style={{
              opacity: cardTextOpacity,
              pointerEvents: scaleProgress > 0.8 ? 'auto' : 'none',
            }}
          >
            {/* Top & Center Content */}
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center space-y-4 my-auto pt-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-xs uppercase tracking-widest text-purple-300">
                  Upcoming Opportunity
                </span>
              </div>

              <h2
                className="font-['Inter',sans-serif] font-medium text-2xl sm:text-4xl lg:text-[46px] leading-[115%] tracking-tight text-center drop-shadow-2xl max-w-3xl"
                style={{
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #F3E8FF 45%, #D8B4FE 60%, #C084FC 75%, #A855F7 88%, #7E22CE 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                FinTech Innovation Loop Montenegro
              </h2>

              <p className="font-['Plus_Jakarta_Sans',sans-serif] font-normal text-xs sm:text-base leading-[24px] text-white/85 max-w-2xl text-center mx-auto drop-shadow-md">
                A sector-focused initiative connecting startups, financial institutions, investors and ecosystem partners around real fintech challenges, pilot opportunities and strategic partnerships.
              </p>

              <div className="pt-2">
                <button
                  onClick={onOpenAction}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs sm:text-sm tracking-wider uppercase shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 group cursor-pointer border border-purple-400/40"
                >
                  <span>Explore FinTech Opportunities</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Bottom Metadata Specs Row (4 Items matching reference image) */}
            <div className="w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/15 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 flex-shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Date</p>
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-xs sm:text-sm text-white mt-0.5">23 June 2026</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Location</p>
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-xs sm:text-sm text-white mt-0.5">Podgorica, Montenegro</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 flex-shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Ecosystem</p>
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-xs sm:text-sm text-white mt-0.5">Banks & Institutions</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Target Access</p>
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-xs sm:text-sm text-white mt-0.5">Seed & Scaleup Pilots</p>
                </div>
              </div>
            </div>
          </div>

          {/* Loading Overlay */}
          {!isInitialReady && (
            <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-white z-50 transition-opacity duration-500 pointer-events-auto">
              <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-semibold tracking-widest uppercase text-slate-300">
                Loading High Definition Experience...
              </p>
              <div className="w-48 bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-teal-400 h-full transition-all duration-200"
                  style={{ width: `${Math.min(100, (imagesLoadedCount / 60) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Render webpage content sections directly over the canvas */}
      <div className="relative z-10 w-full">
        {children && children(scrollProgress, currentFrameIndex)}
      </div>
    </div>
  );
}
