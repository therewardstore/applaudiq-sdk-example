import { useEffect, useRef } from 'react';

import { BASE_URL, PUBLISHABLE_KEY } from './config';
import type { ApplaudIQHandle, ApplaudIQOpenOptions } from './applaudiq.d';

/**
 * Mounts the ApplaudIQ embed into `containerId` for the lifetime of the component.
 * Pass the open options (mode/token/callbacks); the hook handles init + cleanup.
 */
export function useApplaudIQ(containerId: string, options: ApplaudIQOpenOptions) {
  // Keep the latest options without re-running the effect on every render.
  const optsRef = useRef(options);
  optsRef.current = options;

  useEffect(() => {
    if (!window.ApplaudIQ) {
      optsRef.current.onError?.({ message: 'SDK not loaded — check the <script> src in index.html' });
      return;
    }
    let handle: ApplaudIQHandle | undefined;
    try {
      handle = window.ApplaudIQ.init({ key: PUBLISHABLE_KEY, baseUrl: BASE_URL }).open({
        render: 'inline',
        container: `#${containerId}`,
        ...optsRef.current,
      });
    } catch (e) {
      optsRef.current.onError?.({ message: e instanceof Error ? e.message : 'open failed' });
    }
    return () => handle?.close(); // tear down on unmount / mode change
    // Re-open when the login mode or token changes.
  }, [containerId, options.mode, options.token]);
}
