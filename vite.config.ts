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
      const originals = readdirSync("public/assets", {recursive:true,encoding:"utf8"}).filter(p=>p.endsWith(".png")).map(p=>"assets/"+p.replaceAll("\\","/")).filter(p=>/^assets\/(worlds|worlds-landscape|logos|covers|buttons|effects)\//.test(p));
      for(const path of originals) files.push({path,content:createHash("sha256").update(readFileSync("public/"+path)).digest("hex")});
      const version = hashBuildFiles(files);
      const assets = Object.keys(bundle).filter(path => path !== "index.html" && !path.endsWith(".map"));
      const sw = createServiceWorkerScript(version, [...assets,...originals,...art]);
      this.emitFile({ type: "asset", fileName: "sw.js", source: sw });
    },
  };
}

export default defineConfig({ base: "./", plugins: [react(), offlineBuild()] });
