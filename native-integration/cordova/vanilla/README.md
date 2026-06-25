# Applaud IQ — Cordova (vanilla TS)

A plain **Cordova** app (vanilla TypeScript + Vite, no framework) embedding the Applaud IQ portal with
[`@applaudiq/embed-cordova`](https://www.npmjs.com/package/@applaudiq/embed-cordova) — Manual + Auto login + SSO.

> **Legacy.** Cordova / PhoneGap is EOL — for a new app use the
> [Capacitor example](../../capacitor/vanilla) (`@applaudiq/embed-capacitor`). This exists for existing
> Cordova / legacy-Ionic-Cordova apps.

A tiny **query-based router** (History API, no framework) gives a Home → Embed flow:

- no `?mode=` → **Home** — choose a login mode.
- `?mode=manual|auto` → **Embed** — opens the full-screen embed; the browser/native **Back** returns to Home.

## Run it

```bash
npm install
npm run local:web      # browser (http://localhost:4200)
npm run local:ios      # iOS simulator
npm run local:android  # Android emulator (auto-runs `adb reverse` for the local portal)
```

`run-local.sh <web|ios|android>` builds the web app into `www/`, injects `cordova.js` (native only), runs
`cordova prepare`, and launches the target. The first native run restores the `ios`/`android` platforms and
the two plugins from `package.json`'s `cordova` field — or run `npx cordova prepare` once up front.

1. **Configure** `src/config.ts` — `PUBLISHABLE_KEY` + `BASE_URL` (the committed file ships placeholders).
2. **SSO scheme** `aiqexample://sso-callback` is declared in `config.xml` via `cordova-plugin-customurlscheme`
   (`URL_SCHEME=aiqexample`) — Cordova generates the iOS `CFBundleURLSchemes` + Android intent-filter.
3. **Auto-login** needs a token — set `MINT_ENDPOINT` (your server) or `TEST_EMBED_SECRET` (⚠️ dev-only).

## How it consumes the SDK

`src/main.ts` calls
`ApplaudIQ.init({ key, baseUrl, ssoCallback }).open({ mode, token, render: 'fullscreen', …callbacks })`. The same
call is used by the Capacitor variant — only the surrounding UI differs. `init()` runs on a button tap (after
Cordova's `deviceready`), so the plugins are loaded.

Needs `cordova-plugin-inappbrowser` (SSO system browser) + `cordova-plugin-customurlscheme` (SSO callback deep
link → `window.handleOpenURL`). The Android hardware Back / iOS left-edge swipe step back inside the embed
(`backNavigation`, default on). `config.xml` ships **dev-permissive** networking (cleartext localhost, `access
origin="*"`) — tighten it for production (the portal is HTTPS there).
