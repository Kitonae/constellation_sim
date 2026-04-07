export function initKeybinds({ settingsPanel, demo, infoPanel, moonPosition }) {
  window.addEventListener('keydown', e => {
    if (e.key === 'q' || e.key === 'Q') {
      settingsPanel.toggle();
      return;
    }
    if ((e.key === 'z' || e.key === 'Z') && moonPosition) {
      demo.flyToPosition(moonPosition, 8);
      return;
    }
    if (e.key === 'd' || e.key === 'D') {
      demo.isActive() ? demo.stop() : demo.start();
      return;
    }
    if (demo.isActive() && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
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
