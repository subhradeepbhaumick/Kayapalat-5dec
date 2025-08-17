import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { executeQuery } from "@/lib/db";
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        login: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) return null;
        
        // Ensure you have a 'username' column if you want to log in with it
        const query = 'SELECT * FROM users WHERE email = ? OR username = ?';
        const [users]: any[] = await executeQuery(query, [credentials.login, credentials.login]);
        const user = users[0];

        if (!user || !user.password) return null;
        
        const passwordIsValid = await bcrypt.compare(credentials.password, user.password);
        
        if (passwordIsValid) {
          // IMPORTANT: Return the user object with the 'role' property
          return { id: String(user.id), email: user.email, name: user.first_name, role: user.role };
        }
        
        return null;
      }
    })
  ],
  callbacks: {
    // This callback adds the role to the token
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    // This callback adds the role to the session, making it available on the client
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  session: { strategy: "jwt" },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };