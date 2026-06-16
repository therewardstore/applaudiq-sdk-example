'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** App shell nav: sticky top bar with brand + links to each mode. */
export function Nav() {
  const pathname = usePathname();
  const cls = (href: string, exact = false) =>
    (exact ? pathname === href : pathname.startsWith(href)) ? 'active' : undefined;

  return (
    <nav className="aiq-nav">
      <span className="aiq-brand">
        ApplaudIQ <span className="dot">·</span> Next.js
      </span>
      <div className="aiq-links">
        <Link href="/" className={cls('/', true)}>
          Home
        </Link>
        <Link href="/auto" className={cls('/auto')}>
          Auto-login
        </Link>
        <Link href="/manual" className={cls('/manual')}>
          Manual login
        </Link>
      </div>
    </nav>
  );
}
