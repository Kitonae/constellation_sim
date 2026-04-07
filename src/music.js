// ─── Generative Ambient Music: "Celestial Drift" ─────────────────────────────
//
//  A layered, procedural soundtrack for the constellation simulator.
//  Built entirely with the Web Audio API — no samples or external files.
//
//  Layers:
//    1. Deep drone        – two detuned saws filtered to a warm hum (D2 + A1)
//    2. Sub pulse         – slow LFO-modulated sine at the root (D1)
//    3. Pad chord         – evolving triad pads (D-min / F-maj / A-min / C-maj)
//    4. Shimmer arpeggio  – high, quiet pentatonic notes that sparkle like stars
//    5. Cosmic texture    – band-passed noise for that "void of space" feel
//
//  Key: D natural minor / modal interchange
//  Tempo: free-time, event-driven
// ──────────────────────────────────────────────────────────────────────────────

const NOTE = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

// D natural minor pentatonic + extensions
const SCALE = [62, 65, 67, 69, 72, 74, 77, 79, 81, 84, 86, 89]; // D4-D7 region

// Chord voicings (MIDI): slowly cycle through these
const CHORDS = [
  [38, 50, 57, 62, 69],  // Dm      – D2 D3 A3 D4 A4
  [41, 53, 57, 60, 65],  // F       – F2 F3 A3 C4 F4
  [45, 52, 57, 64, 69],  // Am      – A2 E3 A3 E4 A4
  [36, 48, 55, 60, 67],  // C       – C2 C3 G3 C4 G4
  [38, 50, 57, 62, 66],  // Dm(add♭3) – D2 D3 A3 D4 F#4 (lydian colour)
  [43, 50, 55, 62, 67],  // G       – G2 D3 G3 D4 G4
];

export function createMusic() {
  let ctx = null;
  let master = null;
  let running = false;
  let disposed = false;
  let volume = 0.55;

  // Node references for cleanup
  const nodes = [];

  // ── Helpers ──────────────────────────────────────────────────────────────

  function makeGain(val) {
    const g = ctx.createGain();
    g.gain.value = val;
    nodes.push(g);
    return g;
  }

  function makeOsc(type, freq) {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    nodes.push(o);
    return o;
  }

  function makeFilter(type, freq, Q) {
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = Q || 1;
    nodes.push(f);
    return f;
  }

  function makeConvolver() {
    // Generate a simple impulse response for reverb (2.8 seconds)
    const len = ctx.sampleRate * 2.8;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        // Exponential decay with slight randomness for diffusion
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
      }
    }
    const conv = ctx.createConvolver();
    conv.buffer = buf;
    nodes.push(conv);
    return conv;
  }

  // ── Start everything ─────────────────────────────────────────────────────

  function start() {
    if (running) return;
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === 'suspended') ctx.resume();

    running = true;
    disposed = false;

    // Master chain: gain → reverb-send + dry → destination
    master = makeGain(volume);
    const dry = makeGain(0.65);
    const wet = makeGain(0.35);
    const reverb = makeConvolver();

    master.connect(dry).connect(ctx.destination);
    master.connect(reverb).connect(wet).connect(ctx.destination);

    buildDrone(master);
    buildSubPulse(master);
    buildPads(master);
    buildShimmer(master);
    buildTexture(master);
  }

  // ── Layer 1: Deep drone ──────────────────────────────────────────────────

  function buildDrone(dest) {
    const droneGain = makeGain(0.0);
    droneGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 6);
    droneGain.connect(dest);

    const lp = makeFilter('lowpass', 320, 0.7);
    lp.connect(droneGain);

    // Two detuned sawtooths → filtered
    [NOTE(38), NOTE(33)].forEach((freq, i) => { // D2, A1
      const o = makeOsc('sawtooth', freq);
      // Slow detune drift
      const lfo = makeOsc('sine', 0.04 + i * 0.02);
      const lfoGain = makeGain(1.5);
      lfo.connect(lfoGain).connect(o.detune);
      lfo.start();

      o.connect(lp);
      o.start();
    });

    // Slow filter sweep on the drone
    sweepParam(lp.frequency, 200, 500, 18);
  }

  // ── Layer 2: Sub pulse ───────────────────────────────────────────────────

  function buildSubPulse(dest) {
    const subGain = makeGain(0.0);
    subGain.gain.linearRampToValueAtTime(0.10, ctx.currentTime + 8);
    subGain.connect(dest);

    const sub = makeOsc('sine', NOTE(26)); // D1
    const lfo = makeOsc('sine', 0.08);     // Very slow amplitude throb
    const lfoGain = makeGain(0.05);
    lfo.connect(lfoGain).connect(subGain.gain);

    sub.connect(subGain);
    sub.start();
    lfo.start();
  }

  // ── Layer 3: Pad chords ──────────────────────────────────────────────────

  function buildPads(dest) {
    const padGain = makeGain(0.0);
    padGain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 10);
    padGain.connect(dest);

    const lp = makeFilter('lowpass', 900, 0.5);
    lp.connect(padGain);

    let chordIndex = 0;
    const oscBank = [];

    // Create oscillators for 5-voice chord
    for (let v = 0; v < 5; v++) {
      const o = makeOsc('sine', NOTE(CHORDS[0][v]));
      const voiceGain = makeGain(v < 2 ? 0.35 : 0.55); // lower voices quieter
      o.connect(voiceGain).connect(lp);
      o.start();
      oscBank.push(o);
    }

    // Change chord every ~12 seconds with smooth glide
    function nextChord() {
      if (disposed) return;
      chordIndex = (chordIndex + 1) % CHORDS.length;
      const chord = CHORDS[chordIndex];
      const t = ctx.currentTime;
      for (let v = 0; v < 5; v++) {
        oscBank[v].frequency.exponentialRampToValueAtTime(NOTE(chord[v]), t + 4);
      }
      // Modulate filter cutoff with chord changes
      const newCutoff = 600 + Math.random() * 700;
      lp.frequency.linearRampToValueAtTime(newCutoff, t + 5);

      setTimeout(nextChord, 11000 + Math.random() * 5000);
    }
    setTimeout(nextChord, 8000);
  }

  // ── Layer 4: Shimmer arpeggio ────────────────────────────────────────────

  function buildShimmer(dest) {
    const shimGain = makeGain(0.0);
    shimGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 14);
    shimGain.connect(dest);

    const hp = makeFilter('highpass', 2000, 0.3);
    hp.connect(shimGain);

    function playNote() {
      if (disposed) return;
      const midi = SCALE[Math.floor(Math.random() * SCALE.length)];
      const freq = NOTE(midi);
      const now = ctx.currentTime;
      const dur = 1.5 + Math.random() * 3;

      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = freq;

      // Gentle vibrato
      const vib = ctx.createOscillator();
      vib.type = 'sine';
      vib.frequency.value = 4 + Math.random() * 2;
      const vibG = ctx.createGain();
      vibG.gain.value = 3;
      vib.connect(vibG).connect(o.frequency);

      const env = ctx.createGain();
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(0.15 + Math.random() * 0.1, now + dur * 0.3);
      env.gain.exponentialRampToValueAtTime(0.001, now + dur);

      o.connect(env).connect(hp);
      o.start(now);
      vib.start(now);
      o.stop(now + dur + 0.05);
      vib.stop(now + dur + 0.05);

      // Occasionally play a second note for a dyad shimmer
      if (Math.random() < 0.3) {
        const midi2 = SCALE[Math.floor(Math.random() * SCALE.length)];
        const o2 = ctx.createOscillator();
        o2.type = 'triangle';
        o2.frequency.value = NOTE(midi2);
        const env2 = ctx.createGain();
        env2.gain.setValueAtTime(0, now + 0.2);
        env2.gain.linearRampToValueAtTime(0.08, now + 0.2 + dur * 0.3);
        env2.gain.exponentialRampToValueAtTime(0.001, now + 0.2 + dur);
        o2.connect(env2).connect(hp);
        o2.start(now + 0.2);
        o2.stop(now + 0.2 + dur + 0.05);
      }

      // Random interval between notes: 1.5 – 5 seconds
      setTimeout(playNote, 1500 + Math.random() * 3500);
    }

    // Start shimmer after 12 seconds
    setTimeout(playNote, 12000);
  }

  // ── Layer 5: Cosmic texture (filtered noise) ─────────────────────────────

  function buildTexture(dest) {
    const texGain = makeGain(0.0);
    texGain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 5);
    texGain.connect(dest);

    // White noise source
    const bufLen = ctx.sampleRate * 4;
    const noiseBuf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    noise.loop = true;
    nodes.push(noise);

    // Band-pass for "cosmic wind" effect
    const bp = makeFilter('bandpass', 800, 0.4);
    sweepParam(bp.frequency, 400, 1600, 22);

    // Second narrower band for tonal colour
    const bp2 = makeFilter('bandpass', 1200, 2.5);
    sweepParam(bp2.frequency, 600, 2400, 31);
    const bp2Gain = makeGain(0.3);

    noise.connect(bp).connect(texGain);
    noise.connect(bp2).connect(bp2Gain).connect(texGain);
    noise.start();
  }

  // ── Utility: slow triangle-wave parameter sweep ──────────────────────────

  function sweepParam(param, min, max, periodSec) {
    function tick() {
      if (disposed) return;
      const t = ctx.currentTime;
      const mid = (min + max) / 2;
      const amp = (max - min) / 2;
      param.linearRampToValueAtTime(mid + amp, t + periodSec / 2);
      param.linearRampToValueAtTime(mid - amp, t + periodSec);
      setTimeout(tick, periodSec * 1000);
    }
    tick();
  }

  // ── Stop ─────────────────────────────────────────────────────────────────

  function stop() {
    if (!running) return;
    disposed = true;
    running = false;

    // Fade out master over 2 seconds, then disconnect everything
    if (master) {
      const t = ctx.currentTime;
      master.gain.linearRampToValueAtTime(0, t + 2);
      setTimeout(() => {
        nodes.forEach(n => {
          try { n.disconnect(); } catch (_) { /* already disconnected */ }
          if (n.stop) try { n.stop(); } catch (_) { /* already stopped */ }
        });
        nodes.length = 0;
        master = null;
      }, 2500);
    }
  }

  // ── Public API ───────────────────────────────────────────────────────────

  return {
    start,
    stop,
    toggle() { running ? stop() : start(); },
    isPlaying() { return running; },
    setVolume(v) {
      volume = Math.max(0, Math.min(1, v));
      if (master) master.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.3);
    },
    getVolume() { return volume; },
  };
}
