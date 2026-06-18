---
title: Auto-login
---

# Auto-login (silent sign-in)

Auto-login signs the employee into the embed **silently** — no second login screen. Use it when your app
has **already** authenticated the employee and you can run a small server endpoint.

It works in three moves:

1. Your **server** swaps the **secret** (`aiq_embed_…`) for a one-time `embedToken`.
2. Your **browser** fetches that token from your own endpoint.
3. You hand the SDK a `getToken` fetcher — `open({ mode: 'auto', getToken })` — and it signs the user in.

> New to the modes? See **[auto vs manual](/guides/login-modes)** first. Just want manual? See
> **[Manual login](/guides/manual-login)** — no server required.

## Prerequisites

- A **publishable key** (`pk_live_…` / `pk_test_…`) and the **portal origin** (`baseUrl`) — from the admin
  **Embed SDK** tab. See [Get your keys](/get-keys).
- The **secret** (`aiq_embed_…`) — shown once by HR. It lives **only on your server** (env var / secret
  manager). **Never** ship it in browser code.
- A server you control (any language) to host the mint endpoint.
- Your app's origin registered in the key's **allowed origins** (incl. your dev origin).

## Step 1 — Mint a token on your server

Your server exchanges the secret for a one-time token by calling the gateway's mint endpoint
(`APPLAUDIQ_API_BASE` — an env-only value, no hardcoded default; see [Minting](/MINTING)):

```http
POST <APPLAUDIQ_API_BASE>/api/v1/embed/sessions
Authorization: Bearer aiq_embed_…        ← your SECRET, server-side only
Content-Type: application/json

{ "employee": { "email": "arulraj@example.com" }, "autoProvision": true }
```

The response carries the token (single-use, ~60s) and whether the employee is awaiting HR approval:

```json
{ "embedToken": "…", "expiresIn": 60, "hrPending": false }
```

Return **only** `embedToken` to the browser — never the secret. The employee identity must come from
**your** authenticated session, not from the client. See **[Minting on your server](/MINTING)** for the
full request/response reference and a Node (Express) endpoint.

A complete, working server route ships in the Next.js example —
[`web-integration/nextjs/app/api/mint/route.ts`](/web/nextjs):

```ts
const API_BASE = process.env.APPLAUDIQ_API_BASE; // gateway origin — env-only, no hardcoded default
const SECRET = process.env.APPLAUDIQ_SECRET; // aiq_embed_… — server only
const res = await fetch(`${API_BASE}/api/v1/embed/sessions`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${SECRET}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ employee, autoProvision: true }),
});
const body = await res.json();
const data = body.data ?? body; // gateway wraps in { data }
return Response.json({ embedToken: data.embedToken }); // ONLY the token
```

## Step 2 — Fetch the token in the browser

Point the SDK's token getter at **your** endpoint (named `/api/mint` in the examples):

```js
async function getEmbedToken() {
  const res = await fetch('/api/mint', { method: 'POST' });
  const { embedToken } = await res.json();
  return embedToken;
}
```

> **Local vs production — the same request, only the place that holds the secret differs.** A direct browser
> fetch to the gateway is CORS-blocked, so for **local testing** the Vite examples (React, Vue, Svelte) don't
> run a separate server — their **dev server's own proxy** forwards `/api/mint` →
> `POST /api/v1/embed/sessions` and **injects your secret server-side** from a gitignored `.env.local`
> (copy each example's `.env.example`; set `APPLAUDIQ_SECRET` + `APPLAUDIQ_API_BASE`). Angular does the same
> via `proxy.conf.js`. **This dev proxy is local testing only.** **In production your backend mints** the
> token — `/api/mint` is a real route on **your** backend, exactly like the Next.js example's
> [`app/api/mint/route.ts`](/web/nextjs). It's **one code path**, not two: the same mint request, just moved
> from the dev proxy to your real backend. The static examples (vanilla, plain HTML) have no dev proxy, so
> they always need a backend endpoint you host.

## Step 3 — Open the embed in auto mode

```js
ApplaudIQ.init({ key: PUBLISHABLE_KEY, baseUrl: BASE_URL }).open({
  mode: 'auto',
  getToken: getEmbedToken, // async fetcher — the SDK calls it for a one-time token
  render: 'inline',
  container: '#applaudiq-recognition',
  onReady: () => console.log('signed in ✓'),
  onAuthPending: () => console.log('waiting for HR approval'),
});
```

If the mint fails, the **portal shows the error itself** (e.g. *"We couldn't sign you in"*) — you don't need
`onError`. The recommended `getToken` form keeps all failure UI inside the embed.

## What you'll see

- The recognition feed renders **already signed in** — no login screen.
- `onReady` fires once the session is established.
- A **brand-new** employee signs in but sees *"waiting for HR approval"* and `onAuthPending` fires — they
  get access the moment HR approves them.

## Troubleshooting

- **`onError` immediately / blank embed** — the token expired (it's ~60s and single-use) or wasn't passed.
  Mint a fresh one right before `open()`.
- **401 from `/api/v1/embed/sessions`** — wrong or missing secret, or you used the publishable key. The
  `Authorization: Bearer` must be the `aiq_embed_…` secret, server-side.
- **Embed won't load on your page** — your origin isn't in the key's allowed origins; add it (incl. dev).
- **Stuck on "waiting for HR approval"** — expected for new employees until an HR admin approves them.

## Next

- **[Manual login](/guides/manual-login)** — the no-server alternative.
- **[Minting on your server](/MINTING)** — full mint reference.
- **[Pick your framework](/web/vanilla)** — each example wires this up end-to-end.
