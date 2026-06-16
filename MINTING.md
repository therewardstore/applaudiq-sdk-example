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
    "email": "you@example.com",
    "externalId": "EMP-4821",   // optional — your own stable id
    "firstName": "Arulraj",       // optional (used when auto-provisioning)
    "lastName": "V"            // optional
  },
  "autoProvision": true          // create the employee if they don't exist yet
}
```

```jsonc
// 200 OK
{
  "embedToken": "9f3a8c1b…", // opaque, single-use, ~60s — hand to the SDK in the browser
  "expiresIn": 60,
  "hrPending": false, // true until an HR admin approves the employee
}
```

`<YOUR_API_BASE>` is environment-specific: local `http://localhost:8000`, production
`https://api.<your-domain>` (the exact base is shown in the admin **Embed SDK** tab).

## Node (Express) example endpoint

```js
// server.js — the ONLY place your secret key appears.
import express from "express";
const app = express();
app.use(express.json());

const API_BASE = process.env.APPLAUDIQ_API_BASE ?? "http://localhost:8000";
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
  -d '{"employee":{"email":"you@example.com"},"autoProvision":true}'
```

In the framework examples, the browser calls **your** `/api/mint` (above) inside the `getEmbedToken()`
stub, then passes the returned `embedToken` to `ApplaudIQ.init().open({ mode:'auto', token })`.
