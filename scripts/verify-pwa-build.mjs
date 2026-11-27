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
for (const outcome of ["win","loss","training"]) {
  const prefix = "./assets/thunderfighter-end-"+outcome+"-";
  assert.ok(paths.some(file=>file.startsWith(prefix)&&file.endsWith(".webp")), "missing offline mission artwork: "+outcome);
}
assert.ok(!paths.some(file=>/^\.\/assets\/thunderfighter-end-(win|loss)-.*\.svg$/.test(file)), "obsolete ending SVG in offline bundle");
const manifest = JSON.parse(text("manifest.webmanifest"));
assert.equal(manifest.display, "standalone");
assert.equal(manifest.start_url, "./");
assert.ok(manifest.icons.some(icon => icon.sizes === "192x192" && icon.type === "image/png"));
assert.ok(manifest.icons.some(icon => icon.sizes === "512x512" && icon.type === "image/png"));
console.log(`PWA bundle verified: ${paths.length} offline assets, manifest and installable icons`);

const thunderCards=paths.filter(p=>/^\.\/art\/thunderfighter\/(ships|officers|special)\/.*\.webp$/.test(p));
assert.equal(new Set(thunderCards).size,54,"all ThunderFighter cards must be precached");

const grimUiPaths=["./art/boards/grim-delve.webp","./art/logos/grim-delve/board.webp","./art/frames/grim-delve/panel-wide.webp","./art/hud/grim-delve/heart-filled.webp","./art/hud/grim-delve/heart-empty.webp","./art/hud/grim-delve/deck.webp","./art/hud/grim-delve/skull.webp","./art/banners/grim-delve/title-wide.webp","./art/banners/grim-delve/title-small.webp","./art/banners/grim-delve/parchment.webp","./art/icons/grim-delve/back.webp","./art/icons/grim-delve/help.webp","./art/icons/grim-delve/settings.webp","./art/buttons/grim-delve/primary.webp","./art/buttons/grim-delve/danger.webp","./art/buttons/grim-delve/disabled.webp"];
for(const path of grimUiPaths)assert.ok(paths.includes(path),"missing Grim Delve UI artwork: "+path);

const grimCardPaths=["./art/cards/grim-delve/hearts-1.webp","./art/cards/grim-delve/hearts-11.webp","./art/cards/grim-delve/hearts-12.webp","./art/cards/grim-delve/hearts-13.webp","./art/cards/grim-delve/diamonds-1.webp","./art/cards/grim-delve/diamonds-11.webp","./art/cards/grim-delve/diamonds-12.webp","./art/cards/grim-delve/diamonds-13.webp","./art/cards/grim-delve/clubs-1.webp","./art/cards/grim-delve/clubs-11.webp","./art/cards/grim-delve/clubs-12.webp","./art/cards/grim-delve/clubs-13.webp","./art/cards/grim-delve/spades-1.webp","./art/cards/grim-delve/spades-11.webp","./art/cards/grim-delve/spades-12.webp","./art/cards/grim-delve/spades-13.webp","./art/cards/grim-delve/joker-1.webp","./art/cards/grim-delve/joker-2.webp","./art/cards/grim-delve/back.webp","./art/frames/grim-delve/card-hearts.webp","./art/frames/grim-delve/card-diamonds.webp","./art/frames/grim-delve/card-clubs.webp","./art/frames/grim-delve/card-spades.webp","./art/frames/grim-delve/card-joker.webp","./art/cards/grim-delve/hearts-2.webp","./art/cards/grim-delve/hearts-3.webp","./art/cards/grim-delve/hearts-4.webp","./art/cards/grim-delve/hearts-5.webp","./art/cards/grim-delve/hearts-6.webp","./art/cards/grim-delve/hearts-7.webp","./art/cards/grim-delve/hearts-8.webp","./art/cards/grim-delve/hearts-9.webp","./art/cards/grim-delve/hearts-10.webp","./art/cards/grim-delve/diamonds-2.webp","./art/cards/grim-delve/diamonds-3.webp","./art/cards/grim-delve/diamonds-4.webp","./art/cards/grim-delve/diamonds-5.webp","./art/cards/grim-delve/diamonds-6.webp","./art/cards/grim-delve/diamonds-7.webp","./art/cards/grim-delve/diamonds-8.webp","./art/cards/grim-delve/diamonds-9.webp","./art/cards/grim-delve/diamonds-10.webp","./art/cards/grim-delve/clubs-2.webp","./art/cards/grim-delve/clubs-3.webp","./art/cards/grim-delve/clubs-4.webp","./art/cards/grim-delve/clubs-5.webp","./art/cards/grim-delve/clubs-6.webp","./art/cards/grim-delve/clubs-7.webp","./art/cards/grim-delve/clubs-8.webp","./art/cards/grim-delve/clubs-9.webp","./art/cards/grim-delve/clubs-10.webp","./art/cards/grim-delve/spades-2.webp","./art/cards/grim-delve/spades-3.webp","./art/cards/grim-delve/spades-4.webp","./art/cards/grim-delve/spades-5.webp","./art/cards/grim-delve/spades-6.webp","./art/cards/grim-delve/spades-7.webp","./art/cards/grim-delve/spades-8.webp","./art/cards/grim-delve/spades-9.webp","./art/cards/grim-delve/spades-10.webp","./art/icons/grim-delve/faction-hearts.webp","./art/icons/grim-delve/faction-diamonds.webp","./art/icons/grim-delve/faction-clubs.webp","./art/icons/grim-delve/faction-spades.webp"];
for(const path of grimCardPaths)assert.ok(paths.includes(path),"missing Grim Delve card artwork: "+path);
assert.equal(new Set(grimCardPaths).size,64);

for(const scene of ["defeat-damage","defeat-exhaustion","victory"])assert.ok(paths.includes("./art/banners/grim-delve/end-"+scene+".webp"),"missing offline Grim Delve ending: "+scene);
