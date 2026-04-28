// app/api/paystack/initialize/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import paystack from '@/lib/paystack';

// ✅ Plans in NGN (Naira) - amount in NAIRA not kobo
// paystack.js will convert to kobo automatically
const PLANS = {
  starter: {
    name: 'Starter',
    amount: 5000,    // ₦5,000
    description: 'Starter Plan - 100 requests/month',
  },
  pro: {
    name: 'Pro',
    amount: 10000,   // ₦10,000
    description: 'Pro Plan - Unlimited requests',
  },
};

export async function POST(req) {
  try {
    // ✅ Check auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // ✅ Check Paystack key exists
    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { planType } = body;

    // ✅ Validate plan
    if (!planType || !PLANS[planType]) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // ✅ Check if already on this plan
    if (user.plan === planType) {
      return NextResponse.json(
        { error: 'You are already on this plan' },
        { status: 400 }
      );
    }

    const plan = PLANS[planType];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000';

    console.log('Initializing Paystack payment for:', {
      email: user.email,
      plan: planType,
      amount: plan.amount,
    });

    // ✅ Initialize payment - NO currency param
    const payment = await paystack.initializePayment({
      email: user.email,
      amount: plan.amount,  // In Naira - converted to kobo in paystack.js
      metadata: {
        userId: user._id.toString(),
        planType,
        userName: user.name,
        businessName: user.businessName,
        planName: plan.name,
      },
      callback_url: appUrl + '/api/paystack/verify',
    });

    if (!payment.status) {
      return NextResponse.json(
        { error: payment.message || 'Payment initialization failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: payment.data.authorization_url,
      reference: payment.data.reference,
      accessCode: payment.data.access_code,
    });

  } catch (error) {
    console.error('Paystack init error:', error.response?.data || error.message);

    // ✅ Return specific error messages
    const paystackError = error.response?.data;

    if (paystackError?.code === 'unsupported_currency') {
      return NextResponse.json(
        {
          error: 'Currency not supported. Please use test keys or activate your Paystack account.',
          details: paystackError.message,
        },
        { status: 400 }
      );
    }

    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid Paystack API key. Check your .env.local file.' },
        { status: 500 }
      );
    }

    if (error.response?.status === 403) {
      return NextResponse.json(
        {
          error: paystackError?.message || 'Paystack access denied',
          fix: 'Use test keys (sk_test_xxx) during development',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Payment initialization failed. Please try again.' },
      { status: 500 }
    );
  }
}