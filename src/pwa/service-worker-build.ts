/** The cache version is derived from actual emitted application content, not a hand-maintained list. */
export function hashBuildFiles(files: readonly { path: string; content: string }[]): string {
  let hash = 2166136261;
  for (const { path, content } of [...files].sort((a, b) => a.path.localeCompare(b.path))) {
    const text = path + "\u0000" + content + "\u0000";
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export const PWA_PUBLIC_ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icons/cardforge.svg", "./icons/cardforge-192.png", "./icons/cardforge-512.png"] as const;

export function createServiceWorkerScript(buildId: string, emittedAssets: readonly string[]): string {
  if (!/^[a-f0-9]{8}$/.test(buildId)) throw new Error("Invalid build identifier");
  if (emittedAssets.some(path => /(^|\/)\.\.(\/|$)/.test(path) || /^(https?:|\/\/|\/)/.test(path))) throw new Error("Invalid local asset path");
  const assets = [...new Set([...PWA_PUBLIC_ASSETS, ...emittedAssets.map(path => "./" + path.replace(/^\.\//, ""))])];
  if (!assets.some(path => /\.js$/.test(path)) || !assets.some(path => /\.css$/.test(path))) {
    throw new Error("Offline app requires built JS and CSS");
  }
  if (assets.some(path => path.includes("..") || /^https?:/.test(path))) throw new Error("Invalid local asset path");
  return `/* Generated from the exact build output; only CardForge caches are managed. */
const PREFIX = "cardforge-app-";
const CACHE_NAME = PREFIX + ${JSON.stringify(buildId)};
const REQUIRED = ${JSON.stringify(assets)};
const URLS = REQUIRED.map(path => new URL(path, self.registration.scope).href);
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      await cache.addAll(URLS.map(url => new Request(url, { cache: "reload" })));
      for (const url of URLS) {
        if (!await cache.match(url)) throw new Error("Incomplete offline cache: " + url);
      }
    } catch (error) {
      await caches.delete(CACHE_NAME);
      throw error;
    }
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const url of URLS) {
      if (!await cache.match(url)) throw new Error("Offline cache incomplete");
    }
    await self.clients.claim();
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)));
  })());
});
self.addEventListener("message", event => {
  if (event.data?.type !== "CARDFORGE_CHECK_OFFLINE") return;
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      const present = await Promise.all(URLS.map(url => cache.match(url)));
      event.ports[0]?.postMessage({ type: "CARDFORGE_OFFLINE_STATUS", ready: present.every(Boolean),
        version: ${JSON.stringify(buildId)}, assetCount: URLS.length });
    } catch {
      event.ports[0]?.postMessage({ type: "CARDFORGE_OFFLINE_STATUS", ready: false });
    }
  })());
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const shell = await cache.match(new URL("./index.html", self.registration.scope).href);
      try { const live = await fetch(request, { cache: "no-store" }); if (live.ok) return live; } catch { /* offline */ }
      if (shell) return shell;
      return Response.error();
    })());
    return;
  }
  event.respondWith((async () => {
    // Built JS/CSS are immutable same-origin resources. Their fetch requests can
    // have different Vary headers from install-time cache.addAll requests.
    // Match the exact requested URL in this version's cache, ignoring Vary,
    // rather than falling through to the network on a cold offline restart.
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(url.href, { ignoreVary: true });
    if (cached) return cached;
    return fetch(request);
  })());
});
`;
}
