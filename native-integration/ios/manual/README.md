# iOS example — Manual (no package manager)

Integrates [`ApplaudIQEmbed`](https://github.com/therewardstore/applaudiq-embed-ios) **without** any package
manager: the SDK source is vendored in [`Vendor/ApplaudIQEmbed/`](./Vendor/ApplaudIQEmbed/) and built as an
embedded framework in the project, so the app still does `import ApplaudIQEmbed`. App code is in
[`../Shared/`](../Shared/) (shared by all variants).

## Run it (3 steps)

**1. Open the project**

```bash
cd native-integration/ios/manual
open ApplaudIQiOSExample.xcodeproj
```

No `pod install`, no package download — the SDK source is already in `Vendor/`.

**2. Set your key** — in [`../Shared/Config.swift`](../Shared/Config.swift), replace `PUBLISHABLE_KEY` (your
`pk_…`) and `BASE_URL` (your portal origin). *Manual login needs nothing else.*

**3. Run** — pick any iOS Simulator and press **▶︎** (⌘R). Tap **Manual login** or **Auto-login**.

## How the SDK gets in (and other manual styles)

This variant builds the vendored source as a **framework target** (keeps a clean `import ApplaudIQEmbed`).
Alternatively, drop `Vendor/ApplaudIQEmbed/*.swift` straight into your **app** target — then they're part of
your module, so remove the `import ApplaudIQEmbed` lines. Or embed a prebuilt `ApplaudIQEmbed.xcframework`.
Prefer **SwiftPM** or **CocoaPods** (the sibling variants) unless you specifically need a vendored copy.

> 🔄 **Keep it in sync.** `Vendor/ApplaudIQEmbed/` is a **copy** of the SDK at **v1.0.5** — it won't update
> itself. On a version bump, re-copy from the SDK repo:
> `git -C applaudiq-embed-ios show 1.0.5:Sources/ApplaudIQEmbed/ApplaudIQEmbed.swift`.

## Usage, auto-login & minting

Config, manual vs auto-login, the in-app test mint vs your backend, and callbacks are the same for all
variants — see the **[iOS example index](../README.md)**.
