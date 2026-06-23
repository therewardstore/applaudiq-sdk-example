import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.applaudiq.example.capangular',
  appName: 'Applaud IQ Cap Angular',
  webDir: 'dist/browser',
  server: {
    // DEV ONLY — serve the app shell over http://localhost so it is schemefully SAME-SITE with the
    // local portal iframe (http://localhost:3017). The embed session cookie is SameSite=Lax, which a
    // WebView only stores/sends in a same-site context; the default https://localhost (Android) /
    // capacitor://localhost (iOS) shell is cross-site → the cookie is dropped → auto-login bounces to
    // the login page. Remove these scheme overrides for production (the portal is HTTPS there).
    androidScheme: 'http',
    iosScheme: 'http',
    // DEV ONLY — allow the http portal origin (http://localhost:3017). Remove for production (HTTPS only).
    cleartext: true,
    allowNavigation: [
      'accounts.google.com',
      'login.microsoftonline.com',
      'login.live.com',
      '*.okta.com',
    ],
  },
  plugins: {
    // Route the app's JS fetch through the NATIVE HTTP stack instead of the WebView. Native requests
    // aren't subject to browser CORS, so the auto-login token mint (mint.ts → your cross-origin backend,
    // or the demo's POST to the portal /api/v1/embed/sessions) succeeds without the server returning
    // Access-Control-Allow-Origin. Recommended for any Capacitor app that mints the embed token from JS.
    // (The embed iframe's own same-origin calls are unaffected — this only patches the app window.)
    CapacitorHttp: { enabled: true },
  },
};

export default config;
