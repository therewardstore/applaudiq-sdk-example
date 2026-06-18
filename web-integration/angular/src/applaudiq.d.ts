// Self-contained type shim for the ApplaudIQ Web SDK global (window.ApplaudIQ).
export type ApplaudIQRenderMode = 'inline' | 'modal' | 'fullscreen';
export type ApplaudIQLoginMode = 'auto' | 'manual';

export interface ApplaudIQInitOptions {
  key: string;
  baseUrl?: string;
}
export interface ApplaudIQOpenOptions {
  mode?: ApplaudIQLoginMode;
  token?: string;
  /** Auto mode: fetch a one-time token from your mint endpoint. On failure the
   *  embedded portal renders the error itself — you write no error UI. */
  getToken?: () => Promise<string>;
  render?: ApplaudIQRenderMode;
  container?: string | HTMLElement;
  onReady?: () => void;
  onClose?: () => void;
  onError?: (e: { message: string }) => void;
  onAuthPending?: () => void;
}
export interface ApplaudIQHandle {
  close(): void;
}
export interface ApplaudIQClient {
  open(opts?: ApplaudIQOpenOptions): ApplaudIQHandle;
}
declare global {
  interface Window {
    ApplaudIQ?: { init(opts: ApplaudIQInitOptions): ApplaudIQClient };
  }
}
export {};
