// Home page — choose a login mode, then navigate to the Embed route (react-router v5 history).
import { IonContent, IonPage } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { getEmbedToken } from '../mint';

type State = 'idle' | 'loading' | 'error';
const ICON: Record<State, string> = { idle: 'ℹ', loading: '↻', error: '⚠' };
const IDLE = 'Choose a login mode to open the embed.';

export default function Home() {
  const history = useHistory();
  const [state, setState] = useState<State>('idle');
  const [text, setText] = useState(IDLE);
  const [busy, setBusy] = useState<'manual' | 'auto' | null>(null);

  useEffect(() => {
    // Web (non-native) same-page SSO return: the gateway redirected back here with `#aiq_sso=<code>`.
    if (typeof window !== 'undefined' && window.location.hash.includes('aiq_sso')) {
      history.push('/embed?mode=manual');
    }
  }, [history]);

  const openManual = () => history.push('/embed?mode=manual');

  const openAuto = async () => {
    setBusy('auto');
    setState('loading');
    setText('Minting a one-time token…');
    let token: string | undefined;
    try {
      token = await getEmbedToken();
    } catch {
      token = undefined;
    }
    // Pass the minted token via router state (never a query param — tokens stay out of URLs).
    setBusy(null);
    setState('idle');
    setText(IDLE);
    history.push({ pathname: '/embed', search: '?mode=auto', state: { token } });
  };

  const card = (
    id: 'manual' | 'auto',
    icon: string,
    title: string,
    sub: string,
    onClick: () => void,
  ) => (
    <button
      className={`aiq-card ${busy === id ? 'is-busy' : ''} ${busy && busy !== id ? 'is-dim' : ''}`}
      disabled={busy !== null}
      onClick={onClick}
    >
      <span className="aiq-tile">{icon}</span>
      <span className="aiq-card-text">
        <div className="aiq-card-title">{title}</div>
        <div className="aiq-card-sub">{sub}</div>
      </span>
      <span className="aiq-chevron">›</span>
      <span className="aiq-spinner" />
    </button>
  );

  return (
    <IonPage>
      <IonContent>
        <div className="aiq-app">
          <header className="aiq-hero">
            <div className="aiq-badge">✨</div>
            <h1 className="aiq-hero-title">Applaud IQ</h1>
            <p className="aiq-hero-sub">Capacitor · Ionic React — embed example</p>
          </header>
          <main className="aiq-content">
            <p className="aiq-section-label">Choose a login mode</p>
            {card(
              'manual',
              '🔒',
              'Manual login',
              'Employees sign in inside the embed (email + SSO). No server needed.',
              openManual,
            )}
            {card(
              'auto',
              '⚡',
              'Auto-login',
              'Silent sign-in with a one-time token minted on your server.',
              openAuto,
            )}
            <div className={`aiq-status is-${state}`}>
              <span className="aiq-status-icon">{ICON[state]}</span>
              <span className="aiq-status-text">{text}</span>
            </div>
            <p className="aiq-footer">@applaudiq/embed-capacitor · by Arulraj V</p>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
