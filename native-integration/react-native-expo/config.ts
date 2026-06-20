/** Example configuration. The publishable key + base URL are needed in BOTH login modes. */
export const Config = {
  // 👉 REPLACE with your publishable key — HR portal → Settings → Embed SDK Keys (pk_live_…).
  //    Safe to ship in the app; required in both login modes.
  PUBLISHABLE_KEY: 'pk_live_xxxxxxxxxxxxxxxxxxxxxxxx',

  // 👉 REPLACE with your portal origin — shown in Admin → Clients → your org → Embed SDK.
  BASE_URL: 'https://recognize.applaudiq.com',

  // The SSO callback deep link. MUST match `"scheme"` in app.json (`aiqrnexpo`). Expo registers this
  // scheme on both iOS + Android at prebuild, so the SSO callback returns to this app.
  SSO_CALLBACK: 'aiqrnexpo://sso-callback',

  // 👉 REPLACE (auto-login only) with YOUR backend's mint endpoint. Manual login needs none of this.
  //    The aiq_embed_ SECRET must never live in the app; it stays on your mint server.
  MINT_ENDPOINT: 'http://localhost:4000/api/mint',

  // The employee the in-app test mint signs in. Auto-provisioned on first sign-in.
  DEMO_EMAIL: 'arulraj@example.com',

  // ⚠️ DEMO/TEST ONLY. When set, the app mints the one-time token ITSELF so auto-login runs with NO backend.
  //    In PRODUCTION your BACKEND mints it (the aiq_embed_ secret must NEVER ship in an app). Leave empty.
  TEST_EMBED_SECRET: '',
};
