/** Example configuration. The publishable key + base URL are needed in BOTH login modes. */
export const Config = {
  // 👉 REPLACE with your publishable key — HR portal → Settings → Embed SDK Keys (pk_live_…).
  PUBLISHABLE_KEY: 'pk_live_xxxxxxxxxxxxxxxxxxxxxxxx',

  // 👉 REPLACE with your portal origin — shown in Admin → Clients → your org → Embed SDK.
  BASE_URL: 'https://recognize.applaudiq.com',

  // The SSO callback deep link. MUST match the scheme you register natively (iOS Info.plist
  // CFBundleURLSchemes + Android AndroidManifest intent-filter — see README step 2).
  SSO_CALLBACK: 'aiqrncli://sso-callback',

  // 👉 REPLACE (auto-login only) with YOUR backend's mint endpoint. Manual login needs none of this.
  //    The aiq_embed_ SECRET must never live in the app; it stays on your mint server.
  MINT_ENDPOINT: 'http://localhost:4000/api/mint',

  // The employee the in-app test mint signs in. Auto-provisioned on first sign-in.
  DEMO_EMAIL: 'arulraj@example.com',

  // ⚠️ DEMO/TEST ONLY. When set, the app mints the one-time token ITSELF so auto-login runs with NO backend.
  //    In PRODUCTION your BACKEND mints it (the aiq_embed_ secret must NEVER ship in an app). Leave empty.
  TEST_EMBED_SECRET: '',
};
