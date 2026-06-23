// App shell — just the router. Real pages live in pages/Home + pages/Embed (named routes).
// Plain React (no Ionic), so the SDK owns the only back affordance: iOS left-edge swipe + Android Back.
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Embed from './pages/Embed';
import Home from './pages/Home';
import './theme.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/embed" element={<Embed />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
