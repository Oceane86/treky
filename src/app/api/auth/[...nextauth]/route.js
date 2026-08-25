import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// Pas de base de donnees cote Treky (tout le reste du site persiste en localStorage) :
// on reste en session JWT, sans adapter, et AuthContext se resynchronise sur ce token
// cote client pour rejoindre le meme `user` que le flux email/mot de passe demo.
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
