# Applaud IQ — Capacitor + Angular (plain)

A **Capacitor + Angular** app (standalone components, no Ionic) embedding the Applaud IQ portal with
[`@applaudiq/embed-capacitor`](https://www.npmjs.com/package/@applaudiq/embed-capacitor) — Manual + Auto login + SSO.

> The SDK call (`src/app/app.component.ts`) is **identical** to the `ionic-angular` example — that one just wraps it
> in Ionic UI.

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
2. **SSO scheme** `aiqexample://sso-callback` is already registered (iOS `Info.plist` `CFBundleURLSchemes`,
   Android `AndroidManifest` intent-filter) — change it if you change `SSO_CALLBACK`.
3. **Auto-login** needs a token — set `MINT_ENDPOINT` (your server) or `TEST_EMBED_SECRET` (⚠️ dev-only).

> Capacitor expects the web build in `webDir: 'dist'`; Angular 17's application builder outputs there. (Some Angular
> setups emit to `dist/<app>/browser` — if so, point `webDir` at that path.)

Needs `@capacitor/app` + `@capacitor/browser` (SSO + Back).
