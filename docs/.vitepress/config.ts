import { defineConfig } from 'vitepress';

// Navigator/docs site for the ApplaudIQ Web SDK examples.
// Framework pages @include the per-folder READMEs, so the steps live in one place.
export default defineConfig({
  title: 'ApplaudIQ Web SDK',
  description:
    'Copy-paste integrations that embed the Applaud IQ recognition portal in your web app — every major framework, auto-login or manual.',
  lang: 'en-US',
  cleanUrls: true,
  appearance: 'dark',
  // Localhost dev URLs in the framework guides aren't reachable at build time —
  // ignore them, but keep validating internal links (sidebar / @include targets).
  ignoreDeadLinks: [/^https?:\/\/localhost/, /^https?:\/\/127\.0\.0\.1/],
  themeConfig: {
    search: { provider: 'local' },
    nav: [
      { text: 'Guide', link: '/' },
      { text: 'Get keys', link: '/get-keys' },
      {
        text: 'Login modes',
        items: [
          { text: 'Compare auto vs manual', link: '/guides/login-modes' },
          { text: 'Auto-login', link: '/guides/auto-login' },
          { text: 'Manual login', link: '/guides/manual-login' },
          { text: 'Minting (server)', link: '/MINTING' },
        ],
      },
      {
        text: 'Frameworks',
        items: [
          { text: 'Plain HTML', link: '/web/html' },
          { text: 'Vanilla JS', link: '/web/vanilla' },
          { text: 'React (Vite)', link: '/web/react' },
          { text: 'Vue 3', link: '/web/vue' },
          { text: 'Angular', link: '/web/angular' },
          { text: 'Svelte', link: '/web/svelte' },
          { text: 'Next.js', link: '/web/nextjs' },
        ],
      },
      // 👉 REPLACE with the public repo URL once it's live.
      { text: 'GitHub', link: 'https://github.com/therewardstore/applaudiq-sdk-example' },
    ],
    sidebar: [
      {
        text: 'Start here',
        items: [
          { text: 'Overview', link: '/' },
          { text: 'Get your keys', link: '/get-keys' },
        ],
      },
      {
        text: 'Login modes',
        items: [
          { text: 'Compare modes', link: '/guides/login-modes' },
          { text: 'Auto-login', link: '/guides/auto-login' },
          { text: 'Manual login', link: '/guides/manual-login' },
          { text: 'Minting on your server', link: '/MINTING' },
        ],
      },
      {
        text: 'Web frameworks',
        items: [
          { text: 'Plain HTML', link: '/web/html' },
          { text: 'Vanilla JS', link: '/web/vanilla' },
          { text: 'React (Vite)', link: '/web/react' },
          { text: 'Vue 3', link: '/web/vue' },
          { text: 'Angular', link: '/web/angular' },
          { text: 'Svelte', link: '/web/svelte' },
          { text: 'Next.js', link: '/web/nextjs' },
        ],
      },
      // Native SDKs (Android · iOS · React Native · Flutter) land here next:
      // {
      //   text: 'Native SDKs',
      //   items: [
      //     { text: 'Android', link: '/native/android' },
      //     { text: 'iOS', link: '/native/ios' },
      //     { text: 'React Native', link: '/native/react-native' },
      //     { text: 'Flutter', link: '/native/flutter' },
      //   ],
      // },
      {
        text: 'Reference',
        items: [{ text: 'Security', link: '/security' }],
      },
    ],
    outline: { level: [2, 3], label: 'On this page' },
  },
});
