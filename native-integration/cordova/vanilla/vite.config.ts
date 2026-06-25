import { defineConfig } from 'vite';

// Cordova loads the app from the device filesystem / a local scheme, so asset URLs must be RELATIVE
// (`base: ''`) and the build must land in `www/` — Cordova's web root (see config.xml `<content>`).
export default defineConfig({
  base: '',
  build: {
    outDir: 'www',
    emptyOutDir: true,
  },
});
