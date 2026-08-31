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
 * Renders liquid-glass reflections, specular lighting, chromatic aberration,
 * and caustic shimmer driven by the heightmap texture gradients.
 */
export const waterRenderShader: string = `
  precision highp float;

  uniform sampler2D uSimTexture;
  uniform vec2  uResolution;
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    vec2 texel = 1.0 / uResolution;

    // Surface gradient estimation from heightmap
    float hL = texture2D(uSimTexture, vUv - vec2(texel.x, 0.0)).r;
    float hR = texture2D(uSimTexture, vUv + vec2(texel.x, 0.0)).r;
    float hD = texture2D(uSimTexture, vUv - vec2(0.0, texel.y)).r;
    float hU = texture2D(uSimTexture, vUv + vec2(0.0, texel.y)).r;

    vec2 gradient = vec2(hR - hL, hU - hD);
    float gradLen = length(gradient);

    // Normal vector calculation from heightmap gradient
    vec3 normal = normalize(vec3(gradient * 3.2, 0.45));

    // Dual-light specular highlights (Active Theory Liquid Glass Specular)
    vec3 lightDir1 = normalize(vec3(-0.4, 0.6, 0.8));
    vec3 lightDir2 = normalize(vec3(0.5, -0.3, 0.9));

    float spec1 = pow(max(0.0, dot(normal, lightDir1)), 32.0);
    float spec2 = pow(max(0.0, dot(normal, lightDir2)), 48.0);
    float specular = spec1 * 0.65 + spec2 * 0.35;

    // Prismatic chromatic dispersion (Lavender & Soft Violet)
    vec3 cLavender  = vec3(0.733, 0.616, 0.933); // #BB9DEE
    vec3 cPastel    = vec3(0.878, 0.831, 0.988); // #E0D4FC
    vec3 cViolet    = vec3(0.659, 0.333, 0.969); // #A855F7

    // Soft liquid glass color reflection
    vec3 liquidColor = cLavender * (gradLen * 1.8) +
                       cViolet * (gradLen * 1.2) +
                       cPastel * specular;

    // Subtle, elegant opacity mask (Active Theory minimal presence)
    float mask = smoothstep(0.002, 0.045, gradLen);
    float alpha = clamp(mask * 0.22 + specular * 0.32, 0.0, 0.38);

    gl_FragColor = vec4(liquidColor, alpha);
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