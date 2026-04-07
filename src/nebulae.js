import * as THREE from 'three';
import { qsNebulaIters } from './quality.js';

const nebulaVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv - 0.5; // centre on 0,0
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const nebulaFragmentShader = `
  precision highp float;
  uniform vec3  uColor;
  uniform vec3  uColor2;
  uniform vec2  uOffset;
  uniform float uScale;
  uniform int   uIter1;
  uniform int   uIter2;
  varying vec2  vUv;

  const int MAX_ITER = 18;

  float field(vec3 p, float s, int iter) {
    float accum = s / 4.0;
    float prev  = 0.0;
    float tw    = 0.0;
    for (int i = 0; i < MAX_ITER; ++i) {
      if (i >= iter) break;
      float mag = dot(p, p);
      p = abs(p) / mag + vec3(-0.5, -0.4, -1.487);
      float w = exp(-float(i) / 5.0);
      accum += w * exp(-9.025 * pow(abs(mag - prev), 2.2));
      tw   += w;
      prev  = mag;
    }
    return max(0.0, 5.2 * accum / tw - 0.65);
  }

  void main() {
    float r    = length(vUv) * 2.0;
    float mask = 1.0 - smoothstep(0.0, 1.0, r); // wide soft falloff = natural blur
    mask = mask * mask;                           // square for extra transparency
    if (mask < 0.001) discard;

    vec3 p  = vec3(vUv * uScale + uOffset, 0.0);
    vec3 p2 = p + vec3(0.4, 0.2, 1.5);
    float t  = field(p,  0.15, uIter1);
    float t2 = field(p2, 0.90, uIter2);

    vec3 col  = uColor  * (1.5 * 0.15 * t*t*t + 1.2 * 0.4 * t*t + 0.9 * t);
    vec3 col2 = uColor2 * (5.5 * t2*t2*t2 + 2.1 * t2*t2 + 2.2 * t2 * 0.45);
    vec3 rgb  = (col + col2 * 0.5) * mask * 0.15;

    gl_FragColor = vec4(rgb, 1.0);
  }
`;

function addNebula(scene, raDecToVec3, materials, ra, dec, color1, color2, worldSize, offset, scale) {
  const pos = raDecToVec3(ra, dec, 97);
  const [iter1, iter2] = qsNebulaIters();
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color1) },
      uColor2: { value: new THREE.Color(color2) },
      uOffset: { value: new THREE.Vector2(offset[0], offset[1]) },
      uScale: { value: scale },
      uIter1: { value: iter1 },
      uIter2: { value: iter2 },
    },
    vertexShader: nebulaVertexShader,
    fragmentShader: nebulaFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  materials.push(mat);
  const sprite = new THREE.Mesh(new THREE.PlaneGeometry(worldSize, worldSize), mat);
  sprite.position.copy(pos);
  sprite.lookAt(0, 0, 0);
  scene.add(sprite);
}

export function createNebulae(scene, raDecToVec3) {
  const materials = [];

  // Each nebula: ra, dec, primaryColor, secondaryColor, worldSize, [fractalOffsetX,Y], fractalScale
  addNebula(scene, raDecToVec3, materials, 83.82, -5.39, 0x4466ff, 0xcc44bb, 42, [0.80, -1.30], 1.8); // Orion     — blue/magenta
  addNebula(scene, raDecToVec3, materials, 247.35, -26.43, 0xff4422, 0xff9900, 36, [1.20, -0.80], 2.1); // Scorpius  — red/orange
  addNebula(scene, raDecToVec3, materials, 310.36, 45.28, 0x22ccff, 0x7755ee, 32, [0.40, -1.60], 1.6); // Cygnus    — cyan/violet
  addNebula(scene, raDecToVec3, materials, 279.23, 38.78, 0x44ffcc, 0x6699ff, 26, [-0.20, -1.10], 2.4); // Lyra      — teal/blue
  addNebula(scene, raDecToVec3, materials, 266.00, -29.00, 0xffaa33, 0xff5511, 50, [2.00, -1.30], 1.4); // Sagittarius — gold/orange

  return {
    materials,
    setIters(i1, i2) {
      materials.forEach(m => {
        m.uniforms.uIter1.value = i1;
        m.uniforms.uIter2.value = i2;
      });
    },
  };
}
