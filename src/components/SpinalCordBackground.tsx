'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GPUComputationRenderer, type Variable } from 'three/examples/jsm/misc/GPUComputationRenderer.js';

interface SpinalCordBackgroundProps {
  progress?: number;
  progressRef?: React.RefObject<number> | { current: number };
}

/* ─── Same GPGPU curl-noise particle field as the Hero's ParticleField, ───
   ─── re-pointed to fall in from the top instead of rise from the bottom ─── */
const SIM_SIZE = 96;
const PARTICLE_COUNT = SIM_SIZE * SIM_SIZE;
const TOP_Y = 11.0;
const BOTTOM_Y = -34.0;
// Depth layer the particles fall through: in front of the spine model (z ≈ 0)
// but well short of the camera (z = 20), reading as a layer between the spine
// and the card content in front of it.
const FRONT_Z_MIN = 6.0;
const FRONT_Z_MAX = 11.0;

const spineSimulationShader = /* glsl */ `
uniform float uTime;
uniform vec3 uMouse;
uniform float uMouseActive;
uniform float uViewportHalfWidth;

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
  float age = data.w;

  float seed = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);

  bool respawn = age < 0.0 || age >= 1.0;

  if (respawn) {
    // A fraction of respawns seek the cursor, same trail-on-hover behavior as the Hero field
    float mouseRoll = fract(sin(dot(uv, vec2(71.34, 22.17)) + uTime * 0.11) * 5432.1);
    bool spawnAtMouse = uMouseActive > 0.5 && mouseRoll < 0.3;

    if (spawnAtMouse) {
      vec2 jitter = vec2(
        fract(sin(dot(uv, vec2(9.1, 3.7)) + uTime * 0.2) * 1000.0) - 0.5,
        fract(sin(dot(uv, vec2(4.3, 8.9)) + uTime * 0.2) * 1000.0) - 0.5
      ) * 0.5;
      pos = uMouse + vec3(jitter.x, 1.5, jitter.y + ${((FRONT_Z_MIN + FRONT_Z_MAX) / 2).toFixed(1)});
    } else {
      // Spawn spread across the full viewport width, right at the top of the spine column,
      // in the depth layer between the spine and the cards
      float rowX = (fract(sin(dot(uv, vec2(51.23, 17.91)) + uTime * 0.05) * 10000.0) - 0.5) * 2.0 * uViewportHalfWidth;
      float rowZ = ${FRONT_Z_MIN.toFixed(1)} + fract(sin(dot(uv, vec2(33.71, 91.13)) + uTime * 0.05) * 10000.0) * ${(FRONT_Z_MAX - FRONT_Z_MIN).toFixed(1)};
      pos = vec3(rowX, ${TOP_Y.toFixed(1)} + seed * 4.0, rowZ);
    }
    age = 0.0;
  } else {
    // Falling instead of the Hero field's rising buoyancy
    vec3 fall = vec3(0.0, -0.009, 0.0);
    vec3 turbulence = curlNoise(pos * 0.4 + uTime * 0.06) * 0.006;

    // Gentle horizontal pull back toward the spine's central axis (X only —
    // leaves the particle's depth layer between the spine and cards untouched)
    vec3 toAxis = vec3(-pos.x, 0.0, 0.0);
    vec3 attraction = toAxis * 0.0012;

    vec3 mouseDiff = pos - uMouse;
    float dist = length(mouseDiff);
    vec3 mouseForce = vec3(0.0);
    if (dist < 1.6) {
      mouseForce = normalize(mouseDiff + 0.0001) * (1.0 - dist / 1.6) * 0.03;
    }

    pos += fall + turbulence + attraction + mouseForce;
    age += 0.0018 + fract(sin(uv.x + uv.y) * 43758.5) * 0.0012;

    // Force an early respawn once particles fall past the bottom of the column
    if (pos.y < ${BOTTOM_Y.toFixed(1)}) {
      age = 1.0;
    }
  }

  gl_FragColor = vec4(pos, age);
}
`;

const spineParticleVertexShader = /* glsl */ `
uniform sampler2D uPosTexture;
uniform float uPixelRatio;
attribute vec2 aSimUv;
varying vec3 vColor;
varying float vLife;

void main() {
  vec4 data = texture2D(uPosTexture, aSimUv);
  vec3 pos = data.xyz;
  float age = data.w;

  float revealed = step(0.0, age);
  float fadeIn = smoothstep(0.0, 0.12, age);
  float fadeOut = smoothstep(1.0, 0.85, age);
  vLife = revealed * fadeIn * fadeOut;

  // Same brand gradient as the Hero field: gold, through violet, to turquoise —
  // remapped so turquoise sits at the top (freshly spawned) and gold at the bottom
  vec3 gold = vec3(1.0, 0.72, 0.35);
  vec3 violet = vec3(0.63, 0.45, 0.98);
  vec3 turquoise = vec3(0.1, 0.85, 0.78);

  float t = smoothstep(${BOTTOM_Y.toFixed(1)}, ${TOP_Y.toFixed(1)}, pos.y);
  vec3 col = mix(gold, violet, t);
  col = mix(col, turquoise, smoothstep(-10.0, ${TOP_Y.toFixed(1)}, pos.y));
  vColor = col;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float depth = max(-mvPosition.z, 0.1);
  float sizeHash = fract(sin(dot(aSimUv, vec2(12.9, 78.2))) * 43758.5);
  float baseSize = mix(3.0, 30.0, pow(sizeHash, 3.5));
  gl_PointSize = (baseSize * uPixelRatio * vLife) / depth;
}
`;

const spineParticleFragmentShader = /* glsl */ `
varying vec3 vColor;
varying float vLife;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;

  float z = sqrt(max(0.0, 0.25 - dist * dist)) * 2.0;
  float fresnel = pow(1.0 - z, 2.5);

  vec2 lightDir = normalize(vec2(0.3, 0.5));
  float specular = pow(max(0.0, dot(normalize(coord + 0.0001), lightDir)), 8.0) * z;

  float alpha = (fresnel * 0.85 + specular * 1.5 + 0.1) * vLife;
  vec3 finalColor = vColor * (1.2 + fresnel * 2.0 + specular * 3.0);

  gl_FragColor = vec4(finalColor, alpha);
}
`;

export default function SpinalCordBackground({ progress = 0, progressRef }: SpinalCordBackgroundProps) {
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
    camera.position.set(0, 0, 20);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    /* ─── Lighting (Matching Hero & Emblem Studio Setup) ─── */
    scene.add(new THREE.AmbientLight(0x070a0f, 1.4));

    const whiteKey = new THREE.DirectionalLight(0xffffff, 2.8);
    whiteKey.position.set(5, 10, 8);
    scene.add(whiteKey);

    // Luminous Turquoise / Cyan Rim Light
    const cyanRim = new THREE.PointLight(0x00f5d4, 3.8, 30);
    cyanRim.position.set(-4, 2, 4);
    scene.add(cyanRim);

    // Electric Violet / Lavender Accent Light
    const violetFill = new THREE.PointLight(0xc084fc, 3.2, 26);
    violetFill.position.set(4, -3, -2);
    scene.add(violetFill);

    // Warm Gold Ember Highlight
    const goldFill = new THREE.PointLight(0xffb859, 2.2, 20);
    goldFill.position.set(0, -6, 5);
    scene.add(goldFill);

    /* ─── Cyber Chromatic Glass & Refractive Titanium Vertebra Shader ─── */
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

          // Active Theory Shearing along X-axis and scroll velocity
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

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          float NdotV = max(0.0, dot(normal, viewDir));
          float fresnel = pow(1.0 - NdotV, 2.8);

          vec3 lightDir = normalize(vec3(0.4, 0.8, 0.6));
          vec3 halfVec = normalize(lightDir + viewDir);
          float spec = pow(max(0.0, dot(normal, halfVec)), 50.0);

          float pulse = exp(-abs(vWorldPosition.y - uPulsePos) * 0.4) * uPulseEnergy;

          // Theme: Obsidian Core + Turquoise Cyan to Electric Violet Chromatic Fresnel + Gold Spark
          vec3 cDarkTitanium = vec3(0.025, 0.032, 0.048);
          vec3 cTurquoiseCyan = vec3(0.00, 0.95, 0.82);
          vec3 cElectricViolet = vec3(0.72, 0.45, 0.98);
          vec3 cGoldSpark = vec3(1.00, 0.78, 0.38);

          vec3 rimColor = mix(cTurquoiseCyan, cElectricViolet, fresnel);
          vec3 pulseColor = mix(cTurquoiseCyan, cGoldSpark, pulse);

          vec3 core = mix(cDarkTitanium, pulseColor * 0.25, pulse * 0.6);
          vec3 edgeGlow = rimColor * fresnel * 2.2;
          vec3 whiteSpec = vec3(0.98, 1.0, 1.0) * (spec * 3.2 + pow(fresnel, 4.5) * 3.8);

          gl_FragColor = vec4(core + edgeGlow + whiteSpec, 0.96);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });

    /* ─── Load Custom Straight Spine GLB Model (/models/spinestaright-optimized.glb) ─── */
    let glbSpineGroup: THREE.Group | null = null;
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(
      '/models/spinestaright-optimized.glb',
      (gltf) => {
        const model = gltf.scene;
        // Compute bounding box to normalize & center height
        const bbox = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        bbox.getSize(size);
        bbox.getCenter(center);

        // Normalize model to span across the spine column height (~36 units)
        const targetHeight = 36.0;
        const scaleFactor = size.y > 0 ? targetHeight / size.y : 1.0;
        model.scale.setScalar(scaleFactor);

        // Center X and Z, align top Y
        model.position.x = -center.x * scaleFactor;
        model.position.z = -center.z * scaleFactor;
        model.position.y = 5.0 - (bbox.max.y * scaleFactor);

        // Apply our custom chromatic cyber glass & titanium shader
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = vertebraMaterial;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });

        glbSpineGroup = model;
        scene.add(model);
      },
      undefined,
      (err) => {
        console.warn('Custom spine.glb load error:', err);
      }
    );

    /* ─── GPGPU Falling Particle Field (same simulation technique as the Hero's ParticleField) ─── */
    const gpuComputation = new GPUComputationRenderer(SIM_SIZE, SIM_SIZE, renderer);
    const dtPosition = gpuComputation.createTexture();
    const posArray = dtPosition.image.data as Float32Array;
    for (let i = 0; i < posArray.length; i += 4) {
      posArray[i] = 0;
      posArray[i + 1] = TOP_Y;
      posArray[i + 2] = (FRONT_Z_MIN + FRONT_Z_MAX) / 2;
      // -1 = needs respawn: forces every particle through the respawn branch on the very
      // first compute pass, which is what actually scatters them across the viewport width
      // via the uv-based hash formulas. A random 0..1 age here was the bug — with identical
      // starting positions and no respawn trigger, every particle followed the exact same
      // deterministic physics and stayed clumped into what looked like a single invisible point.
      posArray[i + 3] = -1.0;
    }

    const positionVariable: Variable = gpuComputation.addVariable('texturePosition', spineSimulationShader, dtPosition);
    gpuComputation.setVariableDependencies(positionVariable, [positionVariable]);
    Object.assign(positionVariable.material.uniforms, {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(999, 999, 0) },
      uMouseActive: { value: 0 },
      uViewportHalfWidth: { value: 4.0 },
    });

    const gpuInitError = gpuComputation.init();
    if (gpuInitError) console.error(gpuInitError);

    const particleGeo = new THREE.BufferGeometry();
    const simUvs = new Float32Array(PARTICLE_COUNT * 2);
    let uvIdx = 0;
    for (let i = 0; i < SIM_SIZE; i++) {
      for (let j = 0; j < SIM_SIZE; j++) {
        simUvs[uvIdx * 2] = (i + 0.5) / SIM_SIZE;
        simUvs[uvIdx * 2 + 1] = (j + 0.5) / SIM_SIZE;
        uvIdx++;
      }
    }
    particleGeo.setAttribute('aSimUv', new THREE.BufferAttribute(simUvs, 2));
    particleGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3));

    const particleMat = new THREE.ShaderMaterial({
      uniforms: {
        uPosTexture: { value: null },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: spineParticleVertexShader,
      fragmentShader: spineParticleFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particlePoints = new THREE.Points(particleGeo, particleMat);
    particlePoints.frustumCulled = false;
    scene.add(particlePoints);

    /* ─── Pointer Tracking (drives the mouse-trail spawns, same as the Hero field) ─── */
    const particlePointerWorld = new THREE.Vector3(999, 999, 0);
    let particleLastPointerMoveAt = -Infinity;
    const particleRaycaster = new THREE.Raycaster();
    const particlePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -((FRONT_Z_MIN + FRONT_Z_MAX) / 2));

    const onParticlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      particleRaycaster.setFromCamera(ndc, camera);
      particleRaycaster.ray.intersectPlane(particlePlane, particlePointerWorld);
      particleLastPointerMoveAt = performance.now();
    };
    window.addEventListener('mousemove', onParticlePointerMove, { passive: true });

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
      particleMat.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
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

      // Smooth lerp velocity decay
      currentVelocity += (targetVelocity - currentVelocity) * 0.12;
      targetVelocity *= 0.88;

      /* Slanted angle constant matching opposite 6vw slope (~-0.06) */
      const slantedAngle = -0.06;

      /* Idle pulse every ~4 s */
      if (Math.floor(time) % 4 === 0 && Math.floor(time) !== Math.floor(time - 0.016)) {
        pulseEnergy = 1.2;
        pulsePos = Math.sin(time) * 3.0;
      }
      pulseEnergy *= 0.97;

      /* Update Shader Uniforms */
      vertebraMaterial.uniforms.uTime.value = time;
      vertebraMaterial.uniforms.uPulsePos.value = pulsePos;
      vertebraMaterial.uniforms.uPulseEnergy.value = pulseEnergy;
      vertebraMaterial.uniforms.uSlantedAngle.value = slantedAngle;
      vertebraMaterial.uniforms.uScrollVelocity.value = currentVelocity;

      /* GPGPU particle field: mouse trail, viewport-width spawn spread, then compute */
      const particleUniforms = positionVariable.material.uniforms;
      particleUniforms.uTime.value = time;
      (particleUniforms.uMouse.value as THREE.Vector3).copy(particlePointerWorld);
      particleUniforms.uMouseActive.value =
        performance.now() - particleLastPointerMoveAt < 500 ? 1 : 0;

      const camDist = camera.position.z - (FRONT_Z_MIN + FRONT_Z_MAX) / 2;
      const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camDist;
      particleUniforms.uViewportHalfWidth.value = halfHeight * camera.aspect;

      gpuComputation.compute();
      particleMat.uniforms.uPosTexture.value = gpuComputation.getCurrentRenderTarget(positionVariable).texture;

      /* Scroll-synced camera position down the spine */
      const currentProgress = activeProgressRef.current ?? 0;

      /* Spine kinematics (GLB Model) — rotation driven by scroll progress only, no idle auto-spin */
      if (glbSpineGroup) {
        glbSpineGroup.rotation.y = currentProgress * 6.0;
        glbSpineGroup.rotation.z = Math.sin(currentProgress * 4.0) * 0.03;
      }

      const targetY = -(currentProgress * 3.5);
      camera.position.x = Math.sin(time * 0.15) * 0.4;
      camera.position.y += (targetY + Math.cos(time * 0.1) * 0.25 - camera.position.y) * 0.16;
      camera.lookAt(0, camera.position.y, 0);

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScrollVel);
      window.removeEventListener('mousemove', onParticlePointerMove);
      renderer.dispose();
      vertebraMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      gpuComputation.dispose();
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
