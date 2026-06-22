# Native integration — ApplaudIQ embed SDKs

Embed the **Applaud IQ** recognition portal inside a native mobile app. Each native SDK hosts the portal's
`/embed` page in a platform web view and handles the token bridge + SSO, so you present one screen and the
employee is signed in — auto-login (silent, with a server-minted token) or manual login (the portal's own
login inside the embed).

Unlike the web SDK (one `<script>` + `window.ApplaudIQ`), each native platform ships its **own published
package** in its own repo (SwiftPM/CocoaPods for iOS, Maven for Android, etc.) — see the
[therewardstore org](https://github.com/therewardstore) for the family.

## Examples

| Platform | Folder | SDK package | Distribution |
|---|---|---|---|
| **iOS** (SwiftUI) | [`ios/`](./ios/) | [`ApplaudIQEmbed`](https://github.com/therewardstore/applaudiq-embed-ios) | [CocoaPods](./ios/cocoapods/) · [SwiftPM](./ios/swiftpm/) · [Manual](./ios/manual/) — a working example each |
| **Android** (Kotlin) | [`android/`](./android/) | [`applaudiq-embed-android`](https://github.com/therewardstore/applaudiq-embed-android) | [Maven Central](https://central.sonatype.com/artifact/com.applaudiq/embed) (`com.applaudiq:embed`) |
| **React Native** | [`react-native-cli/`](./react-native-cli/) · [`react-native-expo/`](./react-native-expo/) | [`@applaudiq/embed-react-native`](https://www.npmjs.com/package/@applaudiq/embed-react-native) ([source](https://github.com/therewardstore/applaudiq-embed-react-native)) | [npm](https://www.npmjs.com/package/@applaudiq/embed-react-native) — a bare-RN **and** an Expo example |
| **Flutter** | [`flutter/`](./flutter/) | [`applaudiq_embed`](https://pub.dev/packages/applaudiq_embed) ([source](https://github.com/therewardstore/applaudiq-embed-flutter)) | [pub.dev](https://pub.dev/packages/applaudiq_embed) — one app, Android **and** iOS |

> **Capacitor / Cordova / Ionic** reuse the **web** SDK inside their web view — see
> [`web-integration/`](../web-integration/), no separate native package needed.

## The flow (same as web)

1. **Get a publishable key** (`pk_…`) from **HR portal → Settings → Embed SDK Keys** — needed in **both** modes.
2. **Present the embed** — the SDK gives you a view/controller that loads the portal.
3. **Sign-in** — *auto*: your **server** mints a one-time token (the `aiq_embed_…` secret stays on your
   server, never in the app), the SDK signs in silently; *manual*: the embed shows the portal's own login.
4. **Callbacks** — `onReady` / `onAuthPending` (awaiting HR approval) / `onError` / `onClose` drive your UI.

→ Full step-by-step + diagram: **[root README → How it works](../README.md#how-it-works-the-flow)**.

> **Native vs web token:** native SDKs take a **pre-fetched `token`** you already minted, rather than the web
> SDK's `getToken` fetcher. The mint contract is identical — see [`MINTING.md`](../MINTING.md).

---

Author: Arulraj V &lt;arulraj@example.com&gt;
