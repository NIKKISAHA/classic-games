// Improved pitch detector + corrected octave mapping + debug info

const startBtn = document.getElementById('startBtn');
const noteDisplay = document.getElementById('note');
const freqDisplay = document.getElementById('freq');
const midiDisplay = document.getElementById('midi');
const needle = document.getElementById('needle');

let audioContext = null;
let analyser = null;
let buffer = null;

startBtn.onclick = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    buffer = new Float32Array(analyser.fftSize);

    source.connect(analyser);
    updatePitch();
    startBtn.disabled = true;
    startBtn.textContent = 'Listening...';
  } catch (err) {
    console.error('Microphone access denied or error:', err);
    alert('Microphone access is required for pitch detection.');
  }
};

/**
 * autoCorrelate: robust autocorrelation-based pitch detection.
 * Returns frequency in Hz, or -1 when no pitch detected.
 *
 * This implementation is derived from commonly used browser tuner examples.
 */
function autoCorrelate(buf, sampleRate) {
  const SIZE = buf.length;
  let rms = 0;

  for (let i = 0; i < SIZE; i++) {
    const val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) // too quiet
    return -1;

  let r1 = 0, r2 = SIZE - 1, thres = 0.2;
  // find range to avoid noisy edges
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buf[i]) < thres) { r1 = i; break; }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }
  }

  buf = buf.slice(r1, r2);
  const newSize = buf.length;

  const correlations = new Array(newSize).fill(0);
  for (let lag = 0; lag < newSize; lag++) {
    let sum = 0;
    for (let i = 0; i < newSize - lag; i++) {
      sum += buf[i] * buf[i + lag];
    }
    correlations[lag] = sum;
  }

  let d = 0;
  while (d < newSize && correlations[d] > correlations[d + 1]) d++;
  let maxPos = -1, maxVal = -Infinity;
  for (let i = d; i < newSize; i++) {
    if (correlations[i] > maxVal) {
      maxVal = correlations[i];
      maxPos = i;
    }
  }
  if (maxPos <= 0) return -1;

  // Parabolic interpolation to improve frequency estimate
  const left = correlations[maxPos - 1] || 0;
  const right = correlations[maxPos + 1] || 0;
  const betterOffset = maxPos + (right - left) / (2 * (2 * correlations[maxPos] - left - right));

  const frequency = sampleRate / (betterOffset + 1); // +1 because index->lag
  if (!isFinite(frequency) || frequency <= 0 || frequency > 5000) return -1;
  return frequency;
}

/**
 * Map frequency -> note name + cents (detune) + MIDI number
 */
function getNoteFromFrequency(frequency) {
  const A4 = 440;
  const noteNumber = 12 * (Math.log(frequency / A4) / Math.log(2)) + 69; // MIDI note number (float)
  const rounded = Math.round(noteNumber); // nearest MIDI
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  // compute octave correctly:
  // MIDI 60 => C4
  const noteIndex = (rounded + 120) % 12; // safe positive mod
  const octave = Math.floor(rounded / 12) - 1;

  const noteName = noteNames[noteIndex] + octave;
  const detune = (noteNumber - rounded) * 100; // cents

  return {
    note: noteName,
    midi: rounded,
    detune,      // cents
    noteNumber,  // fractional MIDI number (for debugging)
  };
}

function moveNeedle(detune) {
  // detune in cents: -50..+50 typical for micro tuning
  // Map -100..+100 cents to -45%..+45% of bar
  const maxPercent = 45;
  const limited = Math.max(-150, Math.min(150, detune));
  const percent = (limited / 100) * maxPercent;
  needle.style.left = `calc(50% + ${percent}%)`;
}

function updatePitch() {
  if (!analyser) return;
  analyser.getFloatTimeDomainData(buffer);
  const freq = autoCorrelate(buffer, audioContext.sampleRate);

  if (freq !== -1) {
    const info = getNoteFromFrequency(freq);
    // update UI
    noteDisplay.textContent = info.note;
    freqDisplay.textContent = `${freq.toFixed(2)} Hz`;
    midiDisplay.textContent = info.midi;
    moveNeedle(info.detune);

    // debug: you can open devtools console to see these values
    // (helpful if you still see octave issues)
    console.debug('freq:', freq.toFixed(2), 'noteNumber:', info.noteNumber.toFixed(3), 'rounded:', info.midi, 'octave:', Math.floor(info.midi/12)-1);
  } else {
    noteDisplay.textContent = '--';
    freqDisplay.textContent = '-- Hz';
    midiDisplay.textContent = '--';
    moveNeedle(0);
  }
  requestAnimationFrame(updatePitch);
}
