// review-saas/app/api/user/stats/route.js

import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/mobileAuth';
import ReviewRequest from '@/models/ReviewRequest';
import Customer from '@/models/Customer';

export async function GET(req) {
  try {
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const [totalRequests, totalCustomers, openedCount] =
      await Promise.all([
        ReviewRequest.countDocuments({ userId: user._id }),
        Customer.countDocuments({ userId: user._id }),
        ReviewRequest.countDocuments({
          userId: user._id,
          status: 'opened',
        }),
      ]);

    const openRate =
      totalRequests > 0
        ? Math.round((openedCount / totalRequests) * 100)
        : 0;

    const limits = {
      free: 10,
      starter: 100,
      pro: 'Unlimited',
    };

    return NextResponse.json({
      success: true,
      totalRequests,
      totalCustomers,
      sentThisMonth: user.reviewRequestsSentThisMonth || 0,
      plan: user.plan || 'free',
      limit: limits[user.plan] || 10,
      openRate,
      businessName: user.businessName || '',
    });

  } catch (error) {
    console.error('Stats error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}