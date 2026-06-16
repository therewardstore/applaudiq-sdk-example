// ApplaudIQ Web SDK config — the only two values you set.
// 👉 REPLACE with your publishable key — HR portal → Settings → Embed SDK Keys (pk_live_/pk_test_). Browser-safe.
export const PUBLISHABLE_KEY = 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxx';
// 👉 REPLACE with your portal origin — shown in Admin → Clients → your org → Embed SDK tab.
// The SDK <script> in index.html is <BASE_URL>/embed.js.
export const BASE_URL = 'https://recognize.applaudiq.com';

// True while the key is still the copy-paste placeholder — used to show a setup hint.
export const keyIsPlaceholder = PUBLISHABLE_KEY.includes('xxxx');
