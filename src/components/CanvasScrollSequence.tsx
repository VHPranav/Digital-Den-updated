'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

interface CanvasScrollSequenceProps {
  frameCount?: number;
  /** First frame (0-based) to show and play; earlier frames are never loaded. */
  startFrame?: number;
  /** Optional fixed height (e.g. "h-[600vh]"); by default the container wraps its content. */
  containerHeight?: string;
  /** id of the element whose centre, reaching the viewport centre, marks the last frame. */
  endAnchorId?: string;
  /** id of the element whose centre, reaching the viewport centre, starts playback (holds startFrame until then). */
  startAnchorId?: string;
  /** Which edge of the end anchor must reach the viewport for the last frame: its centre at the viewport centre (default) or its bottom edge at the viewport bottom. */
  endAnchorAlign?: 'center' | 'bottom';
  /** Without anchors, frames play across the whole container: from its top entering the viewport to its bottom reaching the viewport bottom (no held first/last frame). `curve` maps scroll progress to frame progress with [scroll, video] keyframes (both 0–1, ascending) so the pacing can be shaped, e.g. lingering on the opening frames while content arrives. */
  curve?: [number, number][];
  onProgressUpdate?: (progress: number, frameIndex: number) => void;
  children?: (progress: number, frameIndex: number) => React.ReactNode;
}

export default function CanvasScrollSequence({
  frameCount = 600,
  startFrame = 0,
  containerHeight = '',
  endAnchorId,
  startAnchorId,
  endAnchorAlign = 'center',
  curve,
  onProgressUpdate,
  children,
}: CanvasScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadingSetRef = useRef<Set<number>>(new Set());
  // Wherever the user currently is in the sequence — the background loader
  // keeps re-centering on this so a fast or deep scroll always pulls the
  // frames actually needed to the front of the queue instead of blindly
  // continuing a front-to-back fill.
  const priorityFrameRef = useRef(0);
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const smoothFrameRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const idleAnimIdRef = useRef<number | null>(null);

  const [imagesLoadedCount, setImagesLoadedCount] = useState(0);
  const [isInitialReady, setIsInitialReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [shouldLoad, setShouldLoad] = useState(false);

  // WebGL Active Theory Liquid Fluid Physics State Refs
  const webglStateRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    material: THREE.ShaderMaterial;
    texture: THREE.Texture;
  } | null>(null);

  // Helper to get frame path — WebP (q80) instead of the original JPGs: ~58%
  // smaller (33MB -> 13.4MB total across all 600 frames), so the sequence
  // finishes downloading/decoding far sooner and is less likely to still be
  // loading by the time the user scrolls to a given frame. Originals are kept
  // in public/frames/*.jpg as a backup, unreferenced by the app.
  const getFramePath = useCallback((index: number) => {
    const frameNum = String(index + 1).padStart(3, '0');
    return `/frames/ezgif-frame-${frameNum}.webp`;
  }, []);

  // Preload Images with High-Speed Concurrent Pool & Priority Fetching
  const loadSingleImage = useCallback((index: number, onDone?: () => void) => {
    if (index < startFrame || index >= frameCount) return;
    if (imagesRef.current[index]) {
      if (onDone) onDone();
      return;
    }
    if (loadingSetRef.current.has(index)) {
      // Already being fetched (by the background queue or a prior on-demand
      // call) — don't spawn a duplicate request for the same frame, which
      // otherwise happens repeatedly while scrolling through an unloaded
      // region and starves the frames actually queued up next.
      return;
    }
    loadingSetRef.current.add(index);
    const img = new Image();
    img.decoding = 'async';
    img.src = getFramePath(index);

    const markReady = () => {
      loadingSetRef.current.delete(index);
      imagesRef.current[index] = img;
      setImagesLoadedCount((prev) => prev + 1);
      if (index < startFrame + 5) setIsInitialReady(true);
      if (onDone) onDone();
    };
    const markFailed = () => {
      loadingSetRef.current.delete(index);
      setImagesLoadedCount((prev) => prev + 1);
      if (onDone) onDone();
    };

    // `onload`/`img.complete` only guarantee the bytes finished downloading —
    // NOT that the browser has finished decoding pixels, especially with
    // `decoding="async"`. Grabbing the image as a WebGL texture source in
    // that gap is exactly what produces a corrupted/half-rendered frame.
    // `decode()` resolves only once the image is truly safe to paint, so
    // frames are never marked ready (and never handed to the GPU) until
    // decode has actually finished.
    if (typeof img.decode === 'function') {
      img.decode().then(markReady).catch(() => {
        // decode() can reject on a network error, or in rare cases on some
        // browsers even for an image that did finish loading — fall back to
        // the load event rather than dropping the frame outright.
        if (img.complete && img.naturalWidth > 0) {
          markReady();
        } else {
          markFailed();
        }
      });
    } else {
      // Old-browser fallback where HTMLImageElement.decode() is unavailable.
      img.onload = markReady;
      img.onerror = markFailed;
    }
  }, [frameCount, startFrame, getFramePath]);

  // Defer the (heavy, 600-image / ~33MB) frame prefetch until this section is actually
  // approaching the viewport, instead of racing the hero/models for bandwidth on every page load.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '150% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;

    let isMounted = true;
    imagesRef.current = new Array(frameCount);

    // 1. Immediately load the first 12 urgent frames (from the start frame)
    priorityFrameRef.current = Math.max(priorityFrameRef.current, startFrame);
    for (let i = startFrame; i < Math.min(startFrame + 12, frameCount); i++) {
      loadSingleImage(i);
    }
    // ...and the last few, so the ending never waits on a download.
    for (let i = Math.max(startFrame, frameCount - 12); i < frameCount; i++) {
      loadSingleImage(i);
    }

    // 2. High-speed concurrent worker pool (16 connections) — but instead of a
    // blind front-to-back fill, each worker always grabs whichever unloaded
    // frame is CLOSEST to the user's current scroll position. That way a fast
    // or deep scroll re-centers the whole queue immediately, so the frames
    // about to be needed are always what's loading next — not whatever was
    // next in line from a linear scan that may be hundreds of frames behind.
    const CONCURRENCY = 16;

    const findNextPriorityIndex = (): number => {
      const center = priorityFrameRef.current;
      for (let offset = 0; offset < frameCount; offset++) {
        const forward = center + offset;
        if (forward < frameCount && !imagesRef.current[forward] && !loadingSetRef.current.has(forward)) {
          return forward;
        }
        const backward = center - offset;
        if (offset > 0 && backward >= startFrame && !imagesRef.current[backward] && !loadingSetRef.current.has(backward)) {
          return backward;
        }
      }
      return -1;
    };

    const worker = () => {
      if (!isMounted) return;
      const nextIdx = findNextPriorityIndex();
      if (nextIdx === -1) return; // everything loaded (or already in flight)
      loadSingleImage(nextIdx, () => {
        if (isMounted) worker();
      });
    };

    for (let c = 0; c < CONCURRENCY; c++) {
      worker();
    }

    return () => {
      isMounted = false;
    };
  }, [frameCount, startFrame, loadSingleImage, shouldLoad]);

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

        // "object-fit: cover": show a centred slice of the frame that fills the screen.
        // Narrower screen than the frame -> crop the sides; wider -> crop top/bottom.
        vec2 getCoverUv(vec2 uv, vec2 screenRes, vec2 texRes) {
          float rs = screenRes.x / screenRes.y;
          float ri = texRes.x / texRes.y;
          if (rs < ri) {
            float k = rs / ri;
            return vec2(uv.x * k + (1.0 - k) * 0.5, uv.y);
          }
          float k = ri / rs;
          return vec2(uv.x, uv.y * k + (1.0 - k) * 0.5);
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

    // ─── WebGL Context Loss Recovery ─────────────────────────────────
    // With several always-mounted WebGL scenes elsewhere on the page (Hero,
    // CreativeTransitionSection, the spine carousel) holding GPU memory for
    // their full lifetime — pausing their render loop when off-screen frees
    // no GPU memory — total GPU usage keeps climbing as the user scrolls, and
    // can peak by the time they reach this section. Under that pressure the
    // browser can forcibly evict ("lose") a WebGL context to reclaim memory.
    // Without handling it, this canvas would stay corrupted/blank forever
    // after that point. `preventDefault()` on the loss event is required for
    // the browser to attempt restoration at all.
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('CanvasScrollSequence: WebGL context lost — will recover on restore.');
    };
    const handleContextRestored = () => {
      console.warn('CanvasScrollSequence: WebGL context restored — re-uploading current frame.');
      const img = imagesRef.current[currentFrameRef.current];
      if (img && img.complete && img.naturalWidth > 0) {
        texture.image = img;
        texture.needsUpdate = true;
        displayMat.uniforms.uImageResolution.value.set(img.naturalWidth, img.naturalHeight);
      }
      renderer.render(displayScene, orthoCam);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
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
    if (!img || !img.complete || !img.naturalWidth || img.naturalWidth === 0) {
      // Trigger on-demand priority load if missing
      loadSingleImage(frameIndex);

      // Look for the closest ready frame so the canvas never stalls or blinks
      for (let offset = 1; offset < 40; offset++) {
        const prev = imagesRef.current[frameIndex - offset];
        if (prev && prev.complete && prev.naturalWidth && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesRef.current[frameIndex + offset];
        if (next && next.complete && next.naturalWidth && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (!img || !img.complete || !img.naturalWidth || img.naturalWidth === 0) {
      img = imagesRef.current[startFrame];
    }

    // Safety check: Do not attempt WebGL render if no valid image is ready yet
    if (!img || !img.complete || !img.naturalWidth || img.naturalWidth === 0) {
      return;
    }

    if (webglStateRef.current) {
      const { renderer, scene, camera, texture, material } = webglStateRef.current;
      texture.image = img;
      texture.needsUpdate = true;
      material.uniforms.uImageResolution.value.set(img.naturalWidth, img.naturalHeight);
      renderer.render(scene, camera);
    }
  }, [loadSingleImage, startFrame]);

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
    // Eased frame playback: runs only while the displayed frame is still catching up to the target.
    let loopId: number | null = null;
    const loop = () => {
      const target = targetFrameRef.current;
      const diff = target - smoothFrameRef.current;
      smoothFrameRef.current = Math.abs(diff) < 0.4 ? target : smoothFrameRef.current + diff * 0.18;
      const frame = Math.max(startFrame, Math.min(frameCount - 1, Math.round(smoothFrameRef.current)));
      if (frame !== currentFrameRef.current) {
        currentFrameRef.current = frame;
        setCurrentFrameIndex(frame);
        renderFrame(frame);
      }
      loopId = smoothFrameRef.current === target ? null : requestAnimationFrame(loop);
    };
    const startLoop = () => {
      if (loopId === null) loopId = requestAnimationFrame(loop);
    };

    const computeScrollState = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollableHeight = rect.height - window.innerHeight;

      if (totalScrollableHeight <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollableHeight));

      // Frames run from a start point until the end anchor (the entry cards) is centred, so the
      // whole video has played exactly as the cards arrive; it then holds the last frame.
      // Start point: the start anchor (e.g. the Hero) reaching the viewport centre — startFrame
      // is held until then — or, without one, the container entering at the bottom.
      // Without an end anchor, frames span 0–80% of the container scroll.
      const anchor = endAnchorId ? document.getElementById(endAnchorId) : null;
      const startAnchor = startAnchorId ? document.getElementById(startAnchorId) : null;
      const centreOffset = (r: DOMRect) => r.top + r.height / 2 - window.innerHeight / 2; // 0 when centred
      let videoProgress: number;
      if (anchor) {
        const ar = anchor.getBoundingClientRect();
        const end = endAnchorAlign === 'bottom' ? ar.bottom - window.innerHeight : centreOffset(ar);
        const start = startAnchor ? centreOffset(startAnchor.getBoundingClientRect()) : rect.top - window.innerHeight;
        const total = end - start; // fixed scroll distance between the two points
        videoProgress = total > 0 ? Math.max(0, Math.min(1, -start / total)) : 1;
      } else if (!startAnchorId) {
        // Whole-container range: moving from the moment the section enters until its bottom edge
        // reaches the viewport bottom, so neither the first nor the last frame is ever held.
        const linear = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / rect.height));
        videoProgress = linear;
      } else {
        videoProgress = Math.max(0, Math.min(1, progress / 0.80));
      }
      if (curve && curve.length > 1) {
        // Shape the pacing: piecewise-linear through the [scroll, video] keyframes (monotonic, no stalls).
        for (let i = 1; i < curve.length; i++) {
          const [x0, y0] = curve[i - 1];
          const [x1, y1] = curve[i];
          if (videoProgress <= x1 || i === curve.length - 1) {
            videoProgress = y0 + ((Math.min(videoProgress, x1) - x0) / (x1 - x0)) * (y1 - y0);
            break;
          }
        }
      }
      // Scroll only sets a (fractional) target; the render loop below eases toward it so the frames
      // glide with the smooth-scroll instead of stepping, and a fast fling still lands on the last frame.
      const targetFrame = Math.min(frameCount - 1, startFrame + videoProgress * (frameCount - 1 - startFrame));
      targetFrameRef.current = targetFrame;
      setScrollProgress(progress);
      // Re-center the background loader on wherever the user is heading, every scroll tick.
      priorityFrameRef.current = Math.round(targetFrame);
      startLoop();

      if (onProgressUpdate) {
        onProgressUpdate(progress, Math.round(targetFrame));
      }
    };

    // Coalesce bursts of scroll/resize events (e.g. fast trackpad input can fire
    // several per animation frame) into a single getBoundingClientRect() read
    // per frame instead of one per event — same computed values, less layout work.
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        computeScrollState();
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    computeScrollState();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (loopId !== null) cancelAnimationFrame(loopId);
    };
  }, [frameCount, startFrame, renderFrame, onProgressUpdate, endAnchorId, startAnchorId, endAnchorAlign, curve]);

  // Initial draw when first image ready
  useEffect(() => {
    if (isInitialReady) {
      renderFrame(startFrame);
    }
  }, [isInitialReady, renderFrame, startFrame]);

  // Position mode: fixed while in scroll sequence, absolute bottom-0 only when reaching 0.99
  const isPastSequence = scrollProgress >= 0.99;
  const positionClass = isPastSequence ? 'absolute bottom-0 left-0 w-full h-screen' : 'fixed top-0 left-0 w-full h-screen';

  // The page sections rendered here (Hero/Mission/Venture/FourPillars) are heavy,
  // and don't need to re-render on every pixel of scroll — only re-invoke the
  // render prop when the discrete frame index moves, not on every scrollProgress
  // tick (which otherwise re-renders this whole subtree dozens of times/sec).
  const renderedChildren = useMemo(
    () => children?.(scrollProgress, currentFrameIndex),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [children, currentFrameIndex],
  );

  return (
    <div ref={containerRef} className={`relative w-full ${containerHeight}`.trim()}>
      {/* Full-bleed video canvas: fixed while the sequence runs, scrolls up naturally when the section ends */}
      <div className={`${positionClass} overflow-hidden z-0 bg-den flex items-center justify-center`}>
        <div className="w-full h-full relative overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full block object-cover"
          />

          {/* Pure Black Slanted Gradient (Directly Over the Video Frame, Below the Text Content, 150vh Span) */}
          {/* <div
            className="absolute top-0 inset-x-0 h-[100vh] pointer-events-none z-[2]"
            style={{
              background: 'linear-gradient(176.5deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.92) 20%, rgba(0, 0, 0, 0.6) 40%,  rgba(0, 0, 0, 0) 100%)',
            }}
            aria-hidden="true"
          /> */}

          {/* Loading state: page background with a small spinner low on the screen, so it never
              sits behind the Hero copy (which renders above this layer). */}
          {!isInitialReady && (
            <div className="absolute inset-0 z-50 flex items-end justify-center bg-den pb-[12vh] pointer-events-none" aria-hidden="true">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/15 border-t-purple-300" />
            </div>
          )}
        </div>
      </div>

      {/* Bottom fade: dissolves the video into the page background where the section ends,
          so there is no hard seam with the next section. Below the content (z-10). */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[45vh]"
        style={{ background: 'linear-gradient(to bottom, rgba(11, 11, 12, 0) 0%, rgba(11, 11, 12, 0.55) 45%, rgba(11, 11, 12, 0.9) 80%, #0b0b0c 100%)' }}
        aria-hidden="true"
      />

      {/* Render webpage content sections directly over the canvas */}
      <div className="relative z-10 w-full">
        {renderedChildren}
      </div>
    </div>
  );
}
