export const QS_PIXEL_RATIO_STEPS = [0.5, 0.75, 1.0, Math.min(window.devicePixelRatio, 2.0)];
export const QS_OVERLAY_STEPS     = [0.5, 0.7, 0.85, 1.0];
export const QS_STAR_STEPS        = [1000, 2000, 3500, 5000, 7000];
export const QS_MILKYWAY_STEPS    = [3000, 6000, 10000, 14000, 18000];
// nebula: [iter1, iter2] per step
export const QS_NEBULA_STEPS      = [[4,8],[6,9],[8,12],[10,15],[13,18]];

// Pixel ratio step labels shown in the value readout
export const QS_PIXEL_RATIO_LABELS = ['0.5×','0.75×','1×', window.devicePixelRatio > 1 ? `${Math.min(window.devicePixelRatio,2).toFixed(1)}×` : 'Native'];

// Anti-aliasing modes: 0=Off, 1=FXAA, 2=SMAA
export const QS_AA_LABELS = ['Off', 'FXAA', 'SMAA'];

// Default settings (High quality)
const QS_DEFAULTS = {
  pixelRatioStep: 3,   // index into QS_PIXEL_RATIO_STEPS
  bloom: true,
  aa: 2,               // 0=Off, 1=FXAA, 2=SMAA
  skydome: true,
  vignette: true,
  overlayStep: 4,      // 1-based to match slider min=1
  starsStep: 5,
  milkyWayStep: 5,
  nebulaStep: 5,
  meteors: 3,
};

// Preset stamps — set of step values for Low / Medium / High
export const QUALITY_PRESETS = {
  Low:    { pixelRatioStep:1, bloom:false, aa:0, skydome:false, vignette:false, overlayStep:1, starsStep:1, milkyWayStep:1, nebulaStep:1, meteors:0 },
  Medium: { pixelRatioStep:2, bloom:true,  aa:1, skydome:true,  vignette:true,  overlayStep:2, starsStep:3, milkyWayStep:3, nebulaStep:3, meteors:1 },
  High:   { pixelRatioStep:3, bloom:true,  aa:2, skydome:true,  vignette:true,  overlayStep:4, starsStep:5, milkyWayStep:5, nebulaStep:5, meteors:3 },
};

export function qsLoad() {
  const s = {};
  for (const [k, def] of Object.entries(QS_DEFAULTS)) {
    const raw = localStorage.getItem(`cfs_qs_${k}`);
    if (raw === null) { s[k] = def; continue; }
    s[k] = (typeof def === 'boolean') ? (raw === 'true') : Number(raw);
  }
  return s;
}

export function qsSave(qs) {
  for (const [k, v] of Object.entries(qs)) {
    localStorage.setItem(`cfs_qs_${k}`, String(v));
  }
}

export let QS = qsLoad();

// Derived concrete values from current QS state
export function qsPixelRatio()   { return QS_PIXEL_RATIO_STEPS[QS.pixelRatioStep - 1]; }
export function qsOverlayScale() { return QS_OVERLAY_STEPS[QS.overlayStep - 1]; }
export function qsStarCount()    { return QS_STAR_STEPS[QS.starsStep - 1]; }
export function qsMilkyWayCount(){ return QS_MILKYWAY_STEPS[QS.milkyWayStep - 1]; }
export function qsNebulaIters()  { return QS_NEBULA_STEPS[QS.nebulaStep - 1]; }

// deriveQualityLabel() returns Low/Medium/High/Custom from current QS state
export function deriveQualityLabel() {
  for (const [name, preset] of Object.entries(QUALITY_PRESETS)) {
    if (Object.entries(preset).every(([k,v]) => QS[k] === v)) return name;
  }
  return 'Custom';
}
