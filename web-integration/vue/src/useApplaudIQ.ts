import { onUnmounted, watch, type Ref } from 'vue';

import { BASE_URL, PUBLISHABLE_KEY } from './config';
import type { ApplaudIQHandle, ApplaudIQOpenOptions } from './applaudiq.d';

/**
 * Mounts/refreshes the ApplaudIQ embed into `#${containerId}` whenever the reactive
 * open options change, and tears it down on unmount.
 */
export function useApplaudIQ(containerId: string, options: Ref<ApplaudIQOpenOptions>) {
  let handle: ApplaudIQHandle | undefined;

  const open = () => {
    if (!window.ApplaudIQ) {
      options.value.onError?.({ message: 'SDK not loaded — check the <script> src in index.html' });
      return;
    }
    handle?.close();
    try {
      handle = window.ApplaudIQ.init({ key: PUBLISHABLE_KEY, baseUrl: BASE_URL }).open({
        render: 'inline',
        container: `#${containerId}`,
        ...options.value,
      });
    } catch (e) {
      options.value.onError?.({ message: e instanceof Error ? e.message : 'open failed' });
    }
  };

  watch(() => [options.value.mode, options.value.token], open, { immediate: true });
  onUnmounted(() => handle?.close());
}
