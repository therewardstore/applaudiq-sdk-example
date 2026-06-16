# Vue 3 (Vite) — ApplaudIQ Web SDK example

Embed the Applaud IQ recognition portal in a Vite + Vue 3 app. The SDK loads once via `<script>` in
`index.html`; a `useApplaudIQ` composable mounts the embed inline. The app uses **real route-based
navigation** (`vue-router`) with a Home landing page and one route per login mode.

## What you'll see

A small app with a persistent top nav and **three pages**:

- **Home (`/`)** — a landing page with two mode cards that link into each login mode.
- **Auto-login (`/auto`)** — your server mints a one-time token and the employee is signed in **silently**.
- **Manual login (`/manual`)** — the embed shows Applaud IQ's own login (email / SSO). No server, no secret — still uses your publishable `pk_…` key.

Each mode page renders the recognition feed **inside your app** (inline, full-page).

> **Login modes — this example supports both.** New here? Compare [auto vs manual](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/docs/guides/login-modes.md), then follow the full [Auto-login](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/docs/guides/auto-login.md) or [Manual login](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/docs/guides/manual-login.md) guide for the complete step-by-step.

## How it works in this example

1. **Load** — the SDK `<script src="<BASE_URL>/embed.js">` is loaded once in `index.html` → `window.ApplaudIQ`.
2. **Route** — `src/router.ts` maps `/` (`views/Home.vue`), `/auto` (`views/AutoLogin.vue`), and
   `/manual` (`views/ManualLogin.vue`); `src/App.vue` renders `AppNav` (top nav) + `<RouterView>`.
3. **Open** — `ApplaudIQ.init({ key, baseUrl }).open({ … })` lives in the `useApplaudIQ` composable
   (`src/useApplaudIQ.ts`); the shared `components/EmbedView.vue` calls it to mount the iframe and cleans up on unmount.
4. **Config** — the publishable key + portal URL live in `src/config.ts` (one place, imported everywhere).
5. **Mint (auto only)** — the `useEmbedToken` composable (`src/useEmbedToken.ts`) calls `getEmbedToken()`
   and exposes a `loading | ready | needs-server` state; `views/AutoLogin.vue` just switches on it.
6. **Callbacks** — `onReady` / `onAuthPending` / `onError` update the status pill in `EmbedView`.

### The three user flows

This example surfaces all three states an employee can land in:

1. **Manual** — the embed shows Applaud IQ's own login; no server, no token.
2. **Auto** — your server mints a one-time token and the employee is signed in silently.
3. **HR-pending** — a signed-in but unapproved employee. The SDK fires `onAuthPending`, and
   `EmbedView` shows a **"Waiting for HR approval"** banner until an HR admin approves them.

→ Full step-by-step + diagram: **[root README → How it works](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/README.md#how-it-works-the-flow)**.

## Prerequisites

- A **publishable key** (`pk_live_…` / `pk_test_…`) from **HR portal → Settings → Embed SDK Keys** — needed in **both** modes.
  Add this example's origin **`http://localhost:5175`** to the key's allowed origins.
- For **auto-login** only: a server endpoint that mints a token — see [Minting](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/MINTING.md). Manual login needs neither.

## 1. Configure

In **`src/config.ts`**, edit the two `// 👉 REPLACE` lines:

- `PUBLISHABLE_KEY` → your `pk_…` key.
- `BASE_URL` → your portal origin. (`index.html`'s `<script src>` is `<BASE_URL>/embed.js`.)

That's **all** manual login needs — no server, no secret, no token.

## 2. Manual login (no server)

The simplest path to a running embed. Visit the **`/manual`** route — the page opens the embed with
`open({ mode: 'manual' })` (via the `useApplaudIQ` composable in `src/useApplaudIQ.ts`):

```ts
ApplaudIQ
  .init({ key: PUBLISHABLE_KEY, baseUrl: BASE_URL })
  .open({ mode: 'manual', render: 'inline', container: '#applaudiq-recognition' });
```

**What you'll see:** Applaud IQ's own email / SSO login *inside* the embed; after signing in, the recognition feed. No mint endpoint, no `aiq_embed_…` secret.

## 3. Auto-login (run the dev mint server)

Auto-login signs the employee in **silently** with a server-minted token — so it needs a mint server (the
`aiq_embed_…` secret never touches the browser). **This example is already wired:** `getEmbedToken()` in
`src/useEmbedToken.ts` calls `/api/mint`, which `vite.config.ts` proxies to the shared dev mint server.

1. **Start the dev mint server** with your secret → see
   [Dev mint server (auto-login)](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/web-integration/README.md#dev-mint-server-auto-login)
   (it holds the secret and mints the one-time token from it).
2. `npm run dev`, then open the **`/auto`** route → it mints a one-time token and the embed signs in
   **silently** (no visible login).
3. With **no mint server running** (or no secret set), `/auto` shows the friendly **"Auto-login needs a
   server"** callout — that's expected.

The secret lives only on the mint server, never in this app.

## 4. Run

```bash
npm install
npm run dev      # http://localhost:5175
```

Open **http://localhost:5175** and navigate **Home (`/`) → Auto-login (`/auto`) → Manual login (`/manual`)**
from the top nav. The status pill on each mode page shows the result.

> Clean-path routes need an SPA fallback when statically hosted (every path serves `index.html`).
> `npm run dev` handles this out of the box.

## Verify

- ✅ The recognition feed loads, signed in — no separate login.
- ⏳ A brand-new employee sees a **"waiting for HR approval"** status until an HR admin approves them.
- ❌ A wrong/expired key or origin shows a clear error — never a blank frame.

## Files

- `src/config.ts` — publishable key + portal URL (the only two values you set).
- `src/router.ts` — the routes (`/`, `/auto`, `/manual` + redirect).
- `src/App.vue` — app shell: `AppNav` + `<RouterView>`.
- `src/components/AppNav.vue` — sticky top nav with active highlighting.
- `src/views/Home.vue` — landing page with the two mode cards.
- `src/views/ManualLogin.vue` / `src/views/AutoLogin.vue` — the two mode pages (Auto switches on token state).
- `src/components/EmbedView.vue` — shared sub-header + status pill + HR-pending banner + the `#applaudiq-recognition` container.
- `src/components/EmbedLoading.vue` / `src/components/NeedsServerNotice.vue` — the auto-login loading + needs-server UI states.
- `src/useEmbedToken.ts` — mints the one-time auto-login token; exposes `loading | ready | needs-server`.
- `src/useApplaudIQ.ts` — the `init().open()` call + cleanup (the composable).
- `public/favicon.svg` — the app favicon.
- `src/applaudiq.d.ts` — TypeScript types for the global SDK (copy into your app if you use TS).

## Troubleshooting

- **Blank frame / won't load** — your origin isn't on the key's allowed list. Add `http://localhost:5175`.
- **`SDK not loaded`** — the `<script src>` in `index.html` is wrong; it must be `<BASE_URL>/embed.js`.
- **Mint `401`/`403`** — the secret is wrong or auto-login isn't enabled for your org (auto-login only).

→ What each `open()` value means: **[SDK options reference](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/README.md#sdk-options-reference)**.
