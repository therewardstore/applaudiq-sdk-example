// Embed page — opens the full-screen embed for the requested mode, then returns to Home when dismissed.
// Reached via /embed?mode=manual|auto (auto carries its minted token in react-router state).
//
// Back chain: hardware Back (Android) / left-edge swipe (iOS) → SDK relays `applaudiq:back` → the portal
// steps back; at the embed root it replies `close` → the SDK tears the overlay down and fires `onClose`
// → we route back to Home.
import { ApplaudIQ, type EmbedHandle } from '@applaudiq/embed-capacitor';
import { IonContent, IonPage, useIonViewDidLeave } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { BASE_URL, PUBLISHABLE_KEY, SSO_CALLBACK } from '../config';
import { getEmbedToken } from '../mint';

type State = 'loading' | 'success' | 'pending' | 'error';
const ICON: Record<State, string> = { loading: '↻', success: '✓', pending: '⏳', error: '⚠' };

export default function Embed() {
  const history = useHistory();
  const location = useLocation<{ token?: string }>();
  const [state, setState] = useState<State>('loading');
  const [text, setText] = useState('Opening embed…');
  let handleRef: EmbedHandle | null = null;

  useEffect(() => {
    // StrictMode (dev) double-invokes this effect: mount→cleanup→mount. The `cancelled` flag makes the
    // first (torn-down) run bail before opening, so exactly one embed opens.
    const mode = new URLSearchParams(location.search).get('mode') === 'auto' ? 'auto' : 'manual';
    let handle: EmbedHandle | null = null;
    let cancelled = false;

    const set = (s: State, t: string) => {
      setState(s);
      setText(t);
    };

    void (async () => {
      let token: string | undefined;
      if (mode === 'auto') {
        token = location.state?.token;
        if (!token) {
          set('loading', 'Minting a one-time token…');
          try {
            token = await getEmbedToken();
          } catch {
            token = undefined;
          }
        }
      }
      if (cancelled) return;
      handle = ApplaudIQ.init({
        key: PUBLISHABLE_KEY,
        baseUrl: BASE_URL,
        ssoCallback: SSO_CALLBACK,
      }).open({
        mode,
        token,
        render: 'fullscreen',
        onReady: () => set('success', 'Signed in'),
        onAuthPending: () => set('pending', 'Pending HR approval'),
        onError: (m) => set('error', `Error: ${m}`),
        onClose: () => history.replace('/'),
      });
      handleRef = handle;
    })();

    return () => {
      cancelled = true;
      handle?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ionic keeps pages cached; close on the reliable leave hook too (covers swipe/route-pop teardown).
  useIonViewDidLeave(() => {
    handleRef?.close();
    handleRef = null;
  });

  return (
    <IonPage>
      <IonContent>
        <div className="aiq-app">
          <main className="aiq-content">
            <div className={`aiq-status is-${state}`}>
              <span className="aiq-status-icon">{ICON[state]}</span>
              <span className="aiq-status-text">{text}</span>
            </div>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
