"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { SceneRig } from "./SceneRig";

export default function HeroScene({
  triggerRef,
  videoSrc,
}: {
  triggerRef: RefObject<HTMLElement | null>;
  videoSrc?: string;
}) {
  return (
    <Canvas
      shadows={false}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.3, 8.5], fov: 32 }}
    >
      <color attach="background" args={["#000000"]} />
      <SceneRig triggerRef={triggerRef} videoSrc={videoSrc} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.9} luminanceThreshold={0.25} luminanceSmoothing={0.4} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
