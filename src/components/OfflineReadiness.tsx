import { useEffect, useState } from "react";
import { hasServiceWorkerSupport, resolveOfflineStatus, type OfflineProbe, type OfflineStatus } from "../application/offline-readiness.ts";
import type { Locale } from "../i18n/language.ts";

function inspect(worker: ServiceWorker): Promise<OfflineProbe | null> {
  return new Promise(resolve => {
    const channel = new MessageChannel();
    const timeout = window.setTimeout(() => { channel.port1.close(); resolve(null); }, 5000);
    channel.port1.onmessage = event => {
      window.clearTimeout(timeout);
      channel.port1.close();
      const data: unknown = event.data;
      if (!data || typeof data !== "object" || (data as { type?: string }).type !== "CARDFORGE_OFFLINE_STATUS") {
        resolve(null); return;
      }
      resolve(data as OfflineProbe);
    };
    try { worker.postMessage({ type: "CARDFORGE_CHECK_OFFLINE" }, [channel.port2]); }
    catch { window.clearTimeout(timeout); channel.port1.close(); resolve(null); }
  });
}
export default function OfflineReadiness({ language }: { language: Locale }) {
  const english = language === "en";
  const [status, setStatus] = useState<OfflineStatus>({ phase: "installing" });
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const onNetwork = () => setOnline(navigator.onLine);
    window.addEventListener("online", onNetwork);
    window.addEventListener("offline", onNetwork);
    return () => { window.removeEventListener("online", onNetwork); window.removeEventListener("offline", onNetwork); };
  }, []);
  useEffect(() => {
    if (!hasServiceWorkerSupport("serviceWorker" in navigator, window.isSecureContext, import.meta.env.PROD)) {
      setStatus({ phase: "unsupported" });
      return;
    }
    let cancelled = false;
    let registration: ServiceWorkerRegistration | null = null;
    async function check() {
      try {
        const worker = navigator.serviceWorker.controller ?? registration?.active;
        if (!worker) { if (!cancelled) setStatus({ phase: "installing" }); return; }
        const probe = await inspect(worker);
        if (!cancelled) setStatus(probe ? resolveOfflineStatus(probe, !!navigator.serviceWorker.controller) : { phase: "installing" });
      } catch {
        if (!cancelled) setStatus({ phase: "error" });
      }
    }
    const onControl = () => { void check(); };
    navigator.serviceWorker.addEventListener("controllerchange", onControl);
    void (async () => {
      // On an offline cold restart, a controller can already serve the cached shell.
      // Probe it BEFORE attempting registration, which may reject while offline.
      if (navigator.serviceWorker.controller) await check();
      try {
        registration = await navigator.serviceWorker.register(new URL("sw.js", document.baseURI).toString(), { scope: "./", updateViaCache: "none" });
        if (cancelled) return;
        registration.addEventListener("updatefound", onControl);
        if (registration.installing) registration.installing.addEventListener("statechange", onControl);
        await check();
      } catch {
        if (!cancelled) {
          if (navigator.serviceWorker.controller) await check();
          else setStatus({ phase: "error" });
        }
      }
    })();
    return () => {
      cancelled = true;
      navigator.serviceWorker.removeEventListener("controllerchange", onControl);
      registration?.removeEventListener("updatefound", onControl);
    };
  }, []);
  const message = status.phase === "ready" ?
    (english ? "Grim Delve and Thunderfighter ready offline" : "Grim Delve et Thunderfighter prêts hors ligne") :
    status.phase === "reload-required" ?
    (english ? "Offline files installed — reload to activate offline play" : "Ressources installées — rechargez pour activer le jeu hors ligne") :
    status.phase === "unsupported" ?
    (english ? "Offline mode requires the installed app on HTTPS or localhost" : "Mode hors ligne disponible dans l’application publiée en HTTPS ou sur localhost") :
    status.phase === "error" ?
    (english ? "Offline installation unavailable; a connection may be required" : "Installation hors ligne indisponible ; une connexion peut être nécessaire") :
    (english ? "Preparing the complete offline collection…" : "Préparation complète des ressources hors ligne…");
  return <section className="offline-readiness" role="status" aria-live="polite" data-offline-phase={status.phase}>
    <span aria-hidden="true">{status.phase === "ready" ? "✓" : status.phase === "error" ? "!" : "◌"}</span>
    <span>{message}</span>
    {status.phase === "ready" ? <small>{online ? (english ? "Connected" : "Connecté") : (english ? "Offline" : "Hors connexion")}</small> : null}
    {status.phase === "reload-required" ? <button type="button" className="secondary-action" onClick={() => window.location.reload()}>
      {english ? "Activate" : "Activer"}
    </button> : null}
  </section>;
}
