export function initKeybinds({ settingsPanel, demo, infoPanel, moonPosition, music }) {
  const musicBadge = document.getElementById('music-badge');

  function updateMusicBadge() {
    if (!musicBadge) return;
    if (music.isPlaying()) {
      musicBadge.style.display = 'block';
      musicBadge.textContent = '\u266B  Music ' + Math.round(music.getVolume() * 100) + '%';
    } else {
      musicBadge.style.display = 'none';
    }
  }

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
    if (e.key === 'm' || e.key === 'M') {
      music.toggle();
      updateMusicBadge();
      return;
    }
    if (e.key === '-' || e.key === '_') {
      music.setVolume(music.getVolume() - 0.1);
      updateMusicBadge();
      return;
    }
    if (e.key === '=' || e.key === '+') {
      music.setVolume(music.getVolume() + 0.1);
      updateMusicBadge();
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
