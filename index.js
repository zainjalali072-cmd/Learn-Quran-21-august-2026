// Hostinger & Node.js Universal Production Entry Point (index.js fallback)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distServerPath = path.join(__dirname, 'dist', 'server.cjs');
const distHtmlPath = path.join(__dirname, 'dist', 'index.html');

if (!fs.existsSync(distServerPath) || !fs.existsSync(distHtmlPath)) {
  console.log('[Hostinger / Prod] dist artifacts not found. Running automatic build ("npm run build")...');
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
    console.log('[Hostinger / Prod] Automatic build completed successfully!');
  } catch (err) {
    console.error('[Hostinger / Prod] Build failed, attempting direct TypeScript fallback execution...', err);
    try {
      execSync('npx tsx server.ts', { stdio: 'inherit', cwd: __dirname });
      process.exit(0);
    } catch (fallbackErr) {
      console.error('[Hostinger / Prod] Fatal startup failure:', fallbackErr);
      process.exit(1);
    }
  }
}

if (fs.existsSync(distServerPath)) {
  console.log('[Hostinger / Prod] Launching server from dist/server.cjs...');
  import('./dist/server.cjs');
}
