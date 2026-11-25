import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const dist = resolve("dist");
const text = file => readFileSync(resolve(dist, file), "utf8");
const worker = text("sw.js");
const match = worker.match(/const REQUIRED = (\[[^\n]+\]);/);
assert.ok(match, "the built service worker must contain its precache manifest");
const paths = JSON.parse(match[1]);
assert.ok(paths.includes("./") && paths.includes("./index.html"));
assert.ok(paths.includes("./manifest.webmanifest"));
for (const file of paths) {
  const asset = file === "./" ? "index.html" : file.slice(2);
  assert.ok(!asset.includes("..") && !asset.startsWith("/"), `invalid cache path: ${asset}`);
  assert.ok(statSync(resolve(dist, asset)).size > 0, `missing or empty precache asset: ${asset}`);
}
assert.ok(paths.some(file => /^\.\/assets\/.*\.js$/.test(file)), "built JS must be cached");
assert.ok(paths.some(file => /^\.\/assets\/.*\.css$/.test(file)), "built CSS must be cached");
for (const family of ["rajdhani","cinzel","alegreyasc","josefinsans","kaushanscript"]) {
  assert.ok(paths.some(file=>file.startsWith("./assets/"+family+"-") && file.endsWith(".ttf")), "missing cached font: "+family);
  const notice = "./licenses/fonts/"+family+".txt";
  assert.ok(paths.includes(notice), "missing cached licence: "+family);
  assert.match(text(notice.slice(2)), /SIL OPEN FONT LICENSE Version 1\.1/);
}
assert.match(worker, /await cache\.addAll\(URLS\.map\(url => new Request\(url, \{ cache: "reload" \}\)\)\)/, "precache must fetch every asset without stale HTTP cache");
assert.match(worker, /await caches\.delete\(CACHE_NAME\)/);
assert.match(worker, /key\.startsWith\(PREFIX\)/);
assert.doesNotMatch(worker, /indexedDB\.deleteDatabase|localStorage\.clear/);
const manifest = JSON.parse(text("manifest.webmanifest"));
assert.equal(manifest.display, "standalone");
assert.equal(manifest.start_url, "./");
assert.ok(manifest.icons.some(icon => icon.sizes === "192x192" && icon.type === "image/png"));
assert.ok(manifest.icons.some(icon => icon.sizes === "512x512" && icon.type === "image/png"));
console.log(`PWA bundle verified: ${paths.length} offline assets, manifest and installable icons`);
