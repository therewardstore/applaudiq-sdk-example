# Minting an `embedToken` on your server (auto-login)

For **auto-login**, your **server** exchanges your secret key for a one-time `embedToken` and returns
**only the token** to the browser. The secret (`aiq_embed_…`) must never reach client code.

> Skip this entirely for **manual login** — that mode shows the portal's own login and needs none of this
> (no secret, no token). It still uses your **publishable key** (`pk_…`) in `ApplaudIQ.init({ key })`, just
> like auto-login.

## The mint call

```http
POST <YOUR_API_BASE>/api/v1/embed/sessions
Authorization: Bearer aiq_embed_…           # 👈 your SECRET — server-side only
Content-Type: application/json

{
  "employee": {
    "email": "employee@example.com",
    "externalId": "EMP-4821",   // optional — your own stable id
    "firstName": "Arulraj",          // optional (used when auto-provisioning)
    "lastName": "V"           // optional
  },
  "autoProvision": true          // create the employee if they don't exist yet
}
```

The response is **wrapped in a `data` envelope**:

```jsonc
// 200 OK
{
  "data": {
    "embedToken": "9f3a8c1b…", // opaque, single-use, ~60s — hand to the SDK in the browser
    "expiresIn": 60,
    "hrPending": false // true until an HR admin approves the employee
  }
}
```

> Unwrap it defensively with `(body.data ?? body).embedToken` — clients tolerate both the wrapped and
> unwrapped shapes.

### Identifying the employee

The `employee` object identifies who the token is for. **One of `externalId` / `email` is required.**

| Field | What it is |
|---|---|
| `externalId` | Your own **stable** id (e.g. your HRIS / SSO id). **Matched first** and **email‑independent** — it's linked to the employee on first sign‑in, so it survives email / name changes. **Preferred for production.** |
| `email` | The human identifier and **fallback / bootstrap** key. Required if you don't send `externalId`. |
| `firstName` / `lastName` | Used **only when auto‑provisioning** a brand‑new (pending) employee — they set the display name HR sees. **Ignored if the employee already exists.** |

### HR approval (`hrPending`)

`hrPending: true` means a newly **auto‑provisioned** employee is **awaiting HR approval**. In that case the
token exchange returns **403**, the **portal shows its own "Pending HR approval" screen**, and `onAuthPending`
fires in the SDK (a notification only — you don't render the pending screen yourself).

`<YOUR_API_BASE>` is the gateway origin that exposes `/api/v1/embed/sessions`. It's **env-only** — set it
in your server's environment (e.g. `APPLAUDIQ_API_BASE`), with **no hardcoded default**: local
`http://localhost:8000`, production `https://api.<your-domain>` (the exact base is shown in the admin
**Embed SDK** tab).

## Node (Express) example endpoint

```js
// server.js — the ONLY place your secret key appears.
import express from "express";
const app = express();
app.use(express.json());

const API_BASE = process.env.APPLAUDIQ_API_BASE; // gateway origin — env-only, no hardcoded fallback
const SECRET = process.env.APPLAUDIQ_SECRET; // aiq_embed_… (env / secret manager — never in git)

app.post("/api/mint", async (req, res) => {
  // Identify the employee from YOUR session — never trust a client-supplied identity.
  const email = req.user?.email; // however your app authenticates the user
  const r = await fetch(`${API_BASE}/api/v1/embed/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ employee: { email }, autoProvision: true }),
  });
  if (!r.ok) return res.status(502).json({ error: "mint_failed" });
  const { embedToken, expiresIn, hrPending } = await r
    .json()
    .then((b) => b.data ?? b);
  res.json({ embedToken, expiresIn, hrPending }); // return ONLY the token to the browser
});

app.listen(4000);
```

## curl (quick test)

```bash
curl -X POST "$APPLAUDIQ_API_BASE/api/v1/embed/sessions" \
  -H "Authorization: Bearer $APPLAUDIQ_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"employee":{"email":"employee@example.com"},"autoProvision":true}'
```

## In the examples

Each example's `getEmbedToken()` fetches `/api/mint` and hands the SDK the resulting token via
`ApplaudIQ.init().open({ mode: 'auto', getToken })`. **It's the same `POST /api/v1/embed/sessions` request
everywhere — only the place that holds the secret differs** (one code path, not two): the secret is
**always** added server-side, never in the browser bundle.

- **Vite examples** (react-vite, vue, svelte) — the **dev server's own proxy** mints. `vite.config.ts`
  forwards `/api/mint` → this `POST /api/v1/embed/sessions` and injects `APPLAUDIQ_SECRET` from a gitignored
  `.env.local` (copy each example's `.env.example`). No separate server to run; this is **local testing only**.
- **Angular** — the same, via `proxy.conf.js`. The CLI doesn't auto-load `.env`, so the secret is passed on
  the `npm start` command line.
- **Next.js** — the mint runs in a real backend route (`app/api/mint/route.ts`). **This is the canonical
  production pattern** — host an equivalent on your own backend.
- **vanilla / html** — static, with no dev proxy, so their `getEmbedToken()` must call a backend mint
  endpoint **you** host (the Next.js route is the model).

> **Local vs production.** The dev proxy injects your secret for **local testing only**. In **production
> your backend mints** the token (see the Next.js `app/api/mint/route.ts`). It's the **same request** — only
> the place that holds the secret moves from the dev proxy to your real backend.
