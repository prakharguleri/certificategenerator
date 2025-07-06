import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/lib/user';
import { connectToDB } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectToDB();
        const user = await User.findOne({ email: credentials?.email });

        if (!user) throw new Error('No user found');
        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) throw new Error('Invalid password');
        if (!user.approved) throw new Error('User not approved');

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  pages: {
    signIn: '/login',
    error: '/unauthorized', // This will handle redirect for failed sign-ins
  },

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    // ✅ New logic for Google approval check
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        await connectToDB();
        const user = await User.findOne({ email: profile?.email });

        if (!user || !user.approved) {
          return '/unauthorized'; // 🔥 redirect to error page
        }
      }

      return true; // allow sign-in
    },

    async jwt({ token, account, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
