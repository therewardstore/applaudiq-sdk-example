import { Injectable, type OnDestroy } from '@angular/core';

import type { ApplaudIQHandle, ApplaudIQOpenOptions } from '../applaudiq.d';
import { BASE_URL, PUBLISHABLE_KEY } from './config';

/** Thin wrapper over the global window.ApplaudIQ SDK with lifecycle cleanup. */
@Injectable({ providedIn: 'root' })
export class ApplaudIQService implements OnDestroy {
  private handle?: ApplaudIQHandle;

  /** (Re)render the embed into `#${containerId}`. Closes any previous instance. */
  open(containerId: string, options: ApplaudIQOpenOptions): void {
    if (!window.ApplaudIQ) {
      options.onError?.({ message: 'SDK not loaded — check the <script> src in index.html' });
      return;
    }
    this.handle?.close();
    try {
      this.handle = window.ApplaudIQ.init({ key: PUBLISHABLE_KEY, baseUrl: BASE_URL }).open({
        render: 'inline',
        container: `#${containerId}`,
        ...options,
      });
    } catch (e) {
      options.onError?.({ message: e instanceof Error ? e.message : 'open failed' });
    }
  }

  ngOnDestroy(): void {
    this.handle?.close();
  }
}
