# iOS example — Swift Package Manager

Installs [`ApplaudIQEmbed`](https://github.com/therewardstore/applaudiq-embed-ios) via **SwiftPM**.
**Easiest method — no extra tools.** App code is in [`../Shared/`](../Shared/) (shared by all variants).

## Run it (3 steps)

**1. Open the project**

```bash
cd native-integration/ios/swiftpm
open ApplaudIQiOSExample.xcodeproj
```

Xcode automatically downloads the SDK package (`ApplaudIQEmbed`, `from: 1.1.1`) — wait for
*"Package Graph Resolved"* in the toolbar the first time.

**2. Set your key** — in [`../Shared/Config.swift`](../Shared/Config.swift), replace `PUBLISHABLE_KEY` (your
`pk_…` from HR portal → Settings → Embed SDK Keys) and `BASE_URL` (your portal origin). *Manual login needs
nothing else.*

**3. Run** — pick any iOS Simulator at the top of Xcode and press **▶︎** (or ⌘R). Tap **Manual login** or
**Auto-login**.

## Add SwiftPM to your own app

*File → Add Package Dependencies…* → paste
`https://github.com/therewardstore/applaudiq-embed-ios.git` → **Add Package**.

## Usage, auto-login & minting

Config, manual vs auto-login, the in-app test mint vs your backend, and callbacks are the same for all
variants — see the **[iOS example index](../README.md)**.
