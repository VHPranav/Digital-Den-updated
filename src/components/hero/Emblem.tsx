"use client";

import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import { useIntroTimeline } from "@/hooks/useIntroTimeline";

export const EMBLEM_MODEL_PATH = "/models/emblem.glb";
export const DEFAULT_BOKEH_VIDEO_PATH = "/videos/cyberpunk-nightcity.mp4";

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
 * Generates or plays a high-velocity Cyberpunk Bokeh Video Texture.
 * - Loads `/videos/cyberpunk-nightcity.mp4` seamlessly with full autoplay/muted/loop flags.
 * - If the video is loading or unsupported, dynamically generates a 60fps procedural
 *   cyberpunk bokeh canvas (neon cyan, electric magenta, violet, and gold light disks)
 *   as a zero-downtime fallback.
 */
function useCyberpunkBokehTexture(videoSrc: string = DEFAULT_BOKEH_VIDEO_PATH) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);
  const isVideoPlaying = useRef(false);

  // 1. Procedural Cyberpunk Bokeh Particles Setup
  const particles = useMemo(() => {
    return Array.from({ length: 48 }, () => ({
      x: Math.random() * 512,
      y: Math.random() * 512,
      radius: 10 + Math.random() * 34,
      speedX: (Math.random() - 0.5) * 5.5,
      speedY: -2.2 - Math.random() * 6.0, // Fast upward streak
      color: [
        "rgba(0, 240, 255, ",   // Cyberpunk Cyan
        "rgba(255, 0, 128, ",   // Neon Magenta
        "rgba(138, 43, 226, ",  // Electric Violet
        "rgba(255, 215, 0, ",   // Amber Gold
      ][Math.floor(Math.random() * 4)],
      alpha: 0.35 + Math.random() * 0.65,
      pulseSpeed: 1.2 + Math.random() * 3.5,
    }));
  }, []);

  // 2. HTML Video & Texture Creation
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
      // Browser autoplay policy catch: fallback seamlessly to procedural canvas
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

  // 3. Canvas texture initialization
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

  // Frame tick: update canvas when video is not actively rendering
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

    // Dark cyberpunk backdrop with subtle motion trail fade
    ctx.fillStyle = "rgba(4, 6, 12, 0.28)";
    ctx.fillRect(0, 0, 512, 512);

    ctx.globalCompositeOperation = "screen";

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < -60) p.x = 572;
      if (p.x > 572) p.x = -60;
      if (p.y < -60) p.y = 572;

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
 * Computes planar UV projection mapped onto the XY bounds of the geometry
 * so the video texture displays without distortion.
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

/** Loads the real emblem.glb and renders with emissive video texture mapping. */
export const Emblem = forwardRef<THREE.Group, { videoSrc?: string }>(function Emblem(
  { videoSrc },
  ref
) {
  const innerRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(EMBLEM_MODEL_PATH);
  const bokehTexture = useCyberpunkBokehTexture(videoSrc);

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
 * glyph with planar UV mapping and self-illuminating emissive video texture.
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

export const PlaceholderEmblem = forwardRef<THREE.Group, { videoSrc?: string }>(
  function PlaceholderEmblem({ videoSrc }, ref) {
    const innerRef = useRef<THREE.Group>(null);
    const { ringGeometry, letterGeometry } = useMemo(() => buildPlaceholderGeometry(), []);
    const bokehTexture = useCyberpunkBokehTexture(videoSrc);

    useIntroTimeline(innerRef);

    return (
      <group ref={ref}>
        <group ref={innerRef}>
          {/* 1. Outer Glass Lens / Ring (Physically refracts the inner video glow) */}
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

