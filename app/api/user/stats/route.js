import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import ReviewRequest from '@/models/ReviewRequest';
import Customer from '@/models/Customer';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    const userId = session.user.id;

    const [user, totalRequests, totalCustomers, openedCount] = 
      await Promise.all([
        User.findById(userId).lean(),
        ReviewRequest.countDocuments({ userId }),
        Customer.countDocuments({ userId }),
        ReviewRequest.countDocuments({ userId, status: 'opened' })
      ]);

    const openRate = totalRequests > 0
      ? Math.round((openedCount / totalRequests) * 100)
      : 0;

    const limits = { free: 10, starter: 100, pro: 'Unlimited' };

    return NextResponse.json({
      success: true,
      totalRequests,
      totalCustomers,
      sentThisMonth: user.reviewRequestsSentThisMonth,
      plan: user.plan,
      limit: limits[user.plan],
      openRate
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}