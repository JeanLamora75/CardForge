import { defineConfig, type Plugin } from "vite";
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
      const version = hashBuildFiles(files);
      const assets = Object.keys(bundle).filter(path => path !== "index.html" && !path.endsWith(".map"));
      const sw = createServiceWorkerScript(version, assets);
      this.emitFile({ type: "asset", fileName: "sw.js", source: sw });
    },
  };
}

export default defineConfig({ base: "./", plugins: [react(), offlineBuild()] });
