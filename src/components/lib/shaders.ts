// src/components/lib/shaders.ts
// Custom GLSL Shaders for WebGL & Three.js Water Ripple & Wave Simulation

/**
 * Shared Vertex Shader for Fullscreen Quad Rendering
 */
export const baseVertexShader: string = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

/**
 * Wave Simulation Fragment Shader
 * Implements a 2D heightmap wave equation using a 9-point Laplacian stencil
 * and stroke-segment force injection for realistic, smooth liquid ripple dispersion.
 */
export const waveSimulationShader: string = `
  precision highp float;

  uniform sampler2D uPrevSim;
  uniform vec2  uResolution;
  uniform vec2  uMouse;
  uniform vec2  uPrevMouse;
  uniform float uRadius;
  uniform float uStrength;
  uniform float uDamping;
  uniform float uAspect;
  uniform float uWaveSpeed;

  varying vec2 vUv;

  // Distance from point p to line segment ab (for continuous cursor strokes)
  float distToSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-7), 0.0, 1.0);
    return length(pa - ba * h);
  }

  void main() {
    vec2 texel = 1.0 / uResolution;

    // 9-point Laplacian stencil for isotropic wave propagation
    float hT  = texture2D(uPrevSim, vUv + vec2(0.0,  texel.y)).r;
    float hB  = texture2D(uPrevSim, vUv + vec2(0.0, -texel.y)).r;
    float hL  = texture2D(uPrevSim, vUv + vec2(-texel.x, 0.0)).r;
    float hR  = texture2D(uPrevSim, vUv + vec2( texel.x, 0.0)).r;

    float hTL = texture2D(uPrevSim, vUv + vec2(-texel.x,  texel.y)).r;
    float hTR = texture2D(uPrevSim, vUv + vec2( texel.x,  texel.y)).r;
    float hBL = texture2D(uPrevSim, vUv + vec2(-texel.x, -texel.y)).r;
    float hBR = texture2D(uPrevSim, vUv + vec2( texel.x, -texel.y)).r;

    float laplacian = (0.5 * (hT + hB + hL + hR) + 0.25 * (hTL + hTR + hBL + hBR)) / 3.0;

    vec2 curr  = texture2D(uPrevSim, vUv).rg;
    float hCurr = curr.r;
    float hPrev = curr.g;

    // Wave equation: h(n+1) = c² * (laplacian - hCurr) + 2*hCurr - hPrev
    float c2 = uWaveSpeed * uWaveSpeed;
    float hNew = c2 * (laplacian - hCurr) + 2.0 * hCurr - hPrev;

    // Damping / dissipation
    hNew *= uDamping;

    // Force injection along cursor path
    vec2 aspectUV   = vec2(vUv.x * uAspect, vUv.y);
    vec2 aspectMPos = vec2(uMouse.x * uAspect, uMouse.y);
    vec2 aspectPrev = vec2(uPrevMouse.x * uAspect, uPrevMouse.y);

    float dist = distToSegment(aspectUV, aspectPrev, aspectMPos);

    if (uStrength > 0.0001) {
      float normalizedDist = dist / (uRadius * uAspect);
      float force = exp(-normalizedDist * normalizedDist * 4.0) * uStrength;
      hNew += force;
    }

    hNew = clamp(hNew, -3.0, 3.0);

    gl_FragColor = vec4(hNew, hCurr, 0.0, 1.0);
  }
`;

/**
 * Water Render & Visualization Fragment Shader
 * The overlay can't read the DOM beneath it, so instead of displacing pixels it
 * reproduces what a lens does to light: convex parts of the surface focus light
 * (brighter), concave parts spread it (darker), and each wavelength bends by a
 * slightly different amount (thin chromatic fringes). That read as refraction
 * far more naturally than a flat tinted glow.
 */
export const waterRenderShader: string = `
  precision highp float;

  uniform sampler2D uSimTexture;
  uniform vec2  uResolution;
  uniform float uTime;
  uniform float uLensStrength;   // how much light is focused / spread
  uniform float uDispersion;     // chromatic split, in sim texels
  uniform float uShadow;         // darkening in defocused (concave) areas

  varying vec2 vUv;

  float h(vec2 uv) { return texture2D(uSimTexture, uv).r; }

  // Curvature (negative Laplacian) = local lens power. Sampled over 1.5 texels
  // so the bilinear-upscaled sim reads as a smooth surface, not a pixel grid.
  float focus(vec2 uv, vec2 t) {
    float c = h(uv);
    float lap = h(uv - vec2(t.x, 0.0)) + h(uv + vec2(t.x, 0.0))
              + h(uv - vec2(0.0, t.y)) + h(uv + vec2(0.0, t.y)) - 4.0 * c;
    return -lap;
  }

  void main() {
    vec2 t = 1.5 / uResolution;

    vec2 grad = vec2(h(vUv + vec2(t.x, 0.0)) - h(vUv - vec2(t.x, 0.0)),
                     h(vUv + vec2(0.0, t.y)) - h(vUv - vec2(0.0, t.y)));

    // Per-channel refraction: red bends least, blue most.
    vec2 disp = grad * uDispersion / uResolution * 60.0;
    float fR = focus(vUv - disp, t);
    float fG = focus(vUv, t);
    float fB = focus(vUv + disp, t);

    vec3 light = max(vec3(fR, fG, fB), 0.0) * uLensStrength;
    // Very slight lavender cast to stay on-brand without looking like a paint stroke.
    light *= vec3(0.96, 0.94, 1.0);
    float shade = max(-fG, 0.0) * uLensStrength * uShadow;

    // Small glassy glint on the steepest slopes.
    vec3 n = normalize(vec3(grad * 6.0, 1.0));
    float glint = pow(max(dot(n, normalize(vec3(-0.4, 0.6, 0.7))), 0.0), 60.0);
    glint *= smoothstep(0.002, 0.02, length(grad));
    light += glint * 0.25;

    // Composite light (brighten) and shade (darken) into one straight-alpha colour.
    float lightA = clamp(max(max(light.r, light.g), light.b), 0.0, 0.35);
    float shadeA = clamp(shade, 0.0, 0.25);
    float alpha  = clamp(lightA + shadeA, 0.0, 0.45);
    vec3 color   = alpha > 0.0001 ? (light / max(lightA, 1e-4)) * (lightA / alpha) : vec3(0.0);

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), alpha);
  }
`;

/**
 * Image / Background Texture Distortion Fragment Shader (Optional texture refraction)
 */
export const renderFragmentShader: string = `
  precision highp float;

  uniform sampler2D uImage;
  uniform sampler2D uDisplacement;
  varying vec2 vUv;

  void main() {
    vec4 displacement = texture2D(uDisplacement, vUv);
    vec2 distortedUv = vUv + displacement.rg * 0.05;

    vec4 color = texture2D(uImage, distortedUv);
    gl_FragColor = color;
  }
`;