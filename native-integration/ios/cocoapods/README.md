# iOS example — CocoaPods

Installs [`ApplaudIQEmbed`](https://cocoapods.org/pods/ApplaudIQEmbed) via **CocoaPods** (the `Podfile` here).
App code is in [`../Shared/`](../Shared/) (shared by all variants).

## Run it (4 steps)

**0. One-time:** install CocoaPods if you don't have it — `sudo gem install cocoapods` (or `brew install cocoapods`).

**1. Install the pod**

```bash
cd native-integration/ios/cocoapods
pod install
```

**2. Open the workspace** *(the `.xcworkspace`, NOT the `.xcodeproj`)*

```bash
open ApplaudIQiOSExample.xcworkspace
```

**3. Set your key** — in [`../Shared/Config.swift`](../Shared/Config.swift), replace `PUBLISHABLE_KEY` (your
`pk_…`) and `BASE_URL` (your portal origin). *Manual login needs nothing else.*

**4. Run** — pick any iOS Simulator and press **▶︎** (⌘R). Tap **Manual login** or **Auto-login**.

> **`Unable to find a specification for 'ApplaudIQEmbed'`?** Run `pod install --repo-update` — a just-published
> pod can take a little while to reach the CocoaPods CDN.

## Usage, auto-login & minting

Config, manual vs auto-login, the in-app test mint vs your backend, and callbacks are the same for all
variants — see the **[iOS example index](../README.md)**.
