// app/api/auth/[...nextauth]/route.js
// Catch-all route: /api/auth/* is handled by Auth.js.
// The [...nextauth] segment matches signin, callback, signout, etc.
import { handlers } from '@/auth';

export const { GET, POST } = handlers;
