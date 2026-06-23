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

> **Try manual login first** — no server, just your publishable key. Then add auto-login. Every example's
> README leads with the manual route.

## Examples

| Framework | Folder | Run | Dev port |
|---|---|---|---|
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/html5/html5-original.svg" width="16" alt="HTML5"/> Plain HTML (single file, no build) | [`html/`](./html/) | `npx serve -l 5181 html` | 5181 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/javascript/javascript-original.svg" width="16" alt="JS"/> Vanilla JS (multi-page) | [`vanilla/`](./vanilla/) | `npx serve -l 5180 vanilla` | 5180 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/react/react-original.svg" width="16" alt="React"/> React (Vite) | [`react-vite/`](./react-vite/) | `cd react-vite && npm i && npm run dev` | 5173 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/vuejs/vuejs-original.svg" width="16" alt="Vue"/> Vue 3 (Vite) | [`vue/`](./vue/) | `cd vue && npm i && npm run dev` | 5175 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/angular/angular-original.svg" width="16" alt="Angular"/> Angular | [`angular/`](./angular/) | `cd angular && npm i && npm start` | 5176 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/svelte/svelte-original.svg" width="16" alt="Svelte"/> Svelte (Vite) | [`svelte/`](./svelte/) | `cd svelte && npm i && npm run dev` | 5177 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/nextjs/nextjs-original.svg" width="16" alt="Next.js"/> Next.js (App Router) — **canonical backend-mint reference** | [`nextjs/`](./nextjs/) | `cd nextjs && npm i && npm run dev` | 5174 |

### Which example?

- **Plain HTML** — no build, the simplest possible drop-in.
- **Vanilla** — plain JS, no framework.
- **React / Vue / Svelte / Angular** — pick your framework.
- **Next.js** — the **canonical backend-mint reference** (ships a real server mint route at
  `app/api/mint/route.ts`).

## Before you start

- Get a **publishable key** (`pk_…`) and your **portal origin** — see the repo root
  [README](../README.md) and [Get your keys](../README.md#get-your-keys). The publishable key is needed in
  **both** modes.
- For **auto-login**, your server also mints a one-time token — see [`MINTING.md`](../MINTING.md). (Manual
  login needs no server and no secret — just the publishable key.)
- Add this example's dev origin (e.g. `http://localhost:5173`) to the key's **allowed origins**.

## Auto-login secret (local testing)

> **Do manual login first.** This section is only for the **second** step — auto-login. Manual login needs
> none of it (no server, no secret).

**Auto-login** needs a one-time `embedToken`, minted **server-side** from your `aiq_embed_…` **secret** —
the secret must never reach the browser. **There is no separate mint server to run.** The gateway origin is
**env-only** — there's **no `http://localhost:8000` default baked into the code**; you set
`APPLAUDIQ_API_BASE` yourself (in `.env.local`, or on the CLI for Angular).

- **Vite examples (react-vite, vue, svelte)** — the dev server's **own proxy** mints. `getEmbedToken()`
  calls same-origin `/api/mint`; `vite.config.ts` proxies that to the gateway's
  `POST /api/v1/embed/sessions` and injects your secret server-side. **Copy `.env.example` → `.env.local`**
  (gitignored) and set:

  ```bash
  APPLAUDIQ_SECRET=aiq_embed_xxxxx          # HR portal → Settings → Embed SDK Keys (shown once)
  APPLAUDIQ_API_BASE=http://localhost:8000  # 👉 your gateway origin (POST /api/v1/embed/sessions) — env-only, no default
  ```

  Then `npm run dev`. (A direct browser fetch to the gateway is CORS-blocked — that's why the dev proxy
  exists. The secret stays server-side and never reaches the browser.)

- **Angular** — same idea, but the dev proxy is `proxy.conf.js` and the CLI does **not** auto-load `.env`,
  so pass the values on the command line:
  `APPLAUDIQ_SECRET=aiq_embed_… APPLAUDIQ_API_BASE=http://localhost:8000 npm start`.

- **Next.js** — the mint runs in a real backend route, [`app/api/mint/route.ts`](./nextjs/app/api/mint/route.ts);
  set `APPLAUDIQ_SECRET` + `APPLAUDIQ_API_BASE` in its `.env.local`. **This is the canonical production pattern.**

- **vanilla / html** — static (`npx serve`), so they have **no** dev proxy and cannot inject a secret. Their
  auto-login `getEmbedToken()` must call a backend mint endpoint **you** host (the Next.js route is the model).

> **Local vs production — the same request, only the place that holds the secret differs.** The dev proxies
> above inject your secret for **local testing only**. In **production your own backend mints** the token —
> see the Next.js [`app/api/mint/route.ts`](./nextjs/app/api/mint/route.ts). It's one mint request, not two
> code paths. See [`MINTING.md`](../MINTING.md) for the request/response contract and a Node (Express) endpoint.

> What does each `open()` value (`mode`, `render`, callbacks, …) mean? See the
> **[SDK options reference](../README.md#sdk-options-reference)** in the root README.

