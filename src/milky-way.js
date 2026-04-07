import * as THREE from 'three';
import { QS_MILKYWAY_STEPS, qsMilkyWayCount } from './quality.js';

export function createMilkyWay(scene, animatedMaterials) {
  const MW_MAX = QS_MILKYWAY_STEPS[QS_MILKYWAY_STEPS.length - 1]; // 18000

  const positions = new Float32Array(MW_MAX * 3);
  const alphas    = new Float32Array(MW_MAX);
  const colors    = new Float32Array(MW_MAX * 3);

  // Milky Way is denser toward galactic centre (longitude ~0) and thinner at edges
  for (let i = 0; i < MW_MAX; i++) {
    const lon = Math.random() * Math.PI * 2;
    // Gaussian latitude — wider near centre, narrow at edges
    const centreWeight = 0.5 + 0.5 * Math.cos(lon);         // peaks at lon=0
    const spread = 0.12 + centreWeight * 0.22;
    const lat = (Math.random() - 0.5) * spread * 2;
    const r = 480 + Math.random() * 30;

    const x0 = r * Math.cos(lat) * Math.cos(lon);
    const y0 = r * Math.sin(lat);
    const z0 = r * Math.cos(lat) * Math.sin(lon);

    // Tilt galactic plane ~62.9°
    const tilt = 1.098;  // radians
    positions[i * 3] = x0;
    positions[i * 3 + 1] = y0 * Math.cos(tilt) - z0 * Math.sin(tilt);
    positions[i * 3 + 2] = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);

    // More opaque near centre
    alphas[i] = (0.08 + centreWeight * 0.28) * (0.4 + Math.random() * 0.6);

    // Colour: mostly blue-white, slight warm tinge near centre
    const warm = centreWeight * 0.3;
    colors[i * 3] = 0.72 + warm * 0.28;
    colors[i * 3 + 1] = 0.78 + warm * 0.05;
    colors[i * 3 + 2] = 0.95 - warm * 0.15;
  }

  const mwGeo = new THREE.BufferGeometry();
  mwGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  mwGeo.setAttribute('alpha',    new THREE.BufferAttribute(alphas,    1));
  mwGeo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));
  mwGeo.setDrawRange(0, qsMilkyWayCount());

  const mwMat = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float alpha;
      attribute vec3  color;
      varying   float vAlpha;
      varying   vec3  vColor;
      void main() {
        vAlpha = alpha;
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 1.2 + alpha * 2.0;
        gl_Position  = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      varying vec3  vColor;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = vAlpha * (1.0 - smoothstep(0.1, 0.5, d));
        gl_FragColor = vec4(vColor, a);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(mwGeo, mwMat);
  scene.add(points);

  return {
    points,
    setCount(n) { mwGeo.setDrawRange(0, n); },
  };
}
