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

/**
 * Where the built site will be served from.
 *
 * A GitHub Pages project site lives at /<repo>/, a user site at /. Getting this
 * wrong emits /assets/... instead of /<repo>/assets/..., every asset 404s, and
 * the page renders blank — so this resolves it three ways, most explicit first:
 *
 *   1. VITE_BASE, if a workflow sets it explicitly.
 *   2. GITHUB_REPOSITORY, which GitHub Actions sets on EVERY run. This means a
 *      plain `npm run build` in any workflow still produces the right paths,
 *      even a starter template that never heard of VITE_BASE.
 *   3. "/" for local dev and preview.
 */
function resolveBase(): string {
  if (process.env.VITE_BASE) return process.env.VITE_BASE;

  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
  if (repo) return repo.endsWith(".github.io") ? "/" : `/${repo}/`;

  return "/";
}

const base = resolveBase();
// Surfaced in the Actions log so a wrong base is obvious at a glance.
console.log(`[vite] building with base: ${base}`);

export default defineConfig({
  base,
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
