import type { ApplaudIQHandle, ApplaudIQOpenOptions } from '../applaudiq.d';

import { BASE_URL, PUBLISHABLE_KEY } from './config';

/**
 * Mounts the ApplaudIQ embed into `container` and returns the handle (call
 * `.close()` on teardown). Pass the open options (mode/token/callbacks).
 */
export function openEmbed(
  container: string | HTMLElement,
  opts: ApplaudIQOpenOptions,
): ApplaudIQHandle | undefined {
  if (!window.ApplaudIQ) {
    opts.onError?.({ message: 'SDK not loaded — check the <script> src in index.html' });
    return;
  }
  return window.ApplaudIQ.init({ key: PUBLISHABLE_KEY, baseUrl: BASE_URL }).open({
    render: 'inline',
    container,
    ...opts,
  });
}
