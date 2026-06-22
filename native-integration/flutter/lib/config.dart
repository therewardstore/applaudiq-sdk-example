/// Example configuration. The publishable key + base URL are needed in BOTH login modes.
class Config {
  // 👉 REPLACE with your publishable key — HR portal → Settings → Embed SDK Keys (pk_live_…).
  static const String publishableKey = 'pk_live_xxxxxxxxxxxxxxxxxxxxxxxx';

  // 👉 REPLACE with your portal origin — shown in Admin → Clients → your org → Embed SDK.
  static const String baseUrl = 'https://recognize.applaudiq.com';

  // The SSO callback deep link. MUST match the scheme registered natively (iOS Info.plist
  // CFBundleURLTypes + Android flutter_web_auth_2 CallbackActivity — see README step 2).
  static const String ssoCallback = 'aiqflutter://sso-callback';

  // 👉 REPLACE (auto-login only) with YOUR backend's mint endpoint. Manual login needs none of this.
  //    The aiq_embed_ SECRET must never live in the app; it stays on your mint server.
  static const String mintEndpoint = 'http://localhost:4000/api/mint';

  // The employee the in-app test mint signs in. Auto-provisioned on first sign-in.
  static const String demoEmail = 'arulraj@example.com';

  // ⚠️ DEMO/TEST ONLY. When set, the app mints the one-time token ITSELF so auto-login runs with NO
  //    backend. In PRODUCTION your BACKEND mints it (the aiq_embed_ secret must NEVER ship). Leave empty.
  static const String testEmbedSecret = '';
}
