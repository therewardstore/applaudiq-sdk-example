# Get your keys

This page is for **HR admins and platform admins** — no code. It explains how to turn on the Embed SDK
for your organization and hand the right values to your developers.

## Who does what

| Role | What they do | Where |
|------|--------------|-------|
| **Platform admin** | Enable Embed SDK for the client and choose the allowed login mode(s). | Admin panel → Clients → *your org* → **Embed SDK** tab |
| **HR admin** | Generate the per-org key (secret + publishable) and add the partner's allowed origins. | HR portal → Settings → **Embed SDK Keys** |
| **Developer** | Paste the keys into the example, mint a token on the server (auto-login only). | Your app |

## Steps

1. **Platform admin — enable it.** In **Admin → Clients → your org → Embed SDK**, turn on
   *Enable Embed SDK* and pick the login modes:
   - **Manual login** — needs no key; employees sign in inside the embed.
   - **Auto-login** — silent sign-in; needs the key below (turn this on to let HR generate it).

2. **HR admin — generate the key.** In **HR portal → Settings → Embed SDK Keys**, click **Generate key**.
   You get two values:
   - **Secret** (`aiq_embed_…`) — **shown once**. Hand it to your developer to store on the **server**
     (env var / secret manager). It mints tokens. **Never** put it in browser code.
   - **Publishable key** (`pk_live_…` / `pk_test_…`) — always visible & copyable. Safe in the browser;
     the developer pastes it into `init({ key })`.

3. **HR admin — add allowed origins.** Add every site origin the embed will load on, e.g.
   `https://intranet.yourco.com` and your dev origin (`http://localhost:5173`, etc.). The embed **only**
   loads on these.

4. **Pick the environment.** A key is **Live** (`pk_live_…`) or **Test** (`pk_test_…`). Test sessions show
   a *"Test mode"* pill in the embed so they're never mistaken for production. You can keep one of each.

## What your developer needs

- The **publishable key** (`pk_…`) → goes in the client code (`BASE_URL` + `PUBLISHABLE_KEY`).
- The **portal origin** (`baseUrl`) → shown in the admin **Embed SDK** tab (e.g.
  `https://recognize.applaudiq.com`). The SDK script is `<baseUrl>/embed.js`.
- For **auto-login only**: the **secret** (`aiq_embed_…`) → server-side, for [minting](/MINTING).

## HR-approval gate

A brand-new (auto-provisioned) employee can sign in but sees **no data** until an HR admin approves them —
the embed shows a *"waiting for HR approval"* screen until then. This applies to both login modes.

Next: **[Minting on your server](/MINTING)** (for auto-login) or jump straight to your
[framework guide](/web/vanilla).
