'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  baseVertexShader,
  waveSimulationShader,
  waterRenderShader,
} from '@/components/lib/shaders';


export default function FluidCursorRipple() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Skip the effect entirely for users who've asked for reduced motion —
    // also a free performance win since nothing mounts at all.
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // ─── Configuration ──────────────────────────────────────────────
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));
    // Trimmed a bit further (was 256/128) — this is a soft, blurred ripple,
    // not a detail surface, so the resolution drop is not perceptible.
    const SIM_SIZE = isMobile ? 96 : 192;
    const WAVE_SPEED = 1.42;
    // Faster decay (was 0.985) so ripples settle quickly instead of lingering/building up —
    // reads as calmer and more premium rather than chaotic, per client feedback.
    const DAMPING = 0.975;
    const BRUSH_RADIUS = isMobile ? 0.08 : 0.04;
    // Reduced cap (was 0.35) — client asked for the mouse-driven movement to feel
    // more subtle and premium rather than intense.
    const MAX_STRENGTH = 0.2;
    const MOUSE_LERP = 0.18;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // ─── Renderer ───────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    // The final composite pass is a full-viewport shader, so DPR directly
    // multiplies its fragment cost — dropped to the practical floor of 1.0
    // (native resolution, no supersampling), matching what mobile already uses.
    renderer.setPixelRatio(1.0);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ─── Scenes & Camera ────────────────────────────────────────────
    const simScene = new THREE.Scene();
    const renderScene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const planeGeo = new THREE.PlaneGeometry(2, 2);

    // ─── Render Targets (ping-pong) ─────────────────────────────────
    // Only .r/.g are ever read (see waveSimulationShader) — half-float has
    // ample precision for a damped height field and halves texture bandwidth
    // versus the previous full FloatType targets.
    const rtOptions: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
    };

    let targetA = new THREE.WebGLRenderTarget(SIM_SIZE, SIM_SIZE, rtOptions);
    let targetB = new THREE.WebGLRenderTarget(SIM_SIZE, SIM_SIZE, rtOptions);

    // ─── Mouse State ────────────────────────────────────────────────
    const mouse = new THREE.Vector2(-10, -10);
    const prevMouse = new THREE.Vector2(-10, -10);
    const targetMouse = new THREE.Vector2(-10, -10);
    let velocity = new THREE.Vector2(0, 0);
    let prevTargetMouse = new THREE.Vector2(-10, -10);

    // ─── Simulation Material ────────────────────────────────────────
    const simMaterial = new THREE.ShaderMaterial({
      vertexShader: baseVertexShader,
      fragmentShader: waveSimulationShader,
      uniforms: {
        uPrevSim: { value: null },
        uResolution: { value: new THREE.Vector2(SIM_SIZE, SIM_SIZE) },
        uMouse: { value: mouse },
        uPrevMouse: { value: prevMouse },
        uRadius: { value: BRUSH_RADIUS },
        uStrength: { value: 0.0 },
        uDamping: { value: DAMPING },
        uAspect: { value: width / height },
        uWaveSpeed: { value: WAVE_SPEED },
      },
    });

    const simQuad = new THREE.Mesh(planeGeo, simMaterial);
    simScene.add(simQuad);

    // ─── Render Material ────────────────────────────────────────────
    const renderMaterial = new THREE.ShaderMaterial({
      vertexShader: baseVertexShader,
      fragmentShader: waterRenderShader,
      uniforms: {
        uSimTexture: { value: null },
        uResolution: { value: new THREE.Vector2(SIM_SIZE, SIM_SIZE) },
        uTime: { value: 0 },
      },
      transparent: true,
      blending: THREE.NormalBlending,
    });

    const renderQuad = new THREE.Mesh(planeGeo, renderMaterial);
    renderScene.add(renderQuad);

    // ─── Input Tracking ─────────────────────────────────────────────
    let isInteracting = false;
    let lastMoveTime = performance.now();
    // Wave amplitude decays ~2.5%/frame (DAMPING^SIM_STEPS_PER_FRAME, now 1
    // step) — slower than before now that steps-per-frame is halved below, so
    // this window is widened to match (fully settled within ~3s at 60fps).
    const IDLE_TIMEOUT_MS = 3000;

    const updateMousePos = (clientX: number, clientY: number) => {
      const nx = clientX / window.innerWidth;
      const ny = 1.0 - clientY / window.innerHeight;
      prevTargetMouse.copy(targetMouse);
      targetMouse.set(nx, ny);
      lastMoveTime = performance.now();
      if (!isInteracting) {
        mouse.copy(targetMouse);
        prevMouse.copy(targetMouse);
        prevTargetMouse.copy(targetMouse);
        isInteracting = true;
      }
    };

    const handleMouseMove = (e: MouseEvent) => updateMousePos(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) updateMousePos(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      simMaterial.uniforms.uAspect.value = w / h;
    };
    window.addEventListener('resize', handleResize);

    // ─── Animation Loop ─────────────────────────────────────────────
    let animationFrameId: number;
    const clock = new THREE.Clock();

    // Run simulation steps per frame. Reduced 3 -> 2 -> 1: propagation is
    // slower now, but at this point that reads as "calm" rather than
    // "laggy" — and it halves the GPU sim passes again.
    const SIM_STEPS_PER_FRAME = 1;

    let wasIdle = false;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (document.hidden) return; // skip the fluid sim (4 render passes/frame) while backgrounded

      // Once the ripple has fully damped and the cursor has been still for a
      // while (e.g. the user is just scrolling), skip the 4 GPU render passes
      // entirely instead of simulating a flat, invisible ripple every frame.
      const idle = performance.now() - lastMoveTime > IDLE_TIMEOUT_MS;
      if (idle) {
        if (!wasIdle) {
          // One last render to settle on a fully-decayed frame before pausing.
          wasIdle = true;
        } else {
          return;
        }
      } else {
        wasIdle = false;
      }

      const elapsed = clock.getElapsedTime();
      renderMaterial.uniforms.uTime.value = elapsed;

      // Smooth cursor tracking
      prevMouse.copy(mouse);
      mouse.lerp(targetMouse, MOUSE_LERP);

      // Velocity-based force injection (faster cursor = stronger ripple).
      // Multiplier reduced from 3.5 — normal mouse movement now injects noticeably
      // gentler force, matching the client's request for a more subtle, premium feel.
      velocity.subVectors(mouse, prevMouse);
      const speed = velocity.length();
      const strength = Math.min(speed * 2.2, MAX_STRENGTH);
      simMaterial.uniforms.uStrength.value = strength;

      // ── Multi-step simulation for better propagation distance ──
      for (let i = 0; i < SIM_STEPS_PER_FRAME; i++) {
        simMaterial.uniforms.uPrevSim.value = targetA.texture;
        renderer.setRenderTarget(targetB);
        renderer.render(simScene, camera);

        // Swap
        const temp = targetA;
        targetA = targetB;
        targetB = temp;
      }

      // ── Final render pass ──
      renderMaterial.uniforms.uSimTexture.value = targetA.texture;
      renderer.setRenderTarget(null);
      renderer.render(renderScene, camera);
    };

    animate();

    // ─── Cleanup ────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      planeGeo.dispose();
      simMaterial.dispose();
      renderMaterial.dispose();
      targetA.dispose();
      targetB.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden"
      aria-hidden="true"
    />
  );
}
