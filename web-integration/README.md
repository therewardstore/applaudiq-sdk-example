# Web integration — ApplaudIQ Web SDK examples

Copy-paste integrations that embed the **Applaud IQ** recognition portal inside a web app, across every
major framework. Each example is small and heavily commented — **paste your publishable key**, wire a
token from your server, done.

All examples do the same three things: load the SDK (`<script src="<baseUrl>/embed.js">`), render a
container, and call `ApplaudIQ.init({ key, baseUrl }).open({ mode, token?, render:'inline', container, …callbacks })`.

## The flow (short version)

1. **Load** `<baseUrl>/embed.js` → `window.ApplaudIQ`.
2. **Open** `init({ key, baseUrl }).open({ mode, … })` → the SDK injects an `<iframe src="<baseUrl>/embed">`
   into your container.
3. **Sign-in** — *auto*: your server mints an `embedToken`, the iframe exchanges it and signs in silently;
   *manual*: the iframe shows the portal's own login.
4. **Callbacks** — `onReady` / `onAuthPending` / `onError` drive your UI.

→ Full step-by-step + diagram: **[root README → How it works](../README.md#how-it-works-the-flow)**.
Each example's README maps these steps to its own files.

## Examples

| Framework | Folder | Run | Dev port |
|---|---|---|---|
| Plain HTML (single file, no build) | [`html/`](./html/) | `npx serve -l 5181 html` | 5181 |
| Vanilla JS (multi-page) | [`vanilla/`](./vanilla/) | `npx serve -l 5180 vanilla` | 5180 |
| React (Vite) | [`react-vite/`](./react-vite/) | `cd react-vite && npm i && npm run dev` | 5173 |
| Vue 3 (Vite) | [`vue/`](./vue/) | `cd vue && npm i && npm run dev` | 5175 |
| Angular | [`angular/`](./angular/) | `cd angular && npm i && npm start` | 5176 |
| Svelte (Vite) | [`svelte/`](./svelte/) | `cd svelte && npm i && npm run dev` | 5177 |
| Next.js (App Router) | [`nextjs/`](./nextjs/) | `cd nextjs && npm i && npm run dev` | 5174 |

## Before you start

- Get a **publishable key** (`pk_…`) and your **portal origin** — see the repo root
  [README](../README.md) and [Get your keys](../README.md#get-your-keys). The publishable key is needed in
  **both** modes.
- For **auto-login**, your server also mints a one-time token — see [`MINTING.md`](../MINTING.md). (Manual
  login needs no server and no secret — just the publishable key.)
- Add this example's dev origin (e.g. `http://localhost:5173`) to the key's **allowed origins**.

## Dev mint server (auto-login)

**Auto-login** needs a one-time `embedToken`, and that token is minted **on a server** from your
`aiq_embed_…` **secret** — the secret must never reach the browser. For local demos the repo ships a tiny
shared server, [`tools/mint-server.mjs`](./tools/mint-server.mjs), that the client-only examples point
their `/api/mint` at (so you run **one** mint server, not one per example).

**Start it** with your secret (HR portal → Settings → Embed SDK Keys — shown once):

```bash
cd web-integration
APPLAUDIQ_SECRET=aiq_embed_xxxxx \
APPLAUDIQ_API_BASE=http://localhost:3017 \   # where /api/v1/embed/sessions is reachable (portal or gateway)
node tools/mint-server.mjs                    # → http://localhost:8787
```

- `APPLAUDIQ_API_BASE` — origin that mints (`POST /api/v1/embed/sessions`). Defaults to `http://localhost:3017`
  (the portal, which proxies to the gateway); the gateway directly (`http://localhost:8000`) also works.
- `DEMO_EMPLOYEE_EMAIL` — who the demo signs in as (auto-provisioned). A brand-new employee lands on the
  "waiting for HR approval" screen; point it at an already-approved employee to see the feed.
- `MINT_PORT` — overrides `8787`.

How the examples reach it: the Vite examples proxy `POST /api/mint` → `:8787` (in `vite.config.ts`);
`getEmbedToken()` calls `/api/mint`, the server mints, and returns **only** `{ embedToken }`. The secret
stays in the server process. This mirrors the Next.js example's
[`app/api/mint/route.ts`](./nextjs/app/api/mint/route.ts) — in production, host an equivalent on your own
backend. See [`MINTING.md`](../MINTING.md) for the mint request/response contract.

> What does each `open()` value (`mode`, `render`, callbacks, …) mean? See the
> **[SDK options reference](../README.md#sdk-options-reference)** in the root README.

