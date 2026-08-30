"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, MeshTransmissionMaterial, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { gsap } from "@/lib/gsap";

export const VIDEO_PATH = "/videos/cyberpunk-nightcity.mp4";

/**
 * Computes planar UV projection mapped onto the XY bounds of the geometry
 * so the video texture displays seamlessly without stretching.
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
 * Video / Dynamic Texture for the inner "a" glyph
 */
function useVideoTextureSource(videoSrc: string = VIDEO_PATH) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);
  const isVideoPlaying = useRef(false);

  const particles = useMemo(() => {
    return Array.from({ length: 40 }, () => ({
      x: Math.random() * 512,
      y: Math.random() * 512,
      radius: 12 + Math.random() * 32,
      speedX: (Math.random() - 0.5) * 5.0,
      speedY: -2.0 - Math.random() * 5.0,
      color: [
        "rgba(0, 240, 255, ",
        "rgba(255, 0, 128, ",
        "rgba(138, 43, 226, ",
        "rgba(255, 215, 0, ",
      ][Math.floor(Math.random() * 4)],
      alpha: 0.4 + Math.random() * 0.6,
      pulseSpeed: 1.2 + Math.random() * 3.0,
    }));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let isCancelled = false;
    const video = document.createElement("video");
    video.src = videoSrc;
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;

    const tex = new THREE.VideoTexture(video);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;

    const onPlay = () => {
      if (!isCancelled) {
        isVideoPlaying.current = true;
      }
    };

    video.addEventListener("playing", onPlay);
    video.addEventListener("loadeddata", onPlay);
    video.play().catch(() => {
      isVideoPlaying.current = false;
    });

    setVideoTexture(tex);

    return () => {
      isCancelled = true;
      video.removeEventListener("playing", onPlay);
      video.removeEventListener("loadeddata", onPlay);
      video.pause();
      video.removeAttribute("src");
      video.load();
      tex.dispose();
    };
  }, [videoSrc]);

  const canvasTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    canvasRef.current = canvas;

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    textureRef.current = tex;
    return tex;
  }, []);

  useFrame((state) => {
    if (isVideoPlaying.current && videoTexture) {
      videoTexture.needsUpdate = true;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const t = state.clock.elapsedTime;
    ctx.fillStyle = "rgba(4, 7, 14, 0.28)";
    ctx.fillRect(0, 0, 512, 512);
    ctx.globalCompositeOperation = "screen";

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < -50) p.x = 562;
      if (p.x > 562) p.x = -50;
      if (p.y < -50) p.y = 562;

      const dynamicAlpha = (p.alpha * (0.65 + 0.35 * Math.sin(t * p.pulseSpeed))).toFixed(2);
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      grad.addColorStop(0, `${p.color}${dynamicAlpha})`);
      grad.addColorStop(0.65, `${p.color}${(Number(dynamicAlpha) * 0.35).toFixed(2)})`);
      grad.addColorStop(1, `${p.color}0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    ctx.globalCompositeOperation = "source-over";
    if (textureRef.current) {
      textureRef.current.needsUpdate = true;
    }
  });

  return (isVideoPlaying.current && videoTexture) ? videoTexture : (videoTexture || canvasTexture);
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

export const EMBLEM_MODEL_PATH = "/models/emblem.glb";

/**
 * Big Emblem loaded directly from the real emblem.glb 3D asset
 */
function GLBBigEmblem({ videoTex }: { videoTex: THREE.Texture | null }) {
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
        emissiveMap={videoTex || undefined}
        toneMapped={true}
      />
    </mesh>
  );
}

useGLTF.preload(EMBLEM_MODEL_PATH);

/**
 * Procedural Fallback Emblem if the GLB is loading or missing
 */
function ProceduralBigEmblem({ videoTex }: { videoTex: THREE.Texture | null }) {
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
          emissiveMap={videoTex || undefined}
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
  const videoTex = useVideoTextureSource(VIDEO_PATH);

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
      <ModelErrorBoundary fallback={<ProceduralBigEmblem videoTex={videoTex} />}>
        <Suspense fallback={<ProceduralBigEmblem videoTex={videoTex} />}>
          <GLBBigEmblem videoTex={videoTex} />
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

      {/* ─── Studio Lighting tailored to create chromatic glints on the glass emblem ─── */}
      <ambientLight intensity={0.15} />

      {/* Top Rim Light (Bright white edge catch) */}
      <directionalLight position={[0, 4.5, 1.5]} intensity={1.5} color="#ffffff" />

      {/* Top-Left Cyan Accent */}
      <directionalLight position={[-4, 3.5, 2.5]} intensity={1.8} color="#00f5d4" />

      {/* Bottom-Right Magenta / Violet Rim Light */}
      <pointLight position={[3.8, -2.5, 2.2]} intensity={2.0} color="#c084fc" distance={10} />

      {/* Deep Blue Backlight for glass dispersion */}
      <pointLight position={[1.5, 2.0, -2.8]} intensity={1.6} color="#3b82f6" distance={10} />

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
      className="relative z-[25] w-full min-h-[200vh] bg-black select-none -mt-[8.5vw] overflow-visible"
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

