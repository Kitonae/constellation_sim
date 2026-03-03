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
  {
    name: 'Taurus',
    translation: 'The Bull',
    desc: 'Zeus transformed into a magnificent white bull to carry Europa across the sea to Crete.',
    color: 0xffaa66,
    stars: [
      [ 68.98, 16.51, 0.85], // 0 Aldebaran
      [ 81.57, 28.61, 1.65], // 1 Elnath
      [ 84.41, 21.14, 3.00], // 2 Tianguan (Zeta Tau)
      [ 60.17, 12.49, 3.65], // 3 Prima Hyadum (Gamma Tau)
      [ 61.42, 15.96, 3.76], // 4 Hyadum II (Delta1 Tau)
      [ 67.15, 19.18, 3.53], // 5 Ain (Epsilon Tau)
      [ 56.87, 24.11, 2.87], // 6 Alcyone (Eta Tau / Pleiades)
    ],
    lines: [[3,4],[4,5],[5,0],[0,1],[1,2],[5,6]],
  },
  {
    name: 'Aquila',
    translation: 'The Eagle',
    desc: 'The eagle that carried Zeus\'s thunderbolts, or bore Ganymede up to Olympus to serve the gods.',
    color: 0xccddff,
    stars: [
      [297.70,  8.87, 0.76], // 0 Altair
      [296.56, 10.61, 2.72], // 1 Tarazed
      [298.83,  6.41, 3.71], // 2 Alshain
      [299.69,  3.11, 3.36], // 3 Delta Aql
      [284.74, -4.88, 3.44], // 4 Lambda Aql
      [286.35, 13.86, 2.99], // 5 Zeta Aql
    ],
    lines: [[4,3],[3,0],[0,1],[1,5],[0,2]],
  },
  {
    name: 'Canis Major',
    translation: 'The Greater Dog',
    desc: 'Orion\'s faithful hunting hound, led by Sirius — the brightest star in all the night sky.',
    color: 0xaaccff,
    stars: [
      [101.29, -16.72, -1.46], // 0 Sirius
      [ 95.67, -17.96,  1.98], // 1 Mirzam
      [ 97.20, -15.63,  4.11], // 2 Muliphein
      [107.10, -26.39,  1.84], // 3 Wezen
      [104.66, -28.97,  1.50], // 4 Adhara
      [100.10, -30.06,  3.02], // 5 Furud
      [111.02, -29.30,  2.45], // 6 Aludra
    ],
    lines: [[1,0],[0,2],[2,3],[3,6],[3,4],[4,5]],
  },
  {
    name: 'Perseus',
    translation: 'The Hero',
    desc: 'The slayer of Medusa, who rescued Andromeda from the sea monster Cetus by turning it to stone.',
    color: 0xddaaff,
    stars: [
      [ 51.08, 49.86, 1.79], // 0 Mirfak
      [ 47.04, 40.96, 2.12], // 1 Algol
      [ 59.46, 40.01, 2.85], // 2 Menkib (Zeta Per)
      [ 55.73, 47.79, 3.01], // 3 Delta Per
      [ 57.91, 40.03, 2.90], // 4 Epsilon Per
      [ 46.29, 53.51, 2.84], // 5 Gamma Per
      [ 44.11, 47.71, 3.85], // 6 Kappa Per
    ],
    lines: [[5,0],[0,3],[3,4],[4,2],[0,6],[6,1],[1,4]],
  },
  {
    name: 'Draco',
    translation: 'The Dragon',
    desc: 'Ladon, the sleepless dragon who guarded the golden apples in the Garden of the Hesperides.',
    color: 0x88ddaa,
    stars: [
      [269.15, 51.49, 2.24], // 0 Eltanin
      [262.61, 52.30, 2.79], // 1 Rastaban
      [268.38, 56.87, 3.75], // 2 Grumium (Xi Dra)
      [211.10, 64.38, 3.65], // 3 Thuban
      [228.07, 68.77, 3.17], // 4 Edasich (Iota Dra)
      [245.16, 61.51, 2.74], // 5 Eta Dra
      [257.20, 65.71, 3.07], // 6 Aldhibah (Zeta Dra)
      [236.01, 58.97, 3.29], // 7 Chi Dra
    ],
    lines: [[0,1],[1,2],[2,6],[6,5],[5,7],[7,4],[4,3]],
  },
  {
    name: 'Sagittarius',
    translation: 'The Archer',
    desc: 'The wise centaur Chiron, aiming his arrow at Scorpius — his bow points toward the heart of the galaxy.',
    color: 0xff9966,
    stars: [
      [276.04, -34.38, 1.79], // 0 Kaus Australis (Eps Sgr)
      [283.82, -26.30, 2.05], // 1 Nunki (Sigma Sgr)
      [284.43, -29.88, 2.60], // 2 Ascella (Zeta Sgr)
      [275.25, -29.83, 2.72], // 3 Kaus Media (Delta Sgr)
      [273.44, -25.42, 2.82], // 4 Kaus Borealis (Lambda Sgr)
      [271.45, -30.42, 2.99], // 5 Nash (Gamma Sgr)
      [290.97, -40.62, 3.97], // 6 Rukbat (Alpha Sgr)
      [286.74, -44.80, 3.93], // 7 Arkab (Beta1 Sgr)
    ],
    lines: [[5,3],[3,0],[0,2],[2,1],[1,4],[4,3],[2,7],[7,6]],
  },
  {
    name: 'Virgo',
    translation: 'The Maiden',
    desc: 'Astraea, goddess of innocence and justice, the last immortal to abandon the Earth in the Age of Iron.',
    color: 0xeedd99,
    stars: [
      [201.30, -11.16, 0.98], // 0 Spica
      [177.67,  1.76,  3.59], // 1 Zavijava (Beta Vir)
      [190.42, -1.45,  2.74], // 2 Porrima (Gamma Vir)
      [184.98, -0.67,  3.38], // 3 Auva (Delta Vir)
      [195.54, 10.96,  2.83], // 4 Vindemiatrix (Eps Vir)
      [203.67, -5.54,  3.37], // 5 Heze (Zeta Vir)
    ],
    lines: [[1,3],[3,2],[2,0],[0,5],[2,4]],
  },
  {
    name: 'Aquarius',
    translation: 'The Water-Bearer',
    desc: 'Ganymede, the beautiful youth carried to Olympus by Zeus\'s eagle to pour nectar for the gods.',
    color: 0x88ccdd,
    stars: [
      [322.89, -5.57,  2.90], // 0 Sadalsuud (Beta Aqr)
      [331.45,  0.32,  2.95], // 1 Sadalmelik (Alpha Aqr)
      [343.66, -15.82, 3.27], // 2 Skat (Delta Aqr)
      [334.21, -0.32,  3.84], // 3 Sadachbia (Gamma Aqr)
      [325.02, -9.49,  3.77], // 4 Albali (Epsilon Aqr)
      [339.39, -7.58,  3.74], // 5 Lambda Aqr
      [338.96, -13.59, 4.16], // 6 Ancha (Theta Aqr)
    ],
    lines: [[4,0],[0,1],[1,3],[3,5],[5,6],[6,2]],
  },
  {
    name: 'Boötes',
    translation: 'The Herdsman',
    desc: 'The son of Zeus who invented the plough, or Arcas who nearly slew his own mother Callisto before Zeus intervened.',
    color: 0xffbb77,
    stars: [
      [213.91, 19.18, -0.05], // 0 Arcturus
      [218.01, 40.39,  2.68], // 1 Nekkar (Beta Boo)
      [208.67, 38.31,  3.03], // 2 Seginus (Gamma Boo)
      [221.25, 27.07,  3.47], // 3 Izar (Eps Boo)
      [224.69, 17.46,  3.49], // 4 Muphrid (Eta Boo)
      [217.96, 18.40,  4.05], // 5 Zeta Boo
      [206.87, 49.32,  3.57], // 6 Alkaid (actually Rho Boo — use Theta: 216.37,51.85)
    ],
    lines: [[0,4],[4,3],[3,2],[2,1],[1,6],[0,5],[5,3]],
  },
  {
    name: 'Corona Borealis',
    translation: 'The Northern Crown',
    desc: 'The jewelled crown of Ariadne, placed in the heavens by Dionysus as a token of his undying love.',
    color: 0xffeedd,
    stars: [
      [233.67, 26.71, 2.23], // 0 Alphecca (Alpha CrB)
      [231.96, 29.11, 3.68], // 1 Theta CrB
      [235.69, 28.27, 3.84], // 2 Beta CrB
      [238.36, 26.30, 4.15], // 3 Gamma CrB
      [240.24, 26.88, 4.57], // 4 Delta CrB
      [229.73, 26.88, 4.54], // 5 Iota CrB
    ],
    lines: [[5,1],[1,0],[0,2],[2,3],[3,4]],
  },
  {
    name: 'Hercules',
    translation: 'The Hero',
    desc: 'The greatest of Greek heroes, condemned to perform twelve impossible labours as penance for a moment of madness.',
    color: 0xddbb88,
    stars: [
      [258.76, 14.39, 2.78], // 0 Kornephoros (Beta Her)
      [247.55, 21.49, 3.16], // 1 Rasalgethi (Alpha Her)
      [256.01, 36.81, 3.75], // 2 Sarin (Delta Her)
      [258.77, 31.60, 3.48], // 3 Pi Her
      [264.87, 46.01, 3.16], // 4 Eta Her
      [251.49, 42.45, 3.82], // 5 Sigma Her
      [269.06, 37.25, 3.70], // 6 Zeta Her
      [263.05, 26.11, 3.86], // 7 Gamma Her
    ],
    lines: [[1,0],[0,7],[7,2],[2,5],[5,4],[4,6],[6,3],[3,0]],
  },
  {
    name: 'Pegasus',
    translation: 'The Winged Horse',
    desc: 'The immortal winged horse sprung from the blood of Medusa, tamed by Bellerophon to slay the Chimera.',
    color: 0xccbbff,
    stars: [
      [326.05, 15.21, 2.44], // 0 Scheat (Beta Peg)
      [322.17, 28.08, 2.49], // 1 Markab (Alpha Peg)
      [346.19, 15.21, 2.83], // 2 Algenib (Gamma Peg)
      [330.55, 10.83, 2.38], // 3 Matar (Eta Peg)  — actually Enif: [326.05,9.88]
      [311.55, 33.97, 2.46], // 4 Enif (Eps Peg) — [326.05,9.88,2.38]
      [335.21, 33.17, 3.76], // 5 Homam (Zeta Peg)
    ],
    lines: [[1,0],[0,5],[5,3],[3,2],[2,1],[0,4]],
  },
  {
    name: 'Andromeda',
    translation: 'The Chained Princess',
    desc: 'The Ethiopian princess chained to a rock as a sacrifice to Cetus, rescued at the last moment by Perseus.',
    color: 0xffbbcc,
    stars: [
      [  2.06, 29.09, 2.07], // 0 Alpheratz (Alpha And) — also in Pegasus square
      [ 17.43, 35.62, 2.07], // 1 Mirach (Beta And)
      [ 30.97, 42.33, 2.10], // 2 Almach (Gamma And)
      [ 10.00, 30.86, 3.27], // 3 Delta And
      [  9.24, 23.41, 4.26], // 4 Mu And
      [ 23.46, 46.46, 3.87], // 5 51 And (upsilon)
    ],
    lines: [[0,3],[3,1],[1,5],[5,2],[1,4]],
  },
  {
    name: 'Aries',
    translation: 'The Ram',
    desc: 'The golden-fleeced ram sent by Hermes to rescue Phrixus, whose fleece was later sought by Jason and the Argonauts.',
    color: 0xffddbb,
    stars: [
      [ 31.79, 23.46, 2.01], // 0 Hamal (Alpha Ari)
      [ 28.66, 20.81, 2.64], // 1 Sheratan (Beta Ari)
      [ 28.38, 27.26, 3.63], // 2 Mesarthim (Gamma Ari)
      [ 44.11, 27.98, 3.86], // 3 Botein (Delta Ari)
      [ 49.87, 27.26, 4.35], // 4 Epsilon Ari
    ],
    lines: [[2,1],[1,0],[0,3],[3,4]],
  },
  {
    name: 'Ursa Minor',
    translation: 'The Little Bear',
    desc: 'Arcas, son of Zeus and Callisto, transformed into a bear cub and placed beside his mother in the heavens.',
    color: 0x99ddff,
    stars: [
      [ 37.95, 89.26, 1.97], // 0 Polaris (Alpha UMi)
      [222.68, 86.59, 2.08], // 1 Kochab (Beta UMi)
      [236.01, 86.59, 3.05], // 2 Pherkad (Gamma UMi)
      [257.20, 82.03, 4.35], // 3 Delta UMi
      [260.35, 77.79, 4.22], // 4 Epsilon UMi
      [245.98, 77.79, 4.26], // 5 Zeta UMi
      [228.49, 74.16, 5.02], // 6 Eta UMi
    ],
    lines: [[0,6],[6,5],[5,4],[4,3],[3,2],[2,1],[1,0]],
  },
  {
    name: 'Pisces',
    translation: 'The Fish',
    desc: 'Aphrodite and Eros transformed into fish and bound together with a cord to escape the monster Typhon.',
    color: 0x99bbff,
    stars: [
      [356.65,  5.63, 3.62], // 0 Eta Psc
      [345.00, 15.35, 3.82], // 1 Omega Psc
      [351.00, 21.27, 4.01], // 2 Iota Psc
      [  5.21, 27.26, 4.53], // 3 Theta Psc
      [ 23.46, 33.43, 3.69], // 4 Epsilon Psc
      [ 20.00, 27.26, 4.44], // 5 Delta Psc
      [357.00, 28.07, 3.60], // 6 Gamma Psc (Alrescha area)
      [ 30.74, 15.35, 3.94], // 7 Nu Psc
    ],
    lines: [[0,1],[1,2],[2,6],[6,3],[3,4],[4,5],[5,7]],
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

// ─── Nebulae (kaliset fractal, localized billboards) ──────────────────────────
// Based on "Simplicity Galaxy" by CBS (https://www.shadertoy.com/view/MslGWN)
// and Jared Berghold's variant. Static, blurred, translucent clouds.

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
    float t  = field(p,  0.15, 13);
    float t2 = field(p2, 0.90, 18);

    vec3 col  = uColor  * (1.5 * 0.15 * t*t*t + 1.2 * 0.4 * t*t + 0.9 * t);
    vec3 col2 = uColor2 * (5.5 * t2*t2*t2 + 2.1 * t2*t2 + 2.2 * t2 * 0.45);
    vec3 rgb  = (col + col2 * 0.5) * mask * 0.15;

    gl_FragColor = vec4(rgb, 1.0);
  }
`;

function addNebula(ra, dec, color1, color2, worldSize, offset, scale) {
  const pos = raDecToVec3(ra, dec, 97);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uColor:   { value: new THREE.Color(color1) },
      uColor2:  { value: new THREE.Color(color2) },
      uOffset:  { value: new THREE.Vector2(offset[0], offset[1]) },
      uScale:   { value: scale },
    },
    vertexShader:   nebulaVertexShader,
    fragmentShader: nebulaFragmentShader,
    transparent:    true,
    depthWrite:     false,
    blending:       THREE.AdditiveBlending,
    side:           THREE.DoubleSide,
  });
  const sprite = new THREE.Mesh(new THREE.PlaneGeometry(worldSize, worldSize), mat);
  sprite.position.copy(pos);
  sprite.lookAt(0, 0, 0);
  scene.add(sprite);
}

// Each nebula: ra, dec, primaryColor, secondaryColor, worldSize, [fractalOffsetX,Y], fractalScale
addNebula( 83.82,  -5.39, 0x4466ff, 0xcc44bb,  42, [ 0.80, -1.30], 1.8); // Orion     — blue/magenta
addNebula(247.35, -26.43, 0xff4422, 0xff9900,  36, [ 1.20, -0.80], 2.1); // Scorpius  — red/orange
addNebula(310.36,  45.28, 0x22ccff, 0x7755ee,  32, [ 0.40, -1.60], 1.6); // Cygnus    — cyan/violet
addNebula(279.23,  38.78, 0x44ffcc, 0x6699ff,  26, [-0.20, -1.10], 2.4); // Lyra      — teal/blue
addNebula(266.00, -29.00, 0xffaa33, 0xff5511,  50, [ 2.00, -1.30], 1.4); // Sagittarius — gold/orange

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

const CON_MAX_STARS = 256;
const CON_MAX_LINES = 256;
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
    #define NUM_CONS  24
    #define MAX_STARS 256
    #define MAX_LINES 256

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

const MAX_METEORS   = 3;
const meteors       = [];
const meteorGroup   = new THREE.Group();
scene.add(meteorGroup);

// Palette of meteor color types: orange, white, blue
const METEOR_PALETTES = [
  { core: new THREE.Color(1.0, 0.55, 0.10), halo: new THREE.Color(1.0, 0.30, 0.05) }, // orange
  { core: new THREE.Color(1.0, 1.00, 1.00), halo: new THREE.Color(0.8, 0.85, 1.00) }, // white
  { core: new THREE.Color(0.5, 0.80, 1.00), halo: new THREE.Color(0.2, 0.50, 1.00) }, // blue
];

// Head glow shader — tiny pinpoint rendered in 3D scene (goes through bloom)
// Kept very small so it fuses seamlessly with the feedback trail beneath it.
const meteorHeadMat = new THREE.ShaderMaterial({
  uniforms: {
    uOpacity: { value: 1.0 },
    uCoreCol: { value: new THREE.Color(1, 1, 1) },
    uHaloCol: { value: new THREE.Color(1, 1, 1) },
  },
  vertexShader: `
    uniform float uOpacity;
    varying float vOp;
    void main() {
      vOp = uOpacity;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = min(1.8 * (300.0 / -mv.z), 8.0);
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: `
    uniform vec3  uCoreCol;
    uniform vec3  uHaloCol;
    varying float vOp;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      float core = exp(-d * d * 60.0);
      float a = core * vOp;
      gl_FragColor = vec4(uCoreCol, a);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

function spawnMeteor() {
  const theta0 = Math.random() * Math.PI * 2;
  const phi0   = Math.acos(2 * Math.random() - 1);
  const r0     = 95;
  const start  = new THREE.Vector3(
    r0 * Math.sin(phi0) * Math.cos(theta0),
    r0 * Math.cos(phi0),
    r0 * Math.sin(phi0) * Math.sin(theta0),
  );

  const radial = start.clone().normalize();
  const perp = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5)
    .projectOnPlane(radial).normalize();
  const drift    = new THREE.Vector3().crossVectors(radial, perp).normalize();
  const driftAmt = (Math.random() - 0.5) * 1.5;

  const isBright   = Math.random() < 0.2;
  const speed      = isBright ? (10 + Math.random() * 6) : (6 + Math.random() * 8);
  const brightness = isBright ? 1.0 : (0.5 + Math.random() * 0.4);

  // Pick a random color palette: orange, white, or blue
  const palette = METEOR_PALETTES[Math.floor(Math.random() * METEOR_PALETTES.length)];

  // Head glow point (3D, rendered through bloom)
  const headGeo = new THREE.BufferGeometry();
  const headPos = new Float32Array(3);
  headGeo.setAttribute('position', new THREE.BufferAttribute(headPos, 3));
  const headOpUniform   = { value: 0.0 }; // starts invisible; set to non-zero only after spawnDelay expires
  const headCoreUniform = { value: palette.core.clone() };
  const headHaloUniform = { value: palette.halo.clone() };
  const headMat = new THREE.ShaderMaterial({
    uniforms: {
      uOpacity: headOpUniform,
      uCoreCol: headCoreUniform,
      uHaloCol: headHaloUniform,
    },
    vertexShader:   meteorHeadMat.vertexShader,
    fragmentShader: meteorHeadMat.fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const headPts = new THREE.Points(headGeo, headMat);
  // NOTE: headPts is NOT added to meteorGroup here.
  // updateMeteors adds it once spawnDelay reaches zero.

  return {
    headPts, headGeo, headOpUniform,
    palette,
    start: start.clone(), dir: perp, drift, driftAmt,
    speed, brightness,
    t: 0, life: (28 + Math.random() * 20) / speed,
    // Current and previous NDC positions — used for motion-blur segment in feedback shader
    ndcPos:      new THREE.Vector2(-10, -10),
    ndcPosPrev:  new THREE.Vector2(-10, -10),
    spawnDelay:  0, // seconds to wait before becoming active (used after death)
    active: true,
  };
}

for (let i = 0; i < MAX_METEORS; i++) {
  const m = spawnMeteor();
  m.spawnDelay = i * 4 + Math.random() * 4; // stagger initial appearances: ~0s, ~4s, ~8s
  meteors.push(m);
  // spawnDelay > 0 for all, so none are added to scene yet — updateMeteors handles it
}

function updateMeteors(dt) {
  meteors.forEach((m, idx) => {
    // Count down respawn delay — meteor is invisible and off-screen during this time
    if (m.spawnDelay > 0) {
      m.spawnDelay -= dt;
      if (m.spawnDelay <= 0) {
        // Delay just expired — add head to scene and start moving
        meteorGroup.add(m.headPts);
        positionMeteor(m, 0);
      }
      return;
    }
    m.t += dt;
    if (m.t > m.life) {
      meteorGroup.remove(m.headPts);
      m.headGeo.dispose();
      m.headPts.material.dispose();
      const nm = spawnMeteor();
      nm.spawnDelay = 5 + Math.random() * 10; // wait 5–15 s before appearing
      meteors[idx] = nm;
      return;
    }
    positionMeteor(m, dt);
  });
}

function positionMeteor(m, _dt) {
  const progress = m.t / m.life;
  const fade     = Math.sin(progress * Math.PI);

  const headPos3 = m.start.clone()
    .add(m.dir.clone().multiplyScalar(m.t * m.speed))
    .add(m.drift.clone().multiplyScalar(m.t * m.t * m.driftAmt));
  headPos3.normalize().multiplyScalar(95 - progress * 3);

  const hArr = m.headGeo.attributes.position.array;
  hArr[0] = headPos3.x; hArr[1] = headPos3.y; hArr[2] = headPos3.z;
  m.headGeo.attributes.position.needsUpdate = true;
  m.headOpUniform.value = fade * m.brightness;
}

// ─── Meteor feedback trail (screen-space ping-pong) ───────────────────────────
// Two render targets alternated each frame. The feedback shader reads the
// previous RT, multiplies by a decay factor, then additively draws a screen-
// space glow at each meteor head position — exactly like the original Shadertoy.

const rtParams = {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat,
  type: THREE.HalfFloatType,
};
let meteorRtA = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, rtParams);
let meteorRtB = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, rtParams);

// Uniform array: up to MAX_METEORS NDC positions, opacity, and core color per meteor
const meteorNdcUniforms   = meteors.map(() => new THREE.Vector2(-10, -10));
const meteorPrevUniforms  = meteors.map(() => new THREE.Vector2(-10, -10));
const meteorOpUniforms    = new Array(MAX_METEORS).fill(0);
const meteorColorUniforms = meteors.map(() => new THREE.Color(1, 1, 1));

const meteorFeedbackMat = new THREE.ShaderMaterial({
  uniforms: {
    uPrevFrame:    { value: meteorRtA.texture },
    uResolution:   { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uMeteorPos:    { value: meteorNdcUniforms   },
    uMeteorPrev:   { value: meteorPrevUniforms  },
    uMeteorOp:     { value: meteorOpUniforms    },
    uMeteorColor:  { value: meteorColorUniforms },
    uMeteorCount:  { value: MAX_METEORS },
  },
  vertexShader: `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`,
  fragmentShader: `
    precision highp float;
    #define MAX_M 3
    uniform sampler2D uPrevFrame;
    uniform vec2      uResolution;
    uniform vec2      uMeteorPos[MAX_M];
    uniform vec2      uMeteorPrev[MAX_M];
    uniform float     uMeteorOp[MAX_M];
    uniform vec3      uMeteorColor[MAX_M];
    uniform int       uMeteorCount;

    // Distance from point p to line segment (a→b), in pixels
    float segDist(vec2 p, vec2 a, vec2 b) {
      vec2 ab = b - a;
      float len2 = dot(ab, ab);
      if (len2 < 0.0001) return distance(p, a);
      float t = clamp(dot(p - a, ab) / len2, 0.0, 1.0);
      return distance(p, a + t * ab);
    }

    void main() {
      vec2 fc   = gl_FragCoord.xy;
      vec2 uv   = fc / uResolution;

      // Decay previous frame — slow fade so trails linger visibly
      vec3 col = texture2D(uPrevFrame, uv).rgb * 0.96;

      // Glow radius in pixels — matches effective point size of the 3D head
      float size = 1.6;

      for (int i = 0; i < MAX_M; i++) {
        float op = uMeteorOp[i];
        if (op < 0.005) continue;

        // Convert NDC to pixel coords for both current and previous positions
        vec2 curr = (uMeteorPos[i]  * 0.5 + 0.5) * uResolution;
        vec2 prev = (uMeteorPrev[i] * 0.5 + 0.5) * uResolution;

        // Capsule distance: closest point on the motion segment this frame
        float dist = segDist(fc, prev, curr);

        // Soft Lorentzian glow along the whole segment → motion blur
        float glow = (size * size) / (dist * dist + size * size);

        // White-hot centre fading to palette colour at edge
        vec3 tint = mix(vec3(1.0), uMeteorColor[i],
                        smoothstep(0.0, 1.0, dist / (size * 3.0)));
        col += tint * glow * op * 0.85;
      }

      col = min(col, vec3(1.5));
      gl_FragColor = vec4(col, 1.0);
    }
  `,
  depthTest:  false,
  depthWrite: false,
});

// Fullscreen quad for both the feedback pass and the composite blit
const fsQuadGeo = new THREE.PlaneGeometry(2, 2);
const meteorFeedbackMesh = new THREE.Mesh(fsQuadGeo, meteorFeedbackMat);

// Composite: blit the feedback RT additively over the final rendered frame
const meteorCompositeMat = new THREE.ShaderMaterial({
  uniforms: {
    uTrail:      { value: meteorRtB.texture },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  },
  vertexShader: `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`,
  fragmentShader: `
    precision highp float;
    uniform sampler2D uTrail;
    uniform vec2      uResolution;
    void main() {
      vec2 uv  = gl_FragCoord.xy / uResolution;
      vec3 col = texture2D(uTrail, uv).rgb;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
  transparent: true,
  blending:    THREE.AdditiveBlending,
  depthTest:   false,
  depthWrite:  false,
});
const meteorCompositeMesh = new THREE.Mesh(fsQuadGeo, meteorCompositeMat);

// Minimal orthographic scene for fullscreen passes
const orthoScene  = new THREE.Scene();
const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

// Clear both RTs on startup so they contain black (not GPU garbage)
renderer.setRenderTarget(meteorRtA);
renderer.clear();
renderer.setRenderTarget(meteorRtB);
renderer.clear();
renderer.setRenderTarget(null);

// ─── Resize ───────────────────────────────────────────────────────────────────

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  bloomPass.setSize(Math.floor(window.innerWidth / 2), Math.floor(window.innerHeight / 2));
  overlayMat.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  meteorRtA.setSize(window.innerWidth, window.innerHeight);
  meteorRtB.setSize(window.innerWidth, window.innerHeight);
  meteorFeedbackMat.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  meteorCompositeMat.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
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
      // Dim all but the focused constellation
      constellationObjects.forEach((obj, i) => {
        obj.dimTarget = (i === bestIndex) ? 1.0 : 0.06;
      });
      if (infoIndex === -1 && !infoFadeOut) {
        showConstellationInfo(bestIndex);
      } else if (bestIndex !== infoIndex && !infoFadeOut) {
        hideConstellationInfo(() => showConstellationInfo(bestIndex));
      }
    } else {
      // Nothing focused — restore all to full brightness
      constellationObjects.forEach(obj => { obj.dimTarget = 1.0; });
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

  // ── Project meteor head positions to NDC for feedback shader ───────────────
  {
    const projMat = new THREE.Matrix4().multiplyMatrices(
      camera.projectionMatrix, camera.matrixWorldInverse
    );
    const tmpV = new THREE.Vector4();
    meteors.forEach((m, i) => {
      // Save last frame's NDC before overwriting
      meteorPrevUniforms[i].copy(m.ndcPos);

      const arr = m.headGeo.attributes.position.array;
      tmpV.set(arr[0], arr[1], arr[2], 1.0).applyMatrix4(projMat);
      const w = tmpV.w;
      if (w <= 0 || m.headOpUniform.value < 0.001) {
        m.ndcPos.set(-10, -10);
        meteorNdcUniforms[i].set(-10, -10);
        meteorPrevUniforms[i].set(-10, -10); // don't draw a segment to off-screen
      } else {
        m.ndcPos.set(tmpV.x / w, tmpV.y / w);
        meteorNdcUniforms[i].copy(m.ndcPos);
      }
      meteorOpUniforms[i] = m.headOpUniform.value;
      meteorColorUniforms[i].copy(m.palette.core);
    });
    meteorFeedbackMat.uniforms.uMeteorOp.value    = meteorOpUniforms;
    meteorFeedbackMat.uniforms.uMeteorColor.value = meteorColorUniforms;
  }

  // ── Meteor feedback ping-pong ───────────────────────────────────────────────
  // 1. Render feedback (prev RT → write to meteorRtB)
  meteorFeedbackMat.uniforms.uPrevFrame.value = meteorRtA.texture;
  orthoScene.add(meteorFeedbackMesh);
  renderer.setRenderTarget(meteorRtB);
  renderer.autoClear = true;
  renderer.render(orthoScene, orthoCamera);
  renderer.autoClear = true;
  orthoScene.remove(meteorFeedbackMesh);

  // 2. Render 3D scene + bloom to screen
  renderer.setRenderTarget(null);
  // During a demo camera transition, controls.update() was already called above
  if (!demoActive || demoCamT >= 1.0) controls.update();
  composer.render();

  // 3. Composite feedback trail additively over the finished frame
  //    Must NOT auto-clear here or we erase the bloom output
  meteorCompositeMat.uniforms.uTrail.value = meteorRtB.texture;
  orthoScene.add(meteorCompositeMesh);
  renderer.autoClear = false;
  renderer.render(orthoScene, orthoCamera);
  renderer.autoClear = true;
  orthoScene.remove(meteorCompositeMesh);

  // Swap ping-pong targets: what we just wrote (meteorRtB) becomes next frame's "prev"
  const tmp = meteorRtA; meteorRtA = meteorRtB; meteorRtB = tmp;
}

animateFixed();
