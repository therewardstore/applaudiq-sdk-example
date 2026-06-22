---
layout: home

hero:
  name: ApplaudIQ Web SDK
  text: Embed recognition in your app
  tagline: Drop the Applaud IQ recognition portal into any web framework. Try manual login first — no server, just your publishable key. Then add auto-login.
  actions:
    - theme: brand
      text: Try manual login first
      link: /guides/manual-login
    - theme: alt
      text: Get your keys
      link: /get-keys
    - theme: alt
      text: Pick your framework
      link: /web/html
    - theme: alt
      text: Minting (server)
      link: /MINTING

features:
  - icon: 🔑
    title: Three identifiers
    details: "aiq_embed_… secret (server only, mints tokens) · pk_…  publishable key (browser) · embedToken (one-time, ~60s)."
  - icon: 🔁
    title: Two login modes
    details: "Auto-login — your server mints a token, the employee is signed in silently. Manual — the embed shows Applaud IQ's own login. No server."
  - icon: 🧩
    title: Every framework
    details: "Vanilla, React, Vue, Angular, Svelte, Next.js — same three steps: load the SDK, render a container, call init().open()."
---

## What this is

Applaud IQ's **Web SDK** renders the full recognition portal **inside your own app** — an iframe the SDK
mounts into a container you provide. Your employees see and send recognition without leaving your product.

```
┌── your app ─────────────────────────────┐
│  <div id="applaudiq-recognition">        │   ← the SDK renders the portal here (inline)
│  ApplaudIQ.init({ key }).open({ … })     │
└──────────────────────────────────────────┘
```

## The three identifiers

| Identifier | Where it lives | What it is |
|---|---|---|
| `aiq_embed_…` | **your server only** | **Secret key** — mints one-time tokens. Shown once by HR. **Never** put it in the browser. |
| `pk_live_…` / `pk_test_…` | **the browser** | **Publishable key** — safe to ship in client code; you pass it to `init({ key })`. |
| `embedToken` | server → browser | **One-time session token** minted from the secret. Opaque, single-use, ~60s. |

## Two ways to sign in

**Try manual login first** — no server, just your publishable key. Then add auto-login.

- **[Manual login](/guides/manual-login)** — the embed shows Applaud IQ's own login (email / SSO).
  **No token, no server.** Start here.
- **[Auto-login](/guides/auto-login)** — your **server** mints an `embedToken` and the SDK signs the
  employee in **silently**. Needs the secret on your server — see [Minting](/MINTING).

→ **[Compare the two modes](/guides/login-modes)** (which to use, side by side).

## Pick your framework

Not sure which? Use the **Which example?** aid below.

| Framework | Guide | Dev port |
|---|---|---|
| Plain HTML (single file, no build) | [Plain HTML](/web/html) | 5181 |
| Vanilla JS (multi-page) | [Vanilla](/web/vanilla) | 5180 |
| React (Vite) | [React](/web/react) | 5173 |
| Vue 3 (Vite) | [Vue](/web/vue) | 5175 |
| Angular | [Angular](/web/angular) | 5176 |
| Svelte (Vite) | [Svelte](/web/svelte) | 5177 |
| Next.js (App Router) — **canonical backend-mint reference** | [Next.js](/web/nextjs) | 5174 |

### Which example?

- **Plain HTML** — no build, the simplest possible drop-in.
- **Vanilla** — plain JS, no framework.
- **React / Vue / Svelte / Angular** — pick your framework.
- **Next.js** — the **canonical backend-mint reference** (ships a real server mint route).

**Web** integrations live in [`web-integration/`](https://github.com/therewardstore/applaudiq-sdk-example/tree/master/web-integration);
**native** SDKs (Android, iOS, React Native, Flutter) are available under `native-integration/`. The
server-side token mint is the **same for every platform** — see [Minting](/MINTING).

> **One URL to set:** your **portal origin** (`baseUrl`). The SDK script is served by the portal at
> `<baseUrl>/embed.js` — same origin — so the `<script src>` is just `<baseUrl>/embed.js`. Each example
> ships a placeholder marked `// 👉 REPLACE` — **paste your own portal origin** (no baked-in default).

New here? Get a publishable key (**[Get your keys](/get-keys)**), open your framework's guide, and run the
**manual** route first.
