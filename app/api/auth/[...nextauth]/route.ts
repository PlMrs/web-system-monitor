import NextAuth, { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";

// On exporte authOptions pour que getServerSession puisse l'utiliser ailleurs
export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const ALLOWED_EMAIL = process.env.MAIL_AUTH; 
      return user.email === ALLOWED_EMAIL;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };