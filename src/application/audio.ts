import { normalizeVolume, type SharedSettings } from "./shared-settings.ts";

type AudioKind = "place" | "victory" | "defeat";
type WebAudioContext = AudioContext;
let audio: WebAudioContext | null = null;
let musicTimer: ReturnType<typeof setInterval> | null = null;
let sequence = 0;
let current = { music: 0, sounds: 0 };
let buses: Record<"music"|"sounds", GainNode> | null = null;
function syncBuses(){if(!audio||!buses)return;for(const channel of ["music","sounds"] as const){buses[channel].gain.setValueAtTime(current[channel]/100,audio.currentTime);}}

// Original, unobtrusive four-note ambience; nothing is downloaded or autoplayed
// before the browser permits audio. Sound is never part of game logic.
const melody = [220, 0, 261.63, 0, 329.63, 0, 261.63, 0, 196, 0, 246.94, 0, 293.66, 0, 246.94, 0];
function context(): WebAudioContext | null {
  try {
    if (!audio && typeof AudioContext !== "undefined") { audio = new AudioContext(); buses={music:audio.createGain(),sounds:audio.createGain()}; for(const bus of Object.values(buses))bus.connect(audio.destination); syncBuses(); }
    return audio;
  } catch { return null; }
}
function note(frequency: number, duration: number, volume: number, wave: OscillatorType, channel: "music"|"sounds"="sounds"): void {
  const ctx = context();
  if (!ctx || ctx.state !== "running" || !frequency) return;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = wave;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(Math.max(volume, 0.001), ctx.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  oscillator.connect(gain);
  if (!buses || current[channel] === 0) return;
  gain.connect(buses[channel]);
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration + 0.01);
}
function stopMusic(): void {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
  sequence = 0;
}
function startMusic(): void {
  if (musicTimer || !current.music || (typeof document !== "undefined" && document.hidden)) return;
  const ctx = context();
  if (!ctx) return;
  void ctx.resume().then(() => {
    if (!current.music || musicTimer || (typeof document !== "undefined" && document.hidden)) return;
    musicTimer = setInterval(() => {
      if (!current.music) { stopMusic(); return; }
      const pitch = melody[sequence++ % melody.length];
      if (pitch) note(pitch, 0.38, 0.025, "sine", "music");
    }, 480);
  }).catch(() => { /* Autoplay may be blocked until the next interaction. */ });
}
export function updateAudioPreferences(settings: Pick<SharedSettings, "music" | "sounds"> & Partial<Pick<SharedSettings,"musicVolume"|"soundsVolume">>): void {
  current = { music: normalizeVolume(settings.musicVolume,settings.music), sounds: normalizeVolume(settings.soundsVolume,settings.sounds) };
  syncBuses();
  if (!current.music) stopMusic();
  else startMusic();
}
/** Call after user interaction; a disabled channel never creates an audio context. */
export function playGameplayEffect(kind: AudioKind): void {
  if (!current.sounds) return;
  const ctx = context();
  if (!ctx) return;
  void ctx.resume().then(() => {
    if (!current.sounds) return;
    if (kind === "victory") {
      note(523.25, 0.22, 0.045, "sine");
      note(783.99, 0.36, 0.025, "triangle");
    } else if (kind === "defeat") {
      note(174.61, 0.32, 0.03, "triangle");
    } else note(440, 0.1, 0.02, "sine");
  }).catch(() => {});
}
export function suspendAudio(): void {
  stopMusic();
  if (audio) void audio.suspend().catch(() => {});
}
export function resumeAudio(): void { if (current.music) startMusic(); }
