import Foundation

// Configuration for the example. The publishable key + base URL are needed in BOTH login modes.
//
// 👉 REPLACE with your publishable key — HR portal → Settings → Embed SDK Keys
//    (pk_live_…). Safe to ship in the app; required in both login modes.
let PUBLISHABLE_KEY = "pk_live_xxxxxxxxxxxxxxxxxxxxxxxx"

// 👉 REPLACE with your portal origin — shown in Admin → Clients → your org → Embed SDK.
//    Production default below. For a LOCAL portal over http, see the ATS note in the README.
let BASE_URL = URL(string: "https://recognize.applaudiq.com")!

// THIS app's SSO callback deep link (scheme://host). SSO opens in ASWebAuthenticationSession and the
// backend hands the one-time code back to THIS scheme (the SDK sends it as `native_redirect`), so each
// app uses its own scheme — not the brand-wide `applaudiq://`. Must match the scheme registered in
// Info.plist (CFBundleURLSchemes). The default is applaudiq://sso-callback if you omit it.
let SSO_CALLBACK = "aiqexample://sso-callback"

// 👉 REPLACE (auto-login only) with YOUR backend's mint endpoint — see MintClient.swift and
//    ../../MINTING.md. Manual login needs none of this. The aiq_embed_ SECRET must never live
//    in the app; it stays on your mint server. This is the PRODUCTION path.
let MINT_ENDPOINT = URL(string: "http://localhost:4000/api/mint")!

// The employee the in-app test mint signs in (mirrors the web examples' config.DEMO_EMAIL).
// Auto-provisioned on first sign-in; a brand-new one lands on "pending HR approval".
let DEMO_EMAIL = "arulraj@example.com"

// ⚠️ DEMO/TEST ONLY. When set, the app mints the one-time token ITSELF (MintClient) so auto-login
//    runs with NO backend — exactly like the web examples' dev proxy. In PRODUCTION your BACKEND
//    mints it (the aiq_embed_ SECRET must NEVER ship in an app — anyone can extract it from a
//    binary). Two ways to set it for a local test, easiest last:
//      1) Xcode scheme env var APPLAUDIQ_SECRET — stays out of git, OR
//      2) paste "aiq_embed_…" inline below for a quick test — but NEVER commit a real secret.
//    Empty (the default) → the app uses the hosted MINT_ENDPOINT above (the production pattern).
let TEST_EMBED_SECRET = ProcessInfo.processInfo.environment["APPLAUDIQ_SECRET"] ?? ""
