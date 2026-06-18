# Plain HTML — ApplaudIQ Web SDK example

The **simplest possible** integration: **one HTML file**, no framework, no build step, no modules.
Copy [`index.html`](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/web-integration/html/index.html), set two values, open it — the recognition portal renders inline.

Use this when you just want to drop the embed into an existing page (a CMS template, a static site, a
server-rendered view) without a bundler. If you already use a framework, see the
[React](https://github.com/therewardstore/applaudiq-sdk-example/tree/master/web-integration/react-vite),
[Vue](https://github.com/therewardstore/applaudiq-sdk-example/tree/master/web-integration/vue),
[Angular](https://github.com/therewardstore/applaudiq-sdk-example/tree/master/web-integration/angular),
[Svelte](https://github.com/therewardstore/applaudiq-sdk-example/tree/master/web-integration/svelte) or
[Next.js](https://github.com/therewardstore/applaudiq-sdk-example/tree/master/web-integration/nextjs) examples instead.

> **Login modes — this example uses manual by default (start here)** — no server, just your publishable key.
> Add [auto-login](#auto-login-optional) as a second step. New here? Compare
> [auto vs manual](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/docs/guides/login-modes.md),
> then follow the full [Auto-login](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/docs/guides/auto-login.md)
> or [Manual login](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/docs/guides/manual-login.md) guide for the complete step-by-step.

## How it works

The whole example is one file. It does three things:

1. **Load** — `<script src="<BASE_URL>/embed.js">` in `<head>` exposes `window.ApplaudIQ`.
2. **Configure** — two `var`s at the top of the page script: `PUBLISHABLE_KEY` (browser-safe `pk_…`) and
   `BASE_URL` (your portal origin).
3. **Open + Render** — `ApplaudIQ.init({ key, baseUrl }).open({ mode: 'manual', render: 'inline', container: '#applaudiq-recognition' })`
   renders the recognition feed **inside** the `#applaudiq-recognition` div.

Manual login needs **no server and no secret** — just the publishable key. The file also includes a
commented **auto-login** block showing how to swap in a one-time `token` your server mints.

## Run it

It's a static file, but the SDK needs an `http(s)` origin (not `file://`), so serve the folder:

```bash
npx serve -l 5181 html
# then open http://localhost:5181
```

## Configure

Edit the two `// 👉 REPLACE` values in `index.html` — paste **your** publishable key and **your** portal
origin (and update the host in the `<script src>` to match `BASE_URL`):

```js
var PUBLISHABLE_KEY = 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxx'; // 👉 your pk_… — HR portal → Settings → Embed SDK Keys
var BASE_URL = 'https://recognize.applaudiq.com';        // 👉 your portal origin (e.g. http://localhost:3017 for local)
```

That's all manual login needs — no server, no secret, no token.

## Auto-login (optional)

**Do manual login first** — it's all most apps need to get started. For **silent** sign-in as a second step,
your server mints a one-time token (it holds the `aiq_embed_` secret — never put that in the page) and you
pass `mode: 'auto'` + a `getToken` fetcher. This page is a single **static** file with **no dev server**, so
the token must come from a **backend mint endpoint you host** — the canonical route ships in the
[nextjs example](https://github.com/therewardstore/applaudiq-sdk-example/tree/master/web-integration/nextjs) (`app/api/mint/route.ts`).
It's the **same** `POST /api/v1/embed/sessions` mint request the framework examples make — only here **your
backend** holds the secret (local and production alike), never these static files. See the commented
auto-login block in `index.html` and the
[Auto-login guide](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/docs/guides/auto-login.md).
