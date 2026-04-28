// app/api/debug/route.js
// ⚠️ DELETE THIS FILE after fixing the issue!

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  const checks = {
    environment: {},
    database: {},
    models: {},
  };

  // ✅ Check environment variables
  checks.environment = {
    MONGODB_URI: process.env.MONGODB_URI
      ? `✅ Set (${process.env.MONGODB_URI.slice(0, 20)}...)`
      : '❌ NOT SET',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET
      ? '✅ Set'
      : '❌ NOT SET',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
      ? `✅ ${process.env.NEXTAUTH_URL}`
      : '❌ NOT SET',
    RESEND_API_KEY: process.env.RESEND_API_KEY
      ? '✅ Set'
      : '⚠️ Not set (emails wont send)',
    NODE_ENV: process.env.NODE_ENV,
  };

  // ✅ Check database connection
  try {
    await connectDB();
    checks.database = {
      status: '✅ Connected',
      host: process.env.MONGODB_URI?.split('@')[1]?.split('/')[0] || 'unknown',
    };
  } catch (error) {
    checks.database = {
      status: '❌ Failed',
      error: error.message,
      fix: getMongoFix(error.message),
    };
  }

  // ✅ Check if User model loads
  try {
    const User = (await import('@/models/User')).default;
    checks.models = {
      User: '✅ Loaded',
      userModelName: User.modelName,
    };
  } catch (modelError) {
    checks.models = {
      User: `❌ Failed: ${modelError.message}`,
    };
  }

  const allGood =
    !checks.environment.MONGODB_URI.includes('❌') &&
    !checks.database.status?.includes('❌') &&
    !checks.models.User?.includes('❌');

  return NextResponse.json(
    {
      status: allGood ? '✅ ALL GOOD' : '❌ ISSUES FOUND',
      checks,
      nextStep: allGood
        ? 'Try registering again!'
        : 'Fix the ❌ issues above first',
    },
    { status: allGood ? 200 : 500 }
  );
}

function getMongoFix(errorMessage) {
  if (
    errorMessage.includes('Invalid URL') ||
    errorMessage.includes('Unable to parse')
  ) {
    return 'Wrong MONGODB_URI format. Must be: mongodb+srv://user:pass@cluster.net/db';
  }
  if (errorMessage.includes('ENOTFOUND')) {
    return 'Cannot reach MongoDB server. Check cluster URL.';
  }
  if (errorMessage.includes('Authentication failed')) {
    return 'Wrong username or password in MONGODB_URI';
  }
  if (errorMessage.includes('whitelist') || errorMessage.includes('IP')) {
    return 'Go to MongoDB Atlas → Network Access → Add 0.0.0.0/0';
  }
  return 'Check your MONGODB_URI in .env.local';
}