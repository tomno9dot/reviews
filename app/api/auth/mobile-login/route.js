// review-saas/app/api/auth/mobile-login/route.js

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const email = body.email;
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      );
    }

    // ✅ Create token: userId:email:timestamp
    const userId = user._id.toString();
    const tokenData = userId + ':' + user.email + ':' + Date.now();
    const token = Buffer.from(tokenData).toString('base64');

    // ✅ Verify token decodes correctly
    const testDecode = Buffer.from(token, 'base64').toString('utf8');
    const testUserId = testDecode.split(':')[0];

    console.log('Token created for:', user.email);
    console.log('UserId:', userId);
    console.log('Token preview:', token.slice(0, 20) + '...');
    console.log('Verify decode - userId:', testUserId);
    console.log('Match:', testUserId === userId);

    return NextResponse.json({
      success: true,
      token: token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        businessName: user.businessName,
        businessType: user.businessType || 'other',
        plan: user.plan || 'free',
        googleReviewLink: user.googleReviewLink || '',
        phone: user.phone || '',
      },
    });

  } catch (error) {
    console.error('Mobile login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}