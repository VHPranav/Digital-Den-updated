'use client';

import React, { useEffect, useRef } from 'react';

// Fluted-glass light field: a randomly wandering violet light drifts behind vertical
// glass flutes that refract and streak them. Raw WebGL, one full-screen quad.

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uIntro;
uniform float uDpr;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    a *= 0.5;
  }
  return v;
}

// Random, organic light: a domain-warped noise field (stretched vertically so it
// reads as a curtain) plus one hotspot that wanders along a noise path.
vec3 field(vec2 uv, float t, float aspect) {
  vec2 p = vec2(uv.x * aspect * 1.6, uv.y * 0.55);

  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.18)), fbm(p + vec2(5.2, 1.3) - t * 0.15));
  float n = fbm(p * 1.3 + 2.6 * q + vec2(t * 0.10, -t * 0.07));

  vec2 c = vec2(0.08 + 0.84 * noise(vec2(t * 0.16, 3.7)), 0.2 + 0.6 * noise(vec2(8.1, t * 0.12)));
  vec2 d = (uv - c) * vec2(aspect * 1.9, 0.95);
  float hot = exp(-dot(d, d));

  float intensity = pow(smoothstep(0.32, 0.88, n), 1.7) * 1.7 + hot * 2.1;
  intensity *= 0.5 + 0.6 * noise(vec2(t * 0.22, 1.0)); // whole field breathes

  // Hue drifts independently: indigo → violet → orchid, highlights go lavender.
  float h = fbm(p * 0.7 + vec2(-t * 0.09, t * 0.05));
  vec3 indigo = vec3(0.16, 0.12, 0.95);
  vec3 violet = vec3(0.58, 0.20, 1.00);
  vec3 orchid = vec3(1.00, 0.30, 0.85);
  vec3 hue = mix(indigo, violet, smoothstep(0.3, 0.5, h));
  hue = mix(hue, orchid, smoothstep(0.52, 0.72, h));
  hue = mix(hue, vec3(0.85, 0.35, 1.0), hot * 0.35); // hotspot runs a touch hotter
  vec3 col = hue * intensity;
  return col + vec3(0.006, 0.004, 0.014);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float t = uTime;
  float aspect = uRes.x / uRes.y;

  // Flutes: fixed-width vertical columns, ~38 CSS px each.
  float flutes = uRes.x / (38.0 * uDpr);
  float id = floor(uv.x * flutes);
  float cell = fract(uv.x * flutes);
  float centered = cell - 0.5;
  float rnd = hash(vec2(id, 7.0));

  // Each flute refracts the field sideways and nudges it vertically, slightly
  // differently per flute; RGB split gives the coloured fringes.
  float bend = centered * 5.4 / flutes;
  vec2 suv = vec2(uv.x + bend, uv.y + (rnd - 0.5) * 0.05);
  float disp = centered * 0.018;
  vec3 col;
  col.r = field(suv + vec2(disp, 0.0), t, aspect).r;
  col.g = field(suv, t, aspect).g;
  col.b = field(suv - vec2(disp, 0.0), t, aspect).b;

  // Glass shading: darker flute bodies, bright specular edges, per-flute variance.
  float shade = 0.62 + 0.38 * cos(centered * 3.14159);
  col *= shade * (0.85 + 0.3 * rnd);
  float edge = smoothstep(0.43, 0.5, abs(centered));
  col += edge * (0.05 + 0.35 * col);

  // Tonemap on luminance so bright areas stay saturated violet, not white.
  float lum = max(dot(col, vec3(0.3, 0.5, 0.2)), 1e-4);
  col *= (1.0 - exp(-lum * 1.6)) / lum * 0.95;
  col = min(col, vec3(1.0));

  // Intro: fade up from black.
  col *= uIntro;

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function FlutedShader({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uIntro = gl.getUniformLocation(prog, 'uIntro');
    const uDpr = gl.getUniformLocation(prog, 'uDpr');
    let dpr = 1;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);

    const start = performance.now();
    let frame = 0;
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (!visible) return;
      const t = (now - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduced ? 4 : t + 4);
      gl.uniform1f(uIntro, Math.min(t / 1.4, 1));
      gl.uniform1f(uDpr, dpr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      // Free GPU objects but keep the context: React may re-run this effect on the same canvas.
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, []);

  return <canvas ref={ref} className={`block h-full w-full ${className}`} aria-hidden="true" />;
}
