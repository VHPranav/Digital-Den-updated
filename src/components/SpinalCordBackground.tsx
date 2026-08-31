'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

interface SpinalCordBackgroundProps {
  progress?: number;
  progressRef?: React.RefObject<number> | { current: number };
  enableParticles?: boolean;
}

/* ─── Cluster Particle System Shaders (Dense Sticky Colonies) ─── */
const clusterParticleVertexShader = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform vec3 uMouseWorld;
uniform float uMouseActive;
uniform float uPulseEnergy;

attribute vec3 aColor;
attribute float aSize;
attribute float aPhase;
attribute vec3 aClusterCenter;
attribute float aRadialDist;

varying vec3 vColor;
varying float vRadialDist;
varying float vPhase;

void main() {
  vColor = aColor;
  vRadialDist = aRadialDist;
  vPhase = aPhase;

  // 1. Organic breathing & micro-turbulence around cluster anchor
  float breath = sin(uTime * 1.5 + aPhase * 6.283) * 0.12;
  vec3 toRadial = normalize(position - aClusterCenter + 0.001);
  vec3 displacedPos = position + toRadial * breath * (0.3 + aRadialDist * 0.7);

  // 2. Micro-shimmer wave across the colony
  displacedPos.x += sin(uTime * 2.0 + position.y * 1.5 + aPhase) * 0.04;
  displacedPos.y += cos(uTime * 1.7 + position.x * 1.5 + aPhase) * 0.04;
  displacedPos.z += sin(uTime * 1.9 + position.z * 1.5 + aPhase) * 0.04;

  // 3. Heartbeat pulse wave from spine
  displacedPos += toRadial * (uPulseEnergy * 0.18 * (1.0 - aRadialDist * 0.4));

  // 4. Interactive pointer repulsion in world space
  vec4 worldPos = modelMatrix * vec4(displacedPos, 1.0);
  if (uMouseActive > 0.5) {
    vec3 mouseDiff = worldPos.xyz - uMouseWorld;
    float mouseDist = length(mouseDiff);
    if (mouseDist < 3.5) {
      float repulse = (1.0 - mouseDist / 3.5) * 0.6;
      worldPos.xyz += normalize(mouseDiff + 0.001) * repulse;
    }
  }

  vec4 mvPosition = viewMatrix * worldPos;
  gl_Position = projectionMatrix * mvPosition;

  // Fine grain point size — small enough to read as dense coral texture, not bubbles
  float depth = max(-mvPosition.z, 0.1);
  float sizePulse = 1.0 + sin(uTime * 2.2 + aPhase * 6.28) * 0.15 + uPulseEnergy * 0.3;
  gl_PointSize = clamp((aSize * uPixelRatio * sizePulse) / depth, 1.5, 42.0);
}
`;

const clusterParticleFragmentShader = /* glsl */ `
uniform float uTime;
varying vec3 vColor;
varying float vRadialDist;
varying float vPhase;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;

  // 3D Spherical Normal for tangible solid beads matching vertebra geometry
  float z = sqrt(max(0.0, 0.25 - dist * dist)) * 2.0;
  vec3 normal = normalize(vec3(coord * 2.0, z));

  // Multi-angle directional lighting matching the spine lighting rig
  vec3 lDir1 = normalize(vec3(-8.0, 12.0, 10.0)); // Lavender key
  vec3 lDir2 = normalize(vec3(8.0, 11.0, 8.0));   // Pastel violet key
  vec3 lDir3 = normalize(vec3(-7.0, -10.0, -6.0)); // Deep amethyst fill

  vec3 cLavender     = vec3(0.733, 0.616, 0.933); // #BB9DEE
  vec3 cPastel       = vec3(0.878, 0.831, 0.988); // #E0D4FC
  vec3 cDeepAmeth    = vec3(0.486, 0.227, 0.929); // #7C3AED
  vec3 cDarkObsidian = vec3(0.016, 0.014, 0.030); // Deep liquid obsidian spine core

  float diff1 = max(0.0, dot(normal, lDir1));
  float diff2 = max(0.0, dot(normal, lDir2));
  float diff3 = max(0.0, dot(normal, lDir3));

  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 half1 = normalize(lDir1 + viewDir);
  vec3 half2 = normalize(lDir2 + viewDir);

  // Sharp wet glossy specular sheen matching the spinal cord surface
  float spec1 = pow(max(0.0, dot(normal, half1)), 55.0);
  float spec2 = pow(max(0.0, dot(normal, half2)), 35.0);
  float specBroad = pow(max(0.0, dot(normal, half1)), 14.0);
  float fresnel = pow(1.0 - z, 2.5);

  // Obsidian core with deep violet body matching the spinal cord
  vec3 baseCore = mix(cDarkObsidian, vColor, 0.35) + cDeepAmeth * (diff3 * 0.18);
  vec3 purpleSheen = cLavender * (diff1 * 0.28 + diff2 * 0.16);
  vec3 rim = cLavender * (fresnel * 0.60);
  vec3 wetGlint = (cPastel * spec1 * 0.90 + cLavender * spec2 * 0.50) + cPastel * (specBroad * 0.25);

  vec3 finalColor = baseCore + purpleSheen + rim + wetGlint;
  float edgeAlpha = smoothstep(0.5, 0.28, dist);
  float alpha = clamp((0.92 + spec1 * 0.08) * edgeAlpha, 0.0, 0.98);

  gl_FragColor = vec4(finalColor, alpha);
}
`;

export default function SpinalCordBackground({
  progress = 0,
  progressRef,
  enableParticles = true, // Enabled particles around the spine
}: SpinalCordBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackProgressRef = useRef(progress);

  useEffect(() => {
    fallbackProgressRef.current = progress;
  }, [progress]);

  const activeProgressRef = progressRef || fallbackProgressRef;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* ─── Scene / Camera / Renderer ─── */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020104, 0.02);

    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 19.0); // Zoomed out for smaller, comfortable spine sizing

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    /* ─── Post-Processing: Bloom (Refined soft specular halo) ─── */
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
      0.09, // strength — subtle, elegant soft halo
      0.5,  // radius
      0.88, // threshold
    );
    composer.addPass(bloomPass);
    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    /* ─── Curated Lighting Rig: Multi-Shade Purple & Lavender (Soft Balanced Intensity) ─── */
    // Subtle nocturnal amethyst ambient foundation
    scene.add(new THREE.AmbientLight(0x140d22, 0.6));

    // 1. Signature Lavender Key Light (Top-Left-Front)
    const lavenderDir = new THREE.DirectionalLight(0xbb9dee, 1.15);
    lavenderDir.position.set(-8, 12, 10);
    scene.add(lavenderDir);

    // 2. Light Pastel Violet Key Light (Top-Right-Front)
    const pastelVioletDir = new THREE.DirectionalLight(0xe0d4fc, 1.0);
    pastelVioletDir.position.set(8, 11, 8);
    scene.add(pastelVioletDir);

    // 3. Deep Royal Amethyst Fill Light (Bottom-Left-Back)
    const deepAmethystDir = new THREE.DirectionalLight(0x7c3aed, 0.85);
    deepAmethystDir.position.set(-7, -10, -6);
    scene.add(deepAmethystDir);

    // 4. Electric Orchid Purple Accent Light (Bottom-Right-Back)
    const electricPurpleDir = new THREE.DirectionalLight(0xa855f7, 0.85);
    electricPurpleDir.position.set(7, -11, -6);
    scene.add(electricPurpleDir);

    // 5. Ultraviolet Silhouette Rim Light (Direct Back)
    const ultraVioletBack = new THREE.DirectionalLight(0x9333ea, 0.75);
    ultraVioletBack.position.set(0, 0, -12);
    scene.add(ultraVioletBack);

    // 6. Dynamic Camera-Tracking Orbiting Purple Point Lights (Gentle Glow)
    const pastelLavenderPoint = new THREE.PointLight(0xe0d4fc, 1.5, 24);
    scene.add(pastelLavenderPoint);

    const signatureLavenderPoint = new THREE.PointLight(0xbb9dee, 1.5, 24);
    scene.add(signatureLavenderPoint);

    const electricPurplePoint = new THREE.PointLight(0xa855f7, 1.3, 22);
    scene.add(electricPurplePoint);

    const deepAmethystPoint = new THREE.PointLight(0x7c3aed, 1.1, 20);
    scene.add(deepAmethystPoint);

    /* ─── Master Spine & Sticky Clusters Root Group ─── */
    const spineMasterGroup = new THREE.Group();
    scene.add(spineMasterGroup);

    /* ─── Active Theory Thin-Film Iridescent & Wet Obsidian Vertebra Shader ─── */
    const vertebraMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uPulsePos: { value: 0.0 },
        uPulseEnergy: { value: 0.0 },
        uSlantedAngle: { value: -0.06 },
        uScrollVelocity: { value: 0.0 },
      },
      vertexShader: /* glsl */ `
        uniform float uSlantedAngle;
        uniform float uScrollVelocity;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);

          // Shearing along X-axis and scroll velocity
          vec3 shearedPos = position;
          shearedPos.y += shearedPos.x * uSlantedAngle + uScrollVelocity * 0.05;

          vec4 worldPos = modelMatrix * vec4(shearedPos, 1.0);
          vWorldPosition = worldPos.xyz;
          vec4 mvPosition = viewMatrix * worldPos;
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform float uPulsePos;
        uniform float uPulseEnergy;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;

        // 3D Procedural Simplex Noise for Micro-Surface Bump Displacement
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0) * 2.0 + 1.0;
          vec4 s1 = floor(b1) * 2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
        }

        // Spectral Color Wave Function for Thin-Film Optical Interference (Bismuth / Oil Slick)
        vec3 spectralPalette(float t) {
          vec3 a = vec3(0.5, 0.5, 0.5);
          vec3 b = vec3(0.5, 0.5, 0.5);
          vec3 c = vec3(1.0, 1.0, 1.0);
          vec3 d = vec3(0.00, 0.33, 0.67);
          return a + b * cos(6.28318 * (c * t + d));
        }

        void main() {
          vec3 viewDir = normalize(vViewPosition);

          // 1. High-Frequency Micro-Surface Procedural Bump Displacement
          vec3 bumpCoord = vWorldPosition * 2.4;
          float eps = 0.035;
          float n0 = snoise(bumpCoord);
          float nX = snoise(bumpCoord + vec3(eps, 0.0, 0.0));
          float nY = snoise(bumpCoord + vec3(0.0, eps, 0.0));
          float nZ = snoise(bumpCoord + vec3(0.0, 0.0, eps));
          vec3 bumpGrad = vec3(nX - n0, nY - n0, nZ - n0) / eps;

          // Blend geometric normal with micro-surface bump ridges (organic crystalline texture)
          vec3 normal = normalize(vNormal - bumpGrad * 0.38);

          // 2. View angle & Fresnel Optical Path
          float NdotV = clamp(dot(normal, viewDir), 0.0, 1.0);
          float fresnel = pow(1.0 - NdotV, 2.5);

          // 3. Thin-Film Iridescence (Optical Path Difference across varying thickness)
          float filmThickness = 0.45 + snoise(vWorldPosition * 0.8) * 0.35 + sin(vWorldPosition.y * 1.8) * 0.2;
          float cosThetaT = sqrt(max(0.0, 1.0 - (1.0 - NdotV * NdotV) / (1.33 * 1.33)));
          float opd = 2.0 * 1.33 * filmThickness * cosThetaT;
          
          // Multi-colored rainbow iridescence (pinks, purples, blues, cyan, and gold)
          vec3 iridescentColor = spectralPalette(opd * 2.2 + fresnel * 0.8 + uTime * 0.03);

          // 4. Studio Multi-Light Setup for Wet Specularity
          vec3 light1 = normalize(vec3(0.5, 0.8, 0.6));
          vec3 light2 = normalize(vec3(-0.6, 0.3, 0.4));
          vec3 light3 = normalize(vec3(0.0, -0.7, 0.7));

          vec3 half1 = normalize(light1 + viewDir);
          vec3 half2 = normalize(light2 + viewDir);

          // Dual-lobe glossy specular highlights (sharp polished wet hotspot + broad chromatic sheen)
          float specSharp1 = pow(max(0.0, dot(normal, half1)), 70.0);
          float specSharp2 = pow(max(0.0, dot(normal, half2)), 45.0);
          float specBroad  = pow(max(0.0, dot(normal, half1)), 16.0);

          // 5. Chromatic Dispersion at Glancing Edges (Prismatic color splitting)
          float fresnelR = pow(1.0 - NdotV, 2.2);
          float fresnelG = pow(1.0 - NdotV, 2.6);
          float fresnelB = pow(1.0 - NdotV, 3.1);
          vec3 chromaticRim = vec3(fresnelR, fresnelG, fresnelB) * iridescentColor;

          // 6. Theme Obsidian Base + #BB9DEE Joints
          vec3 cDarkObsidian = vec3(0.016, 0.018, 0.028); // Liquid metal obsidian core
          vec3 cJointBB9DEE  = vec3(0.733, 0.616, 0.933); // #BB9DEE lavender
          
          float jointMask = smoothstep(0.2, 0.8, sin(vWorldPosition.y * 3.4 + 0.5));
          float discCrevice = pow(1.0 - abs(normal.y), 2.4);
          float pulse = exp(-abs(vWorldPosition.y - uPulsePos) * 0.4) * uPulseEnergy;

          // Combine Obsidian base with iridescent thin-film layer & #BB9DEE joints
          vec3 baseCore = mix(cDarkObsidian, cJointBB9DEE * 0.25 + iridescentColor * 0.2, jointMask * 0.35 + discCrevice * 0.2);
          vec3 wetSheen = (specSharp1 * 0.85 + specSharp2 * 0.5) * vec3(0.98, 0.96, 1.0);
          vec3 iridHighlight = iridescentColor * (specBroad * 0.55 + fresnel * 0.65);

          vec3 finalColor = baseCore + iridHighlight + chromaticRim * 0.45 + wetSheen;

          // Soft pulse wave
          finalColor += mix(cJointBB9DEE, iridescentColor, 0.4) * pulse * 0.25;

          gl_FragColor = vec4(finalColor, 0.98);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });

    /* ─── Load Custom Spine GLB Model (/models/spinenw-opt.glb) ─── */
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(
      '/models/spinenw-opt.glb',
      (gltf) => {
        const model = gltf.scene;
        const bbox = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        bbox.getSize(size);
        bbox.getCenter(center);

        const targetHeight = 36.0;
        const scaleFactor = size.y > 0 ? targetHeight / size.y : 1.0;
        model.scale.setScalar(scaleFactor);

        model.position.x = -center.x * scaleFactor;
        model.position.z = -center.z * scaleFactor;
        model.position.y = 5.0 - (bbox.max.y * scaleFactor);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            // Glossy shader material disabled for now (can be re-enabled later)
            // mesh.material = vertebraMaterial;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Enhance standard material responsiveness to multi-color lighting angles
            if (mesh.material) {
              const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              mats.forEach((mat) => {
                mat.side = THREE.DoubleSide;
                if ('roughness' in mat) {
                  const stdMat = mat as THREE.MeshStandardMaterial;
                  if (stdMat.roughness !== undefined) {
                    stdMat.roughness = Math.min(stdMat.roughness, 0.38);
                  }
                  if (stdMat.metalness !== undefined) {
                    stdMat.metalness = Math.max(stdMat.metalness, 0.22);
                  }
                }
              });
            }
          }
        });

        spineMasterGroup.add(model);
      },
      undefined,
      (err) => {
        console.warn('Custom spine.glb load error:', err);
      }
    );

    /* ─── Generate Dense Volumetric Floral / Nebula Particle Clusters (Sticky to Spine) ─── */
    const TOTAL_PARTICLES = 95000;
    const NUM_COLONIES = 14;

    /* ─── Volumetric Sticky Particle Cluster Colonies (Toggled by enableParticles) ─── */
    let clusterGeometry: THREE.BufferGeometry | null = null;
    let clusterMaterial: THREE.ShaderMaterial | null = null;
    let clusterPoints: THREE.Points | null = null;

    if (enableParticles) {
      // Define multi-lobed coral/nebula colony nodes along the vertebrae
      interface ColonyDef {
        center: THREE.Vector3;
        lobes: { offset: THREE.Vector3; radius: number }[];
        baseColor: THREE.Vector3;
        altColor: THREE.Vector3;
        sparkColor: THREE.Vector3;
        particleCount: number;
      }

      const colonies: ColonyDef[] = [];
      const particlesPerColony = Math.floor(TOTAL_PARTICLES / NUM_COLONIES);

      // Base Obsidian & Deep Violet Material Constants matching the spine core
      const cObsidianCore = new THREE.Vector3(0.018, 0.015, 0.032); // Dark liquid obsidian
      const cDeepViolet   = new THREE.Vector3(0.12, 0.05, 0.22);    // Deep violet tone
      const cLavenderCore = new THREE.Vector3(0.24, 0.15, 0.38);    // Lavender crevice tone

      const colonyPalettes = [
        { base: cObsidianCore, alt: cDeepViolet,    spark: cObsidianCore },
        { base: cDeepViolet,   alt: cObsidianCore,  spark: cLavenderCore },
        { base: cObsidianCore, alt: cLavenderCore,  spark: cDeepViolet },
        { base: cDeepViolet,   alt: cLavenderCore,  spark: cObsidianCore },
      ];

      for (let k = 0; k < NUM_COLONIES; k++) {
        // Stagger colonies down the spine height
        const t = k / (NUM_COLONIES - 1);
        const y = 5.5 - t * 36.0 + (Math.sin(k * 2.7) * 1.2);

        // Organic spiral distribution hugging vertebrae with expansive radial reach
        const angle = k * 1.45 + Math.sin(k * 2.3) * 0.7;
        const distFromSpine = 1.4 + Math.abs(Math.sin(k * 3.7)) * 2.4;

        const cx = Math.cos(angle) * distFromSpine;
        const cz = Math.sin(angle) * distFromSpine;
        const center = new THREE.Vector3(cx, y, cz);

        // Create 3 to 5 overlapping sub-lobes per colony for bumpy cauliflower/coral shape
        const lobeCount = 3 + (k % 3);
        const lobes: { offset: THREE.Vector3; radius: number }[] = [];

        // Central dominant lobe (large radius 2.2 to 3.8 units)
        lobes.push({
          offset: new THREE.Vector3(0, 0, 0),
          radius: 2.2 + (k % 3) * 0.6,
        });

        for (let l = 1; l < lobeCount; l++) {
          const lAngle = (l / lobeCount) * Math.PI * 2.0 + Math.sin(k * 1.7);
          const lDist = 1.2 + Math.random() * 1.4;
          const lRadius = 1.5 + Math.random() * 1.6;
          lobes.push({
            offset: new THREE.Vector3(
              Math.cos(lAngle) * lDist,
              (Math.random() - 0.5) * 1.8,
              Math.sin(lAngle) * lDist
            ),
            radius: lRadius,
          });
        }

        const palette = colonyPalettes[k % colonyPalettes.length];

        colonies.push({
          center,
          lobes,
          baseColor: palette.base,
          altColor: palette.alt,
          sparkColor: palette.spark,
          particleCount: particlesPerColony,
        });
      }

      // Allocate Particle Buffer Geometry
      const positions = new Float32Array(TOTAL_PARTICLES * 3);
      const colors = new Float32Array(TOTAL_PARTICLES * 3);
      const sizes = new Float32Array(TOTAL_PARTICLES);
      const phases = new Float32Array(TOTAL_PARTICLES);
      const clusterCenters = new Float32Array(TOTAL_PARTICLES * 3);
      const radialDists = new Float32Array(TOTAL_PARTICLES);

      let pIdx = 0;

      colonies.forEach((colony) => {
        for (let i = 0; i < colony.particleCount; i++) {
          const i3 = pIdx * 3;

          // Pick a random lobe in this colony
          const lobe = colony.lobes[Math.floor(Math.random() * colony.lobes.length)];
          const lobeCenter = colony.center.clone().add(lobe.offset);

          // Volumetric 3D Gaussian / power-law distribution inside the lobe
          const u = Math.random();
          const v = Math.random();
          const theta = u * 2.0 * Math.PI;
          const phi = Math.acos(2.0 * v - 1.0);

          // Power-law concentration: dense core + puffy fluffy halo
          const rNorm = Math.pow(Math.random(), 1.45);
          const r = rNorm * lobe.radius;

          const sinPhi = Math.sin(phi);
          const lx = r * sinPhi * Math.cos(theta);
          const ly = r * Math.cos(phi) * 0.9;
          const lz = r * sinPhi * Math.sin(theta);

          // Organic micro-clustering noise
          const jitterX = (Math.sin(i * 14.17 + lobeCenter.y) - 0.5) * 0.35;
          const jitterY = (Math.cos(i * 29.31 + lobeCenter.x) - 0.5) * 0.35;
          const jitterZ = (Math.sin(i * 67.89 + lobeCenter.z) - 0.5) * 0.35;

          positions[i3] = lobeCenter.x + lx + jitterX;
          positions[i3 + 1] = lobeCenter.y + ly + jitterY;
          positions[i3 + 2] = lobeCenter.z + lz + jitterZ;

          clusterCenters[i3] = colony.center.x;
          clusterCenters[i3 + 1] = colony.center.y;
          clusterCenters[i3 + 2] = colony.center.z;

          radialDists[pIdx] = rNorm;

          // Color blending: core has rich saturated base, outer blends alt & luminous sparks
          const colorMix = Math.random();
          const pColor = new THREE.Vector3();
          if (colorMix < 0.55) {
            pColor.lerpVectors(colony.baseColor, colony.altColor, rNorm * 0.75 + Math.random() * 0.25);
          } else if (colorMix < 0.85) {
            pColor.lerpVectors(colony.altColor, colony.baseColor, Math.random() * 0.45);
          } else {
            pColor.lerpVectors(colony.sparkColor, colony.baseColor, 0.35);
          }

          // Chromatic micro-variance per particle bead
          const tintVar = (Math.random() - 0.5) * 0.1;
          colors[i3] = Math.min(1.0, Math.max(0.0, pColor.x + tintVar));
          colors[i3 + 1] = Math.min(1.0, Math.max(0.0, pColor.y + tintVar));
          colors[i3 + 2] = Math.min(1.0, Math.max(0.0, pColor.z + tintVar));

          // Fine coral/moss grain sizing
          const sizeSeed = Math.random();
          if (sizeSeed > 0.95) {
            sizes[pIdx] = 70.0 + Math.random() * 40.0;
          } else if (sizeSeed > 0.6) {
            sizes[pIdx] = 40.0 + Math.random() * 30.0;
          } else {
            sizes[pIdx] = 18.0 + Math.random() * 20.0;
          }

          phases[pIdx] = Math.random();
          pIdx++;
        }
      });

      clusterGeometry = new THREE.BufferGeometry();
      clusterGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      clusterGeometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
      clusterGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
      clusterGeometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
      clusterGeometry.setAttribute('aClusterCenter', new THREE.BufferAttribute(clusterCenters, 3));
      clusterGeometry.setAttribute('aRadialDist', new THREE.BufferAttribute(radialDists, 1));

      clusterMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0.0 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
          uMouseWorld: { value: new THREE.Vector3(999, 999, 0) },
          uMouseActive: { value: 0.0 },
          uPulseEnergy: { value: 0.0 },
        },
        vertexShader: clusterParticleVertexShader,
        fragmentShader: clusterParticleFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });

      clusterPoints = new THREE.Points(clusterGeometry, clusterMaterial);
      clusterPoints.frustumCulled = false;

      // Rigidly attach the cluster point cloud to the master spine group
      spineMasterGroup.add(clusterPoints);
    }

    /* ─── Pointer Tracking (for local cluster repulsion in 3D) ─── */
    const pointerWorld = new THREE.Vector3(999, 999, 0);
    let lastPointerMoveAt = -Infinity;
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const onPointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(ndc, camera);
      raycaster.ray.intersectPlane(plane, pointerWorld);
      lastPointerMoveAt = performance.now();
    };
    window.addEventListener('mousemove', onPointerMove, { passive: true });

    /* ─── Pulse state ─── */
    let pulseEnergy = 0.0;
    let pulsePos = 0.0;

    /* ─── Resize Handler ─── */
    const canvasEl = canvas;
    function onResize() {
      const w = canvasEl.clientWidth;
      const h = canvasEl.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      if (clusterMaterial) {
        clusterMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
      }
    }
    window.addEventListener('resize', onResize);

    /* ─── Scroll Velocity Tracker ─── */
    let lastScrollY = window.scrollY;
    let targetVelocity = 0.0;
    let currentVelocity = 0.0;

    const onScrollVel = () => {
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      targetVelocity = Math.max(-15.0, Math.min(15.0, delta * 0.06));
    };
    window.addEventListener('scroll', onScrollVel, { passive: true });

    /* ─── Animation Loop ─── */
    const clock = new THREE.Clock();
    let rafId = 0;

    function animate() {
      rafId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Velocity decay
      currentVelocity += (targetVelocity - currentVelocity) * 0.12;
      targetVelocity *= 0.88;

      const slantedAngle = -0.06;

      /* Idle pulse every ~4.5 s */
      if (Math.floor(time) % 5 === 0 && Math.floor(time) !== Math.floor(time - 0.016)) {
        pulseEnergy = 1.0;
        pulsePos = Math.sin(time) * 3.0;
      }
      pulseEnergy *= 0.97;

      /* Update Vertebra Shader Uniforms */
      vertebraMaterial.uniforms.uTime.value = time;
      vertebraMaterial.uniforms.uPulsePos.value = pulsePos;
      vertebraMaterial.uniforms.uPulseEnergy.value = pulseEnergy;
      vertebraMaterial.uniforms.uSlantedAngle.value = slantedAngle;
      vertebraMaterial.uniforms.uScrollVelocity.value = currentVelocity;

      /* Update Cluster Particle Uniforms (if enabled) */
      if (enableParticles && clusterMaterial) {
        clusterMaterial.uniforms.uTime.value = time;
        clusterMaterial.uniforms.uMouseWorld.value.copy(pointerWorld);
        clusterMaterial.uniforms.uMouseActive.value =
          performance.now() - lastPointerMoveAt < 500 ? 1.0 : 0.0;
        clusterMaterial.uniforms.uPulseEnergy.value = pulseEnergy;
      }

      /* Animate dynamic multi-shade purple lights around camera & spine */
      const cy = camera.position.y;
      pastelLavenderPoint.position.set(
        Math.cos(time * 0.65) * 6.5 - 2.0,
        cy + Math.sin(time * 0.45) * 2.5 + 2.0,
        Math.sin(time * 0.65) * 4.5 + 4.5
      );
      signatureLavenderPoint.position.set(
        Math.cos(time * 0.55 + 2.4) * 6.5 + 2.5,
        cy + Math.cos(time * 0.4 + 1.2) * 2.5 - 1.5,
        Math.sin(time * 0.55 + 2.4) * 4.5 + 3.5
      );
      electricPurplePoint.position.set(
        Math.sin(time * 0.7 + 4.0) * 5.5 - 1.0,
        cy - 3.5 + Math.sin(time * 0.5 + 2.0) * 1.5,
        5.0
      );
      deepAmethystPoint.position.set(
        Math.sin(time * 0.5 + 1.0) * 5.0 + 1.5,
        cy + 3.5 + Math.cos(time * 0.45) * 1.8,
        4.0
      );

      /* Scroll-synced Spine & Sticky Cluster Kinematics (Multi-Layer Parallax Gearing) */
      const currentProgress = activeProgressRef.current ?? 0;

      // Differentiated parallax rotation: spine rotates with a distinct, stately velocity relative to cards
      const targetSpineRotY = currentProgress * 2.2 + time * 0.08;
      const targetSpineRotX = Math.sin(currentProgress * 1.8) * 0.06;
      const targetSpineRotZ = Math.cos(currentProgress * 1.5) * 0.04;

      spineMasterGroup.rotation.y += (targetSpineRotY - spineMasterGroup.rotation.y) * 0.12;
      spineMasterGroup.rotation.x += (targetSpineRotX - spineMasterGroup.rotation.x) * 0.10;
      spineMasterGroup.rotation.z += (targetSpineRotZ - spineMasterGroup.rotation.z) * 0.10;

      const targetY = -(currentProgress * 4.8);
      camera.position.x = Math.sin(time * 0.15) * 0.35;
      camera.position.y += (targetY + Math.cos(time * 0.1) * 0.25 - camera.position.y) * 0.16;
      camera.lookAt(0, camera.position.y, 0);

      composer.render();
    }

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScrollVel);
      window.removeEventListener('mousemove', onPointerMove);
      bloomPass.dispose();
      outputPass.dispose();
      composer.dispose();
      renderer.dispose();
      vertebraMaterial.dispose();
      if (clusterGeometry) clusterGeometry.dispose();
      if (clusterMaterial) clusterMaterial.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
}
