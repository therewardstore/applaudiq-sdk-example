import Link from 'next/link';

import { keyIsPlaceholder } from './lib/config';

/** Landing page: explains the two login modes and links into each. */
export default function Home() {
  return (
    <div className="aiq-home">
      <div className="aiq-hero">
        <h1>Embed recognition in your Next.js app</h1>
        <p>Drop the Applaud IQ recognition portal into your app. Pick how employees sign in:</p>
      </div>

      <div className="aiq-cards">
        <article className="aiq-card">
          <span className="icon">🔁</span>
          <h3>Auto-login</h3>
          <p className="desc">Your server mints a one-time token and the employee is signed in silently.</p>
          <p className="when">Use when your app already authenticated the employee (needs a server).</p>
          <Link className="cta" href="/auto">
            Open auto-login →
          </Link>
        </article>

        <article className="aiq-card">
          <span className="icon">🔑</span>
          <h3>Manual login</h3>
          <p className="desc">The embed shows Applaud IQ's own login (email / SSO) — no server, no secret.</p>
          <p className="when">Use to try it in minutes, or when you have no backend.</p>
          <Link className="cta" href="/manual">
            Open manual login →
          </Link>
        </article>
      </div>

      {keyIsPlaceholder && (
        <p className="aiq-note">
          👉 Set your publishable key and portal URL in <code>app/lib/config.ts</code> before the embed will load.
        </p>
      )}
    </div>
  );
}
