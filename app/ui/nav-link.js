// app/ui/nav-link.js
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink(
  { href, children, exact }
) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname === href ||
      pathname.startsWith(href + '/');
  return (
    <Link
      href={href}
      className={isActive ? 'nav-link is-active' : 'nav-link'}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}
