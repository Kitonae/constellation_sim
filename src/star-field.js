import * as THREE from 'three';
import { QS_STAR_STEPS, qsStarCount } from './quality.js';

export function createStarField(scene, animatedMaterials) {
  const SF_MAX = QS_STAR_STEPS[QS_STAR_STEPS.length - 1]; // 7000

  const positions  = new Float32Array(SF_MAX * 3);
  const sizes      = new Float32Array(SF_MAX);
  const colors     = new Float32Array(SF_MAX * 3);
  const twinkleOff = new Float32Array(SF_MAX);

  for (let i = 0; i < SF_MAX; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 490 + Math.random() * 30;

    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    // Power-law size distribution: many tiny, few large
    const u = Math.random();
    sizes[i] = 0.3 + Math.pow(u, 3) * 3.5;

    // Stellar colour: red giants, white, blue-white
    const t = Math.random();
    if (t < 0.06) {
      // Orange / red giant
      colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.55 + Math.random() * 0.15; colors[i * 3 + 2] = 0.3 + Math.random() * 0.1;
    } else if (t < 0.12) {
      // Yellow
      colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.9 + Math.random() * 0.1; colors[i * 3 + 2] = 0.6 + Math.random() * 0.1;
    } else if (t < 0.25) {
      // Blue-white
      colors[i * 3] = 0.75 + Math.random() * 0.1; colors[i * 3 + 1] = 0.85 + Math.random() * 0.1; colors[i * 3 + 2] = 1.0;
    } else {
      // White
      colors[i * 3] = 0.92 + Math.random() * 0.08;
      colors[i * 3 + 1] = 0.94 + Math.random() * 0.06;
      colors[i * 3 + 2] = 0.96 + Math.random() * 0.04;
    }

    twinkleOff[i] = Math.random() * Math.PI * 2;
  }

  const sfGeo = new THREE.BufferGeometry();
  sfGeo.setAttribute('position',   new THREE.BufferAttribute(positions,  3));
  sfGeo.setAttribute('size',       new THREE.BufferAttribute(sizes,      1));
  sfGeo.setAttribute('color',      new THREE.BufferAttribute(colors,     3));
  sfGeo.setAttribute('twinkleOff', new THREE.BufferAttribute(twinkleOff, 1));
  sfGeo.setDrawRange(0, qsStarCount());

  const sfMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      attribute float size;
      attribute vec3  color;
      attribute float twinkleOff;
      uniform   float uTime;
      varying   vec3  vColor;
      varying   float vTwinkle;
      void main() {
        vColor   = color;
        // Each star twinkles at a slightly different frequency & phase
        float freq    = 0.8 + fract(twinkleOff * 7.3) * 1.4;
        vTwinkle  = 0.78 + 0.22 * sin(uTime * freq + twinkleOff);
        vec4 mv   = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * vTwinkle * (320.0 / -mv.z);
        gl_Position  = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3  vColor;
      varying float vTwinkle;
      void main() {
        vec2  uv = gl_PointCoord - 0.5;
        float d  = length(uv);
        if (d > 0.5) discard;
        float core = exp(-d * d * 28.0);
        float halo = exp(-d * d *  7.0) * 0.4;
        float a    = (core + halo) * vTwinkle;
        vec3  col  = mix(vec3(1.0), vColor, smoothstep(0.0, 0.35, d));
        gl_FragColor = vec4(col, a);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  animatedMaterials.push(sfMat);
  const points = new THREE.Points(sfGeo, sfMat);
  scene.add(points);

  return {
    points,
    setCount(n) { sfGeo.setDrawRange(0, n); },
  };
}
