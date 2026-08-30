"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { GPUComputationRenderer, type Variable } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import type { ScrollState } from "@/hooks/useScrollTimeline";

const SIM_SIZE = 96;
const PARTICLE_COUNT = SIM_SIZE * SIM_SIZE;

// Fraction of scroll progress over which particles finish revealing / spreading out
const REVEAL_RANGE = 0.55;
const SPREAD_RANGE = 0.7;
const SPREAD_MIN = 1.0;
const SPREAD_MAX = 3.6;
// A handful of particles are already awake before any scrolling, so the idle
// frame isn't completely empty (matches the reference's sparse-but-present start)
const AMBIENT_REVEAL_FLOOR = 0.06;

// From 50% scroll, spawning fans out from one central column into multiple
// emitter points spread across the full viewport width (emitter count itself
// is a GLSL-side const in the shader below)
const EMITTER_SPREAD_START = 0.5;
const EMITTER_SPREAD_END = 0.65;

// Past this point the emblem is pinned (see PIN_AT in useScrollTimeline) and the
// field surges upward to visually submerge it instead of the emblem moving away
const SUBMERGE_START = 0.95;

// How long after the last pointer move the cursor still counts as "active"
// for spawning a trail of particles
const MOUSE_ACTIVE_TIMEOUT = 500;

const simulationShader = `
uniform float uTime;
uniform vec3 uMouse;
uniform vec3 uEmblemPos;
uniform float uReveal;
uniform float uSpread;
uniform float uEmitterSpread;
uniform float uViewportHalfWidth;
uniform float uSubmergeLevel;
uniform float uMouseActive;

const float EMITTER_COUNT = 7.0;

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

vec3 curlNoise(vec3 p) {
  const float e = 0.05;
  float n1 = snoise(vec3(p.x, p.y + e, p.z));
  float n2 = snoise(vec3(p.x, p.y - e, p.z));
  float n3 = snoise(vec3(p.x, p.y, p.z + e));
  float n4 = snoise(vec3(p.x, p.y, p.z - e));
  float n5 = snoise(vec3(p.x + e, p.y, p.z));
  float n6 = snoise(vec3(p.x - e, p.y, p.z));
  return normalize(vec3((n1 - n2) - (n3 - n4), (n3 - n4) - (n5 - n6), (n5 - n6) - (n1 - n2)));
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 data = texture2D(texturePosition, uv);
  vec3 pos = data.xyz;
  // age: -1 = dormant (never yet revealed), 0..1 = position through its current
  // life cycle. Once revealed, a particle loops forever (fade in, live, fade out,
  // respawn elsewhere, fade in again) instead of popping in once and stopping.
  float age = data.w;

  // Stable per-particle seed: decides both spawn placement and when (in scroll
  // progress) this particle is allowed to switch on, giving a staggered "growing"
  // reveal instead of the whole field fading in together.
  float seed = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);

  bool respawn = age < 0.0 || age >= 1.0;

  if (respawn) {
    if (age < 0.0 && seed > uReveal) {
      // Stay dormant until scroll progress raises uReveal past this particle's seed
      gl_FragColor = vec4(pos, -1.0);
      return;
    }

    // A fraction of respawns seek the cursor instead of the usual spawn point,
    // so hovering leaves a trail of particles that then live out the exact same
    // buoyancy/turbulence/attraction physics as everything else
    float mouseRoll = fract(sin(dot(uv, vec2(71.34, 22.17)) + uTime * 0.11) * 5432.1);
    bool spawnAtMouse = uMouseActive > 0.5 && mouseRoll < 0.35;

    if (spawnAtMouse) {
      vec2 jitter = vec2(
        fract(sin(dot(uv, vec2(9.1, 3.7)) + uTime * 0.2) * 1000.0) - 0.5,
        fract(sin(dot(uv, vec2(4.3, 8.9)) + uTime * 0.2) * 1000.0) - 0.5
      ) * 0.5;
      pos = uMouse + vec3(jitter, 0.0);
    } else {
      // Include uTime so each respawn lands somewhere new, not the exact same spot
      float angle = fract(sin(dot(uv, vec2(39.3468, 11.135)) + uTime * 0.07) * 24634.6345) * 6.28318;
      float radius = seed * uSpread;

      // Single central column (low scroll) ...
      float columnX = cos(angle) * radius;
      float columnZ = sin(angle) * radius * 0.8;

      // ... fanning out into multiple emitters spread across the viewport width
      float emitterIndex = floor(fract(seed * 91.23) * EMITTER_COUNT);
      float emitterX = mix(-uViewportHalfWidth, uViewportHalfWidth, (emitterIndex + 0.5) / EMITTER_COUNT);
      float jitterX = (fract(sin(dot(uv, vec2(51.23, 17.91)) + uTime * 0.03) * 10000.0) - 0.5)
        * (uViewportHalfWidth / EMITTER_COUNT) * 0.7;
      float rowX = emitterX + jitterX;
      float rowZ = sin(angle) * radius * 0.8;

      pos.x = mix(columnX, rowX, uEmitterSpread);
      pos.z = mix(columnZ, rowZ, uEmitterSpread);

      // Submersion: spawn ceiling rises from the low idle band up past the
      // emblem so the surge visually floods over it instead of it moving away
      float baseSpawnY = -2.4 + (fract(uv.y * 311.0 + uTime * 0.05) * 0.9 - 0.45);
      float submergeSpawnY = uEmblemPos.y + 1.4 + (fract(uv.y * 311.0 + uTime * 0.05) * 0.6);
      pos.y = mix(baseSpawnY, submergeSpawnY, uSubmergeLevel);
    }
    age = 0.0;
  } else {
    vec3 buoyancy = vec3(0.0, 0.006, 0.0) * mix(1.0, 3.0, uSubmergeLevel);
    vec3 turbulence = curlNoise(pos * 0.4 + uTime * 0.06) * 0.005;

    vec3 toEmblem = uEmblemPos - pos;
    vec3 attraction = normalize(toEmblem + 0.0001) * 0.0018;

    vec3 mouseDiff = pos - uMouse;
    float dist = length(mouseDiff);
    vec3 mouseForce = vec3(0.0);
    if (dist < 1.6) {
      mouseForce = normalize(mouseDiff + 0.0001) * (1.0 - dist / 1.6) * 0.03;
    }

    pos += buoyancy + turbulence + attraction + mouseForce;
    age += 0.0018 + fract(sin(uv.x + uv.y) * 43758.5) * 0.0012;

    // Buoyancy alone would let particles drift past the emblem and coast
    // indefinitely off the top of frame; force an early respawn once they
    // overshoot so the field stays where it's actually visible
    if (pos.y > uEmblemPos.y + 3.0) {
      age = 1.0;
    }
  }

  gl_FragColor = vec4(pos, age);
}
`;

const particleVertexShader = `
uniform sampler2D uPosTexture;
uniform float uPixelRatio;
uniform float uSubmergeLevel;
attribute vec2 aSimUv;
varying vec3 vColor;
varying float vLife;

void main() {
  vec4 data = texture2D(uPosTexture, aSimUv);
  vec3 pos = data.xyz;
  float age = data.w;

  // Smooth breathing envelope: fades in from birth, fades out before the next
  // respawn, so particles never pop discretely in or out. In the ending/submerge
  // zone, the fade-out is switched off so the field accumulates fully bright
  // instead of continuing to breathe.
  float revealed = step(0.0, age);
  float fadeIn = smoothstep(0.0, 0.12, age);
  float fadeOut = mix(smoothstep(1.0, 0.85, age), 1.0, uSubmergeLevel);
  vLife = revealed * fadeIn * fadeOut;

  // Brand-derived gradient: warm ember at the base, lavender through the
  // middle, turquoise as particles rise (echoes the emblem's rim lighting)
  vec3 gold = vec3(1.0, 0.72, 0.35);
  vec3 violet = vec3(0.63, 0.45, 0.98);
  vec3 turquoise = vec3(0.1, 0.85, 0.78);

  float t = smoothstep(-2.0, 1.0, pos.y);
  vec3 col = mix(gold, violet, t);
  col = mix(col, turquoise, smoothstep(0.5, 3.0, pos.y));
  vColor = col;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float depth = max(-mvPosition.z, 0.1);
  // Power-biased hash: most particles stay small dust, a few pop as bright flares
  float sizeHash = fract(sin(dot(aSimUv, vec2(12.9, 78.2))) * 43758.5);
  float baseSize = mix(3.0, 30.0, pow(sizeHash, 3.5)) * mix(1.0, 1.5, uSubmergeLevel);
  gl_PointSize = (baseSize * uPixelRatio * vLife) / depth;
}
`;

const particleFragmentShader = `
varying vec3 vColor;
varying float vLife;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;

  // Fake 3D sphere normal for a glassy, refractive bubble look
  float z = sqrt(max(0.0, 0.25 - dist * dist)) * 2.0;
  float fresnel = pow(1.0 - z, 2.5);

  vec2 lightDir = normalize(vec2(0.3, 0.5));
  float specular = pow(max(0.0, dot(normalize(coord + 0.0001), lightDir)), 8.0) * z;

  float alpha = (fresnel * 0.85 + specular * 1.5 + 0.1) * vLife;
  vec3 finalColor = vColor * (1.2 + fresnel * 2.0 + specular * 3.0);

  gl_FragColor = vec4(finalColor, alpha);
}
`;

type ParticleFieldProps = {
  scrollState: RefObject<ScrollState>;
  attractorPosition: RefObject<THREE.Vector3>;
};

/**
 * GPGPU curl-noise particle field: particles are simulated (not spawned/destroyed)
 * on the GPU, buoyed upward, pulled gently toward the emblem, and nudged by the
 * pointer. Scroll progress only ever adjusts uReveal/uSpread uniforms, which is
 * what turns a sparse idle field into a dense, expanding one.
 */
export function ParticleField({ scrollState, attractorPosition }: ParticleFieldProps) {
  const { gl, camera } = useThree();
  const pointerWorld = useRef(new THREE.Vector3(999, 999, 0));
  const lastPointerMoveAt = useRef(-Infinity);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const gpu = useMemo(() => {
    const computation = new GPUComputationRenderer(SIM_SIZE, SIM_SIZE, gl);
    const dtPosition = computation.createTexture();
    const posArray = dtPosition.image.data as Float32Array;

    for (let i = 0; i < posArray.length; i += 4) {
      posArray[i] = 0;
      posArray[i + 1] = -2.4;
      posArray[i + 2] = 0;
      posArray[i + 3] = -1.0; // dormant until scroll-driven uReveal wakes it
    }

    const positionVariable: Variable = computation.addVariable("texturePosition", simulationShader, dtPosition);
    computation.setVariableDependencies(positionVariable, [positionVariable]);

    Object.assign(positionVariable.material.uniforms, {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(999, 999, 0) },
      uEmblemPos: { value: new THREE.Vector3(0, 0, 0) },
      uReveal: { value: 0 },
      uSpread: { value: SPREAD_MIN },
      uEmitterSpread: { value: 0 },
      uViewportHalfWidth: { value: 4.0 },
      uSubmergeLevel: { value: 0 },
      uMouseActive: { value: 0 },
    });

    const error = computation.init();
    if (error) console.error(error);

    return { computation, positionVariable };
  }, [gl]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const simUvs = new Float32Array(PARTICLE_COUNT * 2);
    let idx = 0;
    for (let i = 0; i < SIM_SIZE; i++) {
      for (let j = 0; j < SIM_SIZE; j++) {
        simUvs[idx * 2] = (i + 0.5) / SIM_SIZE;
        simUvs[idx * 2 + 1] = (j + 0.5) / SIM_SIZE;
        idx++;
      }
    }
    geo.setAttribute("aSimUv", new THREE.BufferAttribute(simUvs, 2));
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3));
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uPosTexture: { value: null },
          uPixelRatio: { value: gl.getPixelRatio() },
          uSubmergeLevel: { value: 0 },
        },
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [gl]
  );

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const ndc = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      raycaster.ray.intersectPlane(plane, pointerWorld.current);
      lastPointerMoveAt.current = performance.now();
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [camera, raycaster, plane]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      gpu.computation.dispose();
    };
  }, [gpu, geometry, material]);

  useFrame((_state, delta) => {
    const uniforms = gpu.positionVariable.material.uniforms;
    uniforms.uTime.value += delta;
    (uniforms.uMouse.value as THREE.Vector3).copy(pointerWorld.current);
    uniforms.uMouseActive.value = performance.now() - lastPointerMoveAt.current < MOUSE_ACTIVE_TIMEOUT ? 1 : 0;
    if (attractorPosition.current) {
      (uniforms.uEmblemPos.value as THREE.Vector3).copy(attractorPosition.current);
    }

    const progress = scrollState.current?.progress ?? 0;
    const revealRamp = Math.min(progress / REVEAL_RANGE, 1);
    uniforms.uReveal.value = THREE.MathUtils.lerp(AMBIENT_REVEAL_FLOOR, 1, revealRamp);
    uniforms.uSpread.value = THREE.MathUtils.lerp(SPREAD_MIN, SPREAD_MAX, Math.min(progress / SPREAD_RANGE, 1));

    uniforms.uEmitterSpread.value = THREE.MathUtils.clamp(
      (progress - EMITTER_SPREAD_START) / (EMITTER_SPREAD_END - EMITTER_SPREAD_START),
      0,
      1
    );
    uniforms.uSubmergeLevel.value = THREE.MathUtils.clamp((progress - SUBMERGE_START) / (1 - SUBMERGE_START), 0, 1);
    material.uniforms.uSubmergeLevel.value = uniforms.uSubmergeLevel.value;

    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const distance = Math.abs(camera.position.z);
    const halfHeight = Math.tan(THREE.MathUtils.degToRad(perspectiveCamera.fov) / 2) * distance;
    uniforms.uViewportHalfWidth.value = halfHeight * perspectiveCamera.aspect;

    gpu.computation.compute();
    material.uniforms.uPosTexture.value = gpu.computation.getCurrentRenderTarget(gpu.positionVariable).texture;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
