// app/api/user/update/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
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

    await connectDB();

    await User.findByIdAndUpdate(session.user.id, {
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
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings. Please try again.' },
      { status: 500 }
    );
  }
}