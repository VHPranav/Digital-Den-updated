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

    // ─── Configuration (Active Theory Subtle Liquid Glass Profile) ──
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));
    const SIM_SIZE = isMobile ? 384 : 768; // 4x fewer texel updates on mobile
    const WAVE_SPEED = 0.92;
    const DAMPING = 0.935;
    const BRUSH_RADIUS = isMobile ? 0.035 : 0.022;
    const MAX_STRENGTH = 0.12;
    const MOUSE_LERP = 0.28;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // ─── Renderer ───────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ─── Scenes & Camera ────────────────────────────────────────────
    const simScene = new THREE.Scene();
    const renderScene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const planeGeo = new THREE.PlaneGeometry(2, 2);

    // ─── Render Targets (ping-pong) ─────────────────────────────────
    const rtOptions: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
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

    const updateMousePos = (clientX: number, clientY: number) => {
      const nx = clientX / window.innerWidth;
      const ny = 1.0 - clientY / window.innerHeight;
      prevTargetMouse.copy(targetMouse);
      targetMouse.set(nx, ny);
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

    // Run multiple simulation steps per frame for faster wave propagation
    const SIM_STEPS_PER_FRAME = 3;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      renderMaterial.uniforms.uTime.value = elapsed;

      // Smooth cursor tracking
      prevMouse.copy(mouse);
      mouse.lerp(targetMouse, MOUSE_LERP);

      // Velocity-based force injection (faster cursor = stronger ripple)
      velocity.subVectors(mouse, prevMouse);
      const speed = velocity.length();
      const strength = Math.min(speed * 3.5, MAX_STRENGTH);
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
