// review-saas/app/api/user/update/route.js

import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/mobileAuth';
import User from '@/models/User';

export async function PUT(req) {
  try {
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const name = body.name;
    const businessName = body.businessName;
    const businessType = body.businessType;
    const googleReviewLink = body.googleReviewLink;
    const phone = body.phone;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!businessName || !businessName.trim()) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      );
    }

    await User.findByIdAndUpdate(user._id, {
      name: name.trim(),
      businessName: businessName.trim(),
      businessType: businessType || 'other',
      googleReviewLink: googleReviewLink
        ? googleReviewLink.trim()
        : '',
      phone: phone ? phone.trim() : '',
    });

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    });

  } catch (error) {
    console.error('Update settings error:', error.message);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}