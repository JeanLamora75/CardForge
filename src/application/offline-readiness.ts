export type OfflinePhase = "unsupported" | "installing" | "reload-required" | "ready" | "error";
export interface OfflineStatus {
  phase: OfflinePhase;
  version?: string;
  assetCount?: number;
}
export interface OfflineProbe {
  ready: boolean;
  version?: string;
  assetCount?: number;
}
/** Only a fully cached build controlled by the current page is ready for offline play. */
export function resolveOfflineStatus(probe: OfflineProbe | null, controlled: boolean): OfflineStatus {
  if (!probe || !probe.ready || !probe.version || !Number.isSafeInteger(probe.assetCount) || (probe.assetCount ?? 0) < 4)
    return { phase: "installing" };
  return controlled
    ? { phase: "ready", version: probe.version, assetCount: probe.assetCount }
    : { phase: "reload-required", version: probe.version, assetCount: probe.assetCount };
}
export function hasServiceWorkerSupport(
  supported: boolean, secureContext: boolean, production: boolean,
): boolean {
  return supported && secureContext && production;
}
