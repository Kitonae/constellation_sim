// View distances per planet (how far the camera sits from the body)
const VIEW_DIST = {
  Sun: 10,
  Moon: 8,
  Mercury: 4,
  Venus: 5,
  Mars: 5,
  Jupiter: 8,
  Saturn: 8,
  Uranus: 6,
  Neptune: 6,
};

export function initKeybinds({ settingsPanel, demo, infoPanel, planetZoomTargets }) {
  let zoomIndex = -1; // -1 = not zoomed, otherwise index into planetZoomTargets
  let zoomed = false;

  // Find Moon as default Z target
  const moonIdx = planetZoomTargets.findIndex(p => p.name === 'Moon');
  const defaultZoomIdx = moonIdx !== -1 ? moonIdx : 0;

  function zoomTo(idx) {
    if (idx < 0 || idx >= planetZoomTargets.length) return;
    zoomIndex = idx;
    zoomed = true;
    const target = planetZoomTargets[idx];
    const dist = VIEW_DIST[target.name] || 6;
    demo.flyToPosition(target.pos, dist);
  }

  window.addEventListener('keydown', e => {
    if (e.key === 'f' || e.key === 'F') {
      const el = document.getElementById('fps');
      if (el) el.style.display = el.style.display === 'none' ? '' : 'none';
      return;
    }
    if (e.key === 'q' || e.key === 'Q') {
      settingsPanel.toggle();
      return;
    }
    if (e.key === 'z' || e.key === 'Z') {
      if (!zoomed) {
        zoomTo(defaultZoomIdx);
      } else {
        // Zoom out — flyToPosition toggles back
        zoomed = false;
        zoomIndex = -1;
        demo.flyToPosition(planetZoomTargets[defaultZoomIdx].pos, 8);
      }
      return;
    }
    if (zoomed && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      e.preventDefault();
      const delta = e.key === 'ArrowRight' ? 1 : -1;
      const next = (zoomIndex + delta + planetZoomTargets.length) % planetZoomTargets.length;
      zoomTo(next);
      return;
    }
    if (e.key === 'd' || e.key === 'D') {
      demo.isActive() ? demo.stop() : demo.start();
      return;
    }
    if (demo.isActive() && !zoomed && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      e.preventDefault();
      demo.jumpTo(demo.getIndex() + (e.key === 'ArrowRight' ? 1 : -1));
      return;
    }
    if (e.key === 'PageUp') {
      e.preventDefault();
      infoPanel.textSizeUp();
      return;
    }
    if (e.key === 'PageDown') {
      e.preventDefault();
      infoPanel.textSizeDown();
      return;
    }
    if (e.key === ']') {
      demo.adjustHold(5);
    } else if (e.key === '[') {
      demo.adjustHold(-5);
    } else if (e.key === '.') {
      demo.adjustTrans(1);
    } else if (e.key === ',') {
      demo.adjustTrans(-1);
    }
  });
}
