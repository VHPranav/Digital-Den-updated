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

  // Preload Images (Optimized for instant mobile first-paint)
  useEffect(() => {
    let isMounted = true;
    const images: HTMLImageElement[] = new Array(frameCount);
    imagesRef.current = images;

    let loadedCounter = 0;
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));
    const urgentCount = isMobile ? 3 : 10; // Instantly show page after 3 frames on mobile!
    let urgentLoaded = 0;

    const loadSingleImage = (index: number, onDone?: () => void) => {
      if (images[index]) {
        if (onDone) onDone();
        return;
      }
      const img = new Image();
      img.decoding = 'async';
      img.src = getFramePath(index);
      img.onload = () => {
        if (!isMounted) return;
        images[index] = img;
        loadedCounter++;
        setImagesLoadedCount(loadedCounter);

        if (index < urgentCount) {
          urgentLoaded++;
          if (urgentLoaded >= urgentCount) {
            setIsInitialReady(true);
          }
        }
        if (onDone) onDone();
      };
      img.onerror = () => {
        if (!isMounted) return;
        loadedCounter++;
        setImagesLoadedCount(loadedCounter);
        if (onDone) onDone();
      };
    };

    // 1. Immediately load initial urgent frames for fast initial paint
    for (let i = 0; i < urgentCount; i++) {
      loadSingleImage(i);
    }

    // 2. Stagger remaining frame downloads in small batches to preserve mobile network bandwidth & CPU
    let batchIndex = urgentCount;
    const batchSize = isMobile ? 5 : 15;

    const loadNextBatch = () => {
      if (!isMounted || batchIndex >= frameCount) return;
      const end = Math.min(batchIndex + batchSize, frameCount);
      let countInBatch = 0;
      const totalInBatch = end - batchIndex;

      for (let i = batchIndex; i < end; i++) {
        loadSingleImage(i, () => {
          countInBatch++;
          if (countInBatch >= totalInBatch) {
            batchIndex = end;
            if ('requestIdleCallback' in window) {
              window.requestIdleCallback(loadNextBatch, { timeout: 200 });
            } else {
              setTimeout(loadNextBatch, 50);
            }
          }
        });
      }
    };

    const timer = setTimeout(() => {
      loadNextBatch();
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [frameCount, getFramePath]);

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
    const fboOptions = {
      type: THREE.HalfFloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    };

    let fboVelRead = new THREE.WebGLRenderTarget(fboSize, fboSize, fboOptions);
    let fboVelWrite = new THREE.WebGLRenderTarget(fboSize, fboSize, fboOptions);

    // Clear render targets initially to avoid random GPU memory noise
    renderer.setRenderTarget(fboVelRead);
    renderer.clear();
    renderer.setRenderTarget(fboVelWrite);
    renderer.clear();
    renderer.setRenderTarget(null);

    const quadGeo = new THREE.PlaneGeometry(2, 2);
    const orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // 2. Splat Shader (Injects Mouse Motion Velocity Force into Fluid Grid)
    const splatMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D uTarget;
        uniform vec2 uPoint;
        uniform vec2 uForce;
        uniform float uRadius;
        uniform float uAspect;
        varying vec2 vUv;

        void main() {
          vec2 p = vUv - uPoint;
          p.x *= uAspect;
          float splat = exp(-dot(p, p) / uRadius);
          vec2 base = texture2D(uTarget, vUv).xy;
          gl_FragColor = vec4(base + uForce * splat, 0.0, 1.0);
        }
      `,
      uniforms: {
        uTarget: { value: null },
        uPoint: { value: new THREE.Vector2(0.5, 0.5) },
        uForce: { value: new THREE.Vector2(0, 0) },
        uRadius: { value: 0.0035 },
        uAspect: { value: window.innerWidth / window.innerHeight },
      },
      depthWrite: false,
      depthTest: false,
    });
    const splatScene = new THREE.Scene();
    splatScene.add(new THREE.Mesh(quadGeo, splatMat));

    // 3. Advection & Spatial Smoothing Shader (Fluid Flow, Velocity Smoothing, and Quick Decay)
    const advectionMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D uVelocity;
        uniform float uDissipation;
        varying vec2 vUv;

        void main() {
          vec2 px = vec2(0.0039, 0.0039); // 1.0 / 256.0
          vec2 velC = texture2D(uVelocity, vUv).xy;
          vec2 velL = texture2D(uVelocity, vUv - vec2(px.x, 0.0)).xy;
          vec2 velR = texture2D(uVelocity, vUv + vec2(px.x, 0.0)).xy;
          vec2 velB = texture2D(uVelocity, vUv - vec2(0.0, px.y)).xy;
          vec2 velT = texture2D(uVelocity, vUv + vec2(0.0, px.y)).xy;

          // 5-point spatial velocity smoothing filter to eliminate pixelated stair-step noise
          vec2 smoothedVel = (velC * 4.0 + velL + velR + velB + velT) / 8.0;

          vec2 coord = vUv - smoothedVel * 0.006;
          vec2 advectedVel = texture2D(uVelocity, coord).xy;
          
          // Vorticity curl calculation
          float L = velL.y;
          float R = velR.y;
          float B = velB.x;
          float T = velT.x;
          float curl = (R - L) - (T - B);
          vec2 vorticity = vec2(curl, -curl) * 0.12;

          vec2 nextVel = (advectedVel + vorticity) * uDissipation;
          if (length(nextVel) < 0.001) {
            nextVel = vec2(0.0);
          }

          gl_FragColor = vec4(nextVel, 0.0, 1.0);
        }
      `,
      uniforms: {
        uVelocity: { value: null },
        uDissipation: { value: 0.85 },
      },
      depthWrite: false,
      depthTest: false,
    });
    const advectionScene = new THREE.Scene();
    advectionScene.add(new THREE.Mesh(quadGeo, advectionMat));

    // 4. Video Frame Display Shader (Distorts Video with Smooth Liquid Physics)
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
        uniform sampler2D uVelocity;
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
          vec2 baseUv = getCoverUv(vUv, uResolution, uImageResolution);
          
          // Sample HD liquid fluid velocity vector
          vec2 vel = texture2D(uVelocity, vUv).xy;
          float velLen = length(vel);
          
          // Smoothstep fade factor so low/decayed velocities drop to EXACT 0 displacement.
          // This guarantees 100% exact return to original crisp video pixels!
          float fade = smoothstep(0.003, 0.025, velLen);
          vec2 displacement = vel * 0.075 * fade;
          vec2 distortedUv = clamp(baseUv - displacement, 0.0, 1.0);
          
          // Active Theory Liquid Glass Refraction & Chromatic Aberration
          float r = texture2D(uTexture, clamp(distortedUv + displacement * 0.4, 0.0, 1.0)).r;
          float g = texture2D(uTexture, distortedUv).g;
          float b = texture2D(uTexture, clamp(distortedUv - displacement * 0.4, 0.0, 1.0)).b;

          gl_FragColor = vec4(r, g, b, 1.0);
        }
      `,
      uniforms: {
        uTexture: { value: texture },
        uVelocity: { value: null },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uImageResolution: { value: new THREE.Vector2(1920, 1080) },
      },
      depthWrite: false,
      depthTest: false,
    });
    const displayScene = new THREE.Scene();
    displayScene.add(new THREE.Mesh(quadGeo, displayMat));

    webglStateRef.current = { renderer, scene: displayScene, camera: orthoCam, material: displayMat, texture };

    // Mouse Tracking & Splat Forces
    let lastMouseX = 0.5;
    let lastMouseY = 0.5;

    const addSplat = (x: number, y: number, forceX: number, forceY: number) => {
      splatMat.uniforms.uTarget.value = fboVelRead.texture;
      splatMat.uniforms.uPoint.value.set(x, y);
      splatMat.uniforms.uForce.value.set(forceX, forceY);
      splatMat.uniforms.uAspect.value = window.innerWidth / window.innerHeight;

      renderer.setRenderTarget(fboVelWrite);
      renderer.render(splatScene, orthoCam);

      // Swap FBOs
      const tmp = fboVelRead;
      fboVelRead = fboVelWrite;
      fboVelWrite = tmp;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1.0 - e.clientY / window.innerHeight;
      const dx = x - lastMouseX;
      const dy = y - lastMouseY;

      if (Math.abs(dx) > 0.0001 || Math.abs(dy) > 0.0001) {
        addSplat(x, y, dx * 95.0, dy * 95.0);
      }

      lastMouseX = x;
      lastMouseY = y;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const x = touch.clientX / window.innerWidth;
        const y = 1.0 - touch.clientY / window.innerHeight;
        const dx = x - lastMouseX;
        const dy = y - lastMouseY;

        if (Math.abs(dx) > 0.0001 || Math.abs(dy) > 0.0001) {
          addSplat(x, y, dx * 35.0, dy * 35.0);
        }

        lastMouseX = x;
        lastMouseY = y;
      }
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      displayMat.uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // Continuous Animation Frame loop for Advection & Liquid Flow Physics
    let animId: number;
    const animate = () => {
      // 1. Run Advection & Vorticity Pass
      advectionMat.uniforms.uVelocity.value = fboVelRead.texture;
      renderer.setRenderTarget(fboVelWrite);
      renderer.render(advectionScene, orthoCam);

      const tmp = fboVelRead;
      fboVelRead = fboVelWrite;
      fboVelWrite = tmp;

      // 2. Render Final Video Display to Screen with Liquid Velocity Displacement
      displayMat.uniforms.uVelocity.value = fboVelRead.texture;
      renderer.setRenderTarget(null);
      renderer.render(displayScene, orthoCam);

      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      quadGeo.dispose();
      splatMat.dispose();
      advectionMat.dispose();
      displayMat.dispose();
      texture.dispose();
      fboVelRead.dispose();
      fboVelWrite.dispose();
      renderer.dispose();
      webglStateRef.current = null;
    };
  }, []);

  // Update WebGL frame texture
  const renderFrame = useCallback((frameIndex: number) => {
    const img = imagesRef.current[frameIndex] || imagesRef.current[0];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    if (webglStateRef.current) {
      const { texture, material } = webglStateRef.current;
      texture.image = img;
      texture.needsUpdate = true;
      material.uniforms.uImageResolution.value.set(img.naturalWidth, img.naturalHeight);
    }
  }, []);

  // Update canvas on frame change
  const requestDrawFrame = useCallback((frameIndex: number) => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    animationFrameIdRef.current = requestAnimationFrame(() => {
      renderFrame(frameIndex);
    });
  }, [renderFrame]);

  // Idle water movement at top (scrollY < 20) and logo flicker at bottom (near scroll end)
  useEffect(() => {
    if (!isInitialReady) return;

    let topFrameTracker = 0;
    let bottomFrameTracker = 540;

    const animateIdle = () => {
      const isNearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 150;

      if (window.scrollY < 20) {
        topFrameTracker = (topFrameTracker + 0.35) % 60;
        renderFrame(Math.floor(topFrameTracker));
      } else if (isNearBottom) {
        bottomFrameTracker = bottomFrameTracker + 0.35;
        if (bottomFrameTracker > 599) {
          bottomFrameTracker = 540;
        }
        renderFrame(Math.floor(bottomFrameTracker));
      }
      idleAnimIdRef.current = requestAnimationFrame(animateIdle);
    };

    idleAnimIdRef.current = requestAnimationFrame(animateIdle);

    return () => {
      if (idleAnimIdRef.current) cancelAnimationFrame(idleAnimIdRef.current);
    };
  }, [isInitialReady, renderFrame]);

  // Handle Window Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollableHeight = rect.height - window.innerHeight;

      if (totalScrollableHeight <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollableHeight));
      const targetFrame = Math.min(frameCount - 1, Math.floor(progress * frameCount));

      setScrollProgress(progress);
      setCurrentFrameIndex(targetFrame);

      if (window.scrollY >= 20 && targetFrame !== currentFrameRef.current) {
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

  // Dynamic scale-down transition: Video stays 100% full-bleed through sections 1-4.
  // ONLY after FourPillars cards fully exit viewport (scrollProgress > 0.82) does it scale down.
  const scaleProgress = Math.max(0, Math.min(1, (scrollProgress - 0.82) / 0.10));
  const canvasScale = 1 - scaleProgress * 0.12;
  const canvasRadius = scaleProgress * 36;
  const overlayOpacity = scaleProgress * 0.75;
  const paddingClass = scaleProgress > 0.2 ? 'p-4 sm:p-8' : 'p-0';

  // Card content opacity starts fading in ONLY after video scaling is 100% complete (scaleProgress > 0.85)
  const cardTextOpacity = Math.max(0, Math.min(1, (scaleProgress - 0.85) / 0.15));

  // Position mode: fixed while in scroll sequence, absolute bottom-0 when sequence ends so card section naturally scrolls up
  const isPastSequence = scrollProgress >= 0.98;
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
