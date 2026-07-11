// auth.config.js
// Edge-compatible configuration — no database imports
// Imported by both auth.js (Node.js) and middleware.js (Edge)
import GitHub from 'next-auth/providers/github';

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
