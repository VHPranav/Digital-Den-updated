"use client";

import { Suspense, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Emblem, PlaceholderEmblem } from "./Emblem";
import { ModelErrorBoundary } from "./ModelErrorBoundary";
import { ParticleField } from "./ParticleField";
import { RimLights } from "./RimLights";
import { useScrollTimeline, type ScrollState } from "@/hooks/useScrollTimeline";

type SceneRigProps = {
  triggerRef: RefObject<HTMLElement | null>;
  videoSrc?: string;
};

// Composition framing: centered in the viewport
const RIG_SCALE = 0.65;
const RIG_Y_OFFSET = 0.0;

export function SceneRig({ triggerRef, videoSrc }: SceneRigProps) {
  const rigGroupRef = useRef<THREE.Group>(null);
  const scrollState = useRef<ScrollState>({
    rotY: 0,
    rotX: 0,
    posY: 0,
    scale: 1,
    progress: 0,
  });
  const emblemWorldPos = useRef(new THREE.Vector3());

  useScrollTimeline(triggerRef, scrollState);

  useFrame((state) => {
    const rig = rigGroupRef.current;
    if (!rig) return;
    const t = state.clock.elapsedTime;
    const { rotY, rotX, posY, scale } = scrollState.current;

    rig.rotation.y = rotY + Math.sin(t * 0.6) * 0.05;
    rig.rotation.x = rotX + Math.sin(t * 0.4) * 0.025;
    rig.position.y = RIG_Y_OFFSET + posY + Math.sin(t * 0.5) * 0.04;
    rig.scale.setScalar(RIG_SCALE * (scale || 1.0));
    rig.getWorldPosition(emblemWorldPos.current);
  });

  return (
    <>
      <group ref={rigGroupRef} scale={RIG_SCALE} position={[0, RIG_Y_OFFSET, 0]}>
        <RimLights />
        <ModelErrorBoundary fallback={<PlaceholderEmblem videoSrc={videoSrc} />}>
          <Suspense fallback={null}>
            <Emblem videoSrc={videoSrc} />
          </Suspense>
        </ModelErrorBoundary>
      </group>
      <ParticleField scrollState={scrollState} attractorPosition={emblemWorldPos} />
    </>
  );
}
