import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import paystack from '@/lib/paystack';

// Paystack Plan Codes (Create these in Paystack Dashboard)
const PLANS = {
  starter: {
    name: 'Starter',
    code: process.env.PAYSTACK_STARTER_PLAN_CODE, // e.g., PLN_xxx
    amount: 5000,     // ₦5,000/month
    currency: 'NGN'
  },
  pro: {
    name: 'Pro',
    code: process.env.PAYSTACK_PRO_PLAN_CODE,
    amount: 10000,    // ₦10,000/month
    currency: 'NGN'
  }
};

export async function POST(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { planType } = await req.json();

    if (!PLANS[planType]) {
      return NextResponse.json(
        { error: 'Invalid plan' },
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

    const plan = PLANS[planType];

    // Initialize Paystack payment
    const payment = await paystack.initializePayment({
      email: user.email,
      amount: plan.amount,
      currency: plan.currency,
      metadata: {
        userId: user._id.toString(),
        planType,
        userName: user.name,
        businessName: user.businessName
      },
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/verify`,
      plan: plan.code  // This makes it a subscription
    });

    return NextResponse.json({
      success: true,
      authorizationUrl: payment.data.authorization_url,
      reference: payment.data.reference
    });

  } catch (error) {
    console.error('Paystack init error:', error);
    return NextResponse.json(
      { error: 'Payment initialization failed' },
      { status: 500 }
    );
  }
}