# Vanilla JS — ApplaudIQ Web SDK example

Embed the Applaud IQ recognition portal in plain HTML — **no build step**. Three pages (`index.html`,
`auto.html`, `manual.html`) share a stylesheet and a set of focused ES modules under `src/`.

## What you'll see

A small site with a persistent top nav and **three pages**:

- **Home (`index.html`)** — a landing page with two mode cards that link into each login mode.
- **Auto-login (`auto.html`)** — your server mints a one-time token and the employee is signed in **silently**.
- **Manual login (`manual.html`)** — the embed shows Applaud IQ's own login (email / SSO). No server, no secret — still uses your publishable `pk_…` key.

Each mode page renders the recognition feed **inside your page** (inline, full-height).

> **Login modes — this example supports both.** New here? Compare [auto vs manual](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/docs/guides/login-modes.md), then follow the full [Auto-login](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/docs/guides/auto-login.md) or [Manual login](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/docs/guides/manual-login.md) guide for the complete step-by-step.

## How it works in this example

Three plain HTML pages share `styles.css` and a few small ES modules under `src/` (no build —
loaded with `<script type="module">`):

1. **Load** — each page loads the SDK once via `<script src="<BASE_URL>/embed.js">` in `<head>` → `window.ApplaudIQ`.
2. **Navigate** — the top nav markup lives in **one place** (`src/nav.js`); each page calls
   `renderNav('<page>.html')`, which injects the shared `<nav>` into the `<nav id="nav">` host and
   highlights the current page. (No more copy-pasted nav across the three HTML files.)
3. **Open + Render** — the shared `openEmbed()` helper in `src/embed.js` calls
   `ApplaudIQ.init({ key, baseUrl }).open({ … })` into the `#applaudiq-recognition` div on each mode page.
4. **Config** — the publishable key + portal URL live in `src/config.js` (one place, imported everywhere).
5. **Mint (auto only)** — `auto.html` imports `getEmbedToken()` from `src/mint.js` for the server-minted token.
6. **Callbacks** — `onReady` / `onAuthPending` / `onError` update the status pill; `onAuthPending` also
   surfaces a visible HR-pending banner.

### The three user flows

This example surfaces all three states an employee can land in:

1. **Manual** — the embed shows Applaud IQ's own login; no server, no token.
2. **Auto** — your server mints a one-time token and the employee is signed in silently.
3. **HR-pending** — a signed-in but unapproved employee. The SDK fires `onAuthPending`, and
   `openEmbed()` shows a **"Waiting for HR approval"** banner until an HR admin approves them.

→ Full step-by-step + diagram: **[root README → How it works](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/README.md#how-it-works-the-flow)**.

## Prerequisites

- A **publishable key** (`pk_live_…` / `pk_test_…`) from **HR portal → Settings → Embed SDK Keys** — needed
  in **both** modes. Add this example's origin **`http://localhost:5180`** to the key's allowed origins.
- For **auto-login** only: a server endpoint that mints a token — see [Minting](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/MINTING.md). Manual
  login needs neither.

## 1. Configure

In **`src/config.js`**, edit the two `// 👉 REPLACE` lines (and the matching `<script src>` in each
page's `<head>`):

- `PUBLISHABLE_KEY` → your `pk_…` key.
- `BASE_URL` → your portal origin. Each page's `<script src>` is `<BASE_URL>/embed.js`.

That's **all** manual login needs — no server, no secret, no token.

## 2. Manual login (no server)

The simplest path to a running embed. Visit **`manual.html`** — the page calls `openEmbed({ mode: 'manual' })`
(the shared helper in `src/embed.js`):

```js
ApplaudIQ
  .init({ key: PUBLISHABLE_KEY, baseUrl: BASE_URL })
  .open({ mode: 'manual', render: 'inline', container: '#applaudiq-recognition' });
```

**What you'll see:** Applaud IQ's own email / SSO login *inside* the embed; after signing in, the
recognition feed. No mint endpoint, no `aiq_embed_…` secret.

## 3. Auto-login (wire the mint server)

Auto-login signs the employee in **silently** with a server-minted token (the `aiq_embed_…` secret never
touches the browser). This example ships a `getEmbedToken()` **stub** in `src/mint.js`. To enable it:

1. **Start the dev mint server** with your secret → see
   [Dev mint server (auto-login)](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/web-integration/README.md#dev-mint-server-auto-login).
2. Point `getEmbedToken()` at it — there's no dev-server proxy here, so call the mint server directly
   (CORS is enabled):
   ```js
   const res = await fetch('http://localhost:8787/mint', { method: 'POST' });
   return (await res.json()).embedToken;
   ```

Until wired, `auto.html` shows the **"Auto-login needs a server"** callout. The secret lives only on the mint server.

## 4. Run

The SDK needs an `http://` origin (not `file://`):

```bash
npx serve -l 5180 .
```

Open **http://localhost:5180** (`index.html`) and navigate Home → **`auto.html`** → **`manual.html`** from
the top nav. The status pill on each mode page shows the result.

> Each page is its own `.html` file, so there's no SPA fallback to configure — any static host works.

## Verify

- ✅ The recognition feed loads, signed in — no separate login.
- ⏳ A brand-new employee sees a **"waiting for HR approval"** status until an HR admin approves them.
- ❌ A wrong/expired key or origin shows a clear error — never a blank frame.

## Files

- `src/config.js` — publishable key + portal URL (the only two values you set) + `keyIsPlaceholder`.
- `src/nav.js` — `renderNav(activePath)`: the shared top-nav markup (one place) + active-link logic.
- `src/embed.js` — `openEmbed()` (the `init().open()` call) + the status pill + HR-pending banner helpers.
- `src/mint.js` — `getEmbedToken()` stub: mints the one-time auto-login token (wire to your server).
- `index.html` — Home landing page with the two mode cards + the shared top-nav host.
- `manual.html` / `auto.html` — the two mode pages (Auto mints first); each has the nav host, an HR-pending banner, and the `#applaudiq-recognition` container.
- `styles.css` — the shared stylesheet for the nav, cards, embed, and HR-pending banner.
- `favicon.svg` — the app favicon.

## Troubleshooting

- **Blank frame / won't load** — your origin isn't on the key's allowed list. Add `http://localhost:5180`.
- **`SDK not loaded`** — the `<script src>` is wrong; it must be `<BASE_URL>/embed.js`.
- **Mint error** — wire `getEmbedToken()` to your server; the `aiq_embed_…` secret must never be in the browser.

→ What each `open()` value means: **[SDK options reference](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/README.md#sdk-options-reference)**.
