import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

function gscMetaInjector() {
  return {
    name: 'gsc-meta-injector',
    transformIndexHtml(html: string) {
      try {
        const dbPath = path.resolve(__dirname, 'db.json');
        if (fs.existsSync(dbPath)) {
          const raw = fs.readFileSync(dbPath, 'utf-8');
          const db = JSON.parse(raw);
          const rawGsc = db.integrations?.googleSiteVerification || db.integrations?.gscId;
          if (rawGsc) {
            let code = String(rawGsc).trim();
            const contentMatch = code.match(/content=["']([^"']+)["']/i);
            if (contentMatch && contentMatch[1]) code = contentMatch[1].trim();
            if (code.includes("google-site-verification=")) {
              code = code.replace(/^google-site-verification=/, "").trim();
            }
            if (code && code !== "TRUTH_QURAN_GSC_VERIFY_2026") {
              const tag = `<meta name="google-site-verification" content="${code}" />`;
              if (html.includes('name="google-site-verification"')) {
                return html.replace(/<meta\s+name=["']google-site-verification["']\s+content=["'][^"']*["']\s*\/?>/gi, tag);
              } else {
                return html.replace('</head>', `  ${tag}\n</head>`);
              }
            }
          }
        }
      } catch (e) {
        console.error("gscMetaInjector error:", e);
      }
      return html;
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), gscMetaInjector()],
    define: {
      'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(process.env.GOOGLE_MAPS_PLATFORM_KEY || '')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
