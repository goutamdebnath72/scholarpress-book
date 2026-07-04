// auth.js
// The Node.js-runtime Auth.js instance: authConfig + database adapter.
// Everything else in the app imports from here.
import NextAuth            from 'next-auth'
import { TypeORMAdapter }  from '@auth/typeorm-adapter'
import { authConfig }      from '@/auth.config'

// Pass an explicit connection options object (not a raw URL) so TypeORM
// uses the correct 'postgres' driver and Supabase SSL.
const connection = {
  type: 'postgres',
  url:  process.env.DATABASE_URL,
  ssl:  { rejectUnauthorized: false },
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,                       // providers, pages, callbacks
  adapter: TypeORMAdapter(connection),
  session: { strategy: 'jwt' },        // matches authConfig
  callbacks: {
    ...authConfig.callbacks,           // jwt, session from auth.config
    async signIn({ account }) {
      return account?.provider === 'github'
    },
  },
})