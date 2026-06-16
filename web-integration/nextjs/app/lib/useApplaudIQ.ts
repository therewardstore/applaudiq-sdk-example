import { useEffect, useRef } from 'react';

import { BASE_URL, PUBLISHABLE_KEY } from './config';
import type { ApplaudIQHandle, ApplaudIQOpenOptions } from '../applaudiq.d';

/**
 * Mounts the ApplaudIQ embed into `containerId` for the lifetime of the component.
 * Pass the open options (mode/token/callbacks); the hook handles init + cleanup.
 *
 * The SDK <script> is loaded once in the layout (next/script, afterInteractive),
 * so on first render `window.ApplaudIQ` may not exist yet — the hook polls until
 * it does, then opens the embed inline.
 */
export function useApplaudIQ(containerId: string, options: ApplaudIQOpenOptions) {
  // Keep the latest options without re-running the effect on every render.
  const optsRef = useRef(options);
  optsRef.current = options;

  useEffect(() => {
    let handle: ApplaudIQHandle | undefined;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let waited = 0;

    const open = () => {
      if (cancelled) return;
      try {
        handle = window.ApplaudIQ!.init({ key: PUBLISHABLE_KEY, baseUrl: BASE_URL }).open({
          render: 'inline',
          container: `#${containerId}`,
          ...optsRef.current,
        });
      } catch (e) {
        optsRef.current.onError?.({ message: e instanceof Error ? e.message : 'open failed' });
      }
    };

    // Wait for the SDK <script> (loaded in the layout) to expose window.ApplaudIQ.
    const tick = () => {
      if (cancelled) return;
      if (window.ApplaudIQ) {
        open();
        return;
      }
      waited += 100;
      if (waited >= 10000) {
        optsRef.current.onError?.({ message: 'SDK not loaded — check the <script> src in the layout' });
        return;
      }
      timer = setTimeout(tick, 100);
    };
    tick();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      handle?.close(); // tear down on unmount / mode change
    };
    // Re-open when the login mode or token changes.
  }, [containerId, options.mode, options.token]);
}
