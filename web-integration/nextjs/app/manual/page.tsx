'use client';

import { EmbedView } from '../components/EmbedView';

/** Manual login route — publishable key only; the embed shows the portal's own login. */
export default function ManualLogin() {
  return (
    <EmbedView
      title="Manual login"
      what="The embed shows Applaud IQ's own login (email / SSO). No server, no token."
      mode="manual"
    />
  );
}
