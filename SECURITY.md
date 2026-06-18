# Security

These are **example** integrations, but they handle real authentication, so please follow the rules
below — especially around the **secret key**.

## Reporting a vulnerability

Please report security issues **privately** — do **not** open a public issue first.

- Email **support@therewardstore.com** with a description, reproduction steps, and impact.
- We'll acknowledge within a few business days and keep you updated on the fix.

## The golden rule: keep the secret on the server

Embed integrations use three values — only one is sensitive:

| Value | Where it belongs | Sensitive? |
|---|---|---|
| `aiq_embed_…` **secret key** | **your server only** (mints tokens) | **YES — never in the browser, never in git** |
| `pk_live_…` / `pk_test_…` **publishable key** | the browser | No — safe to ship in client code (origin-locked, single-tenant) |
| `embedToken` | server → browser | Low — single-use, ~60s; never cache or reuse |

**Do:**
- Keep `aiq_embed_…` in an environment variable / secret manager, always **server-side**. Wherever an
  example uses it, it stays off the browser: the Vite/Angular examples read it from a gitignored `.env.local`
  (copy each example's `.env.example`) and inject it in their **dev proxy** for **local testing only**; the
  **Next.js** example reads `process.env.APPLAUDIQ_SECRET` in its real backend route
  (`app/api/mint/route.ts`) — the production pattern.
- In **production**, your own backend mints the token (the dev proxies are a local-testing convenience). It's
  the **same mint request** either way — only the place that holds the secret differs.
- Mint **one** `embedToken` per session, server-side, just-in-time. Identify the employee from **your**
  session — never trust a client-supplied identity.
- Register your real site **origins** on the key (the embed only loads on those) and serve over **HTTPS**
  in production (the embed session cookies require it).

**Don't:**
- Commit a real secret, `.env`/`.env.local`, or paste the secret into browser code.
- Reuse or cache an `embedToken`.

## If a secret is exposed

**Rotate it immediately** — HR portal → Settings → Embed SDK Keys → **Regenerate**. The old secret stops
working the moment a new one is issued. Then purge it from any code/history and redeploy.

## Before you publish a fork

Run a quick scan for accidentally-committed secrets:

```bash
grep -rniE "aiq_embed_[a-z0-9]{6}|sk_[a-z0-9]{8}|pk_live_[a-z0-9]{10}" . \
  --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist
git ls-files | grep -i '\.env'   # should show only .env.example
```
