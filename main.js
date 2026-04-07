import * as THREE from 'three';

import { CONSTELLATIONS } from './src/data/constellations.js';
import { PLANETS } from './src/data/planets.js';
import { raDecToVec3, seededRand } from './src/helpers.js';
import {
  QS, qsSave,
  qsPixelRatio, qsOverlayScale, qsStarCount, qsMilkyWayCount, qsNebulaIters,
  deriveQualityLabel,
} from './src/quality.js';
import {
  renderer, scene, camera, controls, composer, bloomPass,
  clock, animatedMaterials, orthoScene, orthoCamera,
  fxaaPass, smaaPass,
} from './src/core.js';
import { createSkyDome } from './src/sky-dome.js';
import { createStarField } from './src/star-field.js';
import { createMilkyWay } from './src/milky-way.js';
import { createNebulae } from './src/nebulae.js';
import { createConstellations } from './src/constellations.js';
import { createPlanets } from './src/planets.js';
import { createOverlay } from './src/overlay.js';
import { createMeteorSystem } from './src/meteors.js';
import { createInfoPanel } from './src/info-panel.js';
import { createDemoMode } from './src/demo.js';
import { initSettingsPanel } from './src/settings-panel.js';
import { initKeybinds } from './src/keybinds.js';
import { initResize } from './src/resize.js';
import { createMusic } from './src/music.js';

// ─── Subsystem initialization ────────────────────────────────────────────────

const skyDomeMesh = createSkyDome(scene);
skyDomeMesh.visible = QS.skydome;
document.getElementById('vignette').style.display = QS.vignette ? '' : 'none';
const starField = createStarField(scene, animatedMaterials);
const milkyWay = createMilkyWay(scene, animatedMaterials);
const nebulae = createNebulae(scene, raDecToVec3);

const {
  constellationObjects, constellationLabels, conDimValues, SPHERE_R, starOffsets, lineOffsets,
} = createConstellations(scene, CONSTELLATIONS, raDecToVec3, seededRand, animatedMaterials);

const { planetLabels, planetMaterials } = createPlanets(scene, PLANETS, raDecToVec3, animatedMaterials, SPHERE_R);

// Precompute planet directions for free-look focus detection
const planetDirs = PLANETS.map(p => {
  const pos = raDecToVec3(p.ra, p.dec, SPHERE_R);
  return pos.normalize();
});

const overlay = createOverlay(CONSTELLATIONS, constellationObjects, starOffsets, lineOffsets);
const { overlayMat, overlayMesh, starPosData, starPosTex } = overlay;

const meteorSystem = createMeteorSystem(scene);
meteorSystem.setMaxMeteors(QS.meteors);

// Fullscreen pass meshes
const fsQuadGeo = overlay.fsQuadGeo;
const meteorFeedbackMesh = new THREE.Mesh(fsQuadGeo, meteorSystem.feedbackMat);
const meteorCompositeMesh = new THREE.Mesh(fsQuadGeo, meteorSystem.compositeMat);

overlayMesh.visible = false;
overlay.overlayCompositeMesh.visible = false;
meteorFeedbackMesh.visible = false;
meteorCompositeMesh.visible = false;
orthoScene.add(overlayMesh, overlay.overlayCompositeMesh, meteorFeedbackMesh, meteorCompositeMesh);

// Clear meteor RTs on startup
renderer.setRenderTarget(meteorSystem.rtA);
renderer.clear();
renderer.setRenderTarget(meteorSystem.rtB);
renderer.clear();
renderer.setRenderTarget(null);

// ─── Quality control ─────────────────────────────────────────────────────────

let _qualityLabel = deriveQualityLabel();

function applyQS(overrides) {
  if (overrides) Object.assign(QS, overrides);
  qsSave(QS);

  renderer.setPixelRatio(qsPixelRatio());
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  bloomPass.enabled = QS.bloom;
  bloomPass.setSize(Math.floor(window.innerWidth / 2), Math.floor(window.innerHeight / 2));
  skyDomeMesh.visible = QS.skydome;
  document.getElementById('fps').style.display = QS.showFps ? '' : 'none';
  document.getElementById('vignette').style.display = QS.vignette ? '' : 'none';
  fxaaPass.enabled = (QS.aa === 1);
  fxaaPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
  smaaPass.enabled = (QS.aa === 2);
  overlay.setScale(qsOverlayScale());
  starField.setCount(qsStarCount());
  milkyWay.setCount(qsMilkyWayCount());
  const [iter1, iter2] = qsNebulaIters();
  nebulae.setIters(iter1, iter2);
  meteorSystem.setMaxMeteors(QS.meteors);

  _qualityLabel = deriveQualityLabel();
  settingsPanel.update();
}

// ─── UI and interaction ──────────────────────────────────────────────────────

const infoPanel = createInfoPanel(CONSTELLATIONS);
const demo = createDemoMode(camera, controls, constellationObjects, infoPanel);
const settingsPanel = initSettingsPanel(applyQS, () => _qualityLabel);
initResize({ renderer, camera, composer, bloomPass, fxaaPass, overlay, meteorSystem, qsPixelRatio });
const music = createMusic();
// Build planet positions for zoom navigation (exclude hidden)
const planetZoomTargets = PLANETS
  .map((p, i) => ({ name: p.name, pos: raDecToVec3(p.ra, p.dec, SPHERE_R), isSun: p.isSun, hidden: p.hidden }))
  .filter(p => !p.hidden);
initKeybinds({ settingsPanel, demo, infoPanel, planetZoomTargets, music });

// ─── Render loop ─────────────────────────────────────────────────────────────

let lastTime = 0;
const fpsEl = document.getElementById('fps');
let fpsFrames = 0, fpsAccum = 0;
let _tDemo = 0, _tCons = 0, _tMeteors = 0, _tRender = 0;

const _projMat = new THREE.Matrix4();
const _camDir = new THREE.Vector3();
const _tmpV4 = new THREE.Vector4();
const _slerpFrom = new THREE.Vector3();
const _slerpTo   = new THREE.Vector3();
const _slerpDir  = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  const dt = Math.min(0.05, Math.max(0.0001, t - lastTime));
  lastTime = t;

  // FPS counter
  fpsFrames++;
  fpsAccum += dt;
  if (fpsAccum >= 1.0) {
    const f = fpsFrames;
    const fps = Math.round(f / fpsAccum);
    const d = (_tDemo / f).toFixed(2), c = (_tCons / f).toFixed(2);
    const m = (_tMeteors / f).toFixed(2), r = (_tRender / f).toFixed(2);
    const total = (_tDemo + _tCons + _tMeteors + _tRender) / f;
    fpsEl.textContent =
      `${fps} FPS · ${total.toFixed(2)}ms/frame · ${_qualityLabel}\n` +
      `demo ${d}ms  cons ${c}ms  meteors ${m}ms  render ${r}ms`;
    fpsFrames = 0; fpsAccum = 0;
    _tDemo = 0; _tCons = 0; _tMeteors = 0; _tRender = 0;
  }

  // ── Demo + time uniforms ──────────────────────────────────────────────────
  const _t0 = performance.now();
  demo.update(dt, _slerpFrom, _slerpTo, _slerpDir);
  animatedMaterials.forEach(m => { if (m.uniforms?.uTime) m.uniforms.uTime.value = t; });
  overlayMat.uniforms.uTime.value = t;
  const _t1 = performance.now();
  _tDemo += _t1 - _t0;

  // ── Constellation pass (dim, project, labels, focus) ──────────────────────
  const DIM_SPEED_DOWN = 3.0, DIM_SPEED_UP = 0.6;
  _projMat.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  _camDir.copy(camera.position).normalize();

  let bestIndex = -1, bestDot = 0.6, si = 0;

  for (let ci = 0; ci < constellationObjects.length; ci++) {
    const obj = constellationObjects[ci];

    // Smooth dim transition
    const diff = obj.dimTarget - obj.uDim.value;
    if (Math.abs(diff) > 0.0001) {
      const speed = diff > 0 ? DIM_SPEED_UP : DIM_SPEED_DOWN;
      obj.uDim.value += diff * Math.min(1.0, speed * dt);
    } else {
      obj.uDim.value = obj.dimTarget;
    }
    conDimValues[ci] = obj.uDim.value;

    // Back-face cull + overlay dim
    const dot = obj.centroidDir.x * _camDir.x + obj.centroidDir.y * _camDir.y + obj.centroidDir.z * _camDir.z;
    overlayMat.uniforms.uConDim.value[ci] = dot > 0.3 ? 0.0 : obj.uDim.value;

    // Project star positions to NDC
    for (let wi = 0; wi < obj.worldPositions.length; wi++) {
      const wp = obj.worldPositions[wi];
      _tmpV4.set(wp.x, wp.y, wp.z, 1.0).applyMatrix4(_projMat);
      const w = _tmpV4.w;
      const px = si * 4;
      if (w <= 0) {
        starPosData[px] = -10; starPosData[px + 1] = -10;
      } else {
        starPosData[px] = _tmpV4.x / w; starPosData[px + 1] = _tmpV4.y / w;
      }
      si++;
    }

    // Bounding circle for overlay culling
    {
      const sOff = starOffsets[ci];
      const nS = CONSTELLATIONS[ci].stars.length;
      const aspect = window.innerWidth / window.innerHeight;
      let cx = 0, cy = 0, visCount = 0;
      for (let k = 0; k < nS; k++) {
        const px = (sOff + k) * 4;
        const sx = starPosData[px], sy = starPosData[px + 1];
        if (sx < -5) continue;
        cx += sx * 0.5 * aspect; cy += sy * 0.5; visCount++;
      }
      if (visCount > 0) {
        cx /= visCount; cy /= visCount;
        let br = 0;
        for (let k = 0; k < nS; k++) {
          const px = (sOff + k) * 4;
          const sx = starPosData[px], sy = starPosData[px + 1];
          if (sx < -5) continue;
          const dx = sx * 0.5 * aspect - cx, dy = sy * 0.5 - cy;
          br = Math.max(br, Math.sqrt(dx * dx + dy * dy));
        }
        overlayMat.uniforms.uConCentroid.value[ci].set(cx, cy);
        overlayMat.uniforms.uConBoundR.value[ci] = br;
      } else {
        overlayMat.uniforms.uConCentroid.value[ci].set(-10, -10);
        overlayMat.uniforms.uConBoundR.value[ci] = 0;
      }
    }

    // Label opacity
    const label = constellationLabels[ci];
    const normal = label.userData.normal;
    if (normal) {
      const facing = normal.dot(_camDir);
      const fade = THREE.MathUtils.smoothstep(facing, -0.25, 0.35);
      const maxOpacity = (label.userData.demoActive === false) ? 0.05 : 0.88;
      label.material.opacity = Math.min(maxOpacity, 0.18 + fade * 0.7);
    }

    // Free-look focus
    if (!demo.isActive()) {
      const d = -dot;
      if (d > bestDot) { bestDot = d; bestIndex = ci; }
    }
  }

  // Planet label visibility + free-look planet focus
  let bestPlanetIndex = -1, bestPlanetDot = 0.985; // very tight ~10° cone for planets
  for (let pi = 0; pi < planetLabels.length; pi++) {
    const pl = planetLabels[pi];
    const normal = pl.userData.normal;
    if (normal) {
      const facing = normal.dot(_camDir);
      const fade = THREE.MathUtils.smoothstep(facing, -0.2, 0.3);
      pl.material.opacity = 0.15 + fade * 0.7;
    }
  }
  if (!demo.isActive()) {
    for (let pi = 0; pi < PLANETS.length; pi++) {
      if (PLANETS[pi].hidden) continue;
      const d = -planetDirs[pi].dot(_camDir); // negated: planet on far side, camera faces inward
      if (d > bestPlanetDot) { bestPlanetDot = d; bestPlanetIndex = pi; }
    }
  }

  starPosTex.needsUpdate = true;

  // Update planet opacity — focused planet lights up
  if (!demo.isActive()) {
    for (const [idx, mats] of Object.entries(planetMaterials)) {
      const targetOpacity = (bestPlanetIndex !== -1 && Number(idx) === bestPlanetIndex) ? 1.0 : 0.45;
      for (const m of mats) {
        if (m.uniforms.uOpacity) {
          const cur = m.uniforms.uOpacity.value;
          m.uniforms.uOpacity.value += (targetOpacity - cur) * Math.min(1, 4 * dt);
        }
      }
    }
  }

  // Info panel (free-look mode only)
  if (!demo.isActive()) {
    // Planet takes priority if focused (tighter cone)
    const planetId = bestPlanetIndex !== -1 ? ('p:' + bestPlanetIndex) : null;

    if (bestPlanetIndex !== -1) {
      // Focused on a planet
      for (let i = 0; i < constellationObjects.length; i++) {
        constellationObjects[i].dimTarget = 0.06;
      }
      if (infoPanel.getIndex() !== planetId && !infoPanel.isFading()) {
        if (infoPanel.getIndex() === -1) {
          infoPanel.showPlanet(PLANETS[bestPlanetIndex], bestPlanetIndex);
        } else {
          infoPanel.hide(() => infoPanel.showPlanet(PLANETS[bestPlanetIndex], bestPlanetIndex));
        }
      }
    } else if (bestIndex !== -1) {
      // Focused on a constellation
      for (let i = 0; i < constellationObjects.length; i++) {
        constellationObjects[i].dimTarget = (i === bestIndex) ? 1.0 : 0.06;
      }
      if (infoPanel.getIndex() === -1 && !infoPanel.isFading()) {
        infoPanel.show(bestIndex);
      } else if (bestIndex !== infoPanel.getIndex() && !infoPanel.isFading()) {
        infoPanel.hide(() => infoPanel.show(bestIndex));
      }
    } else {
      // Nothing focused
      for (let i = 0; i < constellationObjects.length; i++) {
        constellationObjects[i].dimTarget = 1.0;
      }
      if (infoPanel.getIndex() !== -1 && !infoPanel.isFading()) {
        infoPanel.hide(() => { infoPanel.setIndex(-1); });
      }
    }
  }

  const _t2 = performance.now();
  _tCons += _t2 - _t1;

  // ── Meteors ───────────────────────────────────────────────────────────────
  meteorSystem.update(dt);

  {
    const { meteors, meteorNdcUniforms, meteorPrevUniforms, meteorOpUniforms, meteorColorUniforms, feedbackMat } = meteorSystem;
    meteors.forEach((m, i) => {
      meteorPrevUniforms[i].copy(m.ndcPos);
      const arr = m.headGeo.attributes.position.array;
      _tmpV4.set(arr[0], arr[1], arr[2], 1.0).applyMatrix4(_projMat);
      const w = _tmpV4.w;
      if (w <= 0 || m.headOpUniform.value < 0.001) {
        m.ndcPos.set(-10, -10);
        meteorNdcUniforms[i].set(-10, -10);
        meteorPrevUniforms[i].set(-10, -10);
      } else {
        m.ndcPos.set(_tmpV4.x / w, _tmpV4.y / w);
        meteorNdcUniforms[i].copy(m.ndcPos);
      }
      meteorOpUniforms[i] = m.headOpUniform.value;
      meteorColorUniforms[i].copy(m.palette.core);
    });
    feedbackMat.uniforms.uMeteorOp.value = meteorOpUniforms;
    feedbackMat.uniforms.uMeteorColor.value = meteorColorUniforms;
  }
  const _t3 = performance.now();
  _tMeteors += _t3 - _t2;

  // ── Multi-pass rendering ──────────────────────────────────────────────────

  // 1. Meteor feedback (prev RT → rtB)
  meteorSystem.feedbackMat.uniforms.uPrevFrame.value = meteorSystem.rtA.texture;
  meteorFeedbackMesh.visible = true;
  renderer.setRenderTarget(meteorSystem.rtB);
  renderer.autoClear = true;
  renderer.render(orthoScene, orthoCamera);
  meteorFeedbackMesh.visible = false;

  // 2. 3D scene + bloom
  renderer.setRenderTarget(null);
  if (!demo.isActive()) controls.update();
  composer.render();

  // 3. Overlay at reduced resolution
  renderer.setRenderTarget(overlay.overlayRt);
  renderer.autoClear = true;
  overlayMesh.visible = true;
  renderer.render(orthoScene, orthoCamera);
  overlayMesh.visible = false;

  // 3b. Composite overlay
  renderer.setRenderTarget(null);
  renderer.autoClear = false;
  overlay.overlayCompositeMesh.visible = true;
  renderer.render(orthoScene, orthoCamera);
  overlay.overlayCompositeMesh.visible = false;

  // 4. Composite meteor trails
  meteorSystem.compositeMat.uniforms.uTrail.value = meteorSystem.rtB.texture;
  meteorCompositeMesh.visible = true;
  renderer.render(orthoScene, orthoCamera);
  renderer.autoClear = true;
  meteorCompositeMesh.visible = false;

  // Swap ping-pong targets
  meteorSystem.swapRts();
  _tRender += performance.now() - _t3;
}

animate();
