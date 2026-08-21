# 🚀 Hostinger Deployment Guide for Truth Quran Academy

Your project has been fully configured and optimized for **Hostinger Hosting** (both Node.js Web Application Hosting and VPS / cPanel / CyberPanel environments).

---

## 🛠️ What We Configured for Hostinger

1. **Dynamic Port Support (`process.env.PORT`)**:
   Hostinger automatically assigns a custom port (e.g., `8080` or `3000` or a randomized production port) when running Node.js applications. Our backend `server.ts` now automatically reads `process.env.PORT` so it will never crash due to port binding errors.

2. **Universal Hostinger Entry Points (`server.js`, `app.js`, `index.js`)**:
   Hostinger's Node.js selector checks for a root file named `server.js`, `app.js`, or `index.js`. We created lightweight ESM root entry points for all three that automatically launch your production bundle from `dist/server.cjs`.

3. **Resilient Static File Serving**:
   Whether Hostinger launches the process from the domain root directory (`/public_html`) or inside a subdirectory, our server automatically detects and serves your React frontend build from `dist/` seamlessly with full SPA routing fallback.

---

## 📦 Step-by-Step Deployment on Hostinger (Node.js Web App / Automated Git Deploy)

### If deploying via Hostinger Git / Automated Build UI (As shown in your screenshot):
1. **Framework preset**: Select `Express`
2. **Branch**: Select `main`
3. **Node version**: Select **`20.x`** (Strictly required to avoid Rollup GLIBC 2.29 errors on Hostinger Linux servers)
4. **Root directory**: `./`
5. **Package manager**: `npm`
6. **Entry file**: `server.js`
7. Click **Save and redeploy**.

> ✅ **Why it will succeed now**:
> - We moved all required build dependencies (`vite`, `esbuild`, `rollup`, `@rollup/wasm-node`, `typescript`, `tsx`, `tailwindcss`) from `devDependencies` into `dependencies`. This ensures Hostinger installs them even when `NODE_ENV=production` is set!
> - We added an automated `postinstall` script in `package.json` so Hostinger automatically builds the production bundle after running `npm install`.
> - Even if Hostinger skips the build step and boots `server.js` directly, our updated `server.js`, `app.js`, and `index.js` files now automatically detect if `dist/server.cjs` is missing and compile the production bundle on-the-fly before launching!

---

### Step 1: Build Your Application locally or in AI Studio (If uploading manually via File Manager)
Before uploading, ensure your app is built into the production `dist` folder:
```bash
npm install
npm run build
```
This generates:
- `dist/index.html` and static CSS/JS (your frontend React app)
- `dist/server.cjs` (your bundled Express backend + API + WordPress CMS simulator)

### Step 2: Upload Files to Hostinger File Manager
In your Hostinger hPanel:
1. Go to **Websites** -> **Manage** -> **File Manager**.
2. Navigate to your domain directory (usually `public_html` or your custom app root).
3. Upload the following files and folders:
   - `dist/` (folder containing your compiled frontend and server)
   - `package.json`
   - `package-lock.json`
   - `.npmrc` (CRITICAL for Linux GLIBC compatibility and building native modules from source)
   - `.nvmrc` & `.node-version` (forces Node.js 20)
   - `server.js` (Root entry point required by Hostinger)
   - `db.json` (Your initial WordPress simulator database & admin accounts)
   - `.env` (if you have any environment variables like `GEMINI_API_KEY`)

> ⚠️ **Note**: Do **NOT** upload the `node_modules` folder! Hostinger will generate a clean, optimized `node_modules` on their servers.

### Step 3: Configure Node.js in Hostinger hPanel
1. In Hostinger hPanel, go to **Advanced** -> **Node.js**.
2. Configure the following settings:
   - **Node.js Version**: Select **`20.x`** (Strictly Recommended for Hostinger Linux GLIBC compatibility and Rollup/Vite support). Do NOT select `22.x` on older Linux kernels.
   - **Application Root**: Put the folder where you uploaded your files (e.g., `public_html` or `/`).
   - **Application Startup File**: Enter `server.js` (or `app.js`).
3. Click **Save**.

### Step 4: Install Dependencies & Start App
1. In the same Node.js section on Hostinger, click the **"NPM Install"** button. This will install your production dependencies cleanly.
2. Once installation completes, click **"Restart"** or **"Start Application"**.
3. Your Truth Quran Academy website & WordPress Admin Dashboard (`/wp-admin`) are now **LIVE**! 🎉

---

## 🔐 WordPress Admin Access Reminder

Once deployed on Hostinger, you can log into your simulated WordPress Admin Dashboard at:
- **URL**: `https://yourdomain.com/wp-admin`
- **Email**: `muhammadzain92624@gmail.com`
- **Password**: `MuhammadZain786..`

---

## 💡 Troubleshooting on Hostinger

- **503 Service Unavailable / App Not Starting**:
  Check Hostinger's Node.js application logs. Ensure that you ran `npm run build` prior to uploading, so that the `dist/server.cjs` file exists.
- **Port Errors**:
  Our app automatically binds to `0.0.0.0` and uses `process.env.PORT`. You do not need to hardcode any port in Hostinger settings.
- **Database (`db.json`) Permissions**:
  Ensure that Hostinger has read/write permissions for `db.json` so that any updates you make in the WordPress Admin Panel (like changing pricing plans or adding courses) are saved permanently.
