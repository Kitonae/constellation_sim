import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// ─── Renderer ────────────────────────────────────────────────────────────────

const container = document.getElementById('canvas-container');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x00000a);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 1);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.25;
controls.zoomSpeed = 0.7;
controls.minDistance = 0.4;
controls.maxDistance = 3.5;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.06;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(Math.floor(window.innerWidth / 2), Math.floor(window.innerHeight / 2)),
  1.15,
  0.6,
  0.55,
);
bloomPass.enabled = true;
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
      [88.79, 7.41, 0.42],  // 0 Betelgeuse
      [81.28, 6.35, 1.64],  // 1 Bellatrix
      [83.00, 0.30, 2.23],  // 2 Mintaka
      [84.05, -1.20, 1.69],  // 3 Alnilam
      [85.19, -1.94, 1.74],  // 4 Alnitak
      [86.94, -9.67, 2.06],  // 5 Saiph
      [78.63, -8.20, 0.18],  // 6 Rigel
      [83.78, 9.93, 3.39],  // 7 Meissa
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 2],
      [0, 3], [7, 0], [7, 1],
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
      [0, 1], [1, 2], [2, 3], [3, 0],
      [3, 4], [4, 5], [5, 6],
    ],
  },
  {
    name: 'Cassiopeia',
    translation: 'The Seated Queen',
    desc: 'A vain Ethiopian queen chained to her throne in the heavens as punishment for her boastfulness.',
    color: 0xffddaa,
    stars: [
      [2.29, 59.15, 2.27],  // 0 Caph
      [10.13, 56.54, 2.23],  // 1 Schedar
      [14.18, 60.72, 2.47],  // 2 Gamma Cas
      [21.45, 60.24, 2.68],  // 3 Ruchbah
      [28.60, 63.67, 3.35],  // 4 Segin
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
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
    lines: [[0, 2], [2, 5], [5, 4], [4, 6], [0, 3], [3, 1], [2, 3]],
  },
  {
    name: 'Scorpius',
    translation: 'The Scorpion',
    desc: 'The scorpion sent by Gaia to slay Orion, placed opposite him so they never share the sky.',
    color: 0xff8877,
    stars: [
      [247.35, -26.43, 0.91], // 0  Antares
      [240.08, -19.81, 2.62], // 1  Graffias
      [240.08, -22.62, 2.29], // 2  Dschubba
      [245.30, -25.59, 2.89], // 3  Sigma Sco
      [247.55, -28.22, 2.82], // 4  Tau Sco
      [253.50, -34.29, 2.29], // 5  Epsilon Sco
      [252.97, -38.05, 3.04], // 6  Mu Sco
      [258.04, -43.24, 3.32], // 7  Eta Sco
      [264.33, -42.99, 1.86], // 8  Theta Sco
      [266.89, -45.00, 3.03], // 9  Iota Sco
      [265.62, -39.03, 2.41], // 10 Kappa Sco
      [263.40, -37.10, 1.62], // 11 Lambda Sco
      [265.62, -37.30, 2.69], // 12 Upsilon Sco
    ],
    lines: [
      [1, 2], [2, 0], [0, 3], [3, 4], [4, 5], [5, 6], [6, 7],
      [7, 8], [8, 9], [8, 10], [10, 11], [11, 12],
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
    lines: [[0, 1], [1, 2], [3, 1], [1, 4]],
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
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 3], [0, 4]],
  },
  {
    name: 'Gemini',
    translation: 'The Twins',
    desc: 'Castor and Pollux, the inseparable twin brothers who share immortality between earth and Olympus.',
    color: 0xffeeaa,
    stars: [
      [116.33, 28.03, 1.14], // 0 Pollux
      [113.65, 31.89, 1.57], // 1 Castor
      [99.43, 16.40, 1.93], // 2 Alhena
      [110.03, 21.98, 3.53], // 3 Wasat
      [100.98, 25.13, 2.98], // 4 Mebsuda
      [100.18, 20.57, 3.79], // 5 Mekbuda
      [93.72, 22.51, 3.28], // 6 Propus
      [95.74, 22.51, 2.86], // 7 Tejat
    ],
    lines: [[1, 4], [4, 6], [6, 7], [7, 5], [5, 2], [0, 3], [3, 4], [3, 7], [0, 1]],
  },
  {
    name: 'Taurus',
    translation: 'The Bull',
    desc: 'Zeus transformed into a magnificent white bull to carry Europa across the sea to Crete.',
    color: 0xffaa66,
    stars: [
      [68.98, 16.51, 0.85], // 0 Aldebaran
      [81.57, 28.61, 1.65], // 1 Elnath
      [84.41, 21.14, 3.00], // 2 Tianguan (Zeta Tau)
      [60.17, 12.49, 3.65], // 3 Prima Hyadum (Gamma Tau)
      [61.42, 15.96, 3.76], // 4 Hyadum II (Delta1 Tau)
      [67.15, 19.18, 3.53], // 5 Ain (Epsilon Tau)
      [56.87, 24.11, 2.87], // 6 Alcyone (Eta Tau / Pleiades)
    ],
    lines: [[3, 4], [4, 5], [5, 0], [0, 1], [1, 2], [5, 6]],
  },
  {
    name: 'Aquila',
    translation: 'The Eagle',
    desc: 'The eagle that carried Zeus\'s thunderbolts, or bore Ganymede up to Olympus to serve the gods.',
    color: 0xccddff,
    stars: [
      [297.70, 8.87, 0.76], // 0 Altair
      [296.56, 10.61, 2.72], // 1 Tarazed
      [298.83, 6.41, 3.71], // 2 Alshain
      [299.69, 3.11, 3.36], // 3 Delta Aql
      [284.74, -4.88, 3.44], // 4 Lambda Aql
      [286.35, 13.86, 2.99], // 5 Zeta Aql
    ],
    lines: [[4, 3], [3, 0], [0, 1], [1, 5], [0, 2]],
  },
  {
    name: 'Canis Major',
    translation: 'The Greater Dog',
    desc: 'Orion\'s faithful hunting hound, led by Sirius — the brightest star in all the night sky.',
    color: 0xaaccff,
    stars: [
      [101.29, -16.72, -1.46], // 0 Sirius
      [95.67, -17.96, 1.98], // 1 Mirzam
      [97.20, -15.63, 4.11], // 2 Muliphein
      [107.10, -26.39, 1.84], // 3 Wezen
      [104.66, -28.97, 1.50], // 4 Adhara
      [100.10, -30.06, 3.02], // 5 Furud
      [111.02, -29.30, 2.45], // 6 Aludra
    ],
    lines: [[1, 0], [0, 2], [2, 3], [3, 6], [3, 4], [4, 5]],
  },
  {
    name: 'Perseus',
    translation: 'The Hero',
    desc: 'The slayer of Medusa, who rescued Andromeda from the sea monster Cetus by turning it to stone.',
    color: 0xddaaff,
    stars: [
      [51.08, 49.86, 1.79], // 0 Mirfak
      [47.04, 40.96, 2.12], // 1 Algol
      [59.46, 40.01, 2.85], // 2 Menkib (Zeta Per)
      [55.73, 47.79, 3.01], // 3 Delta Per
      [57.91, 40.03, 2.90], // 4 Epsilon Per
      [46.29, 53.51, 2.84], // 5 Gamma Per
      [44.11, 47.71, 3.85], // 6 Kappa Per
    ],
    lines: [[5, 0], [0, 3], [3, 4], [4, 2], [0, 6], [6, 1], [1, 4]],
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
    lines: [[0, 1], [1, 2], [2, 6], [6, 5], [5, 7], [7, 4], [4, 3]],
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
    lines: [[5, 3], [3, 0], [0, 2], [2, 1], [1, 4], [4, 3], [2, 7], [7, 6]],
  },
  {
    name: 'Virgo',
    translation: 'The Maiden',
    desc: 'Astraea, goddess of innocence and justice, the last immortal to abandon the Earth in the Age of Iron.',
    color: 0xeedd99,
    stars: [
      [201.30, -11.16, 0.98], // 0 Spica
      [177.67, 1.76, 3.59], // 1 Zavijava (Beta Vir)
      [190.42, -1.45, 2.74], // 2 Porrima (Gamma Vir)
      [184.98, -0.67, 3.38], // 3 Auva (Delta Vir)
      [195.54, 10.96, 2.83], // 4 Vindemiatrix (Eps Vir)
      [203.67, -5.54, 3.37], // 5 Heze (Zeta Vir)
    ],
    lines: [[1, 3], [3, 2], [2, 0], [0, 5], [2, 4]],
  },
  {
    name: 'Aquarius',
    translation: 'The Water-Bearer',
    desc: 'Ganymede, the beautiful youth carried to Olympus by Zeus\'s eagle to pour nectar for the gods.',
    color: 0x88ccdd,
    stars: [
      [322.89, -5.57, 2.90], // 0 Sadalsuud (Beta Aqr)
      [331.45, 0.32, 2.95], // 1 Sadalmelik (Alpha Aqr)
      [343.66, -15.82, 3.27], // 2 Skat (Delta Aqr)
      [334.21, -0.32, 3.84], // 3 Sadachbia (Gamma Aqr)
      [325.02, -9.49, 3.77], // 4 Albali (Epsilon Aqr)
      [339.39, -7.58, 3.74], // 5 Lambda Aqr
      [338.96, -13.59, 4.16], // 6 Ancha (Theta Aqr)
    ],
    lines: [[4, 0], [0, 1], [1, 3], [3, 5], [5, 6], [6, 2]],
  },
  {
    name: 'Boötes',
    translation: 'The Herdsman',
    desc: 'The son of Zeus who invented the plough, or Arcas who nearly slew his own mother Callisto before Zeus intervened.',
    color: 0xffbb77,
    stars: [
      [213.91, 19.18, -0.05], // 0 Arcturus
      [218.01, 40.39, 2.68], // 1 Nekkar (Beta Boo)
      [208.67, 38.31, 3.03], // 2 Seginus (Gamma Boo)
      [221.25, 27.07, 3.47], // 3 Izar (Eps Boo)
      [224.69, 17.46, 3.49], // 4 Muphrid (Eta Boo)
      [217.96, 18.40, 4.05], // 5 Zeta Boo
      [206.87, 49.32, 3.57], // 6 Alkaid (actually Rho Boo — use Theta: 216.37,51.85)
    ],
    lines: [[0, 4], [4, 3], [3, 2], [2, 1], [1, 6], [0, 5], [5, 3]],
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
    lines: [[5, 1], [1, 0], [0, 2], [2, 3], [3, 4]],
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
    lines: [[1, 0], [0, 7], [7, 2], [2, 5], [5, 4], [4, 6], [6, 3], [3, 0]],
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
    lines: [[1, 0], [0, 5], [5, 3], [3, 2], [2, 1], [0, 4]],
  },
  {
    name: 'Andromeda',
    translation: 'The Chained Princess',
    desc: 'The Ethiopian princess chained to a rock as a sacrifice to Cetus, rescued at the last moment by Perseus.',
    color: 0xffbbcc,
    stars: [
      [2.06, 29.09, 2.07], // 0 Alpheratz (Alpha And) — also in Pegasus square
      [17.43, 35.62, 2.07], // 1 Mirach (Beta And)
      [30.97, 42.33, 2.10], // 2 Almach (Gamma And)
      [10.00, 30.86, 3.27], // 3 Delta And
      [9.24, 23.41, 4.26], // 4 Mu And
      [23.46, 46.46, 3.87], // 5 51 And (upsilon)
    ],
    lines: [[0, 3], [3, 1], [1, 5], [5, 2], [1, 4]],
  },
  {
    name: 'Aries',
    translation: 'The Ram',
    desc: 'The golden-fleeced ram sent by Hermes to rescue Phrixus, whose fleece was later sought by Jason and the Argonauts.',
    color: 0xffddbb,
    stars: [
      [31.79, 23.46, 2.01], // 0 Hamal (Alpha Ari)
      [28.66, 20.81, 2.64], // 1 Sheratan (Beta Ari)
      [28.38, 27.26, 3.63], // 2 Mesarthim (Gamma Ari)
      [44.11, 27.98, 3.86], // 3 Botein (Delta Ari)
      [49.87, 27.26, 4.35], // 4 Epsilon Ari
    ],
    lines: [[2, 1], [1, 0], [0, 3], [3, 4]],
  },
  {
    name: 'Ursa Minor',
    translation: 'The Little Bear',
    desc: 'Arcas, son of Zeus and Callisto, transformed into a bear cub and placed beside his mother in the heavens.',
    color: 0x99ddff,
    stars: [
      [37.95, 89.26, 1.97], // 0 Polaris (Alpha UMi)
      [222.68, 86.59, 2.08], // 1 Kochab (Beta UMi)
      [236.01, 86.59, 3.05], // 2 Pherkad (Gamma UMi)
      [257.20, 82.03, 4.35], // 3 Delta UMi
      [260.35, 77.79, 4.22], // 4 Epsilon UMi
      [245.98, 77.79, 4.26], // 5 Zeta UMi
      [228.49, 74.16, 5.02], // 6 Eta UMi
    ],
    lines: [[0, 6], [6, 5], [5, 4], [4, 3], [3, 2], [2, 1], [1, 0]],
  },
  {
    name: 'Pisces',
    translation: 'The Fish',
    desc: 'Aphrodite and Eros transformed into fish and bound together with a cord to escape the monster Typhon.',
    color: 0x99bbff,
    stars: [
      [356.65, 5.63, 3.62], // 0 Eta Psc
      [345.00, 15.35, 3.82], // 1 Omega Psc
      [351.00, 21.27, 4.01], // 2 Iota Psc
      [5.21, 27.26, 4.53], // 3 Theta Psc
      [23.46, 33.43, 3.69], // 4 Epsilon Psc
      [20.00, 27.26, 4.44], // 5 Delta Psc
      [357.00, 28.07, 3.60], // 6 Gamma Psc (Alrescha area)
      [30.74, 15.35, 3.94], // 7 Nu Psc
    ],
    lines: [[0, 1], [1, 2], [2, 6], [6, 3], [3, 4], [4, 5], [5, 7]],
  },

  // ── 16 new constellations ────────────────────────────────────────────────

  {
    name: 'Cancer',
    translation: 'The Crab',
    desc: 'Sent by Hera to distract Hercules during his battle with the Lernaean Hydra. Though it was crushed underfoot, Hera immortalised the loyal crab among the stars.',
    color: 0xffddaa,
    stars: [
      [124.63, 27.98, 3.52], // 0 β Cnc (Altarf)
      [131.17, 28.76, 3.94], // 1 δ Cnc (Asellus Australis)
      [129.69, 21.47, 4.25], // 2 η Cnc
      [127.65, 28.46, 4.02], // 3 γ Cnc (Asellus Borealis)
      [130.82, 11.86, 4.67], // 4 α Cnc (Acubens)
      [132.08, 17.65, 5.14], // 5 ι Cnc
    ],
    lines: [[0, 1], [1, 3], [3, 2], [1, 4], [4, 5]],
  },

  {
    name: 'Libra',
    translation: 'The Scales',
    desc: 'The scales of Astraea, goddess of justice, who was the last immortal to live among mortals before ascending to become Virgo. Libra is the only zodiac sign represented by an inanimate object.',
    color: 0xaaffcc,
    stars: [
      [222.72, -16.04, 2.61], // 0 β Lib (Zubeneschamali)
      [216.54, -25.28, 2.75], // 1 α Lib (Zubenelgenubi)
      [233.88, -29.78, 3.29], // 2 σ Lib
      [229.25, -20.16, 3.91], // 3 γ Lib
      [226.02, -14.79, 4.43], // 4 υ Lib
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4]],
  },

  {
    name: 'Capricornus',
    translation: 'The Sea Goat',
    desc: 'The god Pan, fleeing the monster Typhon, leapt into the Nile and transformed himself into a goat-fish — half goat, half fish. Zeus later placed him among the stars in commemoration.',
    color: 0x99ccff,
    stars: [
      [304.51, -12.51, 3.57], // 0 δ Cap (Deneb Algedi)
      [305.25, -14.78, 3.08], // 1 β Cap (Dabih)
      [321.67, -16.66, 3.68], // 2 γ Cap (Nashira)
      [325.02, -21.02, 4.27], // 3 ι Cap
      [311.52, -25.27, 4.08], // 4 ζ Cap
      [307.60, -27.04, 4.84], // 5 θ Cap
      [306.41, -14.04, 3.58], // 6 α Cap (Algedi)
    ],
    lines: [[6, 1], [1, 0], [0, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
  },

  {
    name: 'Auriga',
    translation: 'The Charioteer',
    desc: 'The lame craftsman Erichthonius, son of Hephaestus, who invented the four-horse chariot to compensate for his disability. His ingenuity so impressed Zeus that he was placed among the stars.',
    color: 0xffee88,
    stars: [
      [79.17, 45.99, 0.08], // 0 α Aur (Capella)
      [89.93, 44.95, 1.90], // 1 β Aur (Menkalinan)
      [92.68, 33.17, 2.69], // 2 θ Aur
      [74.25, 33.17, 2.99], // 3 ι Aur (Hassaleh)
      [75.49, 41.23, 3.18], // 4 ε Aur (Almaaz)
      [76.63, 37.21, 3.96], // 5 ζ Aur
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [3, 5], [5, 0]],
  },

  {
    name: 'Ophiuchus',
    translation: 'The Serpent Bearer',
    desc: 'Asclepius, the great healer who learned the secret of resurrection from a serpent. Zeus struck him down with a thunderbolt to preserve the natural order of life and death, then honoured him with a place in the heavens.',
    color: 0x88ffaa,
    stars: [
      [263.73, 12.56, 2.08], // 0 α Oph (Rasalhague)
      [265.87, 4.37, 2.77], // 1 η Oph (Sabik)
      [247.73, -3.69, 2.43], // 2 ζ Oph (Han)
      [258.84, 14.39, 2.76], // 3 β Oph (Cebalrai)
      [249.29, -8.37, 3.20], // 4 δ Oph (Yed Prior)
      [251.45, -3.37, 3.24], // 5 ε Oph (Yed Posterior)
      [270.19, 9.38, 3.73], // 6 κ Oph
      [262.69, 25.34, 3.75], // 7 λ Oph
    ],
    lines: [[0, 3], [3, 7], [7, 0], [0, 6], [6, 1], [1, 5], [5, 4], [4, 2], [2, 1]],
  },

  {
    name: 'Serpens',
    translation: 'The Serpent',
    desc: 'The great serpent held by Ophiuchus — Asclepius\'s sacred healing snake. Its image became the caduceus, symbol of medicine, carried by Hermes and adorning healers to this day.',
    color: 0x99ffdd,
    stars: [
      [237.39, 6.43, 2.65], // 0 α Ser (Unukalhai)
      [240.80, 10.54, 3.26], // 1 δ Ser
      [243.44, -3.43, 3.54], // 2 ε Ser
      [239.11, 15.66, 3.67], // 3 β Ser
      [234.26, 3.42, 3.85], // 4 γ Ser
      [241.69, -2.90, 3.71], // 5 μ Ser
    ],
    lines: [[3, 1], [1, 0], [0, 4], [4, 2], [2, 5], [5, 1]],
  },

  {
    name: 'Corvus',
    translation: 'The Crow',
    desc: 'Apollo\'s sacred crow, once white as snow, was turned black as punishment for bearing bad news — that the god\'s beloved Coronis had been unfaithful. The crow and his cup, Crater, were cast together into the sky.',
    color: 0xffaa66,
    stars: [
      [187.47, -16.52, 2.59], // 0 γ Crv (Gienah)
      [183.95, -17.54, 2.65], // 1 β Crv (Kraz)
      [187.01, -22.62, 3.02], // 2 δ Crv (Algorab)
      [182.10, -24.73, 4.02], // 3 ε Crv
      [184.98, -12.35, 4.31], // 4 α Crv (Alchiba)
    ],
    lines: [[4, 0], [0, 2], [2, 3], [3, 1], [1, 0]],
  },

  {
    name: 'Crater',
    translation: 'The Cup',
    desc: 'The golden goblet of Apollo, placed in the sky alongside Corvus the crow. The crow was sent to fetch water in the cup but dawdled; Apollo, enraged at the delay, flung both cup and crow into the heavens.',
    color: 0xcc99ff,
    stars: [
      [164.94, -18.30, 3.56], // 0 δ Crt (Labrum)
      [163.14, -14.78, 4.08], // 1 γ Crt (Al Sharatan)
      [166.19, -22.83, 4.46], // 2 ε Crt
      [167.91, -11.61, 4.70], // 3 β Crt
      [157.61, -18.70, 4.76], // 4 α Crt (Alkes)
      [172.53, -22.23, 4.83], // 5 ζ Crt
    ],
    lines: [[4, 1], [1, 0], [0, 2], [2, 5], [1, 3], [3, 0]],
  },

  {
    name: 'Centaurus',
    translation: 'The Centaur',
    desc: 'The wise centaur Chiron, tutor of heroes — teacher of Achilles, Jason, and Asclepius. Accidentally wounded by a poisoned arrow, the immortal Chiron chose death to escape eternal pain, and Zeus set him among the stars.',
    color: 0xffcc88,
    stars: [
      [219.90, -60.84, -0.01], // 0 α Cen (Rigil Kentaurus)
      [210.96, -60.37, 0.61], // 1 β Cen (Hadar)
      [204.97, -53.47, 2.17], // 2 ε Cen
      [182.09, -50.72, 2.20], // 3 η Cen
      [189.30, -48.96, 2.30], // 4 ζ Cen
      [211.67, -54.49, 2.55], // 5 γ Cen
      [224.79, -42.16, 2.75], // 6 δ Cen
      [231.23, -40.65, 3.13], // 7 ι Cen
    ],
    lines: [[0, 1], [1, 5], [5, 4], [4, 3], [3, 2], [2, 4], [1, 6], [6, 7], [0, 5]],
  },

  {
    name: 'Lupus',
    translation: 'The Wolf',
    desc: 'An unnamed beast impaled on the spear of Centaurus, offered as a sacrifice on the altar Ara. In later traditions it became a wolf — the untameable predator of the southern sky.',
    color: 0xff8866,
    stars: [
      [220.48, -47.39, 2.30], // 0 α Lup (Men)
      [224.63, -43.13, 2.68], // 1 β Lup
      [228.19, -47.39, 3.22], // 2 γ Lup
      [234.23, -41.17, 3.37], // 3 δ Lup
      [237.82, -33.63, 3.56], // 4 ε Lup
      [236.99, -38.40, 4.05], // 5 ζ Lup
      [236.01, -34.71, 3.41], // 6 η Lup
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 6], [6, 5], [5, 3], [0, 2]],
  },

  {
    name: 'Columba',
    translation: 'The Dove',
    desc: 'The dove released by Noah to seek land after the great flood — or in other tellings, the scout dove sent ahead of the Argo by Jason to test the passage between the Clashing Rocks.',
    color: 0xaaddff,
    stars: [
      [84.91, -34.07, 2.65], // 0 α Col (Phact)
      [86.74, -35.77, 3.12], // 1 β Col (Wezn)
      [88.60, -33.44, 3.85], // 2 γ Col
      [84.34, -40.00, 3.87], // 3 δ Col
      [93.63, -42.82, 4.36], // 4 ε Col
    ],
    lines: [[0, 1], [1, 2], [0, 3], [3, 4], [1, 3]],
  },

  {
    name: 'Lepus',
    translation: 'The Hare',
    desc: 'The swift hare crouching beneath the feet of Orion, perpetually hunted by Canis Major. Some say it was placed here by Hermes to honour the animal\'s legendary speed and cleverness.',
    color: 0xddbb88,
    stars: [
      [83.18, -17.82, 2.58], // 0 α Lep (Arneb)
      [82.06, -20.76, 2.84], // 1 β Lep (Nihal)
      [87.20, -16.21, 3.59], // 2 γ Lep
      [88.59, -20.88, 3.76], // 3 δ Lep
      [76.36, -22.37, 3.71], // 4 ε Lep
      [71.83, -22.45, 4.29], // 5 μ Lep
    ],
    lines: [[5, 4], [4, 0], [0, 1], [1, 3], [3, 2], [2, 0], [1, 4]],
  },

  {
    name: 'Monoceros',
    translation: 'The Unicorn',
    desc: 'The elusive unicorn threading between the great dogs of Orion. First charted by the Dutch cartographer Petrus Plancius in 1612, it inhabits the rich star fields of the Milky Way\'s winter band.',
    color: 0xeeddff,
    stars: [
      [110.03, -9.55, 3.93], // 0 β Mon A (Muliphein area)
      [113.57, -8.93, 4.15], // 1 γ Mon
      [107.45, -6.27, 4.48], // 2 δ Mon
      [102.64, -0.49, 4.50], // 3 α Mon
      [116.66, -13.17, 4.34], // 4 ε Mon
      [108.80, -11.24, 3.93], // 5 β Mon B
    ],
    lines: [[3, 2], [2, 0], [0, 5], [5, 1], [1, 4], [0, 1]],
  },

  {
    name: 'Canis Minor',
    translation: 'The Little Dog',
    desc: 'The faithful smaller hound of Orion — some say it is Maera, the dog of Icarius who discovered his master\'s body and led his daughter Erigone to the grave. Its brightest star Procyon heralds the rising of Canis Major.',
    color: 0xffeecc,
    stars: [
      [114.83, 5.23, 0.40], // 0 α CMi (Procyon)
      [111.79, 8.29, 2.89], // 1 β CMi (Gomeisa)
      [116.23, 3.90, 4.33], // 2 γ CMi
    ],
    lines: [[1, 0], [0, 2]],
  },

  {
    name: 'Cepheus',
    translation: 'The King',
    desc: 'King of Ethiopia, husband of Cassiopeia and father of Andromeda. After his vain wife\'s boasting endangered their daughter, he negotiated with Poseidon — too late. Perseus saved Andromeda, and all three royals were set among the stars.',
    color: 0xaaccff,
    stars: [
      [332.16, 70.56, 2.44], // 0 α Cep (Alderamin)
      [322.16, 77.63, 3.23], // 1 β Cep (Alfirk)
      [340.67, 66.20, 3.21], // 2 γ Cep (Errai)
      [354.84, 77.63, 3.52], // 3 ζ Cep
      [338.96, 61.84, 4.07], // 4 δ Cep
      [325.33, 68.11, 4.40], // 5 ι Cep
    ],
    lines: [[0, 1], [1, 3], [3, 2], [2, 4], [4, 0], [0, 5], [5, 1]],
  },

  {
    name: 'Fornax',
    translation: 'The Furnace',
    desc: 'Named by the French astronomer Nicolas Louis de Lacaille to honour the chemical furnace — the athanor — used by alchemists and early chemists. It occupies a dark patch of sky rich in distant galaxies, including the Fornax Cluster.',
    color: 0xff9944,
    stars: [
      [48.02, -28.99, 3.80], // 0 α For (Dalim)
      [40.72, -32.41, 4.46], // 1 β For
      [45.42, -30.00, 4.69], // 2 γ For
      [55.94, -28.23, 4.81], // 3 δ For
      [44.17, -27.07, 5.19], // 4 ε For
    ],
    lines: [[1, 2], [2, 0], [0, 3], [2, 4], [4, 0]],
  },

  // ── Remaining Ptolemaic + mythology-rich constellations ─────────────────────

  {
    name: 'Hydra',
    translation: 'The Water Serpent',
    desc: 'The nine-headed Lernaean Hydra slain by Hercules as his second labour — every head cut off grew back two. He finally cauterised the stumps with fire and buried the immortal head beneath a stone.',
    color: 0x55ddaa,
    stars: [
      [127.57, 5.70, 3.90], // 0 α Hya (Alphard)
      [130.80, 3.40, 4.30], // 1 υ¹ Hya
      [138.59, -0.73, 3.11], // 2 ι Hya — actually using ζ
      [134.62, -8.66, 4.16], // 3 θ Hya — head region
      [141.90, -1.74, 3.54], // 4 β Hya
      [171.05, -16.76, 3.83], // 5 γ Hya
      [178.49, -17.36, 3.89], // 6 π Hya
      [175.28, -27.96, 4.16], // 7 μ Hya
    ],
    lines: [[3, 0], [0, 1], [1, 2], [2, 4], [4, 5], [5, 6], [6, 7]],
  },

  {
    name: 'Eridanus',
    translation: 'The River',
    desc: 'The great celestial river into which Phaëton fell after his disastrous attempt to drive the chariot of the Sun. His sisters, the Heliades, wept so long on its banks that they were transformed into amber-weeping poplar trees.',
    color: 0x88ccff,
    stars: [
      [76.96, -5.09, 4.80], // 0 β Eri (Cursa) — head near Orion
      [44.57, -40.30, 2.79], // 1 θ Eri (Acamar)
      [24.43, -57.24, 0.46], // 2 α Eri (Achernar) — tail, south
      [55.81, -23.62, 3.72], // 3 δ Eri (Rana)
      [66.00, -34.02, 3.55], // 4 υ² Eri
      [50.53, -29.77, 3.82], // 5 ε Eri
    ],
    lines: [[0, 3], [3, 5], [5, 1], [1, 4], [4, 2]],
  },

  {
    name: 'Cetus',
    translation: 'The Sea Monster',
    desc: 'The fearsome sea monster sent by Poseidon to devour Andromeda as punishment for her mother Cassiopeia\'s boastful vanity. It was turned to stone by Perseus when he raised the severed head of Medusa.',
    color: 0x9988cc,
    stars: [
      [10.89, 0.33, 2.54], // 0 β Cet (Diphda)
      [45.57, 4.09, 2.53], // 1 α Cet (Menkar)
      [43.83, 3.24, 3.47], // 2 λ Cet
      [26.02, -8.18, 3.56], // 3 η Cet
      [21.01, -10.34, 4.28], // 4 θ Cet
      [30.00, -3.00, 3.74], // 5 ι Cet
      [41.24, 8.46, 3.60], // 6 γ Cet (Kaffaljidhma)
    ],
    lines: [[0, 4], [4, 3], [3, 5], [5, 0], [1, 2], [2, 6], [6, 1], [2, 3]],
  },

  {
    name: 'Piscis Austrinus',
    translation: 'The Southern Fish',
    desc: 'The great fish that swallowed the waters poured by Aquarius — parent of the two fish of Pisces. In Babylonian myth it was the sacred fish of the god Ea, sovereign of the subterranean sweet waters.',
    color: 0x66aaff,
    stars: [
      [344.41, -29.62, 1.16], // 0 α PsA (Fomalhaut)
      [340.65, -32.55, 4.17], // 1 β PsA
      [338.75, -26.04, 4.28], // 2 γ PsA
      [336.03, -27.04, 4.20], // 3 δ PsA
      [333.57, -32.99, 4.18], // 4 ε PsA
      [341.45, -24.30, 5.01], // 5 ι PsA
    ],
    lines: [[0, 1], [1, 4], [4, 3], [3, 2], [2, 5], [5, 0], [0, 2]],
  },

  {
    name: 'Sagitta',
    translation: 'The Arrow',
    desc: 'The arrow of Hercules — shot to kill the eagle Aquila that perpetually gnawed the liver of the chained Prometheus. Others say it is one of Eros\'s arrows, or the dart with which Apollo slew the Cyclopes.',
    color: 0xffdd88,
    stars: [
      [296.19, 18.01, 3.82], // 0 γ Sge (tip of arrow)
      [298.18, 17.48, 3.51], // 1 δ Sge
      [295.02, 17.48, 4.37], // 2 β Sge
      [293.31, 18.53, 4.39], // 3 α Sge (tail)
    ],
    lines: [[3, 2], [2, 1], [1, 0]],
  },

  {
    name: 'Delphinus',
    translation: 'The Dolphin',
    desc: 'The dolphin sent by the sea god Poseidon to find the nereid Amphitrite and persuade her to become his bride. Having succeeded in his mission, Poseidon immortalised the faithful messenger among the stars.',
    color: 0x44ccff,
    stars: [
      [309.91, 14.59, 3.77], // 0 β Del (Rotanev)
      [309.39, 15.91, 3.77], // 1 α Del (Sualocin)
      [309.91, 15.07, 4.43], // 2 γ Del
      [311.02, 15.46, 4.72], // 3 δ Del
      [308.63, 11.30, 4.03], // 4 ε Del
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4]],
  },

  {
    name: 'Ara',
    translation: 'The Altar',
    desc: 'The altar upon which the Olympian gods swore their oaths of alliance before the Titanomachy — the great war against the Titans. After their victory, Zeus placed this sacred altar in the sky as an eternal reminder.',
    color: 0xff8844,
    stars: [
      [261.35, -49.88, 2.84], // 0 β Ara
      [262.96, -55.53, 2.95], // 1 α Ara
      [263.62, -53.16, 3.13], // 2 ζ Ara
      [257.83, -59.04, 3.34], // 3 ε Ara
      [265.07, -59.87, 3.62], // 4 γ Ara
      [270.27, -50.09, 3.66], // 5 δ Ara
    ],
    lines: [[0, 1], [1, 3], [3, 4], [4, 2], [2, 0], [0, 5]],
  },

  {
    name: 'Corona Australis',
    translation: 'The Southern Crown',
    desc: 'The wreath or crown dropped by Sagittarius as he drew his bow — or, in another telling, the crown placed by Dionysus at the foot of the sky to mark where he descended to Hades to retrieve his mother Semele.',
    color: 0xffcc66,
    stars: [
      [285.66, -37.11, 4.10], // 0 α CrA (Alfecca Meridiana)
      [287.37, -37.90, 4.11], // 1 β CrA
      [283.82, -38.32, 4.21], // 2 γ CrA
      [290.17, -40.50, 4.57], // 3 δ CrA
      [282.52, -37.06, 4.74], // 4 ε CrA
    ],
    lines: [[4, 2], [2, 0], [0, 1], [1, 3]],
  },

  {
    name: 'Triangulum',
    translation: 'The Triangle',
    desc: 'The island of Sicily, said by some mythographers to have been placed in the heavens by Ceres to commemorate her beloved island. Others identify it as the Greek letter Delta, symbol of the fertile Nile delta.',
    color: 0xddccff,
    stars: [
      [34.84, 34.99, 3.00], // 0 β Tri
      [28.27, 29.58, 3.41], // 1 α Tri (Mothallah)
      [37.61, 33.85, 4.01], // 2 γ Tri
    ],
    lines: [[1, 0], [0, 2], [2, 1]],
  },

  {
    name: 'Coma Berenices',
    translation: 'Berenice\'s Hair',
    desc: 'Queen Berenice II of Egypt sacrificed her beautiful golden hair to Aphrodite as a vow for the safe return of her husband Ptolemy III from war. When the offering vanished from the temple, the court astronomer Conon declared the gods had placed it among the stars.',
    color: 0xffeeaa,
    stars: [
      [197.49, 27.88, 4.26], // 0 β Com
      [186.73, 17.53, 4.32], // 1 α Com (Diadem)
      [198.03, 28.27, 4.36], // 2 γ Com
    ],
    lines: [[1, 0], [0, 2]],
  },

  {
    name: 'Leo Minor',
    translation: 'The Little Lion',
    desc: 'The small lion cub crouching between the great Lion and the Great Bear — placed in the sky by the Polish astronomer Johannes Hevelius in 1687, representing the lion cub offered to Cybele by her devotees in the spring rites.',
    color: 0xffcc88,
    stars: [
      [155.58, 36.71, 3.83], // 0 46 LMi (β LMi)
      [148.98, 34.22, 4.20], // 1 21 LMi
      [162.22, 35.25, 4.49], // 2 10 LMi
      [152.64, 33.80, 5.31], // 3 β LMi
    ],
    lines: [[2, 1], [1, 0], [0, 3]],
  },

  {
    name: 'Crux',
    translation: 'The Southern Cross',
    desc: 'The smallest of the 88 modern constellations, yet one of the most iconic — the Southern Cross has guided sailors across the Pacific and Indian Oceans for millennia. Its four bright stars form a compact cross visible only from the Southern Hemisphere, symbolising the Christian cross in the traditions of Portuguese explorers.',
    color: 0xaaddff,
    stars: [
      [187.79, -57.11, 0.77], // 0 α Cru (Acrux)
      [191.93, -59.69, 1.25], // 1 β Cru (Mimosa)
      [187.01, -56.94, 1.59], // 2 γ Cru (Gacrux)
      [183.79, -58.75, 2.79], // 3 δ Cru
      [186.65, -63.10, 3.59], // 4 ε Cru
    ],
    lines: [[0, 2], [1, 3], [0, 4]],
  },

  {
    name: 'Puppis',
    translation: 'The Stern',
    desc: 'The stern of the great ship Argo, sailed by Jason and the Argonauts on their quest for the Golden Fleece. When the ancient super-constellation Argo Navis was divided in the 19th century, Puppis claimed the richest portion of the Milky Way — a brilliant sweep of star clusters and nebulae.',
    color: 0xffddaa,
    stars: [
      [110.03, -40.00, 2.21], // 0 ζ Pup (Naos)
      [116.84, -28.95, 2.70], // 1 π Pup
      [113.65, -36.13, 2.81], // 2 ρ Pup
      [108.17, -26.80, 3.17], // 3 τ Pup
      [119.45, -24.30, 3.25], // 4 ν Pup
      [111.89, -22.88, 3.34], // 5 σ Pup
      [122.98, -50.61, 3.73], // 6 L2 Pup (l Pup)
    ],
    lines: [[3, 1], [1, 2], [2, 0], [0, 6], [3, 5], [1, 4]],
  },

  {
    name: 'Vela',
    translation: 'The Sails',
    desc: 'The sails of the Argo, billowing with the breath of Poseidon as the heroes raced toward Colchis. Within Vela lies the Vela Pulsar — the remnant of a supernova that exploded 11,000 years ago, still sweeping its lighthouse beam across the galaxy.',
    color: 0xbbffdd,
    stars: [
      [130.35, -43.43, 1.78], // 0 γ Vel (Regor)
      [136.00, -47.34, 1.96], // 1 δ Vel (Alsephina)
      [141.70, -55.01, 2.50], // 2 λ Vel (Suhail)
      [139.28, -55.17, 2.69], // 3 κ Vel
      [135.91, -40.47, 3.13], // 4 μ Vel
      [127.56, -43.18, 3.84], // 5 ξ Vel
    ],
    lines: [[5, 0], [0, 4], [4, 1], [1, 3], [3, 2], [2, 3]],
  },

  {
    name: 'Carina',
    translation: 'The Keel',
    desc: 'The keel of the Argo, the mightiest ship of Greek legend. Carina contains Canopus — the second-brightest star in the night sky, used for millennia as a navigation star and still used today to orient spacecraft. The Carina Nebula within its borders is one of the largest star-forming regions known.',
    color: 0xffffff,
    stars: [
      [95.99, -52.70, -0.72], // 0 α Car (Canopus) — brightest in constellation
      [139.28, -59.52, 1.67], // 1 β Car (Miaplacidus)
      [125.63, -59.51, 1.86], // 2 ε Car (Avior)
      [152.09, -64.39, 2.21], // 3 ι Car (Aspidiske / Turais)
      [160.74, -64.95, 2.76], // 4 θ Car
      [102.46, -61.68, 2.97], // 5 υ Car
      [119.19, -52.98, 3.01], // 6 ω Car
      [138.30, -57.57, 3.40], // 7 q Car
    ],
    lines: [[0, 5], [5, 6], [6, 2], [2, 7], [7, 1], [1, 3], [3, 4], [4, 3]],
  },

  {
    name: 'Scutum',
    translation: 'Sobieski\'s Shield',
    desc: "Created by the Polish astronomer Johannes Hevelius in 1684 to honour King John III Sobieski of Poland, whose victory at the Battle of Vienna saved Europe from Ottoman conquest. Tiny but rich — the Scutum Star Cloud is one of the densest concentrations of stars visible to the naked eye.",
    color: 0xffcc66,
    stars: [
      [278.80, -4.75, 3.85], // 0 α Sct
      [277.07, -9.95, 4.22], // 1 β Sct
      [281.15, -6.27, 4.70], // 2 γ Sct
      [280.22, -14.56, 4.72], // 3 δ Sct
      [280.43, -10.87, 4.68], // 4 ε Sct
    ],
    lines: [[0, 1], [1, 3], [3, 4], [4, 2], [2, 0], [1, 2]],
  },

  {
    name: 'Vulpecula',
    translation: 'The Little Fox',
    desc: "Another invention of Hevelius (1687), the Little Fox was originally shown clutching a goose. Though faint and shapeless, it hosts one of astronomy's treasures: the Dumbbell Nebula (M27) — the first planetary nebula ever discovered, a glowing cloud of gas puffed off by a dying star.",
    color: 0xffaa88,
    stars: [
      [294.93, 24.66, 4.44], // 0 α Vul (Anser)
      [299.30, 21.39, 5.01], // 1 1 Vul
      [303.41, 22.81, 5.50], // 2 2 Vul (13 Vul)
      [300.74, 25.10, 4.63], // 3 6 Vul
    ],
    lines: [[0, 1], [1, 2], [0, 3], [3, 2]],
  },

  // ── Final 31: completing all 88 IAU constellations ───────────────────────────

  {
    name: 'Sculptor',
    translation: "The Sculptor's Workshop",
    desc: "Named by Lacaille for the sculptor's studio — chisel, mallet, and unfinished bust. It contains the South Galactic Pole and the Sculptor Galaxy (NGC 253), one of the brightest galaxies in the sky and a favourite of southern observers.",
    color: 0xddccaa,
    stars: [
      [4.93, -29.36, 4.31], // 0 α Scl
      [17.07, -28.13, 4.37], // 1 β Scl
      [13.82, -32.53, 5.00], // 2 γ Scl
      [6.58, -23.82, 4.57], // 3 δ Scl
    ],
    lines: [[0, 3], [0, 2], [2, 1], [1, 3]],
  },

  {
    name: 'Phoenix',
    translation: 'The Phoenix',
    desc: "The mythical firebird of Egyptian legend that lived five hundred years, then built a funeral pyre of spices and burned itself to ash, only to rise again renewed. Lacaille charted it in 1752 from the Cape of Good Hope.",
    color: 0xff7744,
    stars: [
      [6.57, -42.31, 2.39], // 0 α Phe (Ankaa)
      [16.52, -46.72, 3.31], // 1 β Phe
      [18.34, -43.32, 3.41], // 2 γ Phe
      [22.09, -49.07, 3.95], // 3 δ Phe
      [15.40, -55.25, 3.88], // 4 ε Phe
      [9.10, -43.68, 3.94], // 5 ζ Phe
    ],
    lines: [[0, 1], [1, 2], [2, 0], [1, 3], [3, 4], [4, 5], [5, 0]],
  },

  {
    name: 'Grus',
    translation: 'The Crane',
    desc: "The elegant crane, sacred to Thoth — Egyptian god of wisdom and writing — who was himself depicted with a crane's head. Bayer introduced the constellation in 1603, filling the blank southern sky with birds and creatures unknown to the ancients.",
    color: 0xaaccdd,
    stars: [
      [332.06, -46.96, 1.74], // 0 α Gru (Alnair)
      [340.67, -46.88, 2.07], // 1 β Gru (Tiaki)
      [337.32, -37.36, 3.01], // 2 γ Gru (Aldhanab)
      [333.44, -53.63, 3.97], // 3 δ¹ Gru
      [338.85, -57.05, 4.11], // 4 ε Gru
      [341.67, -43.50, 4.28], // 5 ζ Gru
    ],
    lines: [[2, 0], [0, 3], [3, 4], [4, 1], [1, 5], [5, 2]],
  },

  {
    name: 'Pavo',
    translation: 'The Peacock',
    desc: "The peacock of Hera, whose tail feathers were adorned with the hundred eyes of the giant Argus after he was slain by Hermes. Hera set her faithful watchman's eyes into the bird's plumage as an eternal memorial.",
    color: 0x88ddff,
    stars: [
      [306.41, -56.74, 1.94], // 0 α Pav (Peacock)
      [311.09, -66.20, 3.42], // 1 β Pav
      [294.18, -57.18, 4.22], // 2 δ Pav
      [308.67, -72.91, 3.62], // 3 γ Pav
      [320.50, -65.37, 3.96], // 4 ε Pav
      [302.21, -65.44, 4.35], // 5 ζ Pav
    ],
    lines: [[0, 2], [2, 5], [5, 3], [3, 1], [1, 4], [4, 0], [0, 1]],
  },

  {
    name: 'Tucana',
    translation: 'The Toucan',
    desc: "The vivid-billed toucan of South America, introduced by Petrus Plancius and Pieter Dirkszoon Keyser in 1597. It contains two of the sky's great treasures: the Small Magellanic Cloud — a satellite galaxy of the Milky Way — and the globular cluster 47 Tucanae.",
    color: 0xffcc66,
    stars: [
      [1.35, -64.88, 2.86], // 0 α Tuc (Atria area)
      [22.22, -65.57, 4.37], // 1 β¹ Tuc
      [354.19, -68.88, 3.99], // 2 γ Tuc
      [346.41, -57.96, 4.48], // 3 δ Tuc
      [340.73, -60.26, 4.50], // 4 ε Tuc
      [13.17, -71.55, 4.23], // 5 ζ Tuc
    ],
    lines: [[0, 1], [1, 2], [2, 5], [5, 0], [0, 4], [4, 3]],
  },

  {
    name: 'Hydrus',
    translation: 'The Water Snake',
    desc: "Not to be confused with Hydra the great water-serpent of Hercules, this smaller southern snake was charted by Keyser and de Houtman on their voyage to the East Indies in 1595–1597, filling the dark southern polar sky with new figures.",
    color: 0x66ffcc,
    stars: [
      [22.57, -77.25, 1.98], // 0 β Hyi
      [6.41, -77.07, 2.86], // 1 α Hyi
      [55.96, -74.24, 3.24], // 2 γ Hyi
      [40.13, -68.27, 4.08], // 3 δ Hyi
      [30.87, -67.64, 4.11], // 4 ε Hyi
    ],
    lines: [[0, 1], [1, 4], [4, 3], [3, 2], [2, 0]],
  },

  {
    name: 'Dorado',
    translation: 'The Swordfish',
    desc: "The golden dorado — a brilliantly coloured South American fish — introduced by Plancius in 1597. Its most remarkable feature is that it contains most of the Large Magellanic Cloud, a satellite galaxy of the Milky Way visible to the naked eye from the southern hemisphere.",
    color: 0xffdd44,
    stars: [
      [82.73, -65.74, 3.27], // 0 α Dor
      [86.01, -55.04, 3.76], // 1 β Dor (Cepheid variable)
      [65.90, -55.04, 4.25], // 2 γ Dor
      [92.36, -68.88, 4.34], // 3 δ Dor
      [79.94, -62.74, 4.35], // 4 ζ Dor
    ],
    lines: [[2, 0], [0, 4], [4, 1], [1, 3], [0, 1]],
  },

  {
    name: 'Pictor',
    translation: "The Painter's Easel",
    desc: "Lacaille's tribute to the fine arts — a painter's easel with palette and brushes. Its brightest star hosts one of the most studied debris discs in astronomy, a flattened ring of dust and planetesimals where a planetary system is thought to be forming.",
    color: 0xccaaff,
    stars: [
      [86.71, -61.94, 3.27], // 0 α Pic
      [91.77, -56.17, 3.86], // 1 β Pic
      [81.28, -56.17, 4.50], // 2 γ Pic
    ],
    lines: [[2, 0], [0, 1]],
  },

  {
    name: 'Volans',
    translation: 'The Flying Fish',
    desc: "The flying fish of tropical seas — a creature that leaps from the water and glides on wing-like fins. Introduced by Keyser and de Houtman in the late 16th century, it skims low over the southern Milky Way near the keel of the great ship Argo.",
    color: 0x88ffee,
    stars: [
      [127.57, -70.50, 3.77], // 0 γ Vol
      [131.18, -70.37, 3.78], // 1 ζ Vol
      [110.89, -70.49, 4.00], // 2 β Vol
      [118.79, -72.65, 4.13], // 3 α Vol
      [126.98, -74.59, 4.35], // 4 ε Vol
      [136.99, -68.62, 4.16], // 5 δ Vol
    ],
    lines: [[2, 3], [3, 0], [0, 1], [1, 5], [0, 4], [4, 3]],
  },

  {
    name: 'Musca',
    translation: 'The Fly',
    desc: "Originally called Apis (the Bee) by Plancius, later renamed Musca Australis — the Southern Fly — to distinguish it from the bee in the zodiac. It lies in a rich stretch of the Milky Way and contains two of the brightest Cepheid variable stars known.",
    color: 0xaaffaa,
    stars: [
      [189.30, -69.14, 2.69], // 0 α Mus
      [183.85, -68.11, 3.04], // 1 β Mus
      [194.64, -65.44, 3.62], // 2 γ Mus
      [193.90, -71.55, 3.87], // 3 δ Mus
      [186.46, -66.73, 4.06], // 4 ε Mus
    ],
    lines: [[1, 0], [0, 2], [2, 3], [3, 1], [0, 4], [4, 1]],
  },

  {
    name: 'Triangulum Australe',
    translation: 'The Southern Triangle',
    desc: "A small but distinctive triangle of bright stars near the Southern Cross, charted by Keyser and de Houtman on their pioneering voyage to the East Indies. Smaller and brighter than its northern namesake Triangulum, it was used as a navigational aid by early southern sailors.",
    color: 0xffeecc,
    stars: [
      [252.17, -63.43, 1.91], // 0 α TrA (Atria)
      [247.36, -68.68, 2.83], // 1 β TrA
      [264.63, -63.68, 2.89], // 2 γ TrA
    ],
    lines: [[0, 1], [1, 2], [2, 0]],
  },

  {
    name: 'Circinus',
    translation: 'The Drawing Compass',
    desc: "Lacaille's navigational compass — the draughtsman's tool for drawing circles — a tribute to the precision instruments of 18th-century science. Tiny but nestled against the rich southern Milky Way, it contains the nearest Seyfert galaxy to Earth.",
    color: 0xccddff,
    stars: [
      [220.48, -64.97, 3.19], // 0 α Cir
      [226.64, -65.53, 4.07], // 1 β Cir
      [214.44, -64.36, 4.51], // 2 γ Cir
    ],
    lines: [[2, 0], [0, 1]],
  },

  {
    name: 'Norma',
    translation: "The Carpenter's Square",
    desc: "Lacaille's surveyor's set-square — the right-angle ruler used by craftsmen and navigators. It sits in a brilliant region of the Milky Way near the galactic centre, containing the Norma Cluster, one of the densest concentrations of galaxies known.",
    color: 0xddccbb,
    stars: [
      [244.97, -47.55, 4.01], // 0 γ² Nor
      [248.52, -50.16, 4.02], // 1 ε Nor
      [245.10, -45.17, 4.46], // 2 η Nor
      [249.38, -45.43, 5.00], // 3 ι¹ Nor
    ],
    lines: [[2, 0], [0, 1], [1, 3]],
  },

  {
    name: 'Telescopium',
    translation: 'The Telescope',
    desc: "Lacaille's tribute to the instrument that revolutionised astronomy — the refracting telescope that Galileo first turned to the heavens in 1609, transforming our understanding of the cosmos. A faint, obscure constellation in the southern sky.",
    color: 0x99bbff,
    stars: [
      [276.04, -45.97, 3.51], // 0 α Tel
      [280.66, -52.38, 4.10], // 1 ε Tel
      [283.95, -54.42, 4.13], // 2 ζ Tel
      [274.44, -54.10, 4.89], // 3 δ Tel
    ],
    lines: [[0, 1], [1, 2], [2, 3]],
  },

  {
    name: 'Apus',
    translation: 'The Bird of Paradise',
    desc: "The spectacular bird of paradise of New Guinea — a creature of such dazzling plumage that early traders believed it had no feet and never landed, spending its entire life aloft. Keyser and de Houtman immortalised it among the southern stars in 1597.",
    color: 0xff99cc,
    stars: [
      [230.45, -79.04, 3.83], // 0 α Aps
      [237.50, -77.52, 4.24], // 1 β Aps
      [245.83, -77.14, 3.83], // 2 γ Aps
      [253.39, -76.97, 4.68], // 3 δ¹ Aps
    ],
    lines: [[0, 1], [1, 2], [2, 3], [0, 2]],
  },

  {
    name: 'Chamaeleon',
    translation: 'The Chameleon',
    desc: "The colour-changing lizard of Africa and Asia, introduced by Keyser and de Houtman in the late 16th century. It contains the Chamaeleon I molecular cloud — one of the nearest star-forming regions to Earth, where new stars are being born today.",
    color: 0x88ff88,
    stars: [
      [114.71, -80.54, 4.05], // 0 α Cha
      [143.01, -78.61, 4.11], // 1 β Cha
      [160.95, -78.61, 4.07], // 2 γ Cha
      [144.72, -80.54, 4.45], // 3 δ Cha
    ],
    lines: [[0, 3], [3, 1], [1, 2], [2, 0]],
  },

  {
    name: 'Octans',
    translation: 'The Octant',
    desc: "Named for the reflecting octant — the navigational instrument invented by John Hadley in 1730, forerunner of the modern sextant. It contains Sigma Octantis, the Southern Pole Star — so faint (magnitude 5.4) it is nearly useless for navigation, unlike the brilliant Polaris in the north.",
    color: 0xbbbbdd,
    stars: [
      [316.25, -81.38, 5.15], // 0 σ Oct (South Pole Star)
      [323.42, -77.39, 4.13], // 1 β Oct
      [209.34, -77.07, 4.33], // 2 δ Oct
      [152.14, -85.07, 4.74], // 3 ν Oct
    ],
    lines: [[1, 0], [0, 2], [2, 3]],
  },

  {
    name: 'Mensa',
    translation: 'Table Mountain',
    desc: "Named by Lacaille after Table Mountain near Cape Town — the flat-topped mountain he observed beneath during his great southern sky survey of 1751–1752. The Large Magellanic Cloud spills across its border, like the famous tablecloth of cloud that drapes the real mountain.",
    color: 0xaabbcc,
    stars: [
      [93.07, -76.34, 5.09], // 0 α Men
      [75.81, -74.93, 5.30], // 1 β Men
      [66.06, -74.75, 5.18], // 2 γ Men
    ],
    lines: [[0, 1], [1, 2]],
  },

  {
    name: 'Reticulum',
    translation: 'The Reticle',
    desc: "Lacaille's eyepiece reticle — the crosshair fitted to telescopes to measure star positions. He invented this small constellation during his southern survey to honour the precision tools of positional astronomy.",
    color: 0xffddbb,
    stars: [
      [63.60, -62.47, 3.35], // 0 α Ret
      [56.71, -64.80, 3.84], // 1 β Ret
      [66.38, -58.45, 4.97], // 2 γ Ret (Horologium border)
      [67.46, -61.40, 4.44], // 3 δ Ret
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0]],
  },

  {
    name: 'Horologium',
    translation: 'The Pendulum Clock',
    desc: "Named by Lacaille to honour Christiaan Huygens, who invented the pendulum clock in 1656 — transforming navigation, science, and daily life. Lacaille was a meticulous timekeeper himself, rating marine chronometers at the Cape of Good Hope.",
    color: 0xddbbaa,
    stars: [
      [63.50, -42.29, 3.85], // 0 α Hor
      [45.91, -64.07, 4.99], // 1 β Hor
      [42.87, -59.74, 4.71], // 2 δ Hor
      [37.83, -54.55, 5.21], // 3 ε Hor
    ],
    lines: [[0, 3], [3, 2], [2, 1]],
  },

  {
    name: 'Caelum',
    translation: "The Engraver's Chisel",
    desc: "Lacaille's engraving chisel — the tool used to incise fine lines on copper plates for printing. A tiny, faint constellation with little to recommend it visually, but a tribute to the art of copperplate engraving that disseminated the star maps of his era.",
    color: 0xccbbaa,
    stars: [
      [69.53, -41.86, 4.44], // 0 α Cae
      [72.50, -37.14, 5.05], // 1 β Cae
      [66.89, -35.48, 5.07], // 2 γ Cae
    ],
    lines: [[0, 1], [0, 2]],
  },

  {
    name: 'Pyxis',
    translation: "The Mariner's Compass",
    desc: "Lacaille's mariner's compass — the magnetic needle that made long ocean voyages possible. Originally part of the ancient ship Argo, its stars once belonged to the mast, but Lacaille reassigned them to honour the navigational instrument that guided European explorers across uncharted seas.",
    color: 0xaaccee,
    stars: [
      [130.90, -26.68, 3.68], // 0 α Pyx
      [134.18, -35.31, 3.97], // 1 β Pyx
      [136.18, -27.71, 4.03], // 2 γ Pyx
    ],
    lines: [[0, 1], [0, 2]],
  },

  {
    name: 'Antlia',
    translation: 'The Air Pump',
    desc: "Named by Lacaille for the air pump invented by Robert Boyle and improved by Denis Papin — the instrument central to experiments on the nature of air and vacuum that launched the scientific revolution. A faint constellation with no mythology, pure tribute to modern science.",
    color: 0xbbccdd,
    stars: [
      [152.86, -36.71, 4.25], // 0 α Ant
      [149.90, -29.50, 4.60], // 1 δ Ant
      [148.53, -35.95, 4.51], // 2 ε Ant
    ],
    lines: [[1, 0], [0, 2]],
  },

  {
    name: 'Microscopium',
    translation: 'The Microscope',
    desc: "Lacaille's tribute to the compound microscope — the instrument through which Antonie van Leeuwenhoek first revealed a hidden world of microorganisms invisible to the naked eye. Like the air pump and telescope, it represents 17th-century science's expansion of human perception.",
    color: 0x99bbcc,
    stars: [
      [312.98, -32.26, 4.67], // 0 γ Mic
      [319.52, -32.17, 4.80], // 1 ε Mic
      [312.51, -45.09, 5.10], // 2 α Mic
    ],
    lines: [[0, 1], [0, 2]],
  },

  {
    name: 'Indus',
    translation: 'The Indian',
    desc: "Representing a Native American or East Indian figure, introduced by Keyser and de Houtman in 1597 — the era of European exploration and colonisation. The constellation contains Epsilon Indi, one of the nearest sun-like stars to Earth, only 11.8 light-years away.",
    color: 0xddaa88,
    stars: [
      [309.39, -47.29, 3.11], // 0 α Ind
      [321.74, -58.45, 3.65], // 1 β Ind
      [286.85, -53.45, 4.39], // 2 δ Ind
      [296.97, -58.45, 4.51], // 3 θ Ind
    ],
    lines: [[0, 2], [2, 3], [3, 1], [1, 0]],
  },

  {
    name: 'Lynx',
    translation: 'The Lynx',
    desc: "Named by Hevelius in 1687 — he chose the lynx because only a person with the sharp eyes of that cat could make out the faint stars of this constellation. It stretches across a barren expanse of sky between Ursa Major and Gemini, a vast wilderness of dim stars.",
    color: 0xeeddcc,
    stars: [
      [139.68, 36.80, 3.13], // 0 α Lyn (Elvashak)
      [124.68, 59.01, 4.25], // 1 38 Lyn
      [119.11, 55.49, 4.56], // 2 10 Lyn
      [132.14, 43.19, 4.62], // 3 15 Lyn
    ],
    lines: [[2, 1], [1, 3], [3, 0]],
  },

  {
    name: 'Canes Venatici',
    translation: 'The Hunting Dogs',
    desc: "The two greyhounds Chara and Asterion, held on a leash by Boötes the herdsman as he drives the Great Bear around the pole. Hevelius introduced them in 1687; their brightest star Cor Caroli ('Charles's Heart') was named in honour of King Charles II of England.",
    color: 0xffccaa,
    stars: [
      [194.01, 38.32, 2.89], // 0 α² CVn (Cor Caroli)
      [188.44, 41.36, 4.24], // 1 β CVn (Chara)
    ],
    lines: [[0, 1]],
  },

  {
    name: 'Camelopardalis',
    translation: 'The Giraffe',
    desc: "The giraffe — the 'camel-leopard' of antiquity, so named because Greeks believed it was a hybrid of camel and leopard. Introduced by Plancius in 1612, it sprawls across a wide, star-poor expanse of the northern sky between Perseus, Cassiopeia, and Ursa Major.",
    color: 0xddccbb,
    stars: [
      [74.25, 60.44, 4.03], // 0 β Cam
      [75.49, 69.33, 4.21], // 1 α Cam
      [81.38, 71.33, 4.39], // 2 CS Cam
      [65.71, 71.33, 4.55], // 3 7 Cam
    ],
    lines: [[3, 1], [1, 2], [1, 0], [0, 2]],
  },

  {
    name: 'Lacerta',
    translation: 'The Lizard',
    desc: "A small lizard tucked between Cygnus, Cassiopeia, and Andromeda in the northern Milky Way — invented by Hevelius in 1687 to fill a gap between the grander constellations. Despite its obscurity it contains BL Lacertae, the prototype of a class of violently variable active galactic nuclei.",
    color: 0xbbddaa,
    stars: [
      [338.19, 43.12, 3.77], // 0 α Lac
      [332.43, 38.54, 4.43], // 1 β Lac
      [337.30, 44.38, 4.57], // 2 1 Lac
      [342.35, 45.44, 4.55], // 3 5 Lac
    ],
    lines: [[1, 0], [0, 2], [2, 3], [0, 3]],
  },

  {
    name: 'Equuleus',
    translation: 'The Little Horse',
    desc: "The tiny foal — said to be Celeris, brother of the winged horse Pegasus, gifted by Hermes to Castor of the Gemini twins. The second-smallest constellation in the sky, it has been known since antiquity and was recorded by Ptolemy in the Almagest.",
    color: 0xffeecc,
    stars: [
      [318.00, 5.25, 3.92], // 0 α Equ (Kitalpha)
      [319.56, 6.81, 4.69], // 1 δ Equ
      [317.58, 7.44, 4.49], // 2 γ Equ
    ],
    lines: [[0, 1], [1, 2], [2, 0]],
  },

  {
    name: 'Sextans',
    translation: 'The Sextant',
    desc: "Named by Hevelius in 1687 to commemorate his great brass sextant, destroyed in the fire that burned his Danzig observatory in 1679. He used this instrument for decades to measure star positions with unprecedented precision before telescopic sights were adopted.",
    color: 0xccbbdd,
    stars: [
      [152.67, -0.37, 4.48], // 0 α Sex
      [154.40, -8.10, 5.07], // 1 β Sex
      [161.69, -9.73, 5.20], // 2 γ Sex
    ],
    lines: [[0, 1], [1, 2]],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const clock = new THREE.Clock();
const animatedMaterials = [];

function raDecToVec3(ra_deg, dec_deg, radius) {
  const ra = ra_deg * Math.PI / 180;
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
    vertexShader: `
      varying vec3 vWorldPos;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorldPos = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      varying vec3 vWorldPos;
      void main() {
        // Pure world-space gradient — no screen-space artifacts
        // h=0 at south pole, h=1 at north pole
        float h = normalize(vWorldPos).y * 0.5 + 0.5;
        vec3 bottom = vec3(0.008, 0.005, 0.018);
        vec3 mid    = vec3(0.012, 0.015, 0.045);
        vec3 top    = vec3(0.018, 0.025, 0.072);
        vec3 col = mix(bottom, mid, smoothstep(0.0, 0.5, h));
        col      = mix(col,    top, smoothstep(0.5, 1.0, h));
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    side: THREE.BackSide,
    depthWrite: false,
  });

  scene.add(new THREE.Mesh(domeGeo, domeMat));
}

addSkyDome();

// ─── Background star field ────────────────────────────────────────────────────

function createStarField(count = 7000) {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const twinkleOff = new Float32Array(count); // per-star phase offset

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 490 + Math.random() * 30;

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
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

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
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
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  animatedMaterials.push(mat);
  return new THREE.Points(geo, mat);
}

scene.add(createStarField());

// ─── Milky Way ────────────────────────────────────────────────────────────────

(function addMilkyWay() {
  const count = 18000;
  const positions = new Float32Array(count * 3);
  const alphas = new Float32Array(count);
  const colors = new Float32Array(count * 3);

  // Milky Way is denser toward galactic centre (longitude ~0) and thinner at edges
  for (let i = 0; i < count; i++) {
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

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

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
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  scene.add(new THREE.Points(geo, mat));
})();

// (foreground dust removed — caused bloom oval artifact at screen center)

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
      uColor: { value: new THREE.Color(color1) },
      uColor2: { value: new THREE.Color(color2) },
      uOffset: { value: new THREE.Vector2(offset[0], offset[1]) },
      uScale: { value: scale },
    },
    vertexShader: nebulaVertexShader,
    fragmentShader: nebulaFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const sprite = new THREE.Mesh(new THREE.PlaneGeometry(worldSize, worldSize), mat);
  sprite.position.copy(pos);
  sprite.lookAt(0, 0, 0);
  scene.add(sprite);
}

// Each nebula: ra, dec, primaryColor, secondaryColor, worldSize, [fractalOffsetX,Y], fractalScale
addNebula(83.82, -5.39, 0x4466ff, 0xcc44bb, 42, [0.80, -1.30], 1.8); // Orion     — blue/magenta
addNebula(247.35, -26.43, 0xff4422, 0xff9900, 36, [1.20, -0.80], 2.1); // Scorpius  — red/orange
addNebula(310.36, 45.28, 0x22ccff, 0x7755ee, 32, [0.40, -1.60], 1.6); // Cygnus    — cyan/violet
addNebula(279.23, 38.78, 0x44ffcc, 0x6699ff, 26, [-0.20, -1.10], 2.4); // Lyra      — teal/blue
addNebula(266.00, -29.00, 0xffaa33, 0xff5511, 50, [2.00, -1.30], 1.4); // Sagittarius — gold/orange

// ─── Constellation rendering ──────────────────────────────────────────────────

const SPHERE_R = 100;

// Shared twinkle time uniforms per constellation batch
const conMatUniforms = [];
const constellationLabels = [];
const constellationObjects = []; // for demo mode + overlay shader

CONSTELLATIONS.forEach(con => {
  const col = new THREE.Color(con.color);
  const positions = con.stars.map(([ra, dec]) => raDecToVec3(ra, dec, SPHERE_R));

  // ── Stars ──────────────────────────────────────────────────────────────────

  const nStars = positions.length;
  const sPosArr = new Float32Array(nStars * 3);
  const sSizeArr = new Float32Array(nStars);
  const sTwinkOff = new Float32Array(nStars);
  const sMagArr = new Float32Array(nStars);

  positions.forEach((p, i) => {
    sPosArr[i * 3] = p.x; sPosArr[i * 3 + 1] = p.y; sPosArr[i * 3 + 2] = p.z;
    const [, , mag] = con.stars[i];
    sSizeArr[i] = Math.max(2.5, 7.5 - mag * 1.4);
    sTwinkOff[i] = seededRand(i * 37 + con.color) * Math.PI * 2;
    sMagArr[i] = mag;
  });

  const sGeo = new THREE.BufferGeometry();
  sGeo.setAttribute('position', new THREE.BufferAttribute(sPosArr, 3));
  sGeo.setAttribute('size', new THREE.BufferAttribute(sSizeArr, 1));
  sGeo.setAttribute('twinkleOff', new THREE.BufferAttribute(sTwinkOff, 1));
  sGeo.setAttribute('mag', new THREE.BufferAttribute(sMagArr, 1));

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
    depthWrite: false,
    blending: THREE.AdditiveBlending,
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
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  scene.add(new THREE.Points(sGeo, coreMat));

  animatedMaterials.push(haloMat);
  animatedMaterials.push(coreMat);

  // ── Label sprite ────────────────────────────────────────────────────────────

  const lc = document.createElement('canvas');
  lc.width = 512; lc.height = 112;
  const lx = lc.getContext('2d');
  lx.shadowColor = `rgb(${Math.round(col.r * 255)},${Math.round(col.g * 255)},${Math.round(col.b * 255)})`;
  lx.shadowBlur = 28;
  lx.font = 'bold 38px Monda, sans-serif';
  lx.fillStyle = `rgba(255,255,255,0.9)`;
  lx.textAlign = 'center';
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
  constellationObjects.push({
    haloMat, coreMat, uDim, dimTarget: 1.0, label: ls, centroid: centroid.clone(),
    worldPositions: positions,
    lines: con.lines,
    color: col,
  });
});

// ─── Art Of Code constellation overlay ───────────────────────────────────────
// Fullscreen screen-space quad. Each frame we project the 3D star positions
// to NDC and upload them as uniforms. The shader draws sparkles + glowing lines
// between connected stars, adapted from the Art Of Code tutorial shader.

const CON_COUNT = CONSTELLATIONS.length; // 88

// Flat layout: all constellations' stars/lines concatenated.
const starOffsets = [];
const lineOffsets = [];
let totalStars = 0, totalLines = 0;
CONSTELLATIONS.forEach(con => {
  starOffsets.push(totalStars);
  lineOffsets.push(totalLines);
  totalStars += con.stars.length;
  totalLines += con.lines.length;
});

// ── Data textures (avoid blowing the MAX_FRAGMENT_UNIFORM_VECTORS limit) ──
// starPosTex  : RGBA32F, width=totalStars, height=1 — rg = NDC xy, updated each frame
// linesTex    : RGBA32F, width=totalLines, height=1 — r=starIndexA, g=starIndexB, static

// Star position texture — pixels written every frame in the animation loop
const starPosData = new Float32Array(totalStars * 4).fill(-10); // init off-screen
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
    lineData[px] = sOff + a; // absolute star index A
    lineData[px + 1] = sOff + b; // absolute star index B
  });
});
const linesTex = new THREE.DataTexture(
  lineData, totalLines, 1,
  THREE.RGBAFormat, THREE.FloatType
);
linesTex.magFilter = THREE.NearestFilter;
linesTex.minFilter = THREE.NearestFilter;
linesTex.needsUpdate = true;

// Per-constellation dim value for demo mode (starts at 1.0)
const conDimArr = new Array(CON_COUNT).fill(1.0);

const overlayMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uStarPos: { value: starPosTex },   // data texture: NDC xy per star
    uLines: { value: linesTex },     // data texture: (starIdxA, starIdxB) per line
    // Per-constellation metadata — 40 elements each, well within uniform budget
    uStarOffset: { value: starOffsets.slice() },
    uLineOffset: { value: lineOffsets.slice() },
    uStarCount: { value: CONSTELLATIONS.map(c => c.stars.length) },
    uLineCount: { value: CONSTELLATIONS.map(c => c.lines.length) },
    uConColor: { value: CONSTELLATIONS.map(c => new THREE.Color(c.color)) },
    uConDim: { value: conDimArr.slice() },
  },
  vertexShader: `
    void main() {
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    #define S smoothstep
    #define NUM_CONS 88

    uniform float     uTime;
    uniform vec2      uResolution;
    uniform sampler2D uStarPos;   // texel i → star i NDC xy in .rg
    uniform sampler2D uLines;     // texel i → line i (starIdxA, starIdxB) in .rg
    uniform int  uStarOffset[NUM_CONS];
    uniform int  uLineOffset[NUM_CONS];
    uniform int  uStarCount[NUM_CONS];
    uniform int  uLineCount[NUM_CONS];
    uniform vec3  uConColor[NUM_CONS];
    uniform float uConDim[NUM_CONS];

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
      // skip lines where either endpoint is off-screen (behind camera → parked at -5,-5)
      if (abs(a.x) > 1.8 || abs(a.y) > 1.8 || abs(b.x) > 1.8 || abs(b.y) > 1.8) return 0.0;
      float d    = DistLine(p, a, b);
      float core = S(0.0015, 0.0003, d) * 0.7;
      float glow = S(0.006,  0.002,  d) * 0.15;
      return core + glow;
    }

    float Sparkle(vec2 p, vec2 center, float t) {
      vec2  d2    = center - p;
      float dist2 = dot(d2, d2);
      if (dist2 > 0.0003) return 0.0; // hard cutoff — no long-range bleed
      vec2  j     = d2 * 1400.0;
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
          // skip lines where both endpoints are off-screen
          if (abs(sa.x) > 2.0 && abs(sb.x) > 2.0) continue;
          m += GlowLine(uv, sa, sb);
        }

        for (int si = 0; si < nS; si++) {
          vec2 raw = fetchStarPos(sOff + si);
          if (abs(raw.x) > 1.2 || abs(raw.y) > 1.2) continue; // off-screen
          vec2 sc = raw * 0.5;
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
// NOT added to scene — rendered directly after bloom to avoid bloom amplifying the overlay

// ─── Shooting stars (meteors) ─────────────────────────────────────────────────

const MAX_METEORS = 3;
const meteors = [];
const meteorGroup = new THREE.Group();
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
  const phi0 = Math.acos(2 * Math.random() - 1);
  const r0 = 95;
  const start = new THREE.Vector3(
    r0 * Math.sin(phi0) * Math.cos(theta0),
    r0 * Math.cos(phi0),
    r0 * Math.sin(phi0) * Math.sin(theta0),
  );

  const radial = start.clone().normalize();
  const perp = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
    .projectOnPlane(radial).normalize();
  const drift = new THREE.Vector3().crossVectors(radial, perp).normalize();
  const driftAmt = (Math.random() - 0.5) * 1.5;

  const isBright = Math.random() < 0.2;
  const speed = isBright ? (10 + Math.random() * 6) : (6 + Math.random() * 8);
  const brightness = isBright ? 1.0 : (0.5 + Math.random() * 0.4);

  // Pick a random color palette: orange, white, or blue
  const palette = METEOR_PALETTES[Math.floor(Math.random() * METEOR_PALETTES.length)];

  // Head glow point (3D, rendered through bloom)
  const headGeo = new THREE.BufferGeometry();
  const headPos = new Float32Array(3);
  headGeo.setAttribute('position', new THREE.BufferAttribute(headPos, 3));
  const headOpUniform = { value: 0.0 }; // starts invisible; set to non-zero only after spawnDelay expires
  const headCoreUniform = { value: palette.core.clone() };
  const headHaloUniform = { value: palette.halo.clone() };
  const headMat = new THREE.ShaderMaterial({
    uniforms: {
      uOpacity: headOpUniform,
      uCoreCol: headCoreUniform,
      uHaloCol: headHaloUniform,
    },
    vertexShader: meteorHeadMat.vertexShader,
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
    ndcPos: new THREE.Vector2(-10, -10),
    ndcPosPrev: new THREE.Vector2(-10, -10),
    spawnDelay: 0, // seconds to wait before becoming active (used after death)
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
  const fade = Math.sin(progress * Math.PI);

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
const meteorNdcUniforms = meteors.map(() => new THREE.Vector2(-10, -10));
const meteorPrevUniforms = meteors.map(() => new THREE.Vector2(-10, -10));
const meteorOpUniforms = new Array(MAX_METEORS).fill(0);
const meteorColorUniforms = meteors.map(() => new THREE.Color(1, 1, 1));

const meteorFeedbackMat = new THREE.ShaderMaterial({
  uniforms: {
    uPrevFrame: { value: meteorRtA.texture },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uMeteorPos: { value: meteorNdcUniforms },
    uMeteorPrev: { value: meteorPrevUniforms },
    uMeteorOp: { value: meteorOpUniforms },
    uMeteorColor: { value: meteorColorUniforms },
    uMeteorCount: { value: MAX_METEORS },
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
  depthTest: false,
  depthWrite: false,
});

// Fullscreen quad for both the feedback pass and the composite blit
const fsQuadGeo = new THREE.PlaneGeometry(2, 2);
const meteorFeedbackMesh = new THREE.Mesh(fsQuadGeo, meteorFeedbackMat);

// Composite: blit the feedback RT additively over the final rendered frame
const meteorCompositeMat = new THREE.ShaderMaterial({
  uniforms: {
    uTrail: { value: meteorRtB.texture },
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
  blending: THREE.AdditiveBlending,
  depthTest: false,
  depthWrite: false,
});
const meteorCompositeMesh = new THREE.Mesh(fsQuadGeo, meteorCompositeMat);

// Minimal orthographic scene for fullscreen passes
const orthoScene = new THREE.Scene();
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

const infoPanel = document.getElementById('constellation-info');
const infoName = document.getElementById('con-name');
const infoTranslation = document.getElementById('con-translation');
const infoDesc = document.getElementById('con-desc');
let infoIndex = -1;   // index of constellation currently shown (-1 = none)
let infoFadeOut = false; // mid-fade-out transition in progress

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

let demoActive = false;
let demoIndex = 0;
let demoTimer = 0;
let DEMO_HOLD = 60.0;  // seconds per constellation
let DEMO_TRANS = 12.0;   // seconds for camera transition
let demoCamFrom = new THREE.Vector3();
let demoCamTo = new THREE.Vector3();
let demoCamT = 1.0;   // 1 = transition complete
let demoCamWasMoving = false; // used to detect the moment the transition finishes
const demoBadge = document.getElementById('demo-badge');
const demoTimingEl = document.getElementById('demo-timing');
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

function updateDemoTimingHUD() {
  demoTimingEl.innerHTML =
    `hold: ${DEMO_HOLD.toFixed(0)}s &nbsp;[/]<br>trans: ${DEMO_TRANS.toFixed(1)}s &nbsp;,/.`;
}

function demoJumpTo(newIndex) {
  // Jump to a specific constellation index, resetting the hold timer.
  demoIndex = (newIndex + constellationObjects.length) % constellationObjects.length;
  demoTimer = 0;
  demoCamFrom.copy(camera.position);
  demoCamTo.copy(demoTargetPos(demoIndex));
  demoCamT = 0;
  demoCamWasMoving = false;
  startDemoFly(demoIndex);
}

function startDemo() {
  demoActive = true;
  demoIndex = 0;
  demoTimer = 0;
  demoCamWasMoving = false;
  demoBadge.style.display = 'block';
  demoTimingEl.style.display = 'block';
  updateDemoTimingHUD();
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
  demoTimingEl.style.display = 'none';
  controls.autoRotate = true;
  restoreDemoVisuals();
  // Hide info panel when leaving demo mode
  if (infoIndex !== -1 && !infoFadeOut) {
    hideConstellationInfo(() => { infoIndex = -1; });
  }
}

// ─── Splash screen ────────────────────────────────────────────────────────────

const splashEl = document.getElementById('splash');

function dismissSplash() {
  splashEl.classList.add('hidden');
  splashEl.addEventListener('transitionend', () => splashEl.remove(), { once: true });
}

splashEl.addEventListener('click', dismissSplash, { once: true });
document.addEventListener('keydown', dismissSplash, { once: true });

// ─── Keybinds ─────────────────────────────────────────────────────────────────

window.addEventListener('keydown', e => {
  if (e.key === 'd' || e.key === 'D') {
    demoActive ? stopDemo() : startDemo();
    return;
  }
  if (demoActive && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
    e.preventDefault();
    demoJumpTo(demoIndex + (e.key === 'ArrowRight' ? 1 : -1));
    return;
  }
  // Adjust demo timings (only meaningful during demo, but allowed anytime)
  if (e.key === ']') {
    DEMO_HOLD = Math.min(300, DEMO_HOLD + 5);
    if (demoActive) updateDemoTimingHUD();
  } else if (e.key === '[') {
    DEMO_HOLD = Math.max(5, DEMO_HOLD - 5);
    if (demoActive) updateDemoTimingHUD();
  } else if (e.key === '.') {
    DEMO_TRANS = Math.min(60, parseFloat((DEMO_TRANS + 1).toFixed(1)));
    if (demoActive) updateDemoTimingHUD();
  } else if (e.key === ',') {
    DEMO_TRANS = Math.max(1, parseFloat((DEMO_TRANS - 1).toFixed(1)));
    if (demoActive) updateDemoTimingHUD();
  }
});

// ─── Animate ──────────────────────────────────────────────────────────────────
let lastTime = 0;
const fpsEl = document.getElementById('fps');
let fpsFrames = 0, fpsAccum = 0;

function animateFixed() {
  requestAnimationFrame(animateFixed);
  const t = clock.getElapsedTime();
  const dt = Math.min(0.05, Math.max(0.0001, t - lastTime));
  lastTime = t;

  // FPS counter — update display once per second
  fpsFrames++;
  fpsAccum += dt;
  if (fpsAccum >= 1.0) {
    fpsEl.textContent = `${Math.round(fpsFrames / fpsAccum)} FPS`;
    fpsFrames = 0;
    fpsAccum = 0;
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
      const toDir = demoCamTo.clone().normalize();
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
  const DIM_SPEED_UP = 0.6; // brightening speed — slower fade-in
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
        const px = si * 4;
        if (w <= 0) {
          starPosData[px] = -10; starPosData[px + 1] = -10;
        } else {
          starPosData[px] = tmpV.x / w; starPosData[px + 1] = tmpV.y / w;
        }
        si++;
      });
    });
    starPosTex.needsUpdate = true;
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
    let bestDot = 0.6; // threshold — must be this centered to show panel
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
    meteorFeedbackMat.uniforms.uMeteorOp.value = meteorOpUniforms;
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

  // 3. Render constellation overlay (screen-space lines + sparkles) — AFTER bloom
  //    so bloom never sees it and can't create a large soft oval artifact
  renderer.autoClear = false;
  orthoScene.add(overlayMesh);
  renderer.render(orthoScene, orthoCamera);
  orthoScene.remove(overlayMesh);
  renderer.autoClear = true;

  // 4. Composite feedback trail additively over the finished frame
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
