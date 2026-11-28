/** Presentation settings are intentionally independent of saved games. */
export type AnimationPreference = "system" | "on" | "off";
export type SharedSettings = Readonly<{
  music: boolean;
  musicVolume: number;
  ambienceVolume: number;
  sounds: boolean;
  soundsVolume: number;
  animations: AnimationPreference;
  hints: boolean;
}>;
export interface SettingsStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export const SETTINGS_KEY = "cardforge.settings.v1";
export const DEFAULT_SETTINGS: SharedSettings = Object.freeze({
  music: false, sounds: false, musicVolume: 0, soundsVolume: 0, ambienceVolume: 0, animations: "system", hints: true,
});
const validAnimation = (value: unknown): value is AnimationPreference =>
  value === "system" || value === "on" || value === "off";

export function normalizeVolume(value: unknown, legacy: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : legacy === true ? 100 : 0;
}
export function normalizeSettings(value: unknown): SharedSettings {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ...DEFAULT_SETTINGS };
  const stored = value as Record<string, unknown>;
  const musicVolume=normalizeVolume(stored.musicVolume,stored.music), soundsVolume=normalizeVolume(stored.soundsVolume,stored.sounds);
  return {
    music: musicVolume>0, sounds: soundsVolume>0, musicVolume, soundsVolume, ambienceVolume: normalizeVolume(stored.ambienceVolume,false),
    animations: validAnimation(stored.animations) ? stored.animations : DEFAULT_SETTINGS.animations,
    hints: typeof stored.hints === "boolean" ? stored.hints : DEFAULT_SETTINGS.hints,
  };
}
export function readSharedSettings(storage: SettingsStorage | null): SharedSettings {
  if (!storage) return { ...DEFAULT_SETTINGS };
  try {
    const raw = storage.getItem(SETTINGS_KEY);
    if (raw !== null) {
      const parsed: unknown=JSON.parse(raw); const normalized=normalizeSettings(parsed);
      if(parsed && typeof parsed==="object" && !Array.isArray(parsed)){
        const old=parsed as Record<string,unknown>;
        if(typeof old.musicVolume!=="number" || typeof old.soundsVolume!=="number" || typeof old.ambienceVolume!=="number"){
          try{storage.setItem(SETTINGS_KEY,JSON.stringify(normalized));}catch{/* Keep working with normalized in-memory values. */}
        }
      }
      return normalized;
    }
    // Preserve an explicit legacy opt-out when graduating from per-game hints.
    const old = ["clear-the-dungeon", "gridcannon"].map(game => {
      const item = storage.getItem("cardforge.learning.v1." + game);
      if (item === null) return null;
      const parsed: unknown = JSON.parse(item);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
      return (parsed as Record<string, unknown>).hintsEnabled;
    });
    return { ...DEFAULT_SETTINGS, hints: !old.some(value => value === false) };
  } catch { return { ...DEFAULT_SETTINGS }; }
}
export function saveSharedSettings(storage: SettingsStorage | null, settings: SharedSettings): boolean {
  if (!storage) return false;
  try {
    storage.setItem(SETTINGS_KEY, JSON.stringify(normalizeSettings(settings)));
    return true;
  } catch { return false; }
}
/** The system preference always wins unless the player explicitly overrides it. */
export function motionAllowed(setting: AnimationPreference, systemReducesMotion: boolean): boolean {
  if (setting === "off") return false;
  if (setting === "on") return true;
  return !systemReducesMotion;
}
