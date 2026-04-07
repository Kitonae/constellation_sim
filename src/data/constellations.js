export const CONSTELLATIONS = [
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
