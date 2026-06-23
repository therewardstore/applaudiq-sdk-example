# Applaud IQ — Capacitor + Ionic React

An **Ionic React** app (Capacitor) embedding the Applaud IQ portal with
[`@applaudiq/embed-capacitor`](https://www.npmjs.com/package/@applaudiq/embed-capacitor) — Manual + Auto login + SSO.

Real **named routes** (`@ionic/react-router`, which wraps react-router v5) drive an `<IonRouterOutlet>` for native
page transitions:

- `/` → **Home** (`src/pages/Home.tsx`) — choose a login mode.
- `/embed?mode=manual|auto` → **Embed** (`src/pages/Embed.tsx`) — opens the full-screen embed; returns to Home
  when dismissed (`onClose`).

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
3. **Auto-login** needs a token — set `MINT_ENDPOINT` (your server) or `TEST_EMBED_SECRET` (⚠️ dev-only).

> Ionic React needs **react-router v5** (`@ionic/react-router` + `react-router-dom@^5`) — not v6.

## Back navigation

`backNavigation` (default `true`) wires **Android** hardware Back and the **iOS** left-edge swipe to step back
inside the embed — the portal navigates its own history and dismisses (`onClose`) at the root, so the Embed page
routes back to Home there.

> Ionic note: `<IonRouterOutlet>` has its own iOS swipe-back. `App.tsx` disables it (`swipeGesture = false`) so
> the SDK's edge-swipe steps through the **portal's** history instead of popping straight back to Home.

Needs `@capacitor/app` + `@capacitor/browser` (SSO + Back). `webDir` is `dist` (Vite).
