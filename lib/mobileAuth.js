// review-saas/lib/mobileAuth.js

import connectDB from './mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export async function getAuthUser(req) {
  await connectDB();

  // ✅ Try NextAuth session (web browser)
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      const user = await User.findById(session.user.id);
      if (user) {
        console.log('Auth: NextAuth -', user.email);
        return user;
      }
    }
  } catch (err) {
    // Session check failed - try token
  }

  // ✅ Try Bearer token (mobile app)
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7).trim();

    if (!token) {
      return null;
    }

    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const colonIndex = decoded.indexOf(':');
    const userId = colonIndex > 0
      ? decoded.substring(0, colonIndex)
      : decoded;

    if (
      !userId ||
      userId.length !== 24 ||
      !/^[0-9a-fA-F]{24}$/.test(userId)
    ) {
      console.log('Invalid userId:', userId);
      return null;
    }

    const user = await User.findById(userId);

    if (!user) {
      console.log('User not found:', userId);
      return null;
    }

    console.log('Auth: Bearer -', user.email);
    return user;

  } catch (err) {
    console.error('Auth error:', err.message);
    return null;
  }
}