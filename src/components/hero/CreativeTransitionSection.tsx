"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, MeshTransmissionMaterial, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { gsap } from "@/lib/gsap";
import { useTabVisible } from "@/hooks/useTabVisible";
import { useInViewport } from "@/hooks/useInViewport";
import { useEmblemGlowTexture } from "@/hooks/useEmblemGlowTexture";

/**
 * Computes planar UV projection mapped onto the XY bounds of the geometry
 * so the glow texture displays seamlessly without stretching.
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

/**
 * Builds the emblem geometry (outer ring + inner "a" glyph)
 */
function buildEmblemGeometry() {
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
    depth: 0.18,
    bevelEnabled: true,
    bevelThickness: 0.028,
    bevelSize: 0.02,
    bevelSegments: 4,
    curveSegments: 64,
  });
  letterGeometry.center();
  applyPlanarUVs(letterGeometry);

  // Outer Torus Ring
  const ringGeometry = new THREE.TorusGeometry(1.48, 0.115, 48, 140);

  return { ringGeometry, letterGeometry };
}

/**
 * Volumetric Light Beam behind the 3D text and emblem
 */
function VolumetricStreak() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = Math.sin(t * 0.4) * 0.04;
  });

  return (
    <mesh ref={meshRef} position={[-0.4, 0.08, -1.1]} rotation={[0, 0, 0.06]}>
      <planeGeometry args={[14, 4.8]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          void main() {
            float yDist = abs(vUv.y - 0.5) * 2.0;
            float streak = exp(-yDist * 2.8);
            float xFade = smoothstep(0.0, 0.28, vUv.x) * smoothstep(1.0, 0.55, vUv.x);
            vec3 color = mix(vec3(0.06, 0.28, 0.24), vec3(0.6, 0.9, 0.85), vUv.x * 0.7);
            float alpha = streak * xFade * 0.28;
            gl_FragColor = vec4(color * 1.6, alpha);
          }
        `}
      />
    </mesh>
  );
}

import { useGLTF } from "@react-three/drei";
import { ModelErrorBoundary } from "./ModelErrorBoundary";

export const EMBLEM_MODEL_PATH = "/models/emblem-opt.glb";

/**
 * Big Emblem loaded directly from the real emblem.glb 3D asset
 */
function GLBBigEmblem({ glowTex }: { glowTex: THREE.Texture | null }) {
  const { scene } = useGLTF(EMBLEM_MODEL_PATH);

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

  if (!geometry) return null;

  return (
    <mesh geometry={geometry} castShadow={false} receiveShadow={false}>
      <MeshTransmissionMaterial
        samples={6}
        resolution={256}
        thickness={0.52}
        roughness={0.04}
        transmission={1.0}
        ior={1.38}
        chromaticAberration={0.16}
        anisotropy={0.5}
        distortion={0.14}
        distortionScale={0.4}
        temporalDistortion={0.08}
        color="#dfeeff"
        backside
        side={THREE.DoubleSide}
        emissive="#ffffff"
        emissiveIntensity={1.0}
        emissiveMap={glowTex || undefined}
        toneMapped={true}
      />
    </mesh>
  );
}

useGLTF.preload(EMBLEM_MODEL_PATH);

/**
 * Procedural Fallback Emblem if the GLB is loading or missing
 */
function ProceduralBigEmblem({ glowTex }: { glowTex: THREE.Texture | null }) {
  const { ringGeometry, letterGeometry } = useMemo(() => buildEmblemGeometry(), []);

  return (
    <>
      {/* 1. Outer Chromatic Glass Ring */}
      <mesh geometry={ringGeometry} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <MeshTransmissionMaterial
          thickness={0.52}
          roughness={0.04}
          transmission={1.0}
          ior={1.38}
          chromaticAberration={0.16}
          anisotropy={0.5}
          distortion={0.14}
          distortionScale={0.4}
          temporalDistortion={0.08}
          color="#dfeeff"
          backside
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Inner "a" Glyph Mesh with Emissive Cyberpunk Video Mapping */}
      <mesh geometry={letterGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#04060c"
          metalness={0.9}
          roughness={0.12}
          emissive="#ffffff"
          emissiveIntensity={1.0}
          emissiveMap={glowTex || undefined}
          toneMapped={true}
        />
      </mesh>

      {/* 3. Outer Glass Lens Casing over the "a" for extra chromatic refraction */}
      <mesh geometry={letterGeometry} scale={[1.025, 1.025, 1.05]}>
        <MeshTransmissionMaterial
          thickness={0.25}
          roughness={0.05}
          transmission={0.92}
          ior={1.32}
          chromaticAberration={0.12}
          color="#ebf5ff"
          backside
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

/**
 * Large 3D Emblem with exact angle, transmissive outer glass ring,
 * and emissive inner "a" glyph. Enters from the top rotating 360 degrees
 * as you scroll into the section.
 */
function BigEmblem({
  mousePos,
  scrollProgress,
}: {
  mousePos: React.RefObject<{ x: number; y: number }>;
  scrollProgress: React.RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const glowTex = useEmblemGlowTexture();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const p = scrollProgress.current ?? 0;

    // Entrance range: from section entering viewport (0.0) until fully centered (0.40)
    const entryT = Math.min(Math.max(p / 0.40, 0), 1.0);
    // Smooth cubic ease-out curve for gentle deceleration
    const entryEase = 1 - Math.pow(1 - entryT, 2.5);

    // 1. Position Y: swoops down from above top frame (+7.2) into resting Y (0.0)
    const entryY = (1 - entryEase) * 7.2;

    // 2. Continuous dynamic 3D rotation driven by scroll progress throughout the section
    const scrollRotY = -0.78 + p * (Math.PI * 2.5);
    const scrollRotX = -0.06 + Math.sin(p * Math.PI) * 0.25;

    // 3. Smooth zoom from 1.30 scale down into resting scale 0.88
    const entryScale = THREE.MathUtils.lerp(1.30, 0.88, entryEase);

    // Mouse parallax + subtle idle float
    const targetRotX = scrollRotX + ((mousePos.current?.y || 0) * 0.15 + Math.sin(t * 0.7) * 0.02);
    const targetRotY = scrollRotY + ((mousePos.current?.x || 0) * 0.22 + Math.cos(t * 0.5) * 0.03);
    const targetRotZ = 0.04 + Math.sin(p * Math.PI * 2) * 0.06;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.1);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.1);
    groupRef.current.rotation.z = targetRotZ;

    const idleY = Math.sin(t * 0.6) * 0.03;
    groupRef.current.position.y = entryY + idleY;
    groupRef.current.position.x = THREE.MathUtils.lerp(0.0, 0.16, entryEase);
    groupRef.current.scale.setScalar(entryScale);
  });

  return (
    <group ref={groupRef} position={[0, 7.2, 0]} scale={1.30} rotation={[0.5, Math.PI * 2 - 0.78, 0.04]}>
      <ModelErrorBoundary fallback={<ProceduralBigEmblem glowTex={glowTex} />}>
        <Suspense fallback={<ProceduralBigEmblem glowTex={glowTex} />}>
          <GLBBigEmblem glowTex={glowTex} />
        </Suspense>
      </ModelErrorBoundary>
    </group>
  );
}

/**
 * 3D Scene containing Luminous Headline, Big Emblem, Lights, and Streak
 */
function Scene({
  triggerRef,
  mousePos,
  scrollProgress,
}: {
  triggerRef: React.RefObject<HTMLElement | null>;
  mousePos: React.RefObject<{ x: number; y: number }>;
  scrollProgress: React.RefObject<number>;
}) {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;

  useEffect(() => {
    RectAreaLightUniformsLib.init();
  }, []);

  // Smooth scroll camera scrub
  useEffect(() => {
    if (!triggerRef.current) return;
    const progress = { value: 0 };

    const tween = gsap.to(progress, {
      value: 1,
      ease: "none",
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.0,
      },
      onUpdate: () => {
        const p = progress.value;
        scrollProgress.current = p;
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [camera, triggerRef, scrollProgress]);

  return (
    <>
      <color attach="background" args={["#000000"]} />

      {/* ─── Curated Multi-Shade Purple & Lavender Lighting Rig on the Big Emblem ─── */}
      <ambientLight intensity={0.2} color="#181028" />

      {/* Top-Left Signature Lavender Key Light */}
      <directionalLight position={[-4, 4.0, 2.5]} intensity={2.4} color="#BB9DEE" />

      {/* Top-Right Light Pastel Violet Key Light */}
      <directionalLight position={[4, 3.5, 2.5]} intensity={2.2} color="#E0D4FC" />

      {/* Bottom-Left Deep Royal Amethyst Fill Light */}
      <directionalLight position={[-3.5, -3.5, 1.5]} intensity={1.8} color="#7C3AED" />

      {/* Bottom-Right Electric Orchid Purple Accent Light */}
      <pointLight position={[3.8, -2.5, 2.2]} intensity={2.4} color="#A855F7" distance={12} />

      {/* Direct Back Ultraviolet Silhouette Light */}
      <pointLight position={[0, 1.0, -3.5]} intensity={2.2} color="#9333EA" distance={12} />

      {/* ─── 3D Clean Text (Left-aligned, passing directly behind the glass ring, vertically centered) ─── */}
      <Text
        position={[-2.65, 0.0, -0.45]}
        fontSize={0.30}
        maxWidth={3.0}
        lineHeight={1.08}
        letterSpacing={0.04}
        anchorX="left"
        anchorY="middle"
        textAlign="left"
      >
        {"CREATIVE\nDIGITAL\nEXPERIENCES"}
        <meshBasicMaterial color="#e4e4e7" toneMapped={true} />
      </Text>

      {/* ─── Big 3D Emblem with 360-degree top entrance transition ─── */}
      <BigEmblem mousePos={mousePos} scrollProgress={scrollProgress} />

      <Environment preset="studio" environmentIntensity={0.7} />
    </>
  );
}

export default function CreativeTransitionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  const isTabVisible = useTabVisible();
  const isInViewport = useInViewport(sectionRef);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mousePos.current = { x, y };
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative z-[25] w-full min-h-[220vh] bg-black select-none -mt-[8.5vw] overflow-visible"
      style={{
        clipPath: "polygon(0 8.5vw, 100% 0, 100% 100%, 0 100%)",
        WebkitClipPath: "polygon(0 8.5vw, 100% 0, 100% 100%, 0 100%)",
      }}
    >
      {/* ─── Pinned 100vh Full Viewport Stage (Clean 100vh inside viewport) ─── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        {/* 3D WebGL Canvas */}
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 4.4], fov: 38 }}
            dpr={[1, 1.5]}
            gl={{ antialias: false, powerPreference: "high-performance" }}
            frameloop={isTabVisible && isInViewport ? "always" : "never"}
          >
            <Suspense fallback={null}>
              <Scene
                triggerRef={sectionRef}
                mousePos={mousePos}
                scrollProgress={scrollProgress}
              />
            </Suspense>
            <EffectComposer multisampling={0}>
              <Bloom
                intensity={0.4}
                luminanceThreshold={0.98}
                luminanceSmoothing={0.2}
                mipmapBlur
              />
            </EffectComposer>
          </Canvas>
        </div>

        {/* ─── Right-Side Information Column (Vertically Centered) ─── */}
        <div className="absolute inset-0 z-10 flex items-center justify-end pointer-events-none">
          <div className="mr-[5vw] sm:mr-[7vw] md:mr-[8vw] max-w-[280px] sm:max-w-xs md:max-w-sm space-y-7 text-neutral-300 font-mono text-[11px] sm:text-xs md:text-[13px] uppercase tracking-wider leading-[1.7] drop-shadow-lg">
            <div>
              <p className="text-white font-semibold tracking-widest">
                FOUNDED IN 2012
              </p>
            </div>
            <div>
              <p>
                WE BLEND STORY, ART &amp; TECHNOLOGY AS AN IN-HOUSE TEAM OF PASSIONATE MAKERS
              </p>
            </div>
            <div>
              <p>
                OUR INDUSTRY-LEADING WEB TOOLSET CONSISTENTLY DELIVERS AWARD-WINNING WORK THROUGH QUALITY &amp; PERFORMANCE
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

