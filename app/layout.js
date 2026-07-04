// app/layout.js  —  excerpt (header only)
import NavLink from './ui/nav-link';
import LayoutCounter from './ui/layout-counter';

// ... inside RootLayout's <header>:
<header>
  <strong>ScholarPress</strong>
  <nav>
    <NavLink href="/" exact>Home</NavLink>
    <NavLink href="/notes">Notes</NavLink>
  </nav>
  <LayoutCounter />
</header>;
