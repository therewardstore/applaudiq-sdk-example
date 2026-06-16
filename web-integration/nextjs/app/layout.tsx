import Script from 'next/script';
import type { ReactNode } from 'react';

import './globals.css';
import { Nav } from './components/Nav';
import { SDK_URL } from './lib/config';

export const metadata = { title: 'ApplaudIQ — Next.js example' };

/** App shell: sticky top nav + the active route below, with the SDK loaded once. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="aiq-app">
          <Nav />
          <main className="aiq-main">{children}</main>
        </div>
        {/* Load the SDK once (global window.ApplaudIQ) — served at <portal>/embed.js. */}
        <Script src={SDK_URL} strategy="afterInteractive" />
      </body>
    </html>
  );
}
