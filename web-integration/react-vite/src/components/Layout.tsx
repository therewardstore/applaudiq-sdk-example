import { NavLink, Outlet } from 'react-router-dom';

const link = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : undefined);

/** App shell: sticky top nav + the active route below. */
export function Layout() {
  return (
    <div className="aiq-app">
      <nav className="aiq-nav">
        <span className="aiq-brand">
          ApplaudIQ <span className="dot">·</span> React
        </span>
        <div className="aiq-links">
          <NavLink to="/" end className={link}>
            Home
          </NavLink>
          <NavLink to="/auto" className={link}>
            Auto-login
          </NavLink>
          <NavLink to="/manual" className={link}>
            Manual login
          </NavLink>
        </div>
      </nav>
      <main className="aiq-main">
        <Outlet />
      </main>
    </div>
  );
}
