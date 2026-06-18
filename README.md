# ApplaudIQ Web SDK — examples

Copy‑paste integrations that embed the **Applaud IQ** recognition portal inside your app with the
**Web SDK**, across every major framework. Each example is intentionally small and heavily commented —
**paste your publishable key** and **your portal origin**, open the **manual** route, and the portal
renders inline. No server required to start. (Add **auto-login** — silent sign-in — as a second step.)

```
┌── your app ─────────────────────────────┐
│  <div id="applaudiq-recognition">        │   ← the SDK renders the portal here (inline)
│  ApplaudIQ.init({ key }).open({ … })     │
└──────────────────────────────────────────┘
```

## Start here — fastest path

You can see the portal rendering **inside an example app in minutes** — manual login needs no server:

1. **Get a publishable key** (`pk_test_…` / `pk_live_…`) and your **portal origin** — ask your HR / Applaud
   IQ admin (see [Get your keys](#get-your-keys)).
2. **Pick an example:** `cd web-integration/<example>` (see [Which example?](#which-example) below).
3. **Paste your key + portal origin** into the example's config (the two `// 👉 REPLACE` lines).
4. **Run** the example (`npm run dev`, or `npx serve` for the static ones).
5. **Open the `/manual` route** — the recognition portal renders inline, **no server**.

Then **add auto-login** (silent sign-in) when you're ready: your backend mints a one-time token. See
[Two login modes](#two-login-modes) and [`MINTING.md`](MINTING.md).

### Which example?

| If you want… | Use | Why |
|---|---|---|
| The simplest thing, no build | **Plain HTML** (`html/`) | One file, no bundler — drop it into any page. |
| Plain JS, multi-page | **Vanilla** (`vanilla/`) | No framework, small ES modules. |
| Your framework | **React / Vue / Svelte / Angular** | Idiomatic per-framework wiring. |
| The **backend-mint reference** | **Next.js** (`nextjs/`) | The **canonical** example — ships a real server mint route (`app/api/mint/route.ts`). |

## The three identifiers

| Identifier | Where it lives | What it is |
|---|---|---|
| `aiq_embed_…` | **your server only** | **Secret key** — mints one‑time tokens. Shown once by HR. **Never** put it in the browser. |
| `pk_live_…` / `pk_test_…` | **the browser** | **Publishable key** — safe to ship in client code; you pass it to `init({ key })` in **both** modes (auto *and* manual). |
| `embedToken` | server → browser | **One‑time session token** minted from the secret. Opaque, single‑use, ~60s. |

## Get your keys

1. A **platform admin** enables Embed SDK for your organization and picks the login mode(s).
2. An **HR admin** (HR portal → Settings → Embed SDK Keys) generates the key, copies the
   `aiq_embed_…` **secret** (shown once → your server) and the `pk_live_…` **publishable key**
   (→ your client code), and adds your site **origin(s)** (the embed only loads on those).

## Two login modes

**Try manual login first** — no server, just your publishable key. Then add auto-login.

- **Manual login** — the embed shows Applaud IQ's own login (email / SSO). **No token, no server secret** —
  still initialized with your publishable `pk_…` key (every mode passes it to `init({ key })`). The fastest
  way to see the portal running in your app.
- **Auto‑login** — your server mints an `embedToken`; the SDK signs the employee in **silently**.
  Adds the secret on your server (see [`MINTING.md`](MINTING.md)) **on top of** the publishable key.
  For local testing, each example's **dev proxy** injects the secret server-side; **in production your own
  backend mints** the token (the same request — only the place that holds the secret differs).

## How it works (the flow)

What actually happens at runtime, from page load to the portal rendering:

1. **One-time setup** — a platform admin enables Embed SDK for your org; an HR admin generates the key
   (the `aiq_embed_…` secret + the `pk_…` publishable key) and adds your site's **allowed origins**.
2. **Load the SDK** — your page includes `<script src="<baseUrl>/embed.js">`, which exposes the global
   `window.ApplaudIQ`.
3. **Open the embed** — you call
   `ApplaudIQ.init({ key, baseUrl }).open({ mode, token?, render:'inline', container, …callbacks })`. The SDK
   injects an `<iframe src="<baseUrl>/embed">` into your container element.
4. **Sign-in** —
   - **Auto:** your **server** already minted a one-time `embedToken` (`POST /embed/sessions` with the secret).
     The SDK hands that token to the iframe, which **exchanges** it (`POST /embed/exchange`) for a session and
     renders the portal — **silently**, no visible login.
   - **Manual:** the iframe shows Applaud IQ's **own login** (email / SSO); after sign-in the portal renders.
     No token, no server secret — still initialized with your publishable key.
5. **Lifecycle callbacks** — the SDK calls back into your app: `onReady` (signed in) · `onAuthPending`
   (new employee, awaiting HR approval) · `onError` (bad/expired key, token, or origin) · `onClose`.
6. **HR approval gate** — a brand-new / auto-provisioned employee can sign in but sees a **"pending approval"**
   screen (→ `onAuthPending`) until an HR admin approves them; after that, the full portal loads.

```
Browser (your app)         Your server               Applaud IQ portal
load <baseUrl>/embed.js ──────────────────────────▶  window.ApplaudIQ
[auto] need a token   ─▶  POST /embed/sessions   ─▶  mint (Bearer aiq_embed_)
                          { embedToken }          ◀─
ApplaudIQ.init(…).open({ mode, token })
  └ injects <iframe src="<baseUrl>/embed"> ───────▶  loads portal
      auto   → exchange embedToken ───────────────▶  POST /embed/exchange → session
      manual → portal login (email / SSO)
  ◀── onReady · onAuthPending · onError
portal renders inline in your <div id="applaudiq-recognition">
```

> Steps 1–2 + the server **mint** ([`MINTING.md`](MINTING.md)) are the same for every framework; only the few
> lines in step 3 differ per framework. The identifiers used above are defined in
> [The three identifiers](#the-three-identifiers).

### What your users see

**The portal owns all failure UI** — the client renders none of these error screens:

- **Mint can't resolve the employee** → portal shows *"We couldn't sign you in / contact your HR admin"*.
- **HR‑pending** (new auto‑provisioned employee) → portal shows its own *"Pending HR approval"* screen (and `onAuthPending` fires as a notification).
- **Bad / expired token** → portal shows *"sign‑in link invalid"*.
- **Sign‑out in an auto/SSO embed** → portal shows its own **signed‑out screen** and `onSignOut` fires — you can `handle.close()`, run your own logout, or relaunch with a fresh token.

So with `getToken`, even a mint failure surfaces inside the embed — **you don't write any error UI**.

## SDK options reference

Every example calls `ApplaudIQ.init({ key, baseUrl }).open({ … })`. Here is what each value means and **when
to use it** — the canonical glossary the per-framework examples refer back to.

### `init({ … })`

| Option | What it is | When to use |
|---|---|---|
| `key` | The **publishable key** (`pk_live_…` / `pk_test_…`), safe in the browser. | **Always — both modes.** `pk_live_…` = production; `pk_test_…` = a test/staging key (the embed shows a **"Test mode"** pill). |
| `baseUrl` | The portal origin where `/embed` lives. | Defaults to the production portal; set it for staging / local dev. |

### `open({ … })`

| Option | Value | What it is / when to use |
|---|---|---|
| `mode` | `'auto'` | Silently sign in a user you **already know** — your server minted the `token`. Use when your app authenticated the employee and you can mint server‑side. |
| | `'manual'` | Let Applaud IQ handle login (email / SSO) **inside the embed**. Use when you have **no server** / don't want to mint. No token, no secret — just the publishable `key`. |
| `getToken` | `() => Promise<string>` | **Auto mode (recommended)** — an async fetcher the SDK calls to get a one‑time token. If it **rejects**, the embedded portal shows the error itself — you write **no error UI**. Prefer this over `token`. |
| `token` | `embedToken` | The direct/legacy alternative to `getToken` — a **pre‑fetched** one‑time token from your mint call. **Auto mode only** — omit for manual. |
| `render` | `'inline'` | Mount into your own `container` `<div>` — embeds the portal **inside your page**. The default for these examples. |
| | `'modal'` | A centered overlay dialog over your app. Use for an "open recognition" button. |
| | `'fullscreen'` | A full‑screen takeover. Use on mobile web or a dedicated recognition screen. |
| `container` | CSS selector / element | The mount point for `render: 'inline'` (e.g. `'#applaudiq-recognition'`). Required for inline; ignored otherwise. |

### Callbacks (lifecycle hooks for your own UI)

| Callback | Fires when | Use it to |
|---|---|---|
| `onReady` | The employee is signed in and the portal is shown. | Hide your loading state. |
| `onAuthPending` | Signed in but **awaiting HR approval** (new / auto‑provisioned employee). The **portal renders its own "Pending HR approval" screen** — this callback is just a notification. | Optionally track / log it; you don't need to render a pending screen yourself. |
| `onSignOut` | The user **signed out** of an auto/SSO embed. The portal shows its **own signed‑out screen**. | `handle.close()` the embed, run your own logout, or relaunch with a fresh token. |
| `onError(message)` | Sign‑in failed — bad / expired key or token, blocked origin, network. | Show an error + a retry. |
| `onClose` | The embed was dismissed (modal / fullscreen closed). | Restore your own UI. |

### `environment` (set on the **key** in HR, not in `open()`)

| Value | Issues | When to use |
|---|---|---|
| `live` | a `pk_live_…` key (production) — no pill. | Production traffic. |
| `test` | a `pk_test_…` key — drives the **"Test mode"** pill in the embed. | Staging / testing. Sign‑in, permissions and data are identical; the pill is a visual marker only. |

## Environment‑specific URLs

There is **one URL to set: your portal origin** (`baseUrl`). The SDK script is served by the portal at
**`<portal>/embed.js`** — same origin — so the `<script src>` is just `<baseUrl>/embed.js`. Each example
ships a placeholder marked `// 👉 REPLACE`; **paste your own portal origin** (shown in
**Admin → Clients → your org → Embed SDK** tab). There is no baked-in default — set it to whatever you use:

| Env | `baseUrl` (portal origin) | SDK script = `<baseUrl>/embed.js` |
|---|---|---|
| Production | e.g. `https://recognize.applaudiq.com` | `https://recognize.applaudiq.com/embed.js` |
| Local dev | e.g. `http://localhost:3017` | `http://localhost:3017/embed.js` |

> The SDK is loaded as a global `window.ApplaudIQ` via `<script>` (it isn't on npm yet).
> Each TypeScript example bundles its own `applaudiq.d.ts` shim so the global is typed — no shared folder.

## Repository layout

Examples are grouped by SDK **category** so more platforms slot in cleanly:

```
applaudiq-sdk-example/
  README.md                ← you are here
  MINTING.md               ← server-side token mint — universal (web + native)
  web-integration/         ← the web SDK examples (this category)
    html/ vanilla/ react-vite/ vue/ angular/ svelte/ nextjs/
  native-integration/      ← native mobile SDK examples
    ios/                   ← iOS (SwiftUI) — available; Android · React Native · Flutter coming next
```

The server **mint/exchange** flow is the same for every platform, so `MINTING.md` lives at the root.

## Examples (web-integration)

Not sure which to pick? See [Which example?](#which-example). New to the SDK? **Open the `/manual` route
first** — it needs only your publishable key (no server).

| Framework | Folder | Run |
|---|---|---|
| Plain HTML (single file, no build) | [`web-integration/html/`](./web-integration/html/) | `npx serve -l 5181 web-integration/html` |
| Vanilla JS (multi-page) | [`web-integration/vanilla/`](./web-integration/vanilla/) | `npx serve -l 5180 web-integration/vanilla` |
| React (Vite) | [`web-integration/react-vite/`](./web-integration/react-vite/) | `cd web-integration/react-vite && npm i && npm run dev` |
| Vue 3 (Vite) | [`web-integration/vue/`](./web-integration/vue/) | `cd web-integration/vue && npm i && npm run dev` |
| Angular | [`web-integration/angular/`](./web-integration/angular/) | `cd web-integration/angular && npm i && npm start` |
| Svelte (Vite) | [`web-integration/svelte/`](./web-integration/svelte/) | `cd web-integration/svelte && npm i && npm run dev` |
| Next.js (App Router) — **canonical backend-mint reference** | [`web-integration/nextjs/`](./web-integration/nextjs/) | `cd web-integration/nextjs && npm i && npm run dev` |

Every example does the same three things: load the SDK, render a container, call
`ApplaudIQ.init({ key, baseUrl }).open({ mode, token?, render:'inline', container, …callbacks })`.

## Examples (native-integration)

Native mobile apps embed the portal via a **per-platform published SDK** (not the web `<script>`) — see the
[therewardstore org](https://github.com/therewardstore) for the family.

| Platform | Folder | SDK package | Distribution |
|---|---|---|---|
| **iOS** (SwiftUI) | [`native-integration/ios/`](./native-integration/ios/) | [`ApplaudIQEmbed`](https://github.com/therewardstore/applaudiq-embed-ios) | [CocoaPods](./native-integration/ios/cocoapods/) · [SwiftPM](./native-integration/ios/swiftpm/) · [Manual](./native-integration/ios/manual/) — a working example each |
| Android · React Native · Flutter | _coming next_ | `applaudiq-embed-*` | Maven · npm · pub.dev |

See [`native-integration/`](./native-integration/) for the category overview.

## Notes & gotchas

- **Allowed origins** — the embed only loads on origins registered on the key. Add `http://localhost:5173`
  (or your dev port) for local testing.
- **Blank / "refused to connect" frame** — the SDK loads the portal in an `<iframe>` governed by a
  `frame-ancestors` CSP scoped to the **allowed origins registered on the publishable key**. A blank or
  *"refused to connect"* frame almost always means **your origin isn't on that list** — add it.
- **Single‑use token** — mint one `embedToken` per session, just‑in‑time; never cache or reuse it.
- **HTTPS** in production — the embed session cookies require it.
- Handle **`onError`** and **`onAuthPending`** to drive your own UI (new employees wait for HR approval).
- **Auto-login minting** — for **local testing**, each example's own dev server proxies `/api/mint` →
  the gateway and injects your `aiq_embed_…` secret server-side (Vite via `vite.config.ts`, Angular via
  `proxy.conf.js`). **In production your backend mints** the token — the **Next.js** example's
  `app/api/mint/route.ts` is the canonical pattern. It's the **same request**; only the place that holds
  the secret differs. The static examples (vanilla, plain HTML) have no dev proxy, so they always call a
  backend mint endpoint **you** host. See [`MINTING.md`](MINTING.md).

## Security

The `aiq_embed_…` **secret** is server-only — never put it in the browser or commit it. The publishable
key (`pk_…`) is safe in client code. Wherever an example uses the secret it stays **server-side**: the
Vite/Angular examples read it from a gitignored `.env.local` (copied from `.env.example`) and inject it in
their **dev proxy** for local testing only; the **Next.js** example reads `process.env.APPLAUDIQ_SECRET`
in its real backend route (`app/api/mint/route.ts`) — the production pattern. Full guidance and how to
report a vulnerability: **[SECURITY.md](./SECURITY.md)**.

## Support

Questions or help integrating? Email **support@therewardstore.com**. Security reports go to the same
address — see [SECURITY.md](./SECURITY.md).

## License

[MIT](./LICENSE) © ApplaudIQ. Use these examples freely in your own apps.
