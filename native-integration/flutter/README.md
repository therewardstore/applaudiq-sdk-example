# Applaud IQ — Flutter embed example

A runnable **Flutter** app (Android **and** iOS) showing **manual + auto login and SSO** with the
[`applaudiq_embed`](https://pub.dev/packages/applaudiq_embed) SDK.

## What you'll see

- **Manual login** — the portal's own email/SSO login renders inside the embed. No server, no token.
- **Auto-login** — your backend mints a one-time token (`mint_client.dart`); the embed signs in silently.
- **SSO** — the SDK opens the system browser; the result returns on this app's `aiqflutter://sso-callback`
  deep link. On success the code is exchanged in the WebView; on failure it fires `onError` and reloads login.

## 1. Setup + install

```sh
cd flutter
flutter pub get                 # pulls the SDK (local path pre-publish) + http
cd ios && pod install && cd ..  # iOS only
```

> `pubspec.yaml` consumes the published package `applaudiq_embed: ^1.1.0` from
> [pub.dev](https://pub.dev/packages/applaudiq_embed). For local SDK development, override it with a path
> dependency (`applaudiq_embed: { path: <your local checkout of applaudiq-embed-flutter> }`).

## 2. Register your SSO callback scheme (the key step)

Pick a scheme **unique to your app** and register it natively. It must match `Config.ssoCallback`
(`aiqflutter://sso-callback`). The SDK sends it to the backend as `native_redirect`, so the callback
returns to exactly this app.

**iOS** — `ios/Runner/Info.plist` `CFBundleURLTypes` → `aiqflutter` (already set in this example).

**Android** — `android/app/src/main/AndroidManifest.xml` registers the `flutter_web_auth_2`
`CallbackActivity` with `<data android:scheme="aiqflutter" />` (already set).

## 3. Configure + run

1. Edit `lib/config.dart` — your `publishableKey` and `baseUrl`. From an emulator the local portal is
   `http://10.0.2.2:3017` (Android) / `http://localhost:3017` (iOS sim). Auto-login: point `mintEndpoint`
   at your mint server, or set `testEmbedSecret` for a quick local test (never ship a real secret).
2. `flutter run` (on a booted Android emulator or iOS simulator).
3. Tap **Manual login** (works immediately) or **Auto-login**, then **Continue with Google/Microsoft** for SSO.

## Files

- `lib/main.dart` — Manual/Auto buttons → full-screen `ApplaudIQEmbed`; status from callbacks.
- `lib/config.dart` — key / base URL / SSO scheme / mint endpoint (`👉 REPLACE`).
- `lib/mint_client.dart` — `getEmbedToken()` for auto-login.
- `android/.../AndroidManifest.xml` — the `flutter_web_auth_2` CallbackActivity (SSO deep link) + a
  dev cleartext config for localhost.
- `ios/Runner/Info.plist` — the `CFBundleURLTypes` scheme + a dev ATS localhost exception.
- `assets/app_icon.png` — the Applaud IQ brand logo used as the app launcher icon. Regenerate the
  Android mipmaps + iOS `AppIcon` set after changing it: `dart run flutter_launcher_icons`.

## Troubleshooting

- **SSO returns but nothing happens** — the native scheme (step 2) must equal `Config.ssoCallback`.
- **`baseUrl` rejected / blank screen** — the SDK only loads HTTPS (or localhost in a debug build); set a
  reachable `baseUrl`.
- **Android can't reach the portal** — from the emulator, use `http://10.0.2.2:3017` (host's localhost).
