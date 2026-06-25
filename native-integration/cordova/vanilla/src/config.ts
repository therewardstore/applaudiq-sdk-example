// Configuration for the example. The publishable key + base URL are needed in BOTH login modes.

// 👉 REPLACE with your publishable key — HR portal → Settings → Embed SDK Keys (pk_live_…).
export const PUBLISHABLE_KEY = 'pk_live_xxxxxxxxxxxxxxxxxxxxxxxx';

// 👉 REPLACE with your portal origin (Admin → Clients → your org → Embed SDK).
export const BASE_URL = 'https://recognize.applaudiq.com';

// THIS app's SSO callback deep link (scheme://host). Declared in config.xml via
// cordova-plugin-customurlscheme (URL_SCHEME) — see the README. The SDK sends it as `native_redirect`.
export const SSO_CALLBACK = 'aiqexample://sso-callback';

// 👉 Auto-login only — YOUR backend's mint endpoint (holds the aiq_embed_ SECRET; never ship it in the app).
export const MINT_ENDPOINT = 'http://localhost:4000/api/mint';

// The employee the in-app test mint signs in (auto-provisioned on first sign-in).
export const DEMO_EMAIL = 'arulraj@example.com';

// ⚠️ DEMO/TEST ONLY — when set, the app mints the token ITSELF (no backend). The aiq_embed_ secret must
// NEVER ship in a real app. Empty (default) → uses the hosted MINT_ENDPOINT above (the production path).
export const TEST_EMBED_SECRET = '';
