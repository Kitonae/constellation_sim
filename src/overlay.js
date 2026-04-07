import * as THREE from 'three';
import { qsOverlayScale } from './quality.js';

export function createOverlay(CONSTELLATIONS, constellationObjects, starOffsets, lineOffsets) {
  const CON_COUNT = CONSTELLATIONS.length;
  let OVERLAY_SCALE = qsOverlayScale();

  // Star/line totals
  let totalStars = 0, totalLines = 0;
  CONSTELLATIONS.forEach(con => {
    totalStars += con.stars.length;
    totalLines += con.lines.length;
  });

  // Star position texture — pixels written every frame in the animation loop
  const starPosData = new Float32Array(totalStars * 4).fill(-10);
  const starPosTex = new THREE.DataTexture(
    starPosData, totalStars, 1,
    THREE.RGBAFormat, THREE.FloatType
  );
  starPosTex.magFilter = THREE.NearestFilter;
  starPosTex.minFilter = THREE.NearestFilter;
  starPosTex.needsUpdate = true;

  // Lines texture — static, built once
  const lineData = new Float32Array(totalLines * 4);
  CONSTELLATIONS.forEach((con, ci) => {
    const lOff = lineOffsets[ci];
    const sOff = starOffsets[ci];
    con.lines.forEach(([a, b], li) => {
      const px = (lOff + li) * 4;
      lineData[px] = sOff + a;
      lineData[px + 1] = sOff + b;
    });
  });
  const linesTex = new THREE.DataTexture(
    lineData, totalLines, 1,
    THREE.RGBAFormat, THREE.FloatType
  );
  linesTex.magFilter = THREE.NearestFilter;
  linesTex.minFilter = THREE.NearestFilter;
  linesTex.needsUpdate = true;

  const conDimArr = new Array(CON_COUNT).fill(1.0);

  const overlayMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(Math.floor(window.innerWidth * OVERLAY_SCALE), Math.floor(window.innerHeight * OVERLAY_SCALE)) },
      uStarPos: { value: starPosTex },
      uLines: { value: linesTex },
      uStarOffset: { value: starOffsets.slice() },
      uLineOffset: { value: lineOffsets.slice() },
      uStarCount: { value: CONSTELLATIONS.map(c => c.stars.length) },
      uLineCount: { value: CONSTELLATIONS.map(c => c.lines.length) },
      uConColor: { value: CONSTELLATIONS.map(c => new THREE.Color(c.color)) },
      uConDim: { value: conDimArr.slice() },
      uConCentroid: { value: Array.from({length: CON_COUNT}, () => new THREE.Vector2(-10, -10)) },
      uConBoundR:   { value: new Float32Array(CON_COUNT).fill(0) },
    },
    vertexShader: `
      void main() {
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      #define S smoothstep
      #define NUM_CONS ${CON_COUNT}

      uniform float     uTime;
      uniform vec2      uResolution;
      uniform sampler2D uStarPos;
      uniform sampler2D uLines;
      uniform int  uStarOffset[NUM_CONS];
      uniform int  uLineOffset[NUM_CONS];
      uniform int  uStarCount[NUM_CONS];
      uniform int  uLineCount[NUM_CONS];
      uniform vec3  uConColor[NUM_CONS];
      uniform float uConDim[NUM_CONS];
      uniform vec2  uConCentroid[NUM_CONS];
      uniform float uConBoundR[NUM_CONS];

      out vec4 outColor;

      vec2 fetchStarPos(int idx) {
        return texelFetch(uStarPos, ivec2(idx, 0), 0).rg;
      }

      float DistLine(vec2 p, vec2 a, vec2 b) {
        vec2 pa = p - a;
        vec2 ba = b - a;
        float t = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        return length(pa - ba * t);
      }

      float GlowLine(vec2 p, vec2 a, vec2 b) {
        if (abs(a.x) > 1.8 || abs(a.y) > 1.8 || abs(b.x) > 1.8 || abs(b.y) > 1.8) return 0.0;
        float d    = DistLine(p, a, b);
        float core = S(0.0015, 0.0003, d) * 0.7;
        float glow = S(0.006,  0.002,  d) * 0.15;
        return core + glow;
      }

      float shineRandom(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * 0.1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }

      float shineNoise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = shineRandom(i);
        float b = shineRandom(i + vec2(1.0, 0.0));
        float c = shineRandom(i + vec2(0.0, 1.0));
        float d = shineRandom(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float shineFlare(float angle, float alpha, float t) {
        float n = shineNoise(vec2(t + 0.5 + abs(angle) + pow(alpha, 0.6),
                                  t - abs(angle) + pow(alpha + 0.1, 0.6)) * 7.0);
        float split = 15.0 + sin(t * 2.0 + n * 4.0 + angle * 20.0 + alpha * n)
                      * (0.8 + alpha * 0.6 * n);
        float rot = sin(angle * 20.0 + sin(angle * 15.0 + alpha * 4.0 + t * 30.0
                    + n * 5.0 + alpha * 4.0) * (0.5 + alpha * 1.5));
        float g = pow((2.0 + sin(split + n * 1.5 * alpha + rot) * 1.4) * n * 4.0,
                      n * (1.5 - 0.8 * alpha));
        g *= alpha * alpha * alpha * 0.5;
        g += alpha * 0.7 + g * g * g;
        return g;
      }

      float sparkleStar4(vec2 uv, float anim) {
        float r2 = dot(uv, uv);
        float r  = sqrt(r2) + 0.0001;
        float cos2t   = (uv.x * uv.x - uv.y * uv.y) / r2;
        float angular = pow(abs(cos2t), 3.0);
        return (angular / r) * anim;
      }

      #define SHINE_SPEED 0.105
      #define SHINE_CORE  1.0
      #define SHINE_RAYS  0.5
      #define SHINE_SCALE 60.0

      vec3 StarShine(vec2 p, vec2 center, float t, vec3 tint) {
        vec2 d = p - center;
        float dist2 = dot(d, d);
        if (dist2 > 0.004) return vec3(0.0);

        vec2 suv = d * SHINE_SCALE * 0.5;
        float seed = fract(center.x * 127.1 + center.y * 311.7);
        float st = (t + seed * 10.0) * SHINE_SPEED * 0.8;

        float suv2 = dot(suv, suv);
        float cos2t_a = (suv.x * suv.x - suv.y * suv.y) / max(suv2, 0.0001);
        float angular_a = pow(abs(cos2t_a), 2.5);
        float alpha = exp(-suv2 / (SHINE_CORE * SHINE_CORE))
                      * 0.35 * (0.04 + angular_a * 0.96);
        float angle = atan(suv.x, suv.y);

        float f  = shineFlare(angle, alpha, st) * 1.3;
        float f2 = shineFlare(angle, alpha * 1.2, -st + alpha * 0.5 + 0.38134);

        vec3 c = vec3(
          f * (1.0 + sin(angle - st * 5.0) * 0.3) + f2 * f2 * f2,
          f * alpha + f2 * f2 * 2.0,
          f * alpha * 0.5 + f2 * (1.0 + sin(angle + st * 5.0) * 0.3)
        );

        vec2 ruv = suv * (2.0 * (cos((t + seed * 10.0) * 2.0) - 2.5)) / SHINE_RAYS;
        float anim = sin((t + seed * 10.0) * 12.0) * 0.1 + 1.0;
        vec3 rayTint = mix(vec3(0.55, 0.5, 1.15), tint * 0.6 + 0.4, 0.5);
        vec3 star = sparkleStar4(ruv, anim) * rayTint;
        c *= star;
        c += star * 0.01;

        return max(c, vec3(0.0));
      }

      void main() {
        float aspect = uResolution.x / uResolution.y;
        vec2 uv = (gl_FragCoord.xy / uResolution - 0.5);
        uv.x *= aspect;

        vec3 col = vec3(0.0);

        for (int ci = 0; ci < NUM_CONS; ci++) {
          float dim = uConDim[ci];
          if (dim < 0.04) continue;

          vec2 ctr = uConCentroid[ci];
          if (ctr.x > -5.0) {
            float dist2toCtr = dot(uv - ctr, uv - ctr);
            float r = uConBoundR[ci] + 0.05;
            if (dist2toCtr > r * r) continue;
          }

          vec3 tint = uConColor[ci];
          int  sOff = uStarOffset[ci];
          int  lOff = uLineOffset[ci];
          int  nS   = uStarCount[ci];
          int  nL   = uLineCount[ci];

          float m = 0.0;

          for (int li = 0; li < nL; li++) {
            vec2 lineAB = texelFetch(uLines, ivec2(lOff + li, 0), 0).rg;
            vec2 sa = fetchStarPos(int(lineAB.r)) * 0.5; sa.x *= aspect;
            vec2 sb = fetchStarPos(int(lineAB.g)) * 0.5; sb.x *= aspect;
            if (abs(sa.x) > 2.0 && abs(sb.x) > 2.0) continue;
            m += GlowLine(uv, sa, sb);
          }

          vec3 shine = vec3(0.0);
          for (int si = 0; si < nS; si++) {
            vec2 raw = fetchStarPos(sOff + si);
            if (abs(raw.x) > 1.2 || abs(raw.y) > 1.2) continue;
            vec2 sc = raw * 0.5;
            sc.x *= aspect;
            shine += StarShine(uv, sc, uTime, tint);
          }

          col += (tint * m + shine) * dim;
        }

        col = clamp(col, 0.0, 1.5);
        outColor = vec4(col, 1.0);
      }
    `,
    transparent: false,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    glslVersion: THREE.GLSL3,
  });

  // Full-screen triangle (covers NDC -1..1)
  const overlayGeo = new THREE.BufferGeometry();
  overlayGeo.setAttribute('position', new THREE.BufferAttribute(
    new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3
  ));
  const overlayMesh = new THREE.Mesh(overlayGeo, overlayMat);
  overlayMesh.frustumCulled = false;

  // Reduced-resolution overlay RT
  const overlayRt = new THREE.WebGLRenderTarget(
    Math.floor(window.innerWidth * OVERLAY_SCALE), Math.floor(window.innerHeight * OVERLAY_SCALE),
    { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat }
  );

  const fsQuadGeo = new THREE.PlaneGeometry(2, 2);
  const overlayCompositeMat = new THREE.ShaderMaterial({
    uniforms: { uOverlay: { value: overlayRt.texture } },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = position.xy * 0.5 + 0.5;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D uOverlay;
      void main() {
        gl_FragColor = vec4(texture2D(uOverlay, vUv).rgb, 1.0);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
  });
  const overlayCompositeMesh = new THREE.Mesh(fsQuadGeo, overlayCompositeMat);

  return {
    overlayMat,
    overlayMesh,
    overlayRt,
    overlayCompositeMesh,
    starPosData,
    starPosTex,
    conDimArr,
    fsQuadGeo,
    setScale(scale) {
      OVERLAY_SCALE = scale;
      overlayMat.uniforms.uResolution.value.set(
        Math.floor(window.innerWidth * OVERLAY_SCALE),
        Math.floor(window.innerHeight * OVERLAY_SCALE),
      );
      overlayRt.setSize(
        Math.floor(window.innerWidth * OVERLAY_SCALE),
        Math.floor(window.innerHeight * OVERLAY_SCALE),
      );
    },
    setResolution() {
      overlayMat.uniforms.uResolution.value.set(
        Math.floor(window.innerWidth * OVERLAY_SCALE),
        Math.floor(window.innerHeight * OVERLAY_SCALE),
      );
      overlayRt.setSize(
        Math.floor(window.innerWidth * OVERLAY_SCALE),
        Math.floor(window.innerHeight * OVERLAY_SCALE),
      );
    },
  };
}
