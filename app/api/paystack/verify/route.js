import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import paystack from '@/lib/paystack';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref');

    const paymentRef = reference || trxref;

    if (!paymentRef) {
      return redirect('/dashboard?payment=failed');
    }

    // Verify with Paystack
    const verification = await paystack.verifyPayment(paymentRef);

    if (verification.data.status !== 'success') {
      return redirect('/dashboard?payment=failed');
    }

    const { userId, planType } = verification.data.metadata;

    await connectDB();

    // Update user plan in database
    await User.findByIdAndUpdate(userId, {
      plan: planType,
      subscriptionStatus: 'active',
      paystackCustomerCode: verification.data.customer.customer_code,
      subscriptionEndDate: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
      )
    });

    // Redirect to dashboard with success message
    return redirect('/dashboard?payment=success');

  } catch (error) {
    console.error('Verify error:', error);
    return redirect('/dashboard?payment=failed');
  }
}