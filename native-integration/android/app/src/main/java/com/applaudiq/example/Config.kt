package com.applaudiq.example

/**
 * Configuration for the example. The publishable key + base URL are needed in BOTH login modes.
 */
object Config {
    // 👉 REPLACE with your publishable key — HR portal → Settings → Embed SDK Keys (pk_live_…).
    //    Safe to ship in the app; required in both login modes.
    const val PUBLISHABLE_KEY = "pk_live_xxxxxxxxxxxxxxxxxxxxxxxx"

    // 👉 REPLACE with your portal origin — shown in Admin → Clients → your org → Embed SDK.
    //    Production default below. From an EMULATOR, the local portal is "http://10.0.2.2:3017"
    //    (10.0.2.2 = the host's localhost); a dev network-security-config already allows cleartext there.
    const val BASE_URL = "https://recognize.applaudiq.com"

    // 👉 REPLACE (auto-login only) with YOUR backend's mint endpoint — see MintClient.kt and ../../MINTING.md.
    //    Manual login needs none of this. The aiq_embed_ SECRET must never live in the app; it stays on
    //    your mint server. This is the PRODUCTION path.
    const val MINT_ENDPOINT = "http://10.0.2.2:4000/api/mint"

    // The employee the in-app test mint signs in. Auto-provisioned on first sign-in; a brand-new one
    // lands on "pending HR approval".
    const val DEMO_EMAIL = "arulraj@example.com"

    // ⚠️ DEMO/TEST ONLY. When set, the app mints the one-time token ITSELF (MintClient) so auto-login
    //    runs with NO backend — exactly like the web examples' dev proxy. In PRODUCTION your BACKEND
    //    mints it (the aiq_embed_ SECRET must NEVER ship in an app — anyone can extract it from an APK).
    //    Leave empty (default) → the app uses the hosted MINT_ENDPOINT above (the production pattern).
    //    For a quick local auto-login test, paste an "aiq_embed_…" secret here — but NEVER commit a real one.
    const val TEST_EMBED_SECRET = ""
}
