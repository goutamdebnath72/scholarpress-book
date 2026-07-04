// app/dashboard/forbidden.js
import Link from 'next/link';

export default function Forbidden() {
  return (
    <div>
      <h2>Forbidden.</h2>
      <p>You do not have permission for this page.</p>
      <Link href="/">Return home</Link>
    </div>
  );
}
