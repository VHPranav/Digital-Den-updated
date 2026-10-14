'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';

export type PaperBurnHandle = {
  /**
   * Called every frame by the owning section.
   * `armed`: the user has scrolled into the burn (raw, unsmoothed) — takes the snapshot.
   * `progress`: smoothed 0→1 burn progress.
   * Returns true while the burnt "paper" fully covers the screen region (so the scene
   * underneath can be switched on).
   */
  update: (armed: boolean, progress: number) => boolean;
};

// Newspaper burn: the element matched by `sourceSelector` (a WebGL canvas + optional
// `[data-burn-text]` text) is snapshotted onto a 2D canvas, then burnt away by a shader.
// Currently unused. To wire it up: mark the source element (e.g. data-burn-source) and its
// text wrapper (data-burn-text), give the source's <Canvas> gl={{ preserveDrawingBuffer: true }}
// so its frame can be captured, render <PaperBurn ref sourceSelector className="fixed inset-0 z-40" />
// and call ref.update(armed, progress) every frame; show the scene below while it returns true.
// Holes ignite at several points, grow along noisy fronts and merge; each front has a
// scorch → char → ember band (logo blue/cyan/mint, no flames). Ash flakes and sparks peel
// off the passing front. Burnt pixels are transparent, revealing whatever sits below.

// Ignitions sit on a jittered 5×3 grid so many small burns cover the whole sheet.
const GRID_COLS = 5;
const GRID_ROWS = 3;
const IGNITIONS = GRID_COLS * GRID_ROWS;
const MAX_DELAY = 0.6; // ignitions are staggered randomly over this much burn time
const GROW = 1.6; // burn time per unit of distance: higher = each hole grows slower
// Burn "time" runs from T_START to T_END over progress 0→1; arrival times span ≈-0.2–1.3.
const T_START = -0.3;
const T_END = 1.4;
const PARTICLES = 2600;

const NOISE_GLSL = /* glsl */ `
  uniform vec3 uPts[${IGNITIONS}];
  uniform float uAspect;

  float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * vnoise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
    return v;
  }
  // Time at which the burn front reaches this point (aspect-corrected distance to the
  // nearest ignition + its delay), warped by noise into ragged, lobed fronts.
  float arrival(vec2 uv) {
    vec2 q = vec2(uv.x * uAspect, uv.y);
    float a = 1e3;
    for (int i = 0; i < ${IGNITIONS}; i++) {
      vec2 c = vec2(uPts[i].x * uAspect, uPts[i].y);
      a = min(a, uPts[i].z + length(q - c) * ${GROW.toFixed(2)});
    }
    a += (fbm(q * 3.0) - 0.5) * 0.35;
    a += (fbm(q * 14.0) - 0.5) * 0.08;
    a += (vnoise(q * 70.0) - 0.5) * 0.012;
    return a;
  }
`;

const PAPER_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const PAPER_FRAG = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uT;
  uniform float uTime;
  uniform float uFade;
  uniform float uReduced;
  varying vec2 vUv;
  ${NOISE_GLSL}

  void main() {
    vec3 paper = texture2D(uTex, vUv).rgb;
    if (uReduced > 0.5) { gl_FragColor = vec4(paper * uFade, uFade); return; }

    vec2 q = vec2(vUv.x * uAspect, vUv.y);
    float e = uT - arrival(vUv); // > 0: already burnt
    float fib = vnoise(q * 120.0);

    float hole = smoothstep(0.0, 0.004, e);
    float charB = smoothstep(-0.05, -0.006, e);
    float ashB = smoothstep(-0.05, -0.03, e) * (1.0 - smoothstep(-0.012, -0.002, e));
    float scorch = smoothstep(-0.17, -0.03, e);

    // Logo palette (sampled from the 3D emblem): royal blue, cyan, mint.
    const vec3 BLUE = vec3(0.29, 0.43, 0.85);  // #4a6dd9
    const vec3 CYAN = vec3(0.58, 0.87, 0.87);  // #93dedd
    const vec3 MINT = vec3(0.62, 0.9, 0.74);   // #9de6bd

    // Paper heating ahead of the front: cool blue scorch, then near-black char.
    vec3 col = mix(paper, paper * vec3(0.45, 0.52, 0.72), scorch * 0.85);
    col += BLUE * 0.18 * smoothstep(-0.06, -0.012, e) * (1.0 - charB * 0.6);
    col = mix(col, vec3(0.02, 0.03, 0.05) * (0.6 + 0.8 * fib), charB);
    // Blue-grey ash ring (curled, burnt paper) — visible even where the paper is black.
    col = mix(col, vec3(0.15, 0.19, 0.25) * (0.55 + 0.9 * fib), ashB * 0.8);

    // Ember thread on the front (white-hot core → cyan → blue), flickering; soft blue halo
    // with a faint mint tinge.
    float flick = 0.8 + 0.2 * vnoise(q * 18.0 + vec2(uTime * 1.2, -uTime * 0.9));
    float core = exp(-abs(e + 0.002) / 0.0028);
    float halo = exp(-abs(e) / 0.014) * 0.24;
    // Glow uses saturated versions of the logo hues so they read as colour, not white.
    vec3 blueHot = vec3(0.18, 0.38, 1.0);
    vec3 cyanHot = vec3(0.25, 0.88, 0.98);
    vec3 ember = mix(blueHot, cyanHot, smoothstep(0.25, 0.7, core));
    ember = mix(ember, vec3(0.9, 1.0, 1.0), smoothstep(0.85, 1.0, core));
    vec3 haloCol = mix(blueHot, MINT, 0.3 * vnoise(q * 6.0));
    vec3 glow = ember * core * flick * 1.25 + haloCol * halo * flick;

    // Soft shadow just inside each hole so the paper reads as a layer above the scene.
    float shadow = hole * (1.0 - smoothstep(0.0, 0.06, e)) * 0.55;
    float paperA = 1.0 - hole;
    float alpha = paperA + shadow * (1.0 - paperA);

    gl_FragColor = vec4((col * paperA + glow) * uFade, alpha * uFade);
  }
`;

const ASH_VERT = /* glsl */ `
  attribute vec3 aSeed;
  uniform float uT;
  uniform float uTime;
  uniform float uDpr;
  varying float vAlpha;
  varying float vKind;
  varying float vTint;
  ${NOISE_GLSL}

  void main() {
    float life = 0.16 + 0.16 * fract(aSeed.z * 7.0);
    float age = uT - arrival(aSeed.xy);
    if (age < 0.0 || age > life) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
    float k = age / life;
    vKind = step(0.55, aSeed.z); // 1 = glowing spark, 0 = dark ash flake
    vTint = fract(aSeed.z * 29.0);
    vec2 drift = vec2(sin(aSeed.z * 40.0 + k * 6.0 + uTime) * 0.012 / uAspect, k * (0.1 + 0.12 * vKind));
    vec2 pos = aSeed.xy + drift;
    vAlpha = sin(k * 3.14159);
    gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
    gl_PointSize = (vKind > 0.5 ? 1.5 + 2.5 * fract(aSeed.z * 13.0) : 2.5 + 4.0 * fract(aSeed.z * 17.0)) * uDpr * (1.0 - 0.4 * k);
  }
`;

const ASH_FRAG = /* glsl */ `
  varying float vAlpha;
  varying float vKind;
  varying float vTint;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float m = smoothstep(0.5, 0.15, d) * vAlpha;
    if (vKind > 0.5) {
      // Sparks in the logo palette (blue → cyan → mint), mostly additive (low alpha, bright colour).
      vec3 c = vTint < 0.5
        ? mix(vec3(0.36, 0.53, 1.0), vec3(0.58, 0.9, 0.92), vTint * 2.0)
        : mix(vec3(0.58, 0.9, 0.92), vec3(0.62, 0.92, 0.74), vTint * 2.0 - 1.0);
      c *= 1.8;
      gl_FragColor = vec4(c * m, m * 0.25);
    } else {
      gl_FragColor = vec4(vec3(0.03, 0.02, 0.04) * m, m * 0.85);
    }
  }
`;

// Ignition layout (uv, y up; z = ignition delay): grid cell centres with random jitter
// and a random firing order, regenerated each time the burn starts.
function ignitionLayout(): [number, number, number][] {
  const pts: [number, number, number][] = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let col = 0; col < GRID_COLS; col++) {
      pts.push([
        (col + 0.5 + (Math.random() - 0.5) * 0.6) / GRID_COLS,
        (r + 0.5 + (Math.random() - 0.5) * 0.6) / GRID_ROWS,
        Math.random() * MAX_DELAY,
      ]);
    }
  }
  return pts;
}

const PaperBurn = forwardRef<PaperBurnHandle, { sourceSelector: string; className?: string }>(function PaperBurn(
  { sourceSelector, className = '' },
  ref
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const engine = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.Camera;
    uniforms: Record<string, THREE.IUniform>;
    snap: HTMLCanvasElement;
    texture: THREE.CanvasTexture;
    clock: THREE.Clock;
    reduced: boolean;
  } | null>(null);
  const state = useRef({ captured: false, visible: false });

  useEffect(() => {
    // Mounted directly on <body>: inside the page, 3D-transformed elements (e.g. the
    // carousel's translateZ cards) can composite above this layer despite its z-index.
    const root = document.createElement('div');
    root.setAttribute('aria-hidden', 'true');
    root.className = `pointer-events-none ${className}`;
    root.style.visibility = 'hidden';
    document.body.appendChild(root);
    rootRef.current = root;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' });
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // texture is raw sRGB pixels: pass through untouched
    renderer.setClearColor(0x000000, 0);
    const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1 : 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    root.appendChild(renderer.domElement);

    const snap = document.createElement('canvas');
    const texture = new THREE.CanvasTexture(snap);
    texture.colorSpace = THREE.NoColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    const uniforms: Record<string, THREE.IUniform> = {
      uTex: { value: texture },
      uT: { value: T_START },
      uTime: { value: 0 },
      uFade: { value: 1 },
      uReduced: { value: 0 },
      uAspect: { value: window.innerWidth / window.innerHeight },
      uDpr: { value: dpr },
      uPts: { value: ignitionLayout().map(([x, y, z]) => new THREE.Vector3(x, y, z)) },
    };

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const paper = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({ uniforms, vertexShader: PAPER_VERT, fragmentShader: PAPER_FRAG, blending: THREE.NoBlending, depthTest: false, depthWrite: false })
    );
    paper.frustumCulled = false;
    scene.add(paper);

    const seeds = new Float32Array(PARTICLES * 3);
    for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
    const ashGeo = new THREE.BufferGeometry();
    ashGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PARTICLES * 3), 3));
    ashGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));
    const ash = new THREE.Points(
      ashGeo,
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: ASH_VERT,
        fragmentShader: ASH_FRAG,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        // Premultiplied "over": dark flakes darken, bright low-alpha sparks add light.
        blending: THREE.CustomBlending,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneMinusSrcAlphaFactor,
      })
    );
    ash.frustumCulled = false;
    scene.add(ash);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    uniforms.uReduced.value = reduced ? 1 : 0;
    renderer.compile(scene, camera); // avoid a shader-compile hitch on the first burnt frame

    engine.current = { renderer, scene, camera, uniforms, snap, texture, clock: new THREE.Clock(), reduced };

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uAspect.value = window.innerWidth / window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      engine.current = null;
      paper.geometry.dispose();
      (paper.material as THREE.Material).dispose();
      ashGeo.dispose();
      (ash.material as THREE.Material).dispose();
      texture.dispose();
      renderer.dispose();
      root.remove();
      rootRef.current = null;
    };
  }, [className]);

  // Draw the source (its WebGL canvas + any [data-burn-text] copy) into the snapshot canvas,
  // laid out as if the source fills the viewport (i.e. pinned).
  const capture = () => {
    const eng = engine.current;
    const src = document.querySelector<HTMLElement>(sourceSelector);
    if (!eng || !src) return false;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const dpr = eng.renderer.getPixelRatio();
    const { snap } = eng;
    snap.width = Math.round(W * dpr);
    snap.height = Math.round(H * dpr);
    const ctx = snap.getContext('2d');
    if (!ctx) return false;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    const rect = src.getBoundingClientRect();
    const gl = src.querySelector('canvas');
    if (gl) {
      const r = gl.getBoundingClientRect();
      ctx.drawImage(gl, r.left - rect.left, r.top - rect.top, r.width, r.height);
    }

    // Text: draw word by word at its laid-out position.
    src.querySelectorAll<HTMLElement>('[data-burn-text] p').forEach((el) => {
      const cs = getComputedStyle(el);
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      ctx.fillStyle = cs.color;
      ctx.textBaseline = 'alphabetic';
      if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
      const upper = cs.textTransform === 'uppercase';
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const range = document.createRange();
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const text = node.textContent ?? '';
        const re = /\S+/g;
        for (let m = re.exec(text); m; m = re.exec(text)) {
          range.setStart(node, m.index);
          range.setEnd(node, m.index + m[0].length);
          const box = range.getClientRects()[0];
          if (!box) continue;
          const word = upper ? m[0].toUpperCase() : m[0];
          const ascent = ctx.measureText(word).fontBoundingBoxAscent || parseFloat(cs.fontSize) * 0.8;
          ctx.fillText(word, box.left - rect.left, box.top - rect.top + ascent);
        }
      }
    });

    eng.texture.needsUpdate = true;
    // New random layout each time the burn starts.
    const layout = ignitionLayout();
    (eng.uniforms.uPts.value as THREE.Vector3[]).forEach((v, i) => v.set(...layout[i]));
    return true;
  };

  useImperativeHandle(ref, () => ({
    update(armed, progress) {
      const eng = engine.current;
      const root = rootRef.current;
      if (!eng || !root) return false;
      const s = state.current;
      const p = Math.max(0, Math.min(1, progress));

      // Back above the burn: forget the snapshot so the next run captures a fresh frame.
      if (!armed && p <= 0.002) {
        s.captured = false;
        if (s.visible) {
          root.style.visibility = 'hidden';
          s.visible = false;
        }
        return false;
      }
      if (!s.captured) s.captured = capture();

      const show = s.captured && p < 0.998;
      if (show !== s.visible) {
        root.style.visibility = show ? 'visible' : 'hidden';
        s.visible = show;
      }
      if (!show) return false;

      eng.uniforms.uT.value = T_START + (T_END - T_START) * p;
      eng.uniforms.uTime.value = eng.clock.getElapsedTime();
      // Safety fade over the last few percent so nothing lingers.
      eng.uniforms.uFade.value = eng.reduced ? 1 - p : 1 - Math.max(0, (p - 0.96) / 0.04);
      eng.renderer.render(eng.scene, eng.camera);
      return true;
    },
  }));

  return null;
});

export default PaperBurn;
