# Contributing

Thanks for helping improve the ApplaudIQ SDK examples! These are intentionally small, copy-paste
integrations — keep them minimal, heavily commented, and consistent.

## Prerequisites

- Node **20+** (see [`.nvmrc`](./.nvmrc)). Each example installs its own deps.

## Run an example

```bash
cd web-integration/<framework>
npm install
npm run dev      # see the framework's README for the port
```

## Security rules (please read)

- **Never commit a real secret** (`aiq_embed_…`) or a real key. Use the `pk_test_xxxxxxxxxxxxxxxxxxxxxxxx`
  / `// 👉 REPLACE` placeholder pattern the other examples use.
- The secret belongs in `process.env` via a gitignored `.env.local` (copy from `.env.example`) — see the
  Next.js example and [SECURITY.md](./SECURITY.md).
- Before opening a PR, scan your changes:
  ```bash
  grep -rniE "aiq_embed_[a-z0-9]{6}|sk_[a-z0-9]{8}|pk_live_[a-z0-9]{10}" . \
    --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist
  ```

## Adding a new framework example

1. Create `web-integration/<framework>/` with the same shape: load the SDK
   (`<script src="<BASE_URL>/embed.js">` or the framework's equivalent), a container, and
   `ApplaudIQ.init({ key, baseUrl }).open({ mode, token?, render:'inline', container, …callbacks })`.
2. Use the shared config pattern (`PUBLISHABLE_KEY` + `BASE_URL` with `// 👉 REPLACE`, production default)
   and a `getEmbedToken()` stub pointing at `/api/mint`.
3. Add a two-audience `README.md` (What you'll see · Prerequisites · Configure · Auto-login · Run ·
   Verify · Files · Troubleshooting) — match the existing ones.
4. Add it to the **Examples** table in the root [`README.md`](./README.md).
