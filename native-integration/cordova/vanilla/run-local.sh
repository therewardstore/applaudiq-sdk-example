#!/usr/bin/env bash
# Build + run this Cordova (vanilla TS + Vite) example against the LOCAL portal — on the web, an iOS
# simulator, or an Android emulator.
# Usage:  ./run-local.sh <web|ios|android>
#
# The committed src/config.ts ships PLACEHOLDERS. For local testing, set it to your local values first:
#   BASE_URL = http://localhost:3017,  PUBLISHABLE_KEY = <your local pk_live_…>,  TEST_EMBED_SECRET = <demo>.
#
# Native prereqs (one-time, restored from package.json's "cordova" field):
#   npx cordova prepare        # adds android+ios platforms and the two plugins (SSO scheme aiqexample://)
# The local portal runs on :3017.
set -euo pipefail

PLATFORM="${1:-}"
if [ "$PLATFORM" != "web" ] && [ "$PLATFORM" != "ios" ] && [ "$PLATFORM" != "android" ]; then
  echo "usage: ./run-local.sh <web|ios|android>" >&2
  exit 1
fi

echo "→ Reminder: src/config.ts should hold LOCAL values (BASE_URL=http://localhost:3017, demo key/secret/email)."

# Web: Vite dev server on :4200 (an embed-allowed origin). Non-native — the embed shows reCAPTCHA and the
# web #aiq_sso SSO return is handled in the browser. No Cordova needed.
if [ "$PLATFORM" = "web" ]; then
  echo "→ Serving on http://localhost:4200 (Ctrl-C to stop)."
  exec npm run dev -- --port 4200
fi

# Native (ios | android): web build → inject cordova.js → cordova prepare → run.
echo "→ Building web assets into www/ …"
npm run build

# Cordova provides cordova.js per-platform, but the built index.html needs the <script> reference. We keep
# it OUT of the source index.html (so the plain web `vite build` doesn't try to resolve a missing file) and
# inject it into the built www/index.html here, before `cordova prepare`.
if ! grep -q 'src="cordova.js"' www/index.html; then
  # insert right before the app's module script
  perl -0pi -e 's#(<script type="module")#<script src="cordova.js"></script>\n    $1#' www/index.html
  echo "→ injected <script src=\"cordova.js\"> into www/index.html"
fi

echo "→ Reminder: the platforms + SSO scheme (aiqexample://sso-callback) come from package.json's cordova field."
npx cordova prepare "$PLATFORM"

# Android: tunnel the emulator's localhost:3017 (and :8000 mint) to the host. localhost is a secure context,
# so the embed's session cookie is accepted over local http (10.0.2.2 would not be).
if [ "$PLATFORM" = "android" ]; then
  if command -v adb >/dev/null 2>&1; then
    adb reverse tcp:3017 tcp:3017 && echo "→ adb reverse tcp:3017 set (emulator localhost:3017 → host)"
    adb reverse tcp:8000 tcp:8000 && echo "→ adb reverse tcp:8000 set (mint endpoint → host)"
  else
    echo "→ adb not found — start an emulator and run: adb reverse tcp:3017 tcp:3017" >&2
  fi
fi

# Launch on a booted simulator/emulator.
npx cordova run "$PLATFORM"
