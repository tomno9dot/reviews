// review-saas/lib/auth.js

import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from './mongodb';
import User from '@/models/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        console.log('=== AUTHORIZE CALLED ===');
        console.log('Email:', credentials?.email);
        console.log('Has password:', !!credentials?.password);
        console.log('NEXTAUTH_SECRET set:', !!process.env.NEXTAUTH_SECRET);
        console.log('MONGODB_URI set:', !!process.env.MONGODB_URI);

        // ✅ Check credentials exist
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          throw new Error('Email and password are required');
        }

        // ✅ Connect to database
        try {
          await connectDB();
          console.log('DB connected in authorize');
        } catch (dbError) {
          console.error('DB connection failed:', dbError.message);
          throw new Error('Database connection failed');
        }

        // ✅ Find user
        let user;
        try {
          user = await User.findOne({
            email: credentials.email.toLowerCase().trim(),
          }).select('+password');

          console.log('User found:', !!user);
          console.log('User email:', user?.email);
        } catch (findError) {
          console.error('Find user error:', findError.message);
          throw new Error('Database query failed');
        }

        if (!user) {
          console.log('No user found for:', credentials.email);
          throw new Error('No account found with this email');
        }

        // ✅ Check password exists on user
        if (!user.password) {
          console.log('User has no password stored');
          throw new Error('Account setup incomplete');
        }

        // ✅ Compare password
        let isValid;
        try {
          isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          console.log('Password valid:', isValid);
        } catch (bcryptError) {
          console.error('Bcrypt error:', bcryptError.message);
          throw new Error('Password verification failed');
        }

        if (!isValid) {
          console.log('Invalid password for:', credentials.email);
          throw new Error('Incorrect password');
        }

        console.log('✅ Auth successful for:', user.email);

        // ✅ Return user object
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          businessName: user.businessName,
          plan: user.plan || 'free',
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.businessName = user.businessName;
        token.plan = user.plan;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.businessName = token.businessName;
        session.user.plan = token.plan;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  // ✅ These are critical for production
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,

  debug: process.env.NODE_ENV === 'development',
};