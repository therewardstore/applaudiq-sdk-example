---
title: Login modes — auto vs manual
---

# Login modes: auto vs manual

The Embed SDK can sign your employees into the recognition portal in **two ways**. You choose per call
with the `mode` option on `open({ … })`. Everything else — the publishable key, the container, the
callbacks — is identical.

```js
ApplaudIQ.init({ key: PUBLISHABLE_KEY, baseUrl: BASE_URL }).open({
  mode: 'manual', // 'manual' | 'auto'
  render: 'inline',
  container: '#applaudiq-recognition',
});
```

## Side-by-side

| | **Manual login** | **Auto-login** |
|---|---|---|
| Who signs the user in | The **embed** — Applaud IQ's own email / SSO screen, inside the iframe | **Silently** — your server already knows who the employee is |
| Needs a server | ❌ No | ✅ Yes (a tiny mint endpoint) |
| Needs the **secret** (`aiq_embed_…`) | ❌ No | ✅ Yes — **server-side only** |
| Needs a one-time `token` | ❌ No | ✅ Yes — your server mints it |
| What you pass to `open()` | `{ mode: 'manual' }` | `{ mode: 'auto', token }` |
| Publishable key (`pk_…`) | ✅ Required | ✅ Required |
| Time to first run | Minutes — paste a key and go | A bit more — stand up `/api/mint` |
| Best for | Trying it out; apps with no backend; letting Applaud IQ own auth | Apps that **already** authenticated the employee and want a seamless, no-extra-login experience |

> **Both modes** are gated by HR approval: a brand-new (auto-provisioned) employee can sign in but sees a
> *"waiting for HR approval"* screen — surfaced via the `onAuthPending` callback — until an HR admin
> approves them.

## Which should I use?

- **Start with [Manual login](/guides/manual-login).** It needs only your publishable key — no server, no
  secret — so you can see the portal rendering in your app within minutes.
- **Move to [Auto-login](/guides/auto-login)** when your app has **already** signed the employee in and you
  want them dropped straight into recognition with no second login. This needs a server endpoint that holds
  your secret and mints a one-time token.

You don't have to pick one forever — the same key supports both, and you can switch by changing `mode`.
Every [framework example](/web/vanilla) ships a toggle that flips between the two so you can compare them
live.

## Next

- **[Auto-login guide →](/guides/auto-login)** — the server mint + silent sign-in, step by step.
- **[Manual login guide →](/guides/manual-login)** — publishable key only, no server.
- **[Minting on your server →](/MINTING)** — the exact mint request/response and a Node example.
