// auth.config.js
// Edge-compatible configuration — no database imports
// Imported by both auth.js (Node.js) and middleware.js (Edge)
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';

// Signing in through real GitHub OAuth cannot be driven by a headless browser:
// rate limits, captchas and MFA make it slow and flaky. So when — and only
// when — E2E === '1', the config also offers a Credentials provider that
// accepts an email and returns a session for it, skipping the OAuth dance
// entirely (Chapter 4 §4.9).
//
// The env flag is the guard. A production build never sets E2E, so this
// provider is not in the array at all and cannot be reached.
const isE2E = process.env.E2E === '1';

const e2eProvider = Credentials({
  // Auth.js assigns this provider the id 'credentials'; signIn() and the
  // signIn callback in auth.js both select it by that name.
  name: 'E2E Test Login',
  credentials: { email: { label: 'Email', type: 'email' } },
  async authorize(credentials) {
    if (!isE2E) return null; // belt and braces: never authorise outside E2E
    const email = credentials?.email;
    if (!email) return null;
    return {
      id: `e2e-${email}`,
      name: 'E2E Test User',
      email,
      role: 'viewer',
      locale: 'en',
    };
  },
});

export const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      // Normalise GitHub profile to ScholarPress user shape
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: 'viewer',
          locale: 'en',
        };
      },
    }),
    // Present only under the E2E flag — never in a production build.
    ...(isE2E ? [e2eProvider] : []),
  ],
  pages: { signIn: '/en/sign-in' },

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id; // carry the user id into the token
        token.role = user.role ?? 'viewer';
        token.locale = user.locale ?? 'en';
        token.createdAt = Date.now();
      }
      // Time-based rotation (Chapter 1 §1.16)
      const AGE = 60 * 60 * 1000; // 60 minutes
      if (Date.now() - (token.createdAt ?? 0) > AGE) {
        token.createdAt = Date.now();
      }
      // Event-based rotation on role change (Chapter 1 §1.16)
      if (trigger === 'update' && user?.role) {
        token.role = user.role;
        token.createdAt = Date.now();
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id; // expose the id to the app
      session.user.role = token.role;
      session.user.locale = token.locale;
      return session;
    },
  },

  session: { strategy: 'jwt' },
};
