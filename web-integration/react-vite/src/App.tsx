import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout';
import { AutoLogin } from './routes/AutoLogin';
import { Home } from './routes/Home';
import { ManualLogin } from './routes/ManualLogin';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/auto" element={<AutoLogin />} />
          <Route path="/manual" element={<ManualLogin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
