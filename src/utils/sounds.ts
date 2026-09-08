// Pleasant sound effects using Web Audio API
// All sounds are soft, musical, and non-intrusive

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.12,
  delay = 0
) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + delay + duration
    );
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.05);
  } catch {
    // Audio not available, silently skip
  }
}

function playChime(notes: number[], duration = 0.18, volume = 0.1) {
  notes.forEach((freq, i) => {
    playTone(freq, duration, "sine", volume, i * 0.12);
  });
}

function playNoise(duration: number, volume = 0.05, filterFreq = 800) {
  try {
    const ctx = getCtx();
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = filterFreq;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch {
    // Audio not available
  }
}

// --- Public API ---

/** Soft click/tap — used for button presses, tapping items */
export function playTap() {
  playTone(880, 0.08, "sine", 0.12);
}

/** Gentle chime — page transition */
export function playPageTransition() {
  playChime([523.25, 659.25, 783.99], 0.25, 0.16);
}

/** Sweet sparkle — revealing a wish, lighting a star */
export function playSparkle() {
  playChime([1046.5, 1318.5, 1568], 0.15, 0.12);
}

/** Star light — lighting a star */
export function playStarLight() {
  playTone(1318.5, 0.2, "triangle", 0.14);
  playTone(1760, 0.15, "sine", 0.08, 0.1);
}

/** Game complete — happy ascending chime */
export function playGameComplete() {
  playChime([523.25, 659.25, 783.99, 1046.5], 0.22, 0.2);
}

/** Candle blow — soft whoosh */
export function playBlow() {
  playNoise(0.35, 0.14, 900);
}

/** Confetti/birthday fanfare */
export function playFanfare() {
  playChime([523.25, 659.25, 783.99, 1046.5, 1318.5], 0.3, 0.16);
}

/** Letter open — gentle paper sound */
export function playLetterOpen() {
  playTone(440, 0.15, "triangle", 0.12);
  playTone(554.37, 0.12, "sine", 0.08, 0.08);
}

/** Bouquet present — soft romantic chime */
export function playBouquet() {
  playChime([440, 554.37, 659.25, 880], 0.25, 0.14);
}

// =============================================
// MINI-GAME SPECIFIC SOUNDS — more realistic
// =============================================

/** Cat meow — short, cute meow sound with formant-like tones */
export function playMeow() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(700, now);
    osc1.frequency.exponentialRampToValueAtTime(500, now + 0.12);
    gain1.gain.setValueAtTime(0.22, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.18);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(450, now + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(300, now + 0.3);
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.18, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.38);

    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = "triangle";
    osc3.frequency.setValueAtTime(1200, now);
    osc3.frequency.exponentialRampToValueAtTime(900, now + 0.15);
    gain3.gain.setValueAtTime(0.07, now);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now);
    osc3.stop(now + 0.2);
  } catch {
    // Audio not available
  }
}

/** Cat purr — low rumbling purr with vibrato */
export function playPurr() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 120;
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 25;
    lfoGain.gain.value = 15;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    lfo.start(now);
    osc.start(now);
    lfo.stop(now + 0.42);
    osc.stop(now + 0.45);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.value = 240;
    gain2.gain.setValueAtTime(0.09, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.02);
    osc2.stop(now + 0.38);
  } catch {
    // Audio not available
  }
}

/** Cat happy sound — alternating meow/purr with variation */
let catSoundCounter = 0;
export function playCatReaction() {
  catSoundCounter++;
  if (catSoundCounter % 3 === 0) {
    playMeow();
  } else {
    playPurr();
    if (catSoundCounter % 5 === 0) {
      playTone(1400, 0.06, "sine", 0.08, 0.05);
    }
  }
}

/** Heart fill — each heart in pet cat game */
export function playHeartFill() {
  playTone(698.46, 0.12, "sine", 0.14);
  playTone(880, 0.12, "sine", 0.1, 0.08);
}

/** Catch petal — soft pluck/chime like picking a flower */
export function playCatchPetal() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.value = 1567.98;
    gain2.gain.setValueAtTime(0.12, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.05);
    osc2.stop(now + 0.22);
  } catch {
    // Audio not available
  }
}

/** Pop bubble — realistic bubble pop with resonance */
export function playBubblePop() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    const bufferSize = Math.floor(ctx.sampleRate * 0.05);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] =
        (Math.random() * 2 - 1) *
        Math.exp(-i / (bufferSize * 0.08)) *
        (i < 3 ? 0.5 : 1);
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.35;
    const bpf = ctx.createBiquadFilter();
    bpf.type = "bandpass";
    bpf.frequency.value = 2500;
    bpf.Q.value = 2;
    noiseSource.connect(bpf);
    bpf.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(now);

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
    oscGain.gain.setValueAtTime(0.2, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);

    const osc2 = ctx.createOscillator();
    const oscGain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(3200, now);
    osc2.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
    oscGain2.gain.setValueAtTime(0.08, now);
    oscGain2.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc2.connect(oscGain2);
    oscGain2.connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.08);
  } catch {
    // Audio not available
  }
}
