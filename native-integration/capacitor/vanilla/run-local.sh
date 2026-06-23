#!/usr/bin/env bash
# Build + run this Capacitor + React (Vite) example against the LOCAL portal — on the web, an iOS
# simulator, or an Android emulator.
# Usage:  ./run-local.sh <web|ios|android>
#
# The committed src/config.ts ships PLACEHOLDERS. For local testing, set it to your local values first:
#   BASE_URL = http://localhost:3017,  PUBLISHABLE_KEY = <your local pk_live_…>,  TEST_EMBED_SECRET = <demo>.
#
# Native prereqs (one-time): the platforms exist (`npx cap add ios` / `npx cap add android`) with the SSO
# callback scheme registered (aiqexample://sso-callback) — see README. The local portal runs on :3017.
set -euo pipefail

PLATFORM="${1:-}"
if [ "$PLATFORM" != "web" ] && [ "$PLATFORM" != "ios" ] && [ "$PLATFORM" != "android" ]; then
  echo "usage: ./run-local.sh <web|ios|android>" >&2
  exit 1
fi

echo "→ Reminder: src/config.ts should hold LOCAL values (BASE_URL=http://localhost:3017, demo key/secret/email)."

# Web: Vite dev server on :4200 (an embed-allowed origin). Non-native — the embed shows reCAPTCHA and the
# web #aiq_sso SSO return is handled in the browser. No Capacitor sync/run needed.
if [ "$PLATFORM" = "web" ]; then
  echo "→ Serving on http://localhost:4200 (Ctrl-C to stop)."
  exec npm run dev -- --port 4200
fi

# Native (ios | android): web build → cap sync → run.
echo "→ Reminder: the generated ios/android need the SSO scheme (aiqexample://sso-callback) — see README."
npm run build
npx cap sync "$PLATFORM"

# Android: tunnel the emulator's localhost:3017 (and :8000 mint) to the host. localhost is a secure context,
# so the embed's SameSite=None; Secure session cookie is accepted over local http (10.0.2.2 would not be).
if [ "$PLATFORM" = "android" ]; then
  if command -v adb >/dev/null 2>&1; then
    adb reverse tcp:3017 tcp:3017 && echo "→ adb reverse tcp:3017 set (emulator localhost:3017 → host)"
    adb reverse tcp:8000 tcp:8000 && echo "→ adb reverse tcp:8000 set (mint endpoint → host)"
  else
    echo "→ adb not found — start an emulator and run: adb reverse tcp:3017 tcp:3017" >&2
  fi
fi

# Launch on a booted simulator/emulator (Capacitor prompts for a target if several).
npx cap run "$PLATFORM"
