// review-saas/app/api/debug/test-login/route.js
// ⚠️ DELETE AFTER FIXING

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const checks = {
      emailProvided: !!email,
      passwordProvided: !!password,
      mongoUriSet: !!process.env.MONGODB_URI,
      nextAuthSecretSet: !!process.env.NEXTAUTH_SECRET,
      nextAuthUrl: process.env.NEXTAUTH_URL,
    };

    // Test DB connection
    try {
      await connectDB();
      checks.dbConnected = true;
    } catch (err) {
      checks.dbConnected = false;
      checks.dbError = err.message;
      return NextResponse.json({ checks }, { status: 500 });
    }

    // Find user
    const user = await User.findOne({
      email: email?.toLowerCase().trim(),
    });

    checks.userFound = !!user;
    checks.userEmail = user?.email;
    checks.hasPassword = !!user?.password;

    if (!user) {
      return NextResponse.json({ checks });
    }

    // Test password
    if (password && user.password) {
      const isValid = await bcrypt.compare(password, user.password);
      checks.passwordValid = isValid;
    }

    return NextResponse.json({ checks });

  } catch (error) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}