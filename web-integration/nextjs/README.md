# Next.js (App Router) — ApplaudIQ Web SDK example

Embed the Applaud IQ recognition portal in a Next.js app. The SDK loads once via `next/script` in the
root layout; client pages mount the embed inline. The app uses **real route-based navigation** (App Router)
with a Home landing page and one route per login mode. Unlike the other examples, this one **ships a real
server mint route** at `app/api/mint/route.ts` — so auto-login works end-to-end (the secret stays server-side).

## What you'll see

A small app with a persistent top nav and **three pages**:

- **Home (`/`)** — a landing page with two mode cards that link into each login mode.
- **Auto-login (`/auto`)** — the bundled `/api/mint` route mints a one-time token with your secret; the employee is signed in **silently**.
- **Manual login (`/manual`)** — the embed shows Applaud IQ's own login (email / SSO). No secret, no token — still uses your publishable `pk_…` key.

Each mode page renders the recognition feed **inside your app** (inline, full-page).

> **Login modes — this example supports both. Try [manual](#2-manual-login-no-server) first** — no server,
> just your publishable key — then add [auto-login](#3-auto-login-optional--uses-the-mint-route) (this
> example ships the real mint route). New here? Compare
> [auto vs manual](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/docs/guides/login-modes.md),
> then follow the full [Auto-login](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/docs/guides/auto-login.md)
> or [Manual login](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/docs/guides/manual-login.md) guide for the complete step-by-step.

## How it works in this example

This is the one example that ships a **server mint route**, so the full flow is in one project:

1. **Load** — the SDK is loaded once via `next/script` in `app/layout.tsx` → `window.ApplaudIQ`.
2. **Route** — `app/layout.tsx` is the shell (top nav + the SDK script); `app/page.tsx` is Home,
   `app/auto/page.tsx` is Auto-login, `app/manual/page.tsx` is Manual login.
3. **Open** — `ApplaudIQ.init({ key, baseUrl }).open({ … })` lives in `app/lib/useApplaudIQ.ts`; the shared
   `app/components/EmbedView.tsx` calls it to mount the iframe inline and cleans up on unmount.
4. **Config** — the publishable key + portal URL live in `app/lib/config.ts` (one place, imported everywhere).
5. **Mint (server)** — `app/auto/page.tsx` defines `getEmbedToken()`, which calls the real backend route
   **`app/api/mint/route.ts`**. That route exchanges your `aiq_embed_…` **secret** (server-only, from
   `process.env`) for a one-time `embedToken` and returns **only the token**. The page hands the SDK that
   fetcher via `open({ mode: 'auto', getToken })`; if the mint fails, the embedded portal shows the error.
6. **Callbacks** — `onReady` / `onAuthPending` / `onError` update the status pill in `EmbedView`.

### The three user flows

This example surfaces all three states an employee can land in:

1. **Manual** — the embed shows Applaud IQ's own login; no server, no token.
2. **Auto** — your server (the bundled `/api/mint` route) mints a one-time token and the employee is signed in silently.
3. **HR-pending** — a signed-in but unapproved employee. The SDK fires `onAuthPending`, and
   `EmbedView` shows a **"Waiting for HR approval"** banner until an HR admin approves them.

→ Full step-by-step + diagram: **[root README → How it works](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/README.md#how-it-works-the-flow)**.

## Prerequisites

- A **publishable key** (`pk_live_…` / `pk_test_…`) from **HR portal → Settings → Embed SDK Keys** — needed in **both** modes.
  Add this example's origin **`http://localhost:5174`** to the key's allowed origins.
- For **auto-login** only: your **secret** key (`aiq_embed_…`) for the mint route — server-only, never in git. Manual login needs neither (no secret, no token).

## 1. Configure

In **`app/lib/config.ts`**, edit the two `// 👉 REPLACE` lines:

- `PUBLISHABLE_KEY` → your `pk_…` key.
- `BASE_URL` → your portal origin. `SDK_URL` is derived as `${BASE_URL}/embed.js`.

The publishable key + portal origin are **all** manual login needs — no secret, no token.

## 2. Manual login (no server)

The simplest path to a running embed — it doesn't use the mint route or the secret at all. Visit the
**`/manual`** route — the page opens the embed with `open({ mode: 'manual' })` (via the `useApplaudIQ` hook):

```ts
ApplaudIQ
  .init({ key: PUBLISHABLE_KEY, baseUrl: BASE_URL })
  .open({ mode: 'manual', render: 'inline', container: '#applaudiq-recognition' });
```

**What you'll see:** Applaud IQ's own email / SSO login *inside* the embed; after signing in, the recognition feed. The `aiq_embed_…` secret in `.env.local` is **not** used for manual.

## 3. Auto-login (optional — uses the mint route)

**This is the canonical production pattern** — a real backend route holds the secret and mints the token.
Visit the **`/auto`** route: `app/auto/page.tsx` defines `getEmbedToken()`, which calls the bundled
**`/api/mint`** route, then opens the embed with `open({ mode: 'auto', getToken })`. Until you set your
secret, the mint route returns `501` and the embedded portal shows the error. Copy the env template and
fill in your **secret** + **gateway origin** (`.env.local` is gitignored — never commit it; both are
**env-only**, no default baked into the code):

```bash
cp .env.example .env.local
# then edit .env.local: APPLAUDIQ_SECRET=aiq_embed_…   APPLAUDIQ_API_BASE=https://api.<your-domain>
```

In **`app/api/mint/route.ts`**, replace the placeholder employee (`employee@example.com`) with **your
authenticated user** (never trust a client-supplied identity). **What you'll see:** the recognition feed,
signed in **silently** — no visible login.

> **Local vs production — it's the same request.** This route *is* the production pattern: it's a real
> backend endpoint that injects your secret server-side. The Vite/Angular examples fake this with a dev proxy
> for local testing only; here it's the real thing. Deploy this route (or an equivalent on your own backend)
> to ship auto-login.

## 4. Run

```bash
npm install
npm run dev      # http://localhost:5174  (set up .env.local above for auto-login)
```

Open **http://localhost:5174** and navigate **Home (`/`) → Auto-login (`/auto`) → Manual login (`/manual`)**
from the top nav. The status pill on each mode page shows the result.

> The App Router serves `/`, `/auto`, and `/manual` as real server routes — no extra SPA fallback config needed.

## Verify

- ✅ The recognition feed loads, signed in — no separate login.
- ⏳ A brand-new employee sees a **"waiting for HR approval"** status until an HR admin approves them.
- ❌ A wrong/expired key or origin shows a clear error — never a blank frame.
- `/api/mint` returns `501` if `APPLAUDIQ_SECRET` is unset, `502` if the upstream mint fails.

## Files

- `app/lib/config.ts` — publishable key + portal URL (the only two values you set); derives `SDK_URL`.
- `app/layout.tsx` — app shell: sticky top nav + the SDK loaded once via `next/script`.
- `app/page.tsx` — Home landing page with the two mode cards.
- `app/manual/page.tsx` / `app/auto/page.tsx` — the two mode pages (`app/auto/page.tsx` defines `getEmbedToken()`, which calls `/api/mint`, and mints first).
- `app/components/Nav.tsx` — sticky top nav with active highlighting.
- `app/components/EmbedView.tsx` — shared sub-header + status pill + HR-pending banner + the `#applaudiq-recognition` container.
- `app/lib/useApplaudIQ.ts` — the `init().open()` call + cleanup (the hook).
- `app/api/mint/route.ts` — the **real** server mint route (the only place your `aiq_embed_…` secret appears).
- `app/icon.svg` — the app favicon (Next.js auto-serves it).
- `app/applaudiq.d.ts` — TypeScript types for the global SDK (copy into your app if you use TS).

## Troubleshooting

- **Blank frame / won't load** — your origin isn't on the key's allowed list. Add `http://localhost:5174`.
- **`SDK not loaded`** — `BASE_URL` is wrong; the script src is `${BASE_URL}/embed.js`.
- **Mint `501`** — `APPLAUDIQ_SECRET` isn't set. **`502`** — the upstream mint failed (bad secret / auto-login
  not enabled / wrong `APPLAUDIQ_API_BASE`).

→ What each `open()` value means: **[SDK options reference](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/README.md#sdk-options-reference)**.
