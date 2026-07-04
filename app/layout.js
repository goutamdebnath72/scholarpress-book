// app/layout.js  —  ScholarPress root layout
import Link from 'next/link';
import LayoutCounter from './ui/layout-counter';

export const metadata = {
  title: 'ScholarPress',
  description: 'Notes and bookmarks, done simply.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <strong>ScholarPress</strong>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
          </nav>
          <LayoutCounter />
        </header>
        <main>{children}</main>
        <footer>
          © 2026  ·  Goutam Debnath  ·  book example
        </footer>
      </body>
    </html>
  );
}
