import {
  QS, QS_PIXEL_RATIO_LABELS, QS_OVERLAY_STEPS,
  QS_STAR_STEPS, QS_MILKYWAY_STEPS, QUALITY_PRESETS,
} from './quality.js';

export function initSettingsPanel(applyQS, getQualityLabel) {
  const settingsBtn = document.getElementById('settings-btn');
  const settingsPanel = document.getElementById('settings-panel');
  let settingsPanelOpen = false;

  function update() {
    if (!settingsPanel) return;

    const sliders = {
      'sq-pixelratio': QS.pixelRatioStep,
      'sq-overlay':    QS.overlayStep,
      'sq-stars':      QS.starsStep,
      'sq-milkyway':   QS.milkyWayStep,
      'sq-nebula':     QS.nebulaStep,
      'sq-meteors':    QS.meteors,
    };
    for (const [id, val] of Object.entries(sliders)) {
      const el = document.getElementById(id);
      if (el) el.value = val;
    }

    const pixelRatioVal = document.getElementById('sq-pixelratio-val');
    if (pixelRatioVal) pixelRatioVal.textContent = QS_PIXEL_RATIO_LABELS[QS.pixelRatioStep - 1];

    const overlayVal = document.getElementById('sq-overlay-val');
    if (overlayVal) overlayVal.textContent = `${Math.round(QS_OVERLAY_STEPS[QS.overlayStep - 1] * 100)}%`;

    const starsVal = document.getElementById('sq-stars-val');
    if (starsVal) starsVal.textContent = QS_STAR_STEPS[QS.starsStep - 1].toLocaleString();

    const milkywayVal = document.getElementById('sq-milkyway-val');
    if (milkywayVal) milkywayVal.textContent = QS_MILKYWAY_STEPS[QS.milkyWayStep - 1].toLocaleString();

    const nebulaSteps = ['Low','Low+','Mid','High-','High'];
    const nebulaVal = document.getElementById('sq-nebula-val');
    if (nebulaVal) nebulaVal.textContent = nebulaSteps[QS.nebulaStep - 1];

    const meteorsVal = document.getElementById('sq-meteors-val');
    if (meteorsVal) meteorsVal.textContent = QS.meteors === 0 ? 'Off' : String(QS.meteors);

    const bloomTrack = document.getElementById('sq-bloom-track');
    if (bloomTrack) bloomTrack.classList.toggle('on', QS.bloom);
    const bloomLabel = document.getElementById('sq-bloom-label');
    if (bloomLabel) bloomLabel.textContent = QS.bloom ? 'On' : 'Off';

    const activePreset = getQualityLabel();
    settingsPanel.querySelectorAll('.sp-preset').forEach(el => {
      el.classList.toggle('active', el.dataset.preset === activePreset);
    });
  }

  function toggle() {
    settingsPanelOpen = !settingsPanelOpen;
    settingsPanel.classList.toggle('visible', settingsPanelOpen);
  }

  function close() {
    settingsPanelOpen = false;
    settingsPanel.classList.remove('visible');
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', e => {
      e.stopPropagation();
      toggle();
    });
  }

  if (settingsPanel) {
    settingsPanel.addEventListener('click', e => e.stopPropagation());

    settingsPanel.querySelectorAll('.sp-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = QUALITY_PRESETS[btn.dataset.preset];
        if (preset) applyQS({ ...preset });
      });
    });

    const sliderKeyMap = {
      'sq-pixelratio': 'pixelRatioStep',
      'sq-overlay':    'overlayStep',
      'sq-stars':      'starsStep',
      'sq-milkyway':   'milkyWayStep',
      'sq-nebula':     'nebulaStep',
      'sq-meteors':    'meteors',
    };
    for (const [id, key] of Object.entries(sliderKeyMap)) {
      const slider = document.getElementById(id);
      if (slider) {
        slider.addEventListener('input', e => {
          applyQS({ [key]: Number(e.target.value) });
        });
      }
    }

    const bloomTrack = document.getElementById('sq-bloom-track');
    if (bloomTrack) {
      bloomTrack.addEventListener('click', () => {
        applyQS({ bloom: !QS.bloom });
      });
    }
  }

  document.addEventListener('click', () => close());

  update();

  return { update, toggle, close };
}
