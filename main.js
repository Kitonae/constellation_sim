import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// ─── Renderer ────────────────────────────────────────────────────────────────

const container = document.getElementById('canvas-container');
const renderer  = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x00000a);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
container.appendChild(renderer.domElement);

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 1);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping    = true;
controls.dampingFactor    = 0.05;
controls.rotateSpeed      = 0.25;
controls.zoomSpeed        = 0.7;
controls.minDistance      = 0.4;
controls.maxDistance      = 3.5;
controls.autoRotate       = true;
controls.autoRotateSpeed  = 0.06;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(Math.floor(window.innerWidth / 2), Math.floor(window.innerHeight / 2)),
  1.15,
  0.6,
  0.55,
);
composer.addPass(bloomPass);

// ─── Constellation data ───────────────────────────────────────────────────────
// [ra_deg, dec_deg, magnitude]

const CONSTELLATIONS = [
  {
    name: 'Orion',
    translation: 'The Hunter',
    desc: 'A giant huntsman placed among the stars by Zeus, forever pursuing the Pleiades across the sky.',
    color: 0x88aaff,
    stars: [
      [88.79,  7.41,  0.42],  // 0 Betelgeuse
      [81.28,  6.35,  1.64],  // 1 Bellatrix
      [83.00,  0.30,  2.23],  // 2 Mintaka
      [84.05, -1.20,  1.69],  // 3 Alnilam
      [85.19, -1.94,  1.74],  // 4 Alnitak
      [86.94, -9.67,  2.06],  // 5 Saiph
      [78.63, -8.20,  0.18],  // 6 Rigel
      [83.78,  9.93,  3.39],  // 7 Meissa
    ],
    lines: [
      [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,2],
      [0,3],[7,0],[7,1],
    ],
  },
  {
    name: 'Ursa Major',
    translation: 'The Great Bear',
    desc: 'Callisto, transformed into a great bear by Hera\'s jealousy and cast among the stars by Zeus.',
    color: 0xaaddff,
    stars: [
      [165.93, 61.75, 1.79], // 0 Dubhe
      [165.46, 56.38, 2.34], // 1 Merak
      [178.46, 53.69, 2.44], // 2 Phecda
      [183.86, 57.03, 3.31], // 3 Megrez
      [193.51, 55.96, 1.76], // 4 Alioth
      [200.98, 54.93, 2.23], // 5 Mizar
      [206.89, 49.31, 1.85], // 6 Alkaid
    ],
    lines: [
      [0,1],[1,2],[2,3],[3,0],
      [3,4],[4,5],[5,6],
    ],
  },
  {
    name: 'Cassiopeia',
    translation: 'The Seated Queen',
    desc: 'A vain Ethiopian queen chained to her throne in the heavens as punishment for her boastfulness.',
    color: 0xffddaa,
    stars: [
      [ 2.29, 59.15, 2.27],  // 0 Caph
      [10.13, 56.54, 2.23],  // 1 Schedar
      [14.18, 60.72, 2.47],  // 2 Gamma Cas
      [21.45, 60.24, 2.68],  // 3 Ruchbah
      [28.60, 63.67, 3.35],  // 4 Segin
    ],
    lines: [[0,1],[1,2],[2,3],[3,4]],
  },
  {
    name: 'Leo',
    translation: 'The Lion',
    desc: 'The Nemean lion slain by Heracles as the first of his twelve labours, immortalized in the sky.',
    color: 0xffcc88,
    stars: [
      [152.09, 11.97, 1.35], // 0 Regulus
      [177.26, 14.57, 2.14], // 1 Denebola
      [154.99, 19.84, 2.01], // 2 Algieba
      [168.53, 20.52, 2.56], // 3 Zosma
      [146.46, 23.77, 3.49], // 4 Eta Leo
      [154.17, 23.42, 3.43], // 5 Adhafera
      [148.19, 26.01, 3.88], // 6 Mu Leo
    ],
    lines: [[0,2],[2,5],[5,4],[4,6],[0,3],[3,1],[2,3]],
  },
  {
    name: 'Scorpius',
    translation: 'The Scorpion',
    desc: 'The scorpion sent by Gaia to slay Orion, placed opposite him so they never share the sky.',
    color: 0xff8877,
    stars: [
      [247.35,-26.43, 0.91], // 0  Antares
      [240.08,-19.81, 2.62], // 1  Graffias
      [240.08,-22.62, 2.29], // 2  Dschubba
      [245.30,-25.59, 2.89], // 3  Sigma Sco
      [247.55,-28.22, 2.82], // 4  Tau Sco
      [253.50,-34.29, 2.29], // 5  Epsilon Sco
      [252.97,-38.05, 3.04], // 6  Mu Sco
      [258.04,-43.24, 3.32], // 7  Eta Sco
      [264.33,-42.99, 1.86], // 8  Theta Sco
      [266.89,-45.00, 3.03], // 9  Iota Sco
      [265.62,-39.03, 2.41], // 10 Kappa Sco
      [263.40,-37.10, 1.62], // 11 Lambda Sco
      [265.62,-37.30, 2.69], // 12 Upsilon Sco
    ],
    lines: [
      [1,2],[2,0],[0,3],[3,4],[4,5],[5,6],[6,7],
      [7,8],[8,9],[8,10],[10,11],[11,12],
    ],
  },
  {
    name: 'Cygnus',
    translation: 'The Swan',
    desc: 'Zeus disguised as a swan, or Orpheus transformed after death and placed beside his lyre in the heavens.',
    color: 0xaaffcc,
    stars: [
      [310.36, 45.28, 1.25], // 0 Deneb
      [305.56, 40.26, 2.23], // 1 Sadr
      [311.55, 33.97, 2.46], // 2 Gienah
      [296.24, 45.13, 2.87], // 3 Delta Cyg
      [292.68, 27.96, 3.05], // 4 Albireo
    ],
    lines: [[0,1],[1,2],[3,1],[1,4]],
  },
  {
    name: 'Lyra',
    translation: 'The Lyre',
    desc: 'The golden lyre of Orpheus, whose music could charm stones and rivers, cast into the sky by the Muses.',
    color: 0xeeeeff,
    stars: [
      [279.23, 38.78, 0.03], // 0 Vega
      [282.52, 33.36, 3.52], // 1 Sheliak
      [284.74, 32.69, 3.24], // 2 Sulafat
      [283.62, 36.90, 4.30], // 3 Delta2 Lyr
      [281.19, 37.61, 4.34], // 4 Zeta1 Lyr
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,0],[0,3],[0,4]],
  },
  {
    name: 'Gemini',
    translation: 'The Twins',
    desc: 'Castor and Pollux, the inseparable twin brothers who share immortality between earth and Olympus.',
    color: 0xffeeaa,
    stars: [
      [116.33, 28.03, 1.14], // 0 Pollux
      [113.65, 31.89, 1.57], // 1 Castor
      [ 99.43, 16.40, 1.93], // 2 Alhena
      [110.03, 21.98, 3.53], // 3 Wasat
      [100.98, 25.13, 2.98], // 4 Mebsuda
      [100.18, 20.57, 3.79], // 5 Mekbuda
      [ 93.72, 22.51, 3.28], // 6 Propus
      [ 95.74, 22.51, 2.86], // 7 Tejat
    ],
    lines: [[1,4],[4,6],[6,7],[7,5],[5,2],[0,3],[3,4],[3,7],[0,1]],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const clock = new THREE.Clock();
const animatedMaterials = [];

function raDecToVec3(ra_deg, dec_deg, radius) {
  const ra  = ra_deg  * Math.PI / 180;
  const dec = dec_deg * Math.PI / 180;
  return new THREE.Vector3(
     radius * Math.cos(dec) * Math.cos(ra),
     radius * Math.sin(dec),
    -radius * Math.cos(dec) * Math.sin(ra),
  );
}

// Simple seeded pseudo-random for stable per-star offsets
function seededRand(seed) {
  const x = Math.sin(seed + 1) * 43758.5453;
  return x - Math.floor(x);
}

function addSkyDome() {
  const domeGeo = new THREE.SphereGeometry(560, 32, 32);
  const domeMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec3 vWorldPos;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorldPos = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec3 vWorldPos;

      vec3 skyGradient(float h) {
        vec3 c0 = vec3(0.020, 0.010, 0.040);
        vec3 c1 = vec3(0.025, 0.018, 0.070);
        vec3 c2 = vec3(0.035, 0.050, 0.130);
        vec3 c3 = vec3(0.045, 0.070, 0.170);
        vec3 c4 = vec3(0.055, 0.085, 0.195);

        vec3 col = mix(c0, c1, smoothstep(0.00, 0.20, h));
        col      = mix(col, c2, smoothstep(0.15, 0.45, h));
        col      = mix(col, c3, smoothstep(0.40, 0.75, h));
        col      = mix(col, c4, smoothstep(0.70, 1.00, h));
        return col;
      }

      void main() {
        vec3 dir = normalize(vWorldPos);
        float h  = dir.y * 0.5 + 0.5;
        vec3 base = skyGradient(h);

        float horizonDist = abs(h - 0.48);
        float horizonGlow = exp(-horizonDist * horizonDist * 80.0);
        base += vec3(0.030, 0.015, 0.010) * horizonGlow * 0.6;
        base += vec3(0.005, 0.018, 0.022) * horizonGlow * 0.4;

        float wave1 = 0.5 + 0.5 * sin(uTime * 0.04 + dir.x * 2.5 + dir.z * 1.8);
        base += vec3(0.012, 0.016, 0.035) * wave1 * (1.0 - h);

        float wave2 = 0.5 + 0.5 * sin(uTime * 0.018 + dir.z * 3.2 - dir.x * 1.5 + 1.7);
        base += vec3(0.008, 0.005, 0.020) * wave2 * smoothstep(0.0, 0.5, 1.0 - h);

        gl_FragColor = vec4(base, 1.0);
      }
    `,
    side: THREE.BackSide,
    depthWrite: false,
  });

  animatedMaterials.push(domeMat);
  scene.add(new THREE.Mesh(domeGeo, domeMat));
}

addSkyDome();

// ─── Background star field ────────────────────────────────────────────────────

function createStarField(count = 7000) {
  const positions  = new Float32Array(count * 3);
  const sizes      = new Float32Array(count);
  const colors     = new Float32Array(count * 3);
  const twinkleOff = new Float32Array(count); // per-star phase offset

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 490 + Math.random() * 30;

    positions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    positions[i*3+1] = r * Math.cos(phi);
    positions[i*3+2] = r * Math.sin(phi) * Math.sin(theta);

    // Power-law size distribution: many tiny, few large
    const u = Math.random();
    sizes[i] = 0.3 + Math.pow(u, 3) * 3.5;

    // Stellar colour: red giants, white, blue-white
    const t = Math.random();
    if (t < 0.06) {
      // Orange / red giant
      colors[i*3] = 1.0; colors[i*3+1] = 0.55 + Math.random()*0.15; colors[i*3+2] = 0.3 + Math.random()*0.1;
    } else if (t < 0.12) {
      // Yellow
      colors[i*3] = 1.0; colors[i*3+1] = 0.9 + Math.random()*0.1; colors[i*3+2] = 0.6 + Math.random()*0.1;
    } else if (t < 0.25) {
      // Blue-white
      colors[i*3] = 0.75 + Math.random()*0.1; colors[i*3+1] = 0.85 + Math.random()*0.1; colors[i*3+2] = 1.0;
    } else {
      // White
      colors[i*3] = 0.92 + Math.random()*0.08;
      colors[i*3+1] = 0.94 + Math.random()*0.06;
      colors[i*3+2] = 0.96 + Math.random()*0.04;
    }

    twinkleOff[i] = Math.random() * Math.PI * 2;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position',   new THREE.BufferAttribute(positions,  3));
  geo.setAttribute('size',       new THREE.BufferAttribute(sizes,      1));
  geo.setAttribute('color',      new THREE.BufferAttribute(colors,     3));
  geo.setAttribute('twinkleOff', new THREE.BufferAttribute(twinkleOff, 1));

  const mat = new THREE.ShaderMaterial({
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
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
  });

  animatedMaterials.push(mat);
  return new THREE.Points(geo, mat);
}

scene.add(createStarField());

// ─── Milky Way ────────────────────────────────────────────────────────────────

(function addMilkyWay() {
  const count     = 18000;
  const positions = new Float32Array(count * 3);
  const alphas    = new Float32Array(count);
  const colors    = new Float32Array(count * 3);

  // Milky Way is denser toward galactic centre (longitude ~0) and thinner at edges
  for (let i = 0; i < count; i++) {
    const lon = Math.random() * Math.PI * 2;
    // Gaussian latitude — wider near centre, narrow at edges
    const centreWeight = 0.5 + 0.5 * Math.cos(lon);         // peaks at lon=0
    const spread = 0.12 + centreWeight * 0.22;
    const lat  = (Math.random() - 0.5) * spread * 2;
    const r    = 480 + Math.random() * 30;

    const x0 =  r * Math.cos(lat) * Math.cos(lon);
    const y0 =  r * Math.sin(lat);
    const z0 =  r * Math.cos(lat) * Math.sin(lon);

    // Tilt galactic plane ~62.9°
    const tilt = 1.098;  // radians
    positions[i*3]   = x0;
    positions[i*3+1] = y0 * Math.cos(tilt) - z0 * Math.sin(tilt);
    positions[i*3+2] = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);

    // More opaque near centre
    alphas[i] = (0.08 + centreWeight * 0.28) * (0.4 + Math.random() * 0.6);

    // Colour: mostly blue-white, slight warm tinge near centre
    const warm = centreWeight * 0.3;
    colors[i*3]   = 0.72 + warm * 0.28;
    colors[i*3+1] = 0.78 + warm * 0.05;
    colors[i*3+2] = 0.95 - warm * 0.15;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('alpha',    new THREE.BufferAttribute(alphas,    1));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

  const mat = new THREE.ShaderMaterial({
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
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
  });

  scene.add(new THREE.Points(geo, mat));
})();

(function addForegroundDust() {
  const count = 1800;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 45 + Math.random() * 30;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    sizes[i] = 0.35 + Math.random() * 0.9;

    colors[i * 3] = 0.7 + Math.random() * 0.2;
    colors[i * 3 + 1] = 0.74 + Math.random() * 0.2;
    colors[i * 3 + 2] = 0.85 + Math.random() * 0.15;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vFlicker;
      uniform float uTime;
      void main() {
        vColor = color;
        vFlicker = 0.75 + 0.25 * sin(uTime * 0.9 + position.x * 0.03 + position.y * 0.04);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (220.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vFlicker;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float alpha = exp(-d * d * 12.0) * 0.28 * vFlicker;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  animatedMaterials.push(mat);
  const cloud = new THREE.Points(geo, mat);
  cloud.userData.spinSpeed = 0.005;
  scene.add(cloud);
})();

// ─── Nebulae ──────────────────────────────────────────────────────────────────

function makeFuzzyCanvas(size, colorHex, secondaryHex, layers) {
  const c   = document.createElement('canvas');
  c.width   = c.height = size;
  const ctx = c.getContext('2d');
  const col = new THREE.Color(colorHex);
  const r   = Math.round(col.r * 255);
  const g   = Math.round(col.g * 255);
  const b   = Math.round(col.b * 255);

  const sec = new THREE.Color(secondaryHex || colorHex);
  const sr  = Math.round(sec.r * 255);
  const sg  = Math.round(sec.g * 255);
  const sb  = Math.round(sec.b * 255);

  // Primary lobes
  layers.forEach(([cx, cy, rad, alpha]) => {
    const grd = ctx.createRadialGradient(cx*size, cy*size, 0, cx*size, cy*size, rad*size);
    grd.addColorStop(0,    `rgba(${r},${g},${b},${alpha})`);
    grd.addColorStop(0.35, `rgba(${r},${g},${b},${alpha*0.4})`);
    grd.addColorStop(0.65, `rgba(${sr},${sg},${sb},${alpha*0.12})`);
    grd.addColorStop(1,    `rgba(0,0,0,0)`);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, size, size);
  });

  // Procedural noise sub-lobes for filamentary structure
  const noiseCount = Math.floor(layers.length * 4 + 6);
  for (let i = 0; i < noiseCount; i++) {
    const seed = i * 7.3 + layers.length;
    const nx = 0.2 + (Math.sin(seed) * 0.5 + 0.5) * 0.6;
    const ny = 0.2 + (Math.cos(seed * 1.7) * 0.5 + 0.5) * 0.6;
    const nr = 0.04 + (Math.sin(seed * 3.1) * 0.5 + 0.5) * 0.12;
    const na = 0.02 + (Math.cos(seed * 2.3) * 0.5 + 0.5) * 0.06;
    // Alternate between primary and secondary colours
    const useSecondary = i % 3 === 0;
    const cr = useSecondary ? sr : r;
    const cg = useSecondary ? sg : g;
    const cb = useSecondary ? sb : b;
    const grd = ctx.createRadialGradient(nx*size, ny*size, 0, nx*size, ny*size, nr*size);
    grd.addColorStop(0, `rgba(${cr},${cg},${cb},${na})`);
    grd.addColorStop(1, `rgba(0,0,0,0)`);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, size, size);
  }

  // Outer fringe — very faint large ring
  const fringeGrd = ctx.createRadialGradient(size*0.5, size*0.5, size*0.3, size*0.5, size*0.5, size*0.5);
  fringeGrd.addColorStop(0, `rgba(0,0,0,0)`);
  fringeGrd.addColorStop(0.5, `rgba(${sr},${sg},${sb},0.015)`);
  fringeGrd.addColorStop(1, `rgba(0,0,0,0)`);
  ctx.fillStyle = fringeGrd;
  ctx.fillRect(0, 0, size, size);

  return c;
}

function addNebula(ra, dec, colorHex, secondaryHex, worldSize, layers) {
  const pos = raDecToVec3(ra, dec, 97);
  const canvas = makeFuzzyCanvas(256, colorHex, secondaryHex, layers);
  const tex  = new THREE.CanvasTexture(canvas);
  const mat  = new THREE.SpriteMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  sprite.position.copy(pos);
  sprite.scale.set(worldSize, worldSize, 1);
  scene.add(sprite);
}

// Orion Nebula region — blue-purple core, magenta rim, 6 lobes
addNebula(83.82, -5.39, 0x5577ff, 0xcc55aa, 40, [
  [0.50, 0.50, 0.45, 0.24],
  [0.38, 0.44, 0.24, 0.18],
  [0.62, 0.56, 0.22, 0.16],
  [0.50, 0.50, 0.18, 0.32],
  [0.44, 0.58, 0.14, 0.12],
  [0.58, 0.40, 0.12, 0.10],
]);
// Scorpius — reddish-orange core, deep red rim
addNebula(247.35, -26.43, 0xff5533, 0xcc2222, 34, [
  [0.50, 0.50, 0.42, 0.22],
  [0.40, 0.55, 0.22, 0.16],
  [0.60, 0.42, 0.20, 0.14],
  [0.48, 0.48, 0.12, 0.20],
  [0.55, 0.58, 0.10, 0.08],
]);
// Cygnus — blue-cyan core, pale violet rim
addNebula(310.36, 45.28, 0x44ccff, 0x8866dd, 30, [
  [0.50, 0.50, 0.42, 0.18],
  [0.50, 0.50, 0.20, 0.24],
  [0.42, 0.55, 0.15, 0.10],
  [0.58, 0.45, 0.13, 0.08],
]);
// Lyra — teal glow around Vega, blue-white rim
addNebula(279.23, 38.78, 0x66ffcc, 0x88aaff, 24, [
  [0.50, 0.50, 0.40, 0.16],
  [0.50, 0.50, 0.18, 0.22],
  [0.45, 0.55, 0.12, 0.10],
]);
// Sagittarius — golden galactic centre glow, warm orange rim
addNebula(266.0, -29.0, 0xffaa44, 0xff6622, 48, [
  [0.50, 0.50, 0.48, 0.14],
  [0.45, 0.52, 0.30, 0.12],
  [0.55, 0.48, 0.26, 0.10],
  [0.50, 0.50, 0.15, 0.18],
  [0.42, 0.46, 0.10, 0.06],
]);

// ─── Constellation rendering ──────────────────────────────────────────────────

const SPHERE_R = 100;

// Shared twinkle time uniforms per constellation batch
const conMatUniforms = [];
const constellationLabels = [];
const constellationObjects = []; // for demo mode + overlay shader

CONSTELLATIONS.forEach(con => {
  const col       = new THREE.Color(con.color);
  const positions = con.stars.map(([ra, dec]) => raDecToVec3(ra, dec, SPHERE_R));

  // ── Stars ──────────────────────────────────────────────────────────────────

  const nStars = positions.length;
  const sPosArr    = new Float32Array(nStars * 3);
  const sSizeArr   = new Float32Array(nStars);
  const sTwinkOff  = new Float32Array(nStars);
  const sMagArr    = new Float32Array(nStars);

  positions.forEach((p, i) => {
    sPosArr[i*3] = p.x; sPosArr[i*3+1] = p.y; sPosArr[i*3+2] = p.z;
    const [,, mag] = con.stars[i];
    sSizeArr[i]   = Math.max(2.5, 7.5 - mag * 1.4);
    sTwinkOff[i]  = seededRand(i * 37 + con.color) * Math.PI * 2;
    sMagArr[i]    = mag;
  });

  const sGeo = new THREE.BufferGeometry();
  sGeo.setAttribute('position',   new THREE.BufferAttribute(sPosArr,   3));
  sGeo.setAttribute('size',       new THREE.BufferAttribute(sSizeArr,  1));
  sGeo.setAttribute('twinkleOff', new THREE.BufferAttribute(sTwinkOff, 1));
  sGeo.setAttribute('mag',        new THREE.BufferAttribute(sMagArr,   1));

  const uTime = { value: 0 };
  conMatUniforms.push(uTime);

  // Two-pass: wide soft halo + sharp bright core
  const uDim = { value: 1.0 };
  const haloMat = new THREE.ShaderMaterial({
    uniforms: { starColor: { value: col }, uTime, uDim },
    vertexShader: `
      attribute float size;
      attribute float twinkleOff;
      attribute float mag;
      uniform   float uTime;
      varying   float vTwinkle;
      varying   float vMag;
      void main() {
        vMag = mag;
        // Layered twinkle: fast shimmer + slow breathe
        float freq   = 0.6 + fract(twinkleOff * 5.1) * 1.2;
        // Dim stars twinkle more (atmospheric scintillation)
        float twinkAmp = 0.15 + 0.20 * smoothstep(0.0, 4.0, mag);
        float fast = sin(uTime * freq + twinkleOff);
        float slow = sin(uTime * 0.15 + twinkleOff * 2.3);
        vTwinkle = (1.0 - twinkAmp) + twinkAmp * (fast * 0.7 + slow * 0.3);
        // Brighter stars get a larger halo multiplier
        float haloScale = 3.8 + smoothstep(2.0, 0.0, mag) * 1.2;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * haloScale * vTwinkle * (300.0 / -mv.z);
        gl_Position  = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3  starColor;
      uniform float uDim;
      varying float vTwinkle;
      varying float vMag;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = exp(-d * d * 6.0) * 0.35 * vTwinkle * uDim;
        // Brighter stars get a slightly more saturated halo
        float brightness = smoothstep(4.0, 0.0, vMag);
        vec3 col = mix(starColor * 0.8, starColor, brightness);
        gl_FragColor = vec4(col, a);
      }
    `,
    transparent: true,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
  });
  scene.add(new THREE.Points(sGeo, haloMat));

  const coreMat = new THREE.ShaderMaterial({
    uniforms: { starColor: { value: col }, uTime, uDim },
    vertexShader: `
      attribute float size;
      attribute float twinkleOff;
      attribute float mag;
      uniform   float uTime;
      varying   float vTwinkle;
      varying   float vMag;
      void main() {
        vMag = mag;
        float freq   = 0.6 + fract(twinkleOff * 5.1) * 1.2;
        float twinkAmp = 0.15 + 0.20 * smoothstep(0.0, 4.0, mag);
        float fast = sin(uTime * freq + twinkleOff);
        float slow = sin(uTime * 0.15 + twinkleOff * 2.3);
        vTwinkle = (1.0 - twinkAmp) + twinkAmp * (fast * 0.7 + slow * 0.3);
        // Slightly larger core for brighter stars
        float coreScale = 1.0 + smoothstep(2.0, 0.0, mag) * 0.25;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * coreScale * vTwinkle * (300.0 / -mv.z);
        gl_Position  = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3  starColor;
      uniform float uDim;
      varying float vTwinkle;
      varying float vMag;
      void main() {
        vec2  uv = gl_PointCoord - 0.5;
        float d  = length(uv);
        if (d > 0.5) discard;

        // Core disc
        float core = exp(-d * d * 30.0);
        // Soft halo
        float halo = exp(-d * d * 7.0) * 0.5;

        // 6-point diffraction spikes (3 axes at 60-degree intervals)
        float spike = 0.0;
        // Axis 1: horizontal/vertical cross
        spike += exp(-uv.x*uv.x * 180.0) * exp(-abs(uv.y) * 22.0);
        spike += exp(-uv.y*uv.y * 180.0) * exp(-abs(uv.x) * 22.0);
        // Axis 2: rotated 60 degrees
        float c60 = 0.5;   // cos(60)
        float s60 = 0.866; // sin(60)
        vec2 uv60 = vec2(uv.x * c60 + uv.y * s60, -uv.x * s60 + uv.y * c60);
        spike += exp(-uv60.x*uv60.x * 180.0) * exp(-abs(uv60.y) * 22.0);
        spike += exp(-uv60.y*uv60.y * 180.0) * exp(-abs(uv60.x) * 22.0);
        // Axis 3: rotated -60 degrees
        vec2 uv60n = vec2(uv.x * c60 - uv.y * s60, uv.x * s60 + uv.y * c60);
        spike += exp(-uv60n.x*uv60n.x * 200.0) * exp(-abs(uv60n.y) * 24.0);
        spike += exp(-uv60n.y*uv60n.y * 200.0) * exp(-abs(uv60n.x) * 24.0);
        // Scale spikes by brightness — brighter stars have more prominent spikes
        float spikeBright = 0.25 + smoothstep(3.0, 0.0, vMag) * 0.25;
        spike *= spikeBright;

        // Faint Airy ring for bright stars (mag < 1.5)
        float airy = 0.0;
        float airyStrength = smoothstep(1.8, 0.0, vMag);
        if (airyStrength > 0.0) {
          float ring = abs(d - 0.28);
          airy = exp(-ring * ring * 800.0) * 0.12 * airyStrength;
        }

        float a   = (core + halo + spike + airy) * vTwinkle * uDim;

        // Color temperature: bright stars get whiter/hotter cores
        float tempShift = smoothstep(3.5, 0.0, vMag);
        vec3  warmCore  = mix(vec3(1.0), vec3(1.0, 0.98, 0.95), 1.0 - tempShift);
        vec3  col = mix(warmCore, starColor, smoothstep(0.0, 0.3, d));

        gl_FragColor = vec4(col, a);
      }
    `,
    transparent: true,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
  });
  scene.add(new THREE.Points(sGeo, coreMat));

  animatedMaterials.push(haloMat);
  animatedMaterials.push(coreMat);

  // ── Label sprite ────────────────────────────────────────────────────────────

  const lc = document.createElement('canvas');
  lc.width = 512; lc.height = 112;
  const lx = lc.getContext('2d');
  lx.shadowColor = `rgb(${Math.round(col.r*255)},${Math.round(col.g*255)},${Math.round(col.b*255)})`;
  lx.shadowBlur  = 28;
  lx.font        = 'bold 38px Monda, sans-serif';
  lx.fillStyle   = `rgba(255,255,255,0.9)`;
  lx.textAlign   = 'center';
  lx.textBaseline = 'middle';
  lx.fillText(con.name, 256, 56);
  lx.fillText(con.name, 256, 56);

  const ltex = new THREE.CanvasTexture(lc);
  const lmat = new THREE.SpriteMaterial({
    map: ltex, transparent: true, opacity: 0.88,
    depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const ls = new THREE.Sprite(lmat);
  const centroid = positions
    .reduce((acc, p) => acc.add(p.clone()), new THREE.Vector3())
    .divideScalar(positions.length)
    .normalize()
    .multiplyScalar(SPHERE_R * 1.065);
  ls.position.copy(centroid);
  ls.scale.set(22, 5, 1);
  scene.add(ls);
  ls.userData.normal = centroid.clone().normalize();
  constellationLabels.push(ls);

  // Store star world-space positions and line connectivity for the overlay shader
  constellationObjects.push({ haloMat, coreMat, uDim, dimTarget: 1.0, label: ls, centroid: centroid.clone(),
    worldPositions: positions,
    lines: con.lines,
    color: col,
  });
});

// ─── Art Of Code constellation overlay ───────────────────────────────────────
// Fullscreen screen-space quad. Each frame we project the 3D star positions
// to NDC and upload them as uniforms. The shader draws sparkles + glowing lines
// between connected stars, adapted from the Art Of Code tutorial shader.

const CON_MAX_STARS = 64;
const CON_MAX_LINES = 64;
const CON_COUNT     = CONSTELLATIONS.length; // 8

// Build static line endpoint index arrays (flat, padded to CON_MAX_LINES each
// constellation). We'll encode them as vec2 (floats) since GLSL ES 1.0 on some
// WebGL1 drivers has limited ivec support.
// Layout: for constellation c, line l → index (c * CON_MAX_LINES + l)
// We store line pairs as separate float arrays: uLineA[64*8], uLineB[64*8].
// But WebGL uniform arrays have size limits, so instead pack per-constellation:
// uStarCount[8], uLineCount[8], uLineA[64], uLineB[64] with star offsets.

// Flat layout: all constellations' stars concatenated; starOffset[c] = start index.
const starOffsets = [];
const lineOffsets = [];
let totalStars = 0, totalLines = 0;
CONSTELLATIONS.forEach(con => {
  starOffsets.push(totalStars);
  lineOffsets.push(totalLines);
  totalStars += con.stars.length;
  totalLines += con.lines.length;
});

// Static line index arrays (flat over all constellations, absolute star indices)
const lineAArr = new Array(CON_MAX_LINES).fill(0);
const lineBArr = new Array(CON_MAX_LINES).fill(0);
CONSTELLATIONS.forEach((con, ci) => {
  const off = lineOffsets[ci];
  const sOff = starOffsets[ci];
  con.lines.forEach(([a, b], li) => {
    lineAArr[off + li] = sOff + a;
    lineBArr[off + li] = sOff + b;
  });
});

// Mutable screen-space positions updated each frame (vec2 NDC per star)
const starScreenPos = new Array(CON_MAX_STARS).fill(null).map(() => new THREE.Vector2(0, 0));
// Per-constellation dim value for demo mode (starts at 1.0)
const conDimArr = new Array(CON_COUNT).fill(1.0);

const overlayMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime:       { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    // Per-star screen positions (NDC -1..1 space, y up)
    uStarPos:    { value: starScreenPos },
    // Flat line connectivity (absolute star indices into uStarPos)
    uLineA:      { value: lineAArr.slice() },
    uLineB:      { value: lineBArr.slice() },
    // Per-constellation metadata
    uStarOffset: { value: starOffsets.slice() },
    uLineOffset: { value: lineOffsets.slice() },
    uStarCount:  { value: CONSTELLATIONS.map(c => c.stars.length) },
    uLineCount:  { value: CONSTELLATIONS.map(c => c.lines.length) },
    uConColor:   { value: CONSTELLATIONS.map(c => new THREE.Color(c.color)) },
    uConDim:     { value: conDimArr.slice() },
  },
  vertexShader: `
    void main() {
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    #define S smoothstep
    #define NUM_CONS  8
    #define MAX_STARS 64
    #define MAX_LINES 64

    uniform float uTime;
    uniform vec2  uResolution;
    uniform vec2  uStarPos[MAX_STARS];
    uniform float uLineA[MAX_LINES];
    uniform float uLineB[MAX_LINES];
    uniform int   uStarOffset[NUM_CONS];
    uniform int   uLineOffset[NUM_CONS];
    uniform int   uStarCount[NUM_CONS];
    uniform int   uLineCount[NUM_CONS];
    uniform vec3  uConColor[NUM_CONS];
    uniform float uConDim[NUM_CONS];

    out vec4 outColor;

    float DistLine(vec2 p, vec2 a, vec2 b) {
      vec2 pa = p - a;
      vec2 ba = b - a;
      float t = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
      return length(pa - ba * t);
    }

    float GlowLine(vec2 p, vec2 a, vec2 b) {
      float d    = DistLine(p, a, b);
      float core = S(0.0015, 0.0003, d) * 0.7;
      float glow = S(0.006,  0.002,  d) * 0.15;
      float m    = core + glow;
      float len  = length(a - b);
      m *= S(2.5, 0.1, len);
      return m;
    }

    float Sparkle(vec2 p, vec2 center, float t) {
      vec2  j     = (center - p) * 1400.0;
      float base  = 1.0 / max(dot(j, j), 0.0001);
      float seed  = fract(center.x * 412.3 + center.y * 253.7);
      float pulse = sin(t * 8.0 + seed * 20.0) * 0.5 + 0.5;
      return base * pulse * 0.6;
    }

    void main() {
      float aspect = uResolution.x / uResolution.y;
      vec2 uv = (gl_FragCoord.xy / uResolution - 0.5);
      uv.x *= aspect;

      vec3 col = vec3(0.0);

      for (int ci = 0; ci < NUM_CONS; ci++) {
        float dim = uConDim[ci];
        if (dim < 0.001) continue;

        vec3  tint = uConColor[ci];
        int   sOff = uStarOffset[ci];
        int   lOff = uLineOffset[ci];
        int   nS   = uStarCount[ci];
        int   nL   = uLineCount[ci];

        float m = 0.0;

        for (int li = 0; li < MAX_LINES; li++) {
          if (li >= nL) break;
          int ai = int(uLineA[lOff + li]);
          int bi = int(uLineB[lOff + li]);
          vec2 sa = uStarPos[ai] * 0.5; sa.x *= aspect;
          vec2 sb = uStarPos[bi] * 0.5; sb.x *= aspect;
          m += GlowLine(uv, sa, sb);
        }

        for (int si = 0; si < MAX_STARS; si++) {
          if (si >= nS) break;
          vec2 sc = uStarPos[sOff + si] * 0.5;
          sc.x *= aspect;
          m += Sparkle(uv, sc, uTime);
        }

        col += tint * m * dim;
      }

      col = clamp(col, 0.0, 1.2);
      outColor = vec4(col, 1.0);
    }
  `,
  transparent: false,
  depthTest:   false,
  depthWrite:  false,
  blending:    THREE.AdditiveBlending,
  glslVersion: THREE.GLSL3,
});

// Full-screen triangle (covers NDC -1..1)
const overlayGeo = new THREE.BufferGeometry();
overlayGeo.setAttribute('position', new THREE.BufferAttribute(
  new Float32Array([-1,-1,0,  3,-1,0,  -1,3,0]), 3
));
const overlayMesh = new THREE.Mesh(overlayGeo, overlayMat);
overlayMesh.frustumCulled = false;
overlayMesh.renderOrder   = 999;
scene.add(overlayMesh);

// ─── Shooting stars (meteors) ─────────────────────────────────────────────────

const MAX_METEORS   = 5;
const TRAIL_SEGS    = 12;
const meteors       = [];
const meteorGroup   = new THREE.Group();
scene.add(meteorGroup);

// Shared trail shader material
const meteorTrailMat = new THREE.ShaderMaterial({
  vertexShader: `
    attribute vec3 color;
    attribute float alpha;
    varying vec3  vColor;
    varying float vAlpha;
    void main() {
      vColor = color;
      vAlpha = alpha;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3  vColor;
    varying float vAlpha;
    void main() {
      gl_FragColor = vec4(vColor, vAlpha);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

// Head glow shader
const meteorHeadMat = new THREE.ShaderMaterial({
  uniforms: { uOpacity: { value: 1.0 } },
  vertexShader: `
    uniform float uOpacity;
    varying float vOp;
    void main() {
      vOp = uOpacity;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = min(5.0 * (300.0 / -mv.z), 40.0);
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: `
    varying float vOp;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      float core = exp(-d * d * 25.0);
      float halo = exp(-d * d * 5.0) * 0.5;
      float a = (core + halo) * vOp;
      // White-hot core, slight warm tinge at edge
      vec3 col = mix(vec3(1.0, 1.0, 1.0), vec3(1.0, 0.85, 0.6), smoothstep(0.0, 0.4, d));
      gl_FragColor = vec4(col, a);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

function spawnMeteor() {
  // Random start point on inner sphere
  const theta0 = Math.random() * Math.PI * 2;
  const phi0   = Math.acos(2 * Math.random() - 1);
  const r0     = 95;
  const start  = new THREE.Vector3(
    r0 * Math.sin(phi0) * Math.cos(theta0),
    r0 * Math.cos(phi0),
    r0 * Math.sin(phi0) * Math.sin(theta0),
  );

  // Velocity: tangential to sphere surface
  const radial = start.clone().normalize();
  const perp = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5)
    .projectOnPlane(radial).normalize();

  // Cross-drift direction for subtle arc curvature
  const drift = new THREE.Vector3().crossVectors(radial, perp).normalize();
  const driftAmt = (Math.random() - 0.5) * 1.5;

  // Random brightness class — occasional bright fireballs
  const isBright = Math.random() < 0.2;
  const speed    = isBright ? (10 + Math.random() * 6) : (6 + Math.random() * 8);
  const trailLen = isBright ? (6.0 + Math.random() * 4) : (3.0 + Math.random() * 4);
  const brightness = isBright ? 1.0 : (0.5 + Math.random() * 0.4);

  // Trail geometry: multi-segment line with per-vertex colour and alpha
  const trailGeo = new THREE.BufferGeometry();
  const posArr   = new Float32Array(TRAIL_SEGS * 3);
  const colArr   = new Float32Array(TRAIL_SEGS * 3);
  const alphaArr = new Float32Array(TRAIL_SEGS);
  trailGeo.setAttribute('position', new THREE.BufferAttribute(posArr,   3));
  trailGeo.setAttribute('color',    new THREE.BufferAttribute(colArr,   3));
  trailGeo.setAttribute('alpha',    new THREE.BufferAttribute(alphaArr, 1));

  const trailLine = new THREE.Line(trailGeo, meteorTrailMat);
  meteorGroup.add(trailLine);

  // Head glow point
  const headGeo = new THREE.BufferGeometry();
  const headPos = new Float32Array(3);
  headGeo.setAttribute('position', new THREE.BufferAttribute(headPos, 3));
  const headOpUniform = { value: 1.0 };
  const headMat = new THREE.ShaderMaterial({
    uniforms: { uOpacity: headOpUniform },
    vertexShader: meteorHeadMat.vertexShader,
    fragmentShader: meteorHeadMat.fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const headPts = new THREE.Points(headGeo, headMat);
  meteorGroup.add(headPts);

  return {
    trailLine, trailGeo, headPts, headGeo, headOpUniform,
    start: start.clone(), dir: perp, drift, driftAmt,
    speed, trailLen, brightness,
    t: 0, life: (12 + Math.random() * 10) / speed,
  };
}

// Stagger initial spawns
for (let i = 0; i < MAX_METEORS; i++) {
  const m = spawnMeteor();
  m.t = Math.random() * m.life;
  meteors.push(m);
}
// Position all geometries before first render to avoid origin flash
updateMeteors(0);

function updateMeteors(dt) {
  meteors.forEach((m, idx) => {
    m.t += dt;
    if (m.t > m.life) {
      // Respawn
      meteorGroup.remove(m.trailLine);
      meteorGroup.remove(m.headPts);
      m.trailGeo.dispose();
      m.headGeo.dispose();
      m.headPts.material.dispose();
      const nm = spawnMeteor();
      meteors[idx] = nm;
      // Immediately position new meteor so it never sits at origin
      positionMeteor(nm, 0);
      return;
    }

    positionMeteor(m, dt);
  });
}

function positionMeteor(m, _dt) {
    const progress = m.t / m.life;
    const fade     = Math.sin(progress * Math.PI);

    // Compute head position with arc curvature
    const headPos = m.start.clone()
      .add(m.dir.clone().multiplyScalar(m.t * m.speed))
      .add(m.drift.clone().multiplyScalar(m.t * m.t * m.driftAmt));
    headPos.normalize().multiplyScalar(95 - progress * 3);

    // Update head glow point
    const hArr = m.headGeo.attributes.position.array;
    hArr[0] = headPos.x; hArr[1] = headPos.y; hArr[2] = headPos.z;
    m.headGeo.attributes.position.needsUpdate = true;
    m.headOpUniform.value = fade * m.brightness;

    // Build trail segments behind the head
    const posArr   = m.trailGeo.attributes.position.array;
    const colArr   = m.trailGeo.attributes.color.array;
    const alphaArr = m.trailGeo.attributes.alpha.array;

    for (let s = 0; s < TRAIL_SEGS; s++) {
      const segT = s / (TRAIL_SEGS - 1); // 0 = head, 1 = tail
      const offset = segT * m.trailLen;
      const segPos = headPos.clone()
        .add(m.dir.clone().multiplyScalar(-offset))
        .add(m.drift.clone().multiplyScalar(-offset * m.t * m.driftAmt * 0.3));

      posArr[s*3]   = segPos.x;
      posArr[s*3+1] = segPos.y;
      posArr[s*3+2] = segPos.z;

      const cR = 1.0;
      const cG = 1.0 - segT * 0.35;
      const cB = 1.0 - segT * 0.65;
      colArr[s*3]   = cR;
      colArr[s*3+1] = cG;
      colArr[s*3+2] = cB;

      const segAlpha = (1.0 - segT * segT) * fade * m.brightness * 0.85;
      alphaArr[s] = Math.max(0, segAlpha);
    }

    m.trailGeo.attributes.position.needsUpdate = true;
    m.trailGeo.attributes.color.needsUpdate = true;
    m.trailGeo.attributes.alpha.needsUpdate = true;
}

// ─── Resize ───────────────────────────────────────────────────────────────────

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  bloomPass.setSize(Math.floor(window.innerWidth / 2), Math.floor(window.innerHeight / 2));
  overlayMat.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
});

// ─── Constellation info panel ─────────────────────────────────────────────────

const infoPanel       = document.getElementById('constellation-info');
const infoName        = document.getElementById('con-name');
const infoTranslation = document.getElementById('con-translation');
const infoDesc        = document.getElementById('con-desc');
let   infoIndex   = -1;   // index of constellation currently shown (-1 = none)
let   infoFadeOut = false; // mid-fade-out transition in progress

function showConstellationInfo(ci) {
  const con = CONSTELLATIONS[ci];
  const col = new THREE.Color(con.color);
  const r = Math.round(col.r * 255);
  const g = Math.round(col.g * 255);
  const b = Math.round(col.b * 255);
  infoName.textContent = con.name;
  infoName.style.textShadow = `0 0 14px rgba(${r},${g},${b},0.7)`;
  infoTranslation.textContent = con.translation || '';
  infoTranslation.style.display = con.translation ? '' : 'none';
  infoDesc.textContent = con.desc;
  infoPanel.style.opacity = '1';
  infoIndex = ci;
  infoFadeOut = false;
}

function hideConstellationInfo(onHidden) {
  infoFadeOut = true;
  infoPanel.style.opacity = '0';
  setTimeout(() => { infoFadeOut = false; if (onHidden) onHidden(); }, 1450);
}

// ─── Demo mode ────────────────────────────────────────────────────────────────

let demoActive    = false;
let demoIndex     = 0;
let demoTimer     = 0;
const DEMO_HOLD   = 8.0;   // seconds per constellation
const DEMO_TRANS  = 2.0;   // seconds for camera transition
let demoCamFrom   = new THREE.Vector3();
let demoCamTo     = new THREE.Vector3();
let demoCamT      = 1.0;   // 1 = transition complete
let demoCamWasMoving = false; // used to detect the moment the transition finishes
const demoBadge   = document.getElementById('demo-badge');
const CAMERA_DIST = 1.0;   // camera sits at distance 1 from origin

function demoTargetPos(index) {
  // Camera looks toward (0,0,0) from outside. To see a constellation on the
  // inner sphere surface, the camera must be on the OPPOSITE side of the centroid.
  return constellationObjects[index].centroid.clone().normalize().multiplyScalar(-CAMERA_DIST);
}

function startDemoFly(activeIdx) {
  // Called when the camera begins flying to a new constellation.
  // Only dim everything down and hide the panel — highlights apply on arrival.
  constellationObjects.forEach((obj, i) => {
    obj.dimTarget = (i === activeIdx) ? 0.06 : 0.06; // all dim during transit
    obj.label.userData.demoActive = (i === activeIdx); // label flag set early
  });
  // Hide the panel immediately; it will re-show once the camera arrives
  if (infoIndex !== -1 && !infoFadeOut) {
    hideConstellationInfo(() => { infoIndex = -1; });
  }
}

function arriveAtDemo(activeIdx) {
  // Called when the camera finishes flying to a constellation.
  // Now bring the active constellation to full brightness.
  constellationObjects.forEach((obj, i) => {
    obj.dimTarget = (i === activeIdx) ? 1.0 : 0.06;
  });
  // Fade in the info panel
  if (infoIndex !== activeIdx) {
    if (infoIndex === -1 || infoFadeOut) {
      showConstellationInfo(activeIdx);
    } else {
      hideConstellationInfo(() => showConstellationInfo(activeIdx));
    }
  }
}

function restoreDemoVisuals() {
  constellationObjects.forEach(obj => {
    obj.dimTarget = 1.0;
    obj.label.userData.demoActive = undefined;
  });
}

function startDemo() {
  demoActive  = true;
  demoIndex   = 0;
  demoTimer   = 0;
  demoCamWasMoving = false;
  demoBadge.style.display = 'block';
  controls.autoRotate = false;
  // Begin camera fly to first constellation
  demoCamFrom.copy(camera.position);
  demoCamTo.copy(demoTargetPos(0));
  demoCamT = 0;
  startDemoFly(0);
}

function stopDemo() {
  demoActive = false;
  demoBadge.style.display = 'none';
  controls.autoRotate = true;
  restoreDemoVisuals();
  // Hide info panel when leaving demo mode
  if (infoIndex !== -1 && !infoFadeOut) {
    hideConstellationInfo(() => { infoIndex = -1; });
  }
}

window.addEventListener('keydown', e => {
  if (e.key === 'd' || e.key === 'D') {
    demoActive ? stopDemo() : startDemo();
  }
});

// ─── Animate ──────────────────────────────────────────────────────────────────
let lastTime = 0;
const fpsEl = document.getElementById('fps');
let fpsFrames = 0, fpsAccum = 0;

function animateFixed() {
  requestAnimationFrame(animateFixed);
  const t  = clock.getElapsedTime();
  const dt = Math.min(0.05, Math.max(0.0001, t - lastTime));
  lastTime = t;

  // FPS counter — update display once per second
  fpsFrames++;
  fpsAccum += dt;
  if (fpsAccum >= 1.0) {
    fpsEl.textContent = `${Math.round(fpsFrames / fpsAccum)} FPS`;
    fpsFrames = 0;
    fpsAccum  = 0;
  }

  // ── Demo mode update ───────────────────────────────────────────────────────
  if (demoActive) {
    demoTimer += dt;

    // Camera fly: slerp the direction on the unit sphere over DEMO_TRANS seconds
    if (demoCamT < 1.0) {
      demoCamWasMoving = true;
      demoCamT = Math.min(1.0, demoCamT + dt / DEMO_TRANS);
      // Ease in-out quadratic
      const ease = demoCamT < 0.5
        ? 2 * demoCamT * demoCamT
        : 1 - Math.pow(-2 * demoCamT + 2, 2) / 2;
      // Slerp between the two unit directions, then scale to camera distance
      const fromDir = demoCamFrom.clone().normalize();
      const toDir   = demoCamTo.clone().normalize();
      const slerpDir = fromDir.clone().lerp(toDir, ease).normalize();
      camera.position.copy(slerpDir.multiplyScalar(CAMERA_DIST));
      camera.lookAt(0, 0, 0);
      // Sync OrbitControls internal state to match so it doesn't fight us
      controls.target.set(0, 0, 0);
      controls.update();
    } else if (demoCamWasMoving) {
      // Camera just arrived — highlight the constellation and show the panel
      demoCamWasMoving = false;
      arriveAtDemo(demoIndex);
    }

    // Advance to next constellation after DEMO_HOLD seconds
    if (demoTimer >= DEMO_HOLD) {
      demoTimer = 0;
      demoIndex = (demoIndex + 1) % constellationObjects.length;
      demoCamFrom.copy(camera.position);
      demoCamTo.copy(demoTargetPos(demoIndex));
      demoCamT = 0;
      startDemoFly(demoIndex);
    }
  }

  animatedMaterials.forEach(m => { if (m.uniforms?.uTime) m.uniforms.uTime.value = t; });
  conMatUniforms.forEach(u => { u.value = t; });
  overlayMat.uniforms.uTime.value = t;

  // ── Smooth dim transitions ─────────────────────────────────────────────────
  const DIM_SPEED_DOWN = 3.0; // dimming speed (units: 1/sec)
  const DIM_SPEED_UP   = 0.6; // brightening speed — slower fade-in
  constellationObjects.forEach(obj => {
    const diff = obj.dimTarget - obj.uDim.value;
    if (Math.abs(diff) > 0.0001) {
      const speed = diff > 0 ? DIM_SPEED_UP : DIM_SPEED_DOWN;
      obj.uDim.value += diff * Math.min(1.0, speed * dt);
    } else {
      obj.uDim.value = obj.dimTarget;
    }
  });

  // ── Project constellation star positions to screen space ───────────────────
  {
    const projMat = new THREE.Matrix4().multiplyMatrices(
      camera.projectionMatrix, camera.matrixWorldInverse
    );
    const tmpV = new THREE.Vector4();
    let si = 0;
    constellationObjects.forEach((obj, ci) => {
      // Update per-constellation dim for overlay (mutate in-place)
      overlayMat.uniforms.uConDim.value[ci] = obj.uDim.value;
      obj.worldPositions.forEach(wp => {
        tmpV.set(wp.x, wp.y, wp.z, 1.0).applyMatrix4(projMat);
        const w = tmpV.w;
        if (w <= 0) {
          starScreenPos[si].set(-10, -10);
        } else {
          starScreenPos[si].set(tmpV.x / w, tmpV.y / w);
        }
        si++;
      });
    });
    // Three.js reads .value by reference for array uniforms — no reassignment needed
  }

  const camDirFromOrigin = camera.position.clone().normalize();
  constellationLabels.forEach(label => {
    const normal = label.userData.normal;
    if (!normal) return;
    const facing = normal.dot(camDirFromOrigin);
    const fade = THREE.MathUtils.smoothstep(facing, -0.25, 0.35);
    const maxOpacity = (label.userData.demoActive === false) ? 0.05 : 0.88;
    label.material.opacity = Math.min(maxOpacity, 0.18 + fade * 0.7);
  });

  // ── Constellation info panel (free-look mode only) ─────────────────────────
  if (!demoActive) {
    let bestIndex = -1;
    let bestDot   = 0.6; // threshold — must be this centered to show panel
    constellationObjects.forEach((obj, i) => {
      const d = obj.centroid.clone().normalize().dot(camDirFromOrigin.clone().negate());
      if (d > bestDot) { bestDot = d; bestIndex = i; }
    });
    if (bestIndex !== -1) {
      if (infoIndex === -1 && !infoFadeOut) {
        showConstellationInfo(bestIndex);
      } else if (bestIndex !== infoIndex && !infoFadeOut) {
        hideConstellationInfo(() => showConstellationInfo(bestIndex));
      }
    } else {
      if (infoIndex !== -1 && !infoFadeOut) {
        hideConstellationInfo(() => { infoIndex = -1; });
      }
    }
  }

  scene.children.forEach(obj => {
    if (obj.userData.spinSpeed) {
      obj.rotation.y += obj.userData.spinSpeed * dt;
      obj.rotation.x += obj.userData.spinSpeed * 0.25 * dt;
    }
  });

  updateMeteors(dt);

  // During a demo camera transition, controls.update() was already called above
  if (!demoActive || demoCamT >= 1.0) controls.update();
  composer.render();
}

animateFixed();
