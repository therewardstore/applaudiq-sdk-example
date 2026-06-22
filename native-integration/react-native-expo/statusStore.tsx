import React, { createContext, useContext, useState } from 'react';

/** Drives the status pill colour (mirrors the Flutter/iOS/Android examples). */
export type StatusKind = 'idle' | 'loading' | 'success' | 'pending' | 'error';

type StatusValue = { kind: StatusKind; message: string; set: (kind: StatusKind, message: string) => void };

const StatusCtx = createContext<StatusValue | null>(null);

/**
 * Shares the status between the Home and Embed screens without passing a non-serializable
 * callback through navigation params — the Embed screen's SDK callbacks update it, and the
 * Home screen renders the latest value when you navigate back.
 */
export function StatusProvider({ children }: { children: React.ReactNode }) {
  const [kind, setKind] = useState<StatusKind>('idle');
  const [message, setMessage] = useState('Choose a login mode to open the embed.');
  const set = (k: StatusKind, m: string) => {
    setKind(k);
    setMessage(m);
  };
  return <StatusCtx.Provider value={{ kind, message, set }}>{children}</StatusCtx.Provider>;
}

export function useStatus(): StatusValue {
  const ctx = useContext(StatusCtx);
  if (!ctx) throw new Error('useStatus must be used within a StatusProvider');
  return ctx;
}
