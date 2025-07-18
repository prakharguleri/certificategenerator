import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User from '@/lib/user';
import { connectToDB } from '@/lib/mongodb';

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
        if (!credentials?.password) throw new Error('Password is required');

        const isValid = await bcrypt.compare(credentials.password, user.password || '');
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
    error: '/unauthorized',
  },

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        await connectToDB();

        const user = await User.findOne({ email: profile?.email });

        if (!user) {
          // Register but don't allow login until approved
          await User.create({
            name: profile?.name,
            email: profile?.email,
            password: '',
            approved: false,
          });

          return false;
        }

        return user.approved;
      }

      return true;
    },

    async jwt({ token, user }) {
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
