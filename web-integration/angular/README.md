# Angular — ApplaudIQ Web SDK example

Embed the Applaud IQ recognition portal in an Angular standalone app. The SDK loads once via `<script>` in
`src/index.html`; an `ApplaudIQService` mounts the embed inline. The app uses **real route-based
navigation** (Angular Router) with a Home landing page and one route per login mode.

## What you'll see

A small app with a persistent top nav and **three pages**:

- **Home (`/`)** — a landing page with two mode cards that link into each login mode.
- **Auto-login (`/auto`)** — your server mints a one-time token and the employee is signed in **silently**.
- **Manual login (`/manual`)** — the embed shows Applaud IQ's own login (email / SSO). No server, no secret — still uses your publishable `pk_…` key.

Each mode page renders the recognition feed **inside your app** (inline, full-page).

### The three user flows

This example surfaces all three states an employee can land in:

1. **Manual** — the embed shows Applaud IQ's own login; no server, no token.
2. **Auto** — your server mints a one-time token and the employee is signed in silently.
3. **HR-pending** — a signed-in but unapproved employee. The SDK fires `onAuthPending`, and
   `EmbedViewComponent` shows a **"Waiting for HR approval"** banner until an HR admin approves them.

→ Full step-by-step + diagram: **[root README → How it works](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/README.md#how-it-works-the-flow)**.

> **Login modes — this example supports both.** New here? Compare [auto vs manual](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/docs/guides/login-modes.md), then follow the full [Auto-login](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/docs/guides/auto-login.md) or [Manual login](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/docs/guides/manual-login.md) guide for the complete step-by-step.

## How it works in this example

1. **Load** — the SDK `<script src="<BASE_URL>/embed.js">` is loaded once in `src/index.html` → `window.ApplaudIQ`.
2. **Route** — `src/app/app.routes.ts` maps `''` (`home.component.ts`), `auto` (`auto-login.component.ts`),
   and `manual` (`manual-login.component.ts`); `src/app/app.component.ts` is the shell (top nav + `<router-outlet>`).
3. **Open** — `ApplaudIQ.init({ key, baseUrl }).open({ … })` lives in `ApplaudIQService`
   (`src/app/applaudiq.service.ts`); the shared `embed-view.component.ts` calls it to mount the iframe and cleans up on destroy.
4. **Config** — the publishable key + portal URL live in `src/app/config.ts` (one place, imported everywhere).
5. **Mint (auto only)** — `auto-login.component.ts` injects `EmbedTokenService` (`src/app/embed-token.service.ts`),
   whose `getEmbedToken()` returns the server-minted token; the component switches on the resulting state.
6. **Callbacks** — `onReady` / `onAuthPending` / `onError` update the status pill in `EmbedViewComponent`.

→ Full step-by-step + diagram: **[root README → How it works](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/README.md#how-it-works-the-flow)**.

## Prerequisites

- A **publishable key** (`pk_live_…` / `pk_test_…`) from **HR portal → Settings → Embed SDK Keys** — needed in **both** modes.
  Add this example's origin **`http://localhost:5176`** to the key's allowed origins.
- For **auto-login** only: a server endpoint that mints a token — see [Minting](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/MINTING.md). Manual login needs neither.

## 1. Configure

In **`src/app/config.ts`**, edit the two `// 👉 REPLACE` lines:

- `PUBLISHABLE_KEY` → your `pk_…` key.
- `BASE_URL` → your portal origin. (`src/index.html`'s `<script src>` is `<BASE_URL>/embed.js`.)

That's **all** manual login needs — no server, no secret, no token.

## 2. Manual login (no server)

The simplest path to a running embed. Visit the **`/manual`** route — the page opens the embed with
`open({ mode: 'manual' })` (via `ApplaudIQService`):

```ts
ApplaudIQ
  .init({ key: PUBLISHABLE_KEY, baseUrl: BASE_URL })
  .open({ mode: 'manual', render: 'inline', container: '#applaudiq-recognition' });
```

**What you'll see:** Applaud IQ's own email / SSO login *inside* the embed; after signing in, the recognition feed. No mint endpoint, no `aiq_embed_…` secret.

## 3. Auto-login (wire the mint server)

Auto-login signs the employee in **silently** with a server-minted token (the `aiq_embed_…` secret never
touches the browser). This example ships a `getEmbedToken()` **stub** in `src/app/embed-token.service.ts`.
To enable it:

1. **Start the dev mint server** with your secret → see
   [Dev mint server (auto-login)](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/web-integration/README.md#dev-mint-server-auto-login).
2. Replace the `throw` in the stub with a call to your mint endpoint:
   ```ts
   const res = await fetch('/api/mint', { method: 'POST' });
   return (await res.json()).embedToken;
   ```
3. Make `/api/mint` reach the mint server: add a `proxy.conf.json`
   (`{ "/api/mint": { "target": "http://localhost:8787", "pathRewrite": { "^/api/mint": "/mint" } } }`)
   and run `ng serve --proxy-config proxy.conf.json` — or call `http://localhost:8787/mint` directly
   (CORS is enabled).

Until wired, `/auto` shows the **"Auto-login needs a server"** callout. The secret lives only on the mint server.

## 4. Run

```bash
npm install
npm start        # http://localhost:5176
```

Open **http://localhost:5176** and navigate **Home (`/`) → Auto-login (`/auto`) → Manual login (`/manual`)**
from the top nav. The status pill on each mode page shows the result.

> Clean-path routes need an SPA fallback when statically hosted (every path serves `index.html`).
> `npm start` (the dev server) handles this out of the box.

## Verify

- ✅ The recognition feed loads, signed in — no separate login.
- ⏳ A brand-new employee sees a **"waiting for HR approval"** status until an HR admin approves them.
- ❌ A wrong/expired key or origin shows a clear error — never a blank frame.

## Files

- `src/app/config.ts` — publishable key + portal URL (the only two values you set).
- `src/app/app.routes.ts` — the routes (`''`, `auto`, `manual` + redirect).
- `src/app/app.component.ts` — app shell: sticky top nav + `<router-outlet>`.
- `src/app/home.component.ts` — landing page with the two mode cards.
- `src/app/manual-login.component.ts` / `src/app/auto-login.component.ts` — the two mode pages (Auto mints first).
- `src/app/embed-token.service.ts` — mints the auto-login token (`getEmbedToken()` + loading/ready/needs-server state).
- `src/app/embed-loading.component.ts` / `src/app/needs-server-notice.component.ts` — the auto-login "minting…" and "needs a server" states.
- `src/app/embed-view.component.ts` — shared sub-header + status pill + HR-pending banner + the `#applaudiq-recognition` container.
- `src/app/applaudiq.service.ts` — the `init().open()` call + cleanup.
- `src/applaudiq.d.ts` — TypeScript types for the global SDK (copy into your app if you use TS).

> `angular.json` lists `zone.js` in `polyfills` — required for Angular to bootstrap.

## Troubleshooting

- **Blank frame / won't load** — your origin isn't on the key's allowed list. Add `http://localhost:5176`.
- **`SDK not loaded`** — the `<script src>` in `src/index.html` is wrong; it must be `<BASE_URL>/embed.js`.
- **Mint `401`/`403`** — the secret is wrong or auto-login isn't enabled for your org (auto-login only).

→ What each `open()` value means: **[SDK options reference](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/README.md#sdk-options-reference)**.
