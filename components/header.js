// components/header.js  —  Server Component
import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <Link href="/">ScholarPress</Link>
      <nav>
        <Link href="/notes">Notes</Link>
        <Link href="/bookmarks">Bookmarks</Link>
      </nav>
    </header>
  );
}
