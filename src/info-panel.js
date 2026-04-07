import * as THREE from 'three';

export function createInfoPanel(CONSTELLATIONS) {
  const infoPanel = document.getElementById('constellation-info');
  const infoName = document.getElementById('con-name');
  const infoTranslation = document.getElementById('con-translation');
  const infoDesc = document.getElementById('con-desc');
  let infoIndex = -1;
  let infoFadeOut = false;

  const INFO_SIZE_MIN = 0.6;
  const INFO_SIZE_MAX = 2.0;
  const INFO_SIZE_STEP = 0.1;
  const _urlTextSize = parseFloat(new URLSearchParams(location.search).get('textSize'));
  let infoTextSize = !isNaN(_urlTextSize)
    ? Math.min(INFO_SIZE_MAX, Math.max(INFO_SIZE_MIN, _urlTextSize))
    : parseFloat(localStorage.getItem('cfs_infoTextSize') || '1.0');

  function applyInfoTextSize() {
    infoName.style.fontSize         = `${(20 * infoTextSize).toFixed(1)}px`;
    infoTranslation.style.fontSize  = `${(13 * infoTextSize).toFixed(1)}px`;
    infoDesc.style.fontSize         = `${(14 * infoTextSize).toFixed(1)}px`;
  }
  applyInfoTextSize();

  function show(ci) {
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

  function hide(onHidden) {
    infoFadeOut = true;
    infoPanel.style.opacity = '0';
    setTimeout(() => { infoFadeOut = false; if (onHidden) onHidden(); }, 1450);
  }

  function textSizeUp() {
    infoTextSize = parseFloat(Math.min(INFO_SIZE_MAX, infoTextSize + INFO_SIZE_STEP).toFixed(2));
    localStorage.setItem('cfs_infoTextSize', String(infoTextSize));
    applyInfoTextSize();
  }

  function textSizeDown() {
    infoTextSize = parseFloat(Math.max(INFO_SIZE_MIN, infoTextSize - INFO_SIZE_STEP).toFixed(2));
    localStorage.setItem('cfs_infoTextSize', String(infoTextSize));
    applyInfoTextSize();
  }

  return {
    show,
    hide,
    textSizeUp,
    textSizeDown,
    getIndex() { return infoIndex; },
    setIndex(v) { infoIndex = v; },
    isFading() { return infoFadeOut; },
  };
}
