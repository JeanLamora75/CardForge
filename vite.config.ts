import { defineConfig, type Plugin } from "vite";
import { readdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import react from "@vitejs/plugin-react";
import { createServiceWorkerScript, hashBuildFiles } from "./src/pwa/service-worker-build.ts";

function offlineBuild(): Plugin {
  return {
    name: "cardforge-versioned-offline",
    apply: "build",
    generateBundle(_output, bundle) {
      const files = Object.entries(bundle).map(([path, entry]) => ({
        path, content: entry.type === "chunk" ? entry.code :
          typeof entry.source === "string" ? entry.source : Array.from(entry.source).join(","),
      }));
      const art = readdirSync("public/art", {recursive:true,encoding:"utf8"}).filter(p=>p.endsWith(".webp")).map(p=>"art/"+p.replaceAll("\\","/"));
      for(const path of art) files.push({path,content:createHash("sha256").update(readFileSync("public/"+path)).digest("hex")});
      const originals = readdirSync("public/assets", {recursive:true,encoding:"utf8"}).filter(p=>p.endsWith(".png") || (/^hud[\\/]thunderfighter[\\/]v2[\\/]/.test(p) && p.endsWith(".webp"))).map(p=>"assets/"+p.replaceAll("\\","/")).filter(p=>/^assets\/(worlds|worlds-landscape|logos|covers|buttons|effects|banners|boards|hud|icons|frames|ornaments|cards)\//.test(p));
      for(const path of originals) files.push({path,content:createHash("sha256").update(readFileSync("public/"+path)).digest("hex")});
      const audio = readdirSync("public/assets/audio/skydeck",{recursive:true,encoding:"utf8"}).filter(p=>p.endsWith(".wav")).map(p=>"assets/audio/skydeck/"+p.replaceAll("\\","/"));
      for(const path of audio)files.push({path,content:createHash("sha256").update(readFileSync("public/"+path)).digest("hex")});
      const fontLicences = readdirSync("public/licenses/fonts").filter(p=>p.endsWith(".txt")).map(p=>"licenses/fonts/"+p);
      for(const path of fontLicences) files.push({path,content:createHash("sha256").update(readFileSync("public/"+path)).digest("hex")});
      const startup = ["startup.css"];
      for(const path of startup) files.push({path,content:readFileSync("public/"+path,"utf8")});
      const version = hashBuildFiles(files);
      const assets = Object.keys(bundle).filter(path => path !== "index.html" && !path.endsWith(".map"));
      const sw = createServiceWorkerScript(version, [...assets,...originals,...art,...audio,...fontLicences,...startup]);
      this.emitFile({ type: "asset", fileName: "sw.js", source: sw });
      const chunks = Object.values(bundle).flatMap(entry => entry.type === "chunk" ? [{
        file: entry.fileName, bytes: Buffer.byteLength(entry.code), entry: entry.isEntry,
        imports: entry.imports, dynamicImports: entry.dynamicImports,
        modules: Object.keys(entry.modules).map(id => id.replaceAll("\\","/").split("/src/").pop() ?? id)
          .filter(id => !id.includes("node_modules") && !id.startsWith("/") && !id.includes(":")),
      }] : []);
      // The report contains only relative module paths, not developer filesystem paths.
      this.emitFile({type:"asset",fileName:"build-report.json",source:JSON.stringify({chunks},null,2)});
    },
  };
}

export default defineConfig({ base: "./", plugins: [react(), offlineBuild()] });
