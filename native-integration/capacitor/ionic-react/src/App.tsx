// App shell — the Ionic root + router outlet. Real pages live in pages/Home + pages/Embed (named routes).
// IonReactRouter wraps react-router v5 (Ionic React's required router); <IonRouterOutlet> gives native page
// transitions + the iOS swipe-back gesture.
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useEffect, useRef } from 'react';
import { Redirect, Route } from 'react-router-dom';

import Embed from './pages/Embed';
import Home from './pages/Home';
import './theme.css';

export default function App() {
  const outletRef = useRef<HTMLIonRouterOutletElement | null>(null);

  useEffect(() => {
    // Disable Ionic's own left-edge swipe-back so it never competes with the SDK's edge-swipe (which steps
    // through the PORTAL's history). It's a 2-page example — Home is root, the SDK owns "back" inside the
    // embed — so a blanket disable is simplest. (Multi-page apps would scope this per-page instead.)
    const el = outletRef.current as unknown as { swipeGesture?: boolean } | null;
    if (el) el.swipeGesture = false;
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet ref={outletRef}>
          <Route exact path="/" component={Home} />
          <Route path="/embed" component={Embed} />
          <Route render={() => <Redirect to="/" />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}
