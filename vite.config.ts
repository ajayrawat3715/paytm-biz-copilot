// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Auto-detect deployment target (Vercel, Netlify, Cloudflare Pages, etc.)
const getPreset = () => {
  if (process.env.VERCEL) return "vercel";
  if (process.env.NETLIFY) return "netlify";
  if (process.env.CF_PAGES) return "cloudflare-pages";
  return process.env.NITRO_PRESET;
};

const activePreset = getPreset();

const geminiKey =
  process.env.GEMINI_API_KEY ||
  process.env.VITE_GEMINI_API_KEY ||
  "";

const geminiModel =
  process.env.GEMINI_MODEL ||
  process.env.VITE_GEMINI_MODEL ||
  "gemini-3.6-flash";

export default defineConfig({
  vite: {
    envPrefix: ["VITE_", "GEMINI_"],
    define: {
      "import.meta.env.GEMINI_API_KEY": JSON.stringify(geminiKey),
      "import.meta.env.VITE_GEMINI_API_KEY": JSON.stringify(geminiKey),
      "import.meta.env.GEMINI_MODEL": JSON.stringify(geminiModel),
      "import.meta.env.VITE_GEMINI_MODEL": JSON.stringify(geminiModel),
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  ...(activePreset ? { nitro: { preset: activePreset } } : {}),
});
