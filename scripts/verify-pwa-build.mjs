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

// All cockpit graphics must survive a cold offline restart.
const thunderHudFiles=["tf-bg-space.webp","tf-bottom-console.png","tf-frame-main.png","tf-grid-background.webp","tf-header-bar.png","tf-separator-h.png","tf-counter-alert.png","tf-counter-large.png","tf-counter-small.png","tf-progress-segment-active.png","tf-progress-segment-complete.png","tf-progress-segment-empty.png","tf-radar-overlay.png","tf-slot-deploy-glow.png","tf-slot-deploy.png","tf-slot-empty.png","tf-slot-selected.png","tf-target-reticle.png","tf-mission-card-frame.png","tf-mission-hologram.png","tf-mission-panel.png","tf-action-button-aegis.png","tf-action-button-nova.png","tf-action-button-singularity.png","tf-action-button-vector.png","tf-effect-impact.png","tf-effect-laser.png","tf-effect-shield.png","tf-effect-singularity.png","tf-nav-back.png","tf-nav-help.png","tf-nav-settings.png"];
assert.equal(new Set(thunderHudFiles).size,32);
for(const file of thunderHudFiles)assert.ok(paths.includes("./assets/hud/thunderfighter/v2/"+file),"missing offline Thunderfighter cockpit artwork: "+file);

const skyCards=paths.filter(p=>/^\.\/art\/cards\/skydeck\/(ships\/|officers\/|joker-[12]\.webp$)/.test(p)&&p.endsWith(".webp"));
assert.equal(new Set(skyCards).size,54,"all Skydeck cards must be precached");
const skyFrames=paths.filter(p=>/^\.\/art\/frames\/skydeck\/card-.*\.webp$/.test(p));
assert.equal(new Set(skyFrames).size,5,"all Skydeck frames must be precached");

assert.equal(new Set(paths.filter(p=>p.startsWith("./assets/audio/skydeck/")&&p.endsWith(".wav"))).size,25,"all Skydeck audio must be precached");

const skyBoardManifest=JSON.parse(readFileSync("docs/assets/skydeck/skydeck-assets-manifest.json","utf8"));
assert.equal(skyBoardManifest.length,59);
for(const item of skyBoardManifest){const asset="./"+item.path.replace(/^public\/assets\//,"art/").replace(/\.png$/,".webp");assert.ok(paths.includes(asset),"missing Skydeck board artwork: "+asset);}
