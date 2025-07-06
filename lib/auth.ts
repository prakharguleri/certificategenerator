import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { Account, Profile, Session, User as AuthUser } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import bcrypt from 'bcryptjs';

import User from '@/lib/user';
import { connectToDB } from '@/lib/mongodb';

type CustomAccount = Account & {
  callbackUrl?: string;
};

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
    error: '/unauthorized',
  },

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async signIn({
      account,
      profile,
    }: {
      account: CustomAccount | null;
      profile?: Profile;
    }): Promise<string | boolean> {
      if (account?.provider === 'google') {
        await connectToDB();
        const existingUser = await User.findOne({ email: profile?.email });
        const isRegistering = account.callbackUrl?.includes('/google-register');

        if (!existingUser && isRegistering) {
          await User.create({
            email: profile?.email,
            name: profile?.name,
            password: '',
            approved: false,
          });

          return false; // block login until approved
        }

        if (!existingUser?.approved) {
          return false;
        }
      }

      return true;
    },

    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: AuthUser;
    }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }

      return token;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
