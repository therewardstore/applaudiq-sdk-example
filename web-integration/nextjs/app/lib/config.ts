// ApplaudIQ Web SDK config — the only two values you set.
// 👉 REPLACE with your publishable key — HR portal → Settings → Embed SDK Keys (pk_live_/pk_test_). Browser-safe.
export const PUBLISHABLE_KEY = 'pk_test_92db034db06cc264fbe5cf5a201c26e6';
// 👉 REPLACE with your portal origin — shown in Admin → Clients → your org → Embed SDK tab.
// The SDK <script> loaded in the layout is <BASE_URL>/embed.js.
export const BASE_URL = 'http://localhost:3017';

// The portal serves the SDK at <portal>/embed.js (same origin) — derived, no separate var.
export const SDK_URL = `${BASE_URL}/embed.js`;

// True while the key is still the copy-paste placeholder — used to show a setup hint.
export const keyIsPlaceholder = PUBLISHABLE_KEY.includes('xxxx');
