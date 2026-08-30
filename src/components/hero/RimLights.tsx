"use client";

import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { Environment } from "@react-three/drei";

/**
 * Luminous turquoise (left) & soft lavender-purple (right) rim lighting +
 * studio HDRI environment reflections. Rendered as a child of the same
 * rotating/scaling rig group as the medallion (see SceneRig), so aiming at
 * the local origin once on mount stays correct at every rotation.
 */
export function RimLights() {
  const cyanRef = useRef<THREE.RectAreaLight>(null);
  const purpleRef = useRef<THREE.RectAreaLight>(null);

  useEffect(() => {
    RectAreaLightUniformsLib.init();
    cyanRef.current?.lookAt(0, 0, 0);
    purpleRef.current?.lookAt(0, 0, 0);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <Environment preset="studio" environmentIntensity={0.85} />
      </Suspense>
      <ambientLight intensity={0.06} />

      {/* Left turquoise rim light */}
      <rectAreaLight
        ref={cyanRef}
        args={["#00F5D4", 5.5, 4.5, 7]}
        position={[-4, 1.4, 2]}
      />

      {/* Right light purple / lavender rim light */}
      <rectAreaLight
        ref={purpleRef}
        args={["#C084FC", 5.5, 4.5, 7]}
        position={[4, 1.2, 1.6]}
      />

      <directionalLight
        position={[0, 4, 3]}
        intensity={0.3}
        color="#e8ecf2"
      />

      {/* Subtle specular point highlight */}
      <pointLight position={[0.6, 1.8, 2.4]} intensity={2.5} distance={8} color="#ffffff" />
    </>
  );
}
