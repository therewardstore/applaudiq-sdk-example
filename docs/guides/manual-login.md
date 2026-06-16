---
title: Manual login
---

# Manual login (the embed handles sign-in)

Manual login lets **Applaud IQ** handle authentication — the embed shows its own email / SSO login screen
**inside the iframe**. There's **no server, no secret, and no token** — just your publishable key. It's the
fastest way to see the portal running in your app.

> Deciding between modes? See **[auto vs manual](/guides/login-modes)**. Want silent sign-in instead? See
> **[Auto-login](/guides/auto-login)**.

## Prerequisites

- A **publishable key** (`pk_live_…` / `pk_test_…`) and the **portal origin** (`baseUrl`) — from the admin
  **Embed SDK** tab. See [Get your keys](/get-keys).
- Your app's origin registered in the key's **allowed origins** (incl. your dev origin, e.g.
  `http://localhost:5173`).

That's it — no secret, no backend.

## Step 1 — Open the embed in manual mode

```js
ApplaudIQ.init({ key: PUBLISHABLE_KEY, baseUrl: BASE_URL }).open({
  mode: 'manual', // the embed shows its own login — no token needed
  render: 'inline',
  container: '#applaudiq-recognition',
  onReady: () => console.log('signed in ✓'),
  onError: (e) => console.error('embed error:', e.message),
});
```

Omit `token` entirely — it's an auto-mode-only option.

## What you'll see

- The embed renders Applaud IQ's **login screen** (email / SSO) inside your container.
- After the employee signs in, the recognition feed appears and `onReady` fires.
- The session stays inside the iframe — your app never handles credentials.

## When to use it

- You're **trying the SDK** and want it working in minutes.
- Your app has **no backend**, or you'd rather not mint tokens.
- You're happy for Applaud IQ to **own the login** experience.

When your app already authenticates the employee and you want them dropped straight in with no second
login, switch to **[Auto-login](/guides/auto-login)** — same key, just add a server mint and pass a `token`.

## Troubleshooting

- **Embed won't load / blank** — your origin isn't in the key's allowed origins. Add it (incl. dev).
- **Wrong environment** — a `pk_test_…` key shows a *"Test mode"* pill; `pk_live_…` does not. Make sure
  you're using the key you intend.
- **`onError` fires** — usually a bad publishable key or `baseUrl`. Double-check both against the admin
  **Embed SDK** tab.

## Next

- **[Auto-login](/guides/auto-login)** — silent sign-in for already-authenticated employees.
- **[Pick your framework](/web/vanilla)** — copy-paste examples for Vanilla, React, Vue, Angular, Svelte,
  and Next.js.
