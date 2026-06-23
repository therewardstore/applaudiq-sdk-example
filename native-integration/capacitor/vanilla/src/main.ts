// Plain Capacitor (vanilla TS) — Applaud IQ embed with a tiny query-based router (no framework).
// Two views, driven by the URL: Home (no `?mode=`) and Embed (`?mode=manual|auto`). Navigation uses the
// History API so the browser/native Back button returns Home, and the SDK's `onClose` (fired by Android
// hardware Back / iOS swipe at the embed root) calls `history.back()` to do the same.
import { ApplaudIQ, type EmbedHandle } from '@applaudiq/embed-capacitor';

import { BASE_URL, PUBLISHABLE_KEY, SSO_CALLBACK } from './config';
import { getEmbedToken } from './mint';
import './theme.css';

type State = 'idle' | 'loading' | 'success' | 'pending' | 'error';
const ICON: Record<State, string> = { idle: 'ℹ', loading: '↻', success: '✓', pending: '⏳', error: '⚠' };
const IDLE = 'Choose a login mode to open the embed.';

const app = document.getElementById('app')!;
const client = () =>
  ApplaudIQ.init({ key: PUBLISHABLE_KEY, baseUrl: BASE_URL, ssoCallback: SSO_CALLBACK });

let openHandle: EmbedHandle | null = null; // the embed currently mounted (Embed view only)
let pendingToken: string | undefined; // auto-mode token minted on Home, consumed by the Embed view

// ── Home view ──────────────────────────────────────────────────────────────────────────────────
function renderHome() {
  app.innerHTML = `
    <div class="aiq-app">
      <header class="aiq-hero">
        <div class="aiq-badge">✨</div>
        <h1 class="aiq-hero-title">Applaud IQ</h1>
        <p class="aiq-hero-sub">Capacitor · vanilla — embed example</p>
      </header>
      <main class="aiq-content">
        <p class="aiq-section-label">Choose a login mode</p>
        <button class="aiq-card" id="manual">
          <span class="aiq-tile">🔒</span>
          <span class="aiq-card-text">
            <div class="aiq-card-title">Manual login</div>
            <div class="aiq-card-sub">Employees sign in inside the embed (email + SSO). No server needed.</div>
          </span>
          <span class="aiq-chevron">›</span><span class="aiq-spinner"></span>
        </button>
        <button class="aiq-card" id="auto">
          <span class="aiq-tile">⚡</span>
          <span class="aiq-card-text">
            <div class="aiq-card-title">Auto-login</div>
            <div class="aiq-card-sub">Silent sign-in with a one-time token minted on your server.</div>
          </span>
          <span class="aiq-chevron">›</span><span class="aiq-spinner"></span>
        </button>
        <div class="aiq-status is-idle" id="status">
          <span class="aiq-status-icon">ℹ</span>
          <span class="aiq-status-text">${IDLE}</span>
        </div>
        <p class="aiq-footer">@applaudiq/embed-capacitor · by Arulraj V</p>
      </main>
    </div>
  `;

  const manualBtn = document.getElementById('manual') as HTMLButtonElement;
  const autoBtn = document.getElementById('auto') as HTMLButtonElement;
  const statusEl = document.getElementById('status') as HTMLElement;
  const setStatus = (s: State, t: string) => {
    statusEl.className = `aiq-status is-${s}`;
    statusEl.querySelector('.aiq-status-icon')!.textContent = ICON[s];
    statusEl.querySelector('.aiq-status-text')!.textContent = t;
  };

  manualBtn.addEventListener('click', () => navigate('manual'));
  autoBtn.addEventListener('click', async () => {
    autoBtn.classList.add('is-busy');
    manualBtn.classList.add('is-dim');
    manualBtn.disabled = autoBtn.disabled = true;
    setStatus('loading', 'Minting a one-time token…');
    try {
      pendingToken = await getEmbedToken();
    } catch {
      pendingToken = undefined;
    }
    navigate('auto');
  });
}

// ── Embed view ─────────────────────────────────────────────────────────────────────────────────
function renderEmbed(mode: 'manual' | 'auto') {
  app.innerHTML = `
    <div class="aiq-app">
      <main class="aiq-content">
        <div class="aiq-status is-loading" id="status">
          <span class="aiq-status-icon">↻</span>
          <span class="aiq-status-text">Opening embed…</span>
        </div>
      </main>
    </div>
  `;
  const statusEl = document.getElementById('status') as HTMLElement;
  const setStatus = (s: State, t: string) => {
    statusEl.className = `aiq-status is-${s}`;
    statusEl.querySelector('.aiq-status-icon')!.textContent = ICON[s];
    statusEl.querySelector('.aiq-status-text')!.textContent = t;
  };

  const token = mode === 'auto' ? pendingToken : undefined;
  pendingToken = undefined;

  openHandle = client().open({
    mode,
    token,
    render: 'fullscreen',
    onReady: () => setStatus('success', 'Signed in'),
    onAuthPending: () => setStatus('pending', 'Pending HR approval'),
    onError: (m) => setStatus('error', `Error: ${m}`),
    // Dismissed at the embed root (Back / swipe) → pop back to Home.
    onClose: () => history.back(),
  });
}

// ── tiny query router ────────────────────────────────────────────────────────────────────────────
function currentMode(): 'manual' | 'auto' | null {
  const m = new URLSearchParams(location.search).get('mode');
  return m === 'manual' || m === 'auto' ? m : null;
}

function render() {
  // Leaving any view tears down a previously-open embed.
  openHandle?.close();
  openHandle = null;
  const mode = currentMode();
  if (mode) renderEmbed(mode);
  else renderHome();
}

function navigate(mode: 'manual' | 'auto') {
  history.pushState({}, '', `?mode=${mode}`);
  render();
}

window.addEventListener('popstate', render);

// Web (non-native) same-page SSO return: the gateway redirected back with `#aiq_sso=<code>` — resume in
// manual mode so the SDK reads the code and completes sign-in.
if (window.location.hash.includes('aiq_sso') && !currentMode()) {
  history.replaceState({}, '', '?mode=manual');
}

render();
