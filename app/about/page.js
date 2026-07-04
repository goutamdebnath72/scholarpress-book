// app/about/page.js
export default function AboutPage() {
  return (
    <article>
      <h1>About ScholarPress</h1>
      <p>
        A notes-and-bookmarks app built alongside the
        <em>Next.js 16: Mechanism and Mastery</em>.
      </p>
      <p>Rendered at {new Date().toISOString()}.</p>
    </article>
  );
}
