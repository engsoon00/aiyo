import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync } from "node:fs";
import path from "node:path";

/**
 * GitHub Pages serves static files only — a request for /app/templates looks
 * for a directory that doesn't exist and returns 404.html. Shipping a copy of
 * index.html under that name means the SPA boots anyway and the router reads
 * the real path off the URL, so deep links and hard refreshes work.
 */
function spaFallback(): Plugin {
  return {
    name: "spa-fallback-404",
    apply: "build",
    closeBundle() {
      const dist = path.resolve(__dirname, "dist");
      copyFileSync(path.join(dist, "index.html"), path.join(dist, "404.html"));
    },
  };
}

export default defineConfig({
  /**
   * A project site lives at /<repo>/, a user site at /. The deploy workflow
   * works out which and passes it in, so nothing here is hardcoded to a repo
   * name — local dev and preview stay at "/".
   */
  base: process.env.VITE_BASE || "/",
  plugins: [react(), spaFallback()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 8080,
  },
});
