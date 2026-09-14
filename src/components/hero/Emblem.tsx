"use client";

import { forwardRef, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import { useIntroTimeline } from "@/hooks/useIntroTimeline";
import { useEmblemGlowTexture, EMBLEM_GLOW_VIDEO_PATH } from "@/hooks/useEmblemGlowTexture";

export const EMBLEM_MODEL_PATH = "/models/emblem-opt.glb";
export { EMBLEM_GLOW_VIDEO_PATH };

/**
 * Glass properties for the outer refractive ring/housing.
 */
const GLASS_PROPS = {
  thickness: 0.45,
  roughness: 0.05,
  transmission: 1,
  ior: 1.32,
  chromaticAberration: 0.08,
  anisotropy: 0.45,
  distortion: 0.18,
  distortionScale: 0.45,
  temporalDistortion: 0.12,
  color: "#e2f2ff",
} as const;

/**
 * Computes planar UV projection mapped onto the XY bounds of the geometry
 * so the glow texture displays without distortion.
 */
function applyPlanarUVs(geometry: THREE.BufferGeometry) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  if (!box) return;

  const sizeX = Math.max(box.max.x - box.min.x, 0.001);
  const sizeY = Math.max(box.max.y - box.min.y, 0.001);
  const pos = geometry.attributes.position;
  const uvs = new Float32Array(pos.count * 2);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    uvs[i * 2] = (x - box.min.x) / sizeX;
    uvs[i * 2 + 1] = (y - box.min.y) / sizeY;
  }

  const uvAttribute = new THREE.BufferAttribute(uvs, 2);
  uvAttribute.needsUpdate = true;
  geometry.setAttribute("uv", uvAttribute);
}

/** Loads the real emblem.glb and renders with emissive ambient glow texture mapping. */
export const Emblem = forwardRef<THREE.Group>(function Emblem(_props, ref) {
  const innerRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(EMBLEM_MODEL_PATH);
  const bokehTexture = useEmblemGlowTexture();

  useIntroTimeline(innerRef);

  const geometry = useMemo(() => {
    let geo: THREE.BufferGeometry | null = null;
    scene.traverse((child) => {
      if (!geo && (child as THREE.Mesh).isMesh) {
        geo = (child as THREE.Mesh).geometry.clone();
        applyPlanarUVs(geo);
        geo.computeVertexNormals();
      }
    });
    return geo;
  }, [scene]);

  return (
    <group ref={ref}>
      <group ref={innerRef}>
        {geometry && (
          <mesh geometry={geometry} castShadow receiveShadow>
            <MeshTransmissionMaterial
              {...GLASS_PROPS}
              backside
              side={THREE.DoubleSide}
              emissive="#ffffff"
              emissiveIntensity={2.5}
              emissiveMap={bokehTexture || undefined}
              toneMapped={false}
            />
          </mesh>
        )}
      </group>
    </group>
  );
});

useGLTF.preload(EMBLEM_MODEL_PATH);

/**
 * Procedural stand-in for emblem.glb: an outer transmissive ring plus an extruded "a"
 * glyph with planar UV mapping and self-illuminating emissive glow texture.
 */
function buildPlaceholderGeometry() {
  const bowlOuterR = 0.5;
  const bowlInnerR = 0.27;
  const bowlCenterX = -0.06;
  const bowlCenterY = -0.05;

  const bowl = new THREE.Shape();
  bowl.absarc(bowlCenterX, bowlCenterY, bowlOuterR, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(bowlCenterX, bowlCenterY, bowlInnerR, 0, Math.PI * 2, true);
  bowl.holes.push(hole);

  const stemWidth = 0.17;
  const stemLeft = bowlCenterX + bowlOuterR - stemWidth * 1.1;
  const stemBottom = bowlCenterY - bowlOuterR + 0.06;
  const stemTop = bowlCenterY + bowlOuterR + 0.3;
  const stem = new THREE.Shape();
  stem.moveTo(stemLeft, stemBottom);
  stem.lineTo(stemLeft + stemWidth, stemBottom);
  stem.lineTo(stemLeft + stemWidth, stemTop);
  stem.lineTo(stemLeft, stemTop);
  stem.closePath();

  const letterGeometry = new THREE.ExtrudeGeometry([bowl, stem], {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.018,
    bevelSegments: 4,
    curveSegments: 64,
  });
  letterGeometry.center();
  applyPlanarUVs(letterGeometry);

  const ringGeometry = new THREE.TorusGeometry(1.4, 0.1, 36, 128);

  return { ringGeometry, letterGeometry };
}

export const PlaceholderEmblem = forwardRef<THREE.Group>(
  function PlaceholderEmblem(_props, ref) {
    const innerRef = useRef<THREE.Group>(null);
    const { ringGeometry, letterGeometry } = useMemo(() => buildPlaceholderGeometry(), []);
    const bokehTexture = useEmblemGlowTexture();

    useIntroTimeline(innerRef);

    return (
      <group ref={ref}>
        <group ref={innerRef}>
          {/* 1. Outer Glass Lens / Ring (Physically refracts the inner ambient glow) */}
          <mesh geometry={ringGeometry} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <MeshTransmissionMaterial {...GLASS_PROPS} backside side={THREE.DoubleSide} />
          </mesh>

          {/* 2. Inner "a" Glyph Mesh with Emissive Cyberpunk Video Mapping */}
          <mesh geometry={letterGeometry} castShadow receiveShadow>
            <meshStandardMaterial
              color="#04070e"
              metalness={0.88}
              roughness={0.12}
              emissive="#ffffff"
              emissiveIntensity={3.2}
              emissiveMap={bokehTexture || undefined}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
    );
  }
);

