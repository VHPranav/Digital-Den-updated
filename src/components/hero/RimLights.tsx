"use client";

import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { Environment } from "@react-three/drei";

/**
 * Curated Multi-Shade Purple & Lavender Lighting Rig on the Hero Emblem:
 * - Signature Lavender (#BB9DEE) left key/rim
 * - Electric Orchid Purple (#A855F7) right rim
 * - Light Pastel Violet (#E0D4FC) top specular highlight
 * - Deep Royal Amethyst (#7C3AED) underside fill
 * - Ultraviolet (#9333EA) back silhouette
 */
export function RimLights() {
  const leftRectRef = useRef<THREE.RectAreaLight>(null);
  const rightRectRef = useRef<THREE.RectAreaLight>(null);

  useEffect(() => {
    RectAreaLightUniformsLib.init();
    leftRectRef.current?.lookAt(0, 0, 0);
    rightRectRef.current?.lookAt(0, 0, 0);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <Environment preset="studio" environmentIntensity={0.65} />
      </Suspense>
      <ambientLight intensity={0.12} color="#181028" />

      {/* Left Signature Lavender rim light */}
      <rectAreaLight
        ref={leftRectRef}
        args={["#BB9DEE", 6.0, 4.5, 7]}
        position={[-4, 1.4, 2]}
      />

      {/* Right Electric Orchid Purple rim light */}
      <rectAreaLight
        ref={rightRectRef}
        args={["#A855F7", 6.0, 4.5, 7]}
        position={[4, 1.2, 1.6]}
      />

      {/* Top Light Pastel Violet Key Highlight */}
      <directionalLight
        position={[0, 4.5, 3.0]}
        intensity={1.8}
        color="#E0D4FC"
      />

      {/* Bottom Deep Royal Amethyst Fill */}
      <directionalLight
        position={[-3, -4.0, 1.5]}
        intensity={1.4}
        color="#7C3AED"
      />

      {/* Direct Back Ultraviolet Silhouette */}
      <directionalLight
        position={[0, 0, -5.0]}
        intensity={1.6}
        color="#9333EA"
      />

      {/* Specular Glint Highlight */}
      <pointLight position={[0.6, 1.8, 2.4]} intensity={2.8} distance={8} color="#E0D4FC" />
    </>
  );
}
