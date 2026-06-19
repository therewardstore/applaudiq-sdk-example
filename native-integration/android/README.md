# Applaud IQ — Android embed example

A runnable Android app showing **both login modes** (and SSO) with the
[`com.applaudiq:embed`](https://github.com/therewardstore/applaudiq-embed-android) SDK, in **both Kotlin
and Java**:

- **Kotlin** — `MainActivity.kt` (the `ApplaudIQEmbed.Config` API with lambda callbacks).
- **Java** — `MainActivityJava.java` (the `AIQEmbed.open` facade with an `AIQEmbed.Listener`) — open it
  with the **"Open Java example"** button on the home screen.
- **Manual login** — no server, no secret, no token: just the publishable key.
- **Auto-login** — your backend mints a one-time token (`MintClient.kt`), then silent sign-in.
- **SSO** — the SDK opens Chrome Custom Tabs; the result returns on this app's **own** callback scheme
  (`aiqexample://sso-callback`, set in `app/build.gradle`). On success the code is exchanged in the WebView;
  on failure it fires `onError` and reloads the login. The browser tab never lingers in recents.
- **Back navigation** — `Config.backNavigation` (default `true`): the hardware **Back** button steps back through
  the embed's WebView history, closing only at the root. Pass `backNavigation = false` to make Back close the embed
  immediately.

## Run it

1. **Configure** `app/src/main/java/com/applaudiq/example/Config.kt`:
   - `PUBLISHABLE_KEY` — your `pk_live_…` from HR portal → Settings → Embed SDK Keys.
   - `BASE_URL` — your portal origin. From an **emulator**, the local stack is `http://10.0.2.2:3017`
     (`10.0.2.2` is the host loopback as seen from the emulator; a dev `network_security_config` already allows
     cleartext to `10.0.2.2`/`localhost`).
     - **Prefer `localhost` (like iOS)?** The emulator's own `localhost` isn't your host, so first open a tunnel:
       `adb reverse tcp:3017 tcp:3017` (and `adb reverse tcp:4000 tcp:4000` for the mint endpoint) — or just run
       [`./adb-reverse.sh`](./adb-reverse.sh) — then you can set `BASE_URL = "http://localhost:3017"`. `10.0.2.2`
       needs no setup; `localhost` needs the reverse tunnel (re-run it after an emulator cold boot).
2. **SSO callback scheme** — this app registers its **own** callback scheme in `app/build.gradle` so it never
   collides with another Applaud IQ app on the device (which would pop an Android "Open with" chooser). Pick a
   scheme unique to your app:
   ```groovy
   // app/build.gradle → android { defaultConfig { … } }
   manifestPlaceholders = [aiqSsoScheme: 'aiqexample', aiqSsoHost: 'sso-callback']
   ```
   The SDK auto-registers the deep-link intent-filter from these and sends them to the backend as
   `native_redirect`, so the SSO callback (success **and** failure) returns to exactly this app.
3. **Open** `native-integration/android/` in Android Studio (or use the Gradle wrapper) and **Run** on an
   emulator/device. **Manual login works immediately** — no backend.
4. **Auto-login:** point `MINT_ENDPOINT` at your server's mint route (see `../../MINTING.md`), or for a quick
   local try set `TEST_EMBED_SECRET` (⚠️ dev-only — the `aiq_embed_` secret must never ship in a real app).

## How it consumes the SDK

This example uses a **Gradle composite build** so it builds against the **local SDK source** next door — no
publish required. See `settings.gradle`:

```groovy
includeBuild('../../../applaudiq-embed-android')   // resolves com.applaudiq:embed from local source
```

To consume the **published** SDK instead (Maven Central / JitPack), remove that `includeBuild` line and switch
the dependency in `app/build.gradle`:

```groovy
// Maven Central:
implementation 'com.applaudiq:embed:1.0.0'
// or JitPack (add `maven { url 'https://jitpack.io' }` in settings.gradle):
implementation 'com.github.therewardstore:applaudiq-embed-android:1.0.0'
```

## CLI

```bash
JAVA_HOME=<jdk17> ANDROID_HOME=<android-sdk> ./gradlew :app:assembleDebug
# install on a running emulator/device:
adb install -r app/build/outputs/apk/debug/app-debug.apk
```
