# Applaud IQ — React Native (Expo) embed example

A runnable **Expo** app showing **manual + auto login and SSO** with the
[`@applaudiq/embed-react-native`](https://www.npmjs.com/package/@applaudiq/embed-react-native) SDK.

> Looking for **bare React Native (CLI)**? See [`../react-native-cli/`](../react-native-cli/). The SDK and the
> integration code are identical — only how you register the SSO scheme differs (here: one line in `app.json`).

## What you'll see

- **Manual login** — the portal's own email/SSO login renders inside the embed. No server, no token.
- **Auto-login** — your backend mints a one-time token (`MintClient.ts`); the embed signs in silently.
- **SSO** — the SDK opens the system browser; the result returns on this app's `aiqrnexpo://sso-callback`
  deep link (registered by the `"scheme"` in `app.json`). On success the code is exchanged in the WebView;
  on failure it fires `onError` and reloads the login.

## SSO callback scheme — one line

Expo registers the deep-link scheme on **both** platforms from a single field in `app.json`:

```json
{ "expo": { "scheme": "aiqrnexpo" } }
```

This must match `Config.SSO_CALLBACK` (`aiqrnexpo://sso-callback`). The SDK sends it to the backend as
`native_redirect`, so the SSO callback returns to exactly this app — no "Open with" chooser when two Applaud IQ
apps are installed. (Pick a scheme unique to your app.)

## Run it

> **Use a dev build, not Expo Go.** Custom URL schemes + `react-native-webview` need a development build.

1. **Configure** `config.ts` — your `PUBLISHABLE_KEY` and `BASE_URL`. From an emulator the local portal is
   `http://10.0.2.2:3017` (Android) / `http://localhost:3017` (iOS sim). Auto-login: point `MINT_ENDPOINT` at your
   mint server, or set `TEST_EMBED_SECRET` for a quick local test (never ship a real secret).
2. **Install** — `npm install` (installs `@applaudiq/embed-react-native` from npm + `react-native-webview`).
3. **Run** — `npx expo run:android` or `npx expo run:ios` (prebuilds the native project with the `aiqrnexpo` scheme).
4. Tap **Manual login** (works immediately) or **Auto-login**, then **Continue with Google/Microsoft** to test SSO.

## How it consumes the SDK

`package.json` installs the published SDK from npm:

```json
"@applaudiq/embed-react-native": "^1.0.0"
```

`metro.config.js` is the plain Expo default — the SDK resolves from `node_modules` like any other dep.

## Files

- `App.tsx` — Manual/Auto buttons → full-screen `<ApplaudIQEmbed>`; status from callbacks.
- `config.ts` — key / base URL / SSO scheme / mint endpoint (`👉 REPLACE`).
- `MintClient.ts` — `getEmbedToken()` for auto-login (see [`../../MINTING.md`](../../MINTING.md)).
- `app.json` — the `"scheme"` that registers the SSO deep link.
- `metro.config.js` — the plain Expo default (the SDK comes from npm).

## Troubleshooting

- **SSO returns but nothing happens** — the `scheme` in `app.json` must equal the scheme in `Config.SSO_CALLBACK`,
  and you must run a **dev build** (`expo run:*`), not Expo Go.
- **Metro can't find the SDK** — re-run `npm install`, then restart with a clean cache
  (`npx expo start --dev-client --clear`).
