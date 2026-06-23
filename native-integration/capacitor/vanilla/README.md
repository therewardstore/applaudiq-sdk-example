# Applaud IQ — Capacitor (vanilla TS)

A plain **Capacitor** app (vanilla TypeScript + Vite, no framework) embedding the Applaud IQ portal with
[`@applaudiq/embed-capacitor`](https://www.npmjs.com/package/@applaudiq/embed-capacitor) — Manual + Auto login + SSO.

A tiny **query-based router** (History API, no framework) gives a Home → Embed flow:

- no `?mode=` → **Home** — choose a login mode.
- `?mode=manual|auto` → **Embed** — opens the full-screen embed; the browser/native **Back** returns to Home
  (the SDK's `onClose` calls `history.back()`). All in `src/main.ts`.

## Run it

The `ios/` and `android/` projects are **committed** (the SSO scheme is already registered) — just install and run:

```bash
npm install
npx cap sync           # installs iOS pods + copies the web build into the native projects
npm run local:web      # browser (http://localhost:4200)
npm run local:ios      # iOS simulator
npm run local:android  # Android emulator (auto-runs `adb reverse` for the local portal)
```

`run-local.sh <web|ios|android>` builds, syncs, and launches the chosen target.

1. **Configure** `src/config.ts` — `PUBLISHABLE_KEY` + `BASE_URL` (the committed file ships placeholders; for
   local testing set `BASE_URL=http://localhost:3017` + your demo key/secret).
2. **SSO scheme** `aiqexample://sso-callback` is already registered (iOS `ios/App/App/Info.plist`
   `CFBundleURLSchemes`; Android `AndroidManifest.xml` deep-link `<intent-filter>`) — change it if you change
   `SSO_CALLBACK`.
3. **Auto-login** needs a token — set `MINT_ENDPOINT` (your server) or `TEST_EMBED_SECRET` (⚠️ dev-only — the
   `aiq_embed_` secret must never ship in a real app).

## How it consumes the SDK

`src/main.ts` calls `ApplaudIQ.init({ key, baseUrl, ssoCallback }).open({ mode, token, render: 'fullscreen',
…callbacks })`. The same call is used by every other variant — only the surrounding UI differs.

Needs `@capacitor/app` + `@capacitor/browser` (SSO + Back). `webDir` is `dist` (Vite).
