// app/api/paystack/verify/route.js

import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import paystack from '@/lib/paystack';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference') ||
      searchParams.get('trxref');

    console.log('Verifying payment reference:', reference);

    if (!reference) {
      return redirect('/dashboard?payment=failed');
    }

    // ✅ Verify with Paystack
    const verification = await paystack.verifyPayment(reference);

    console.log('Verification result:', {
      status: verification.data?.status,
      amount: verification.data?.amount,
    });

    if (!verification.data || verification.data.status !== 'success') {
      console.log('Payment not successful:', verification.data?.status);
      return redirect('/dashboard?payment=failed');
    }

    const metadata = verification.data.metadata;
    const { userId, planType } = metadata;

    if (!userId || !planType) {
      console.error('Missing metadata:', metadata);
      return redirect('/dashboard?payment=failed');
    }

    await connectDB();

    // ✅ Update user plan
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        plan: planType,
        subscriptionStatus: 'active',
        paystackCustomerCode:
          verification.data.customer?.customer_code || '',
        subscriptionEndDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ),
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error('User not found:', userId);
      return redirect('/dashboard?payment=failed');
    }

    console.log('Plan updated for user:', updatedUser.email, '->', planType);

    return redirect('/dashboard?payment=success');

  } catch (error) {
    console.error('Verify payment error:', error.message);
    return redirect('/dashboard?payment=failed');
  }
}