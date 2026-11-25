import test from "node:test";
import assert from "node:assert/strict";
import { createServiceWorkerScript, hashBuildFiles, PWA_PUBLIC_ASSETS } from "../src/pwa/service-worker-build.ts";
import { resolveOfflineStatus, hasServiceWorkerSupport } from "../src/application/offline-readiness.ts";

test("cache version deterministically changes with emitted build content and not input order", () => {
  const files = [{path:"assets/app-1.js",content:"bundle with both engines and FR/EN rules"},{path:"assets/app.css",content:":root{}"}];
  const hash = hashBuildFiles(files);
  assert.match(hash, /^[a-f0-9]{8}$/);
  assert.equal(hashBuildFiles([...files].reverse()),hash);
  assert.notEqual(hashBuildFiles([{...files[0],content:"changed"},files[1]]),hash);
});
test("generated worker precaches complete shell, build chunks, manifest and icons with strict install", () => {
  const output=createServiceWorkerScript("cafebabe",["assets/main-abc.js","assets/main-def.css","assets/game-icon.svg"]);
  for (const asset of ["./", "./index.html",...PWA_PUBLIC_ASSETS,"./assets/main-abc.js","./assets/main-def.css","./assets/game-icon.svg"]) {
    assert.ok(output.includes(asset),asset);
  }
  assert.ok(output.includes('cache.addAll(URLS.map(url => new Request(url, { cache: "reload" })))'));
  assert.ok(output.includes("await caches.delete(CACHE_NAME)"));
  assert.ok(output.includes("event.ports[0]?.postMessage"));
  assert.ok(output.includes("event.request"));
  assert.ok(output.includes("return shell"));
  assert.ok(output.includes("cache.match(url.href, { ignoreVary: true })"),"immutable JS/CSS must use URL-exact cache lookup across varying request headers");
  assert.ok(output.includes("keys.filter(key => key.startsWith(PREFIX)"));
  assert.doesNotMatch(output,/indexedDB\.|localStorage\.|caches\.delete\("cardforge"\)/);
});
test("worker build rejects external paths, missing JS or CSS and invalid version", () => {
  assert.throws(()=>createServiceWorkerScript("bad!",["assets/a.js","assets/a.css"]));
  assert.throws(()=>createServiceWorkerScript("cafebabe",["assets/a.js"]));
  assert.throws(()=>createServiceWorkerScript("cafebabe",["assets/a.js","assets/a.css","https://cdn.net/script"]));
});
test("only complete cache and controlling service worker can announce ready", () => {
  assert.deepEqual(resolveOfflineStatus(null,true),{phase:"installing"});
  assert.deepEqual(resolveOfflineStatus({ready:false,version:"a",assetCount:12},true),{phase:"installing"});
  assert.deepEqual(resolveOfflineStatus({ready:true,version:"abc",assetCount:12},false),{
    phase:"reload-required",version:"abc",assetCount:12,
  });
  assert.deepEqual(resolveOfflineStatus({ready:true,version:"abc",assetCount:12},true),{
    phase:"ready",version:"abc",assetCount:12,
  });
  assert.equal(resolveOfflineStatus({ready:true,version:"abc",assetCount:0},true).phase,"installing");
  assert.equal(hasServiceWorkerSupport(true,true,true),true);
  assert.equal(hasServiceWorkerSupport(true,false,true),false);
  assert.equal(hasServiceWorkerSupport(true,true,false),false);
});
