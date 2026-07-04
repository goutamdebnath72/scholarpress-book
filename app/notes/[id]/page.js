// app/notes/[id]/page.js  —  add the button
import BackButton from '@/app/ui/back-button';
// ... existing imports and component logic

return (
  <article>
    <BackButton>Back to all notes</BackButton>
    <h1>{note.title}</h1>
    {/* ... rest as before */}
  </article>
);
