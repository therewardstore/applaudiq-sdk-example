'use client';

import { useState } from 'react';

import { useApplaudIQ } from '../lib/useApplaudIQ';

const CONTAINER = 'applaudiq-recognition';

type Status = { text: string; kind?: 'ready' | 'pending' | 'error' };

/**
 * Renders the embed for a single login mode: a sub-header (title + status pill)
 * and the inline container the SDK mounts the portal into.
 */
export function EmbedView({ title, what, mode, token }: { title: string; what: string; mode: 'auto' | 'manual'; token?: string }) {
  const [status, setStatus] = useState<Status>({ text: 'opening…' });

  useApplaudIQ(CONTAINER, {
    mode,
    token,
    onReady: () => setStatus({ text: 'signed in', kind: 'ready' }),
    onAuthPending: () => setStatus({ text: 'waiting for HR approval', kind: 'pending' }),
    onError: (e) => setStatus({ text: e.message, kind: 'error' }),
  });

  return (
    <section className="aiq-mode">
      <div className="aiq-subhead">
        <h2>{title}</h2>
        <span className="what">{what}</span>
        <span className={'pill pill-right' + (status.kind ? ' ' + status.kind : '')}>{status.text}</span>
      </div>
      {status.kind === 'pending' && (
        <div className="aiq-banner pending">
          ⏳ Waiting for HR approval — you'll get access once an admin approves you.
        </div>
      )}
      <div id={CONTAINER} className="aiq-embed" />
    </section>
  );
}
