// ApplaudIQ Web SDK example (vanilla) — open the embed + status/banner helpers.
import { PUBLISHABLE_KEY, BASE_URL } from './config.js';

// Update the #status pill element. kind ∈ ready | pending | error.
export function setStatus(text, kind) {
  const statusEl = document.getElementById('status');
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.className = 'pill pill-right' + (kind ? ' ' + kind : '');
}

// Show the HR-pending banner (#aiq-banner) with the given text.
export function showPendingBanner(text) {
  const banner = document.getElementById('aiq-banner');
  if (!banner) return;
  banner.textContent = text;
  banner.className = 'aiq-banner pending show';
}

// Initialises the SDK and renders the recognition portal inline into
// #applaudiq-recognition. Pass { mode, token, ...extra }. Returns the handle.
export function openEmbed(opts) {
  if (!window.ApplaudIQ) {
    setStatus('SDK not loaded — check the <script> src', 'error');
    return null;
  }
  setStatus('opening…');
  return window.ApplaudIQ.init({ key: PUBLISHABLE_KEY, baseUrl: BASE_URL }).open({
    render: 'inline',
    container: '#applaudiq-recognition',
    onReady: () => setStatus('signed in', 'ready'),
    onAuthPending: () => {
      setStatus('waiting for HR approval', 'pending');
      showPendingBanner("⏳ Waiting for HR approval — you'll get access once an admin approves you.");
    },
    onError: (e) => setStatus(e.message, 'error'),
    ...opts,
  });
}
