# iOS — ApplaudIQ embed SDK example

Embed the Applaud IQ recognition portal in a native **iOS** app (SwiftUI). Uses the published
[`ApplaudIQEmbed`](https://github.com/therewardstore/applaudiq-embed-ios) SDK, which hosts `<baseUrl>/embed`
in a `WKWebView` and handles the token bridge + SSO.

The SDK ships **three ways to install** — this folder has a **working example for each**. They all share the
same app code in [`Shared/`](./Shared/); only the SDK-integration differs, so pick whichever matches your app.

## Choose your install method

| Method | Example | Steps | Best when |
|---|---|---|---|
| **Swift Package Manager** | [`swiftpm/`](./swiftpm/) | open `.xcodeproj` → Run | Default. No extra tooling — Xcode resolves the package. |
| **CocoaPods** | [`cocoapods/`](./cocoapods/) | `pod install` → open `.xcworkspace` → Run | Your app already uses CocoaPods. |
| **Manual** | [`manual/`](./manual/) | open `.xcodeproj` → Run | No package manager — the SDK source is vendored + built in-project. |

> Each subfolder's README has just its install + run steps. **Usage below is the same for all three.**

## What you'll see

A SwiftUI screen with two buttons + a status line:

- **Manual login** — the embed shows Applaud IQ's own login (email / SSO). No server, no secret — just your
  publishable `pk_…` key.
- **Auto-login** — a one-time token signs the employee in **silently**. For a quick local try the app can mint
  that token itself (DEMO/TEST only); in production your **backend** mints it.

> New here? Compare [auto vs manual](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/docs/guides/login-modes.md),
> then follow the [Auto-login](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/docs/guides/auto-login.md)
> or [Manual login](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/docs/guides/manual-login.md) guide.

## How it works (shared by all variants)

App code lives in [`Shared/`](./Shared/):

1. **Config** — [`Shared/Config.swift`](./Shared/Config.swift) holds your `PUBLISHABLE_KEY` + `BASE_URL` (and
   the mint settings).
2. **Open** — [`Shared/EmbedView.swift`](./Shared/EmbedView.swift) calls
   `ApplaudIQEmbed.makeViewController(config:options:)` and forwards `onReady`/`onAuthPending`/`onError`/`onClose`
   to the status line.
3. **Buttons** — [`Shared/ContentView.swift`](./Shared/ContentView.swift) presents the embed full-screen for
   Manual (no token) or Auto (after `MintClient` produces a token).
4. **SSO** — opens in the system browser via `ASWebAuthenticationSession`, returns through the `applaudiq://`
   scheme (registered in [`Shared/Info.plist`](./Shared/Info.plist)).

## 1. Configure

In [`Shared/Config.swift`](./Shared/Config.swift), edit the `// 👉 REPLACE` lines: `PUBLISHABLE_KEY` (your
`pk_…`) and `BASE_URL` (your portal origin). That's **all** manual login needs — no server, no secret, no token.

## 2. Manual login (no server)

The **Manual login** button presents the embed with `mode: .manual` (no token):

```swift
// Swift
ApplaudIQEmbed.makeViewController(
  config: .init(key: PUBLISHABLE_KEY, baseURL: BASE_URL),
  options: .init(mode: .manual)
)
```
```objc
// Objective-C
AIQEmbedOptions *o = [AIQEmbedOptions optionsWithMode:AIQEmbedModeManual token:nil];
UIViewController *vc = [AIQEmbed makeViewControllerWithKey:PUBLISHABLE_KEY baseURL:nil options:o];
```

**What you'll see:** Applaud IQ's own email / SSO login inside the embed; after signing in, the feed.

## 3. Auto-login (a one-time token)

Auto-login signs the employee in **silently** with a one-time token. `MintClient.getEmbedToken()`
([`Shared/MintClient.swift`](./Shared/MintClient.swift)) produces it, then:

```swift
// Swift
var options = ApplaudIQEmbed.Options(mode: .auto, token: embedToken)
options.onReady = { /* signed in */ }
ApplaudIQEmbed.makeViewController(config: .init(key: PUBLISHABLE_KEY, baseURL: BASE_URL), options: options)
```

**Where the token comes from — two paths:**

- **✅ Production — your backend mints it.** Point `MINT_ENDPOINT` (`Shared/Config.swift`) at a **backend mint
  endpoint you host**; it holds the `aiq_embed_…` secret and calls `POST /api/v1/embed/sessions` server-side.
  The canonical route ships in the
  [nextjs example](https://github.com/therewardstore/applaudiq-sdk-example/tree/master/web-integration/nextjs)
  (`app/api/mint/route.ts`). **The secret never touches the app.**

- **⚠️ Quick test, no backend.** Set `TEST_EMBED_SECRET` (`Shared/Config.swift`) and the app mints the token
  **itself** — the iOS analog of the web examples' dev proxy. Either set the Xcode scheme env var
  `APPLAUDIQ_SECRET = aiq_embed_…` (*Product → Scheme → Edit Scheme… → Run → Arguments → Environment
  Variables*; stays out of git), or paste it inline into `TEST_EMBED_SECRET`.

  > 🔒 **TEST ONLY.** A secret shipped in an app can be extracted from the binary. Never ship one — keep
  > `TEST_EMBED_SECRET` empty for anything real and let your **backend** mint (`MINT_ENDPOINT`).

> The native SDK takes a **pre-fetched `token`** (unlike the web SDK's `getToken` fetcher). See
> [MINTING.md](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/MINTING.md) for the mint contract.

## 4. Callbacks & HR approval

`onReady` (signed in & shown) · `onAuthPending` (signed in, awaiting HR approval — a brand-new employee shows a
"waiting for HR approval" status) · `onError(message)` (bad/expired key or token) · `onClose` (dismissed).

## Verify

- ✅ The recognition feed loads, signed in (after the portal login for manual / silently for auto).
- ⏳ A brand-new employee shows a "waiting for HR approval" status until an HR admin approves them.
- ❌ A wrong/expired key or token shows a clear error in the status line — never a blank screen.

> **Local portal over http?** Set `BASE_URL` to e.g. `http://localhost:3017` and add an
> `NSAppTransportSecurity` → `NSAllowsLocalNetworking = YES` exception to `Shared/Info.plist` (iOS blocks plain
> `http` by default). Skip for prod HTTPS.

→ What each option (`mode`, callbacks) means: **[SDK options reference](https://github.com/therewardstore/applaudiq-sdk-example/blob/master/README.md#sdk-options-reference)**.

---

Author: Arulraj V &lt;arulraj@example.com&gt;
