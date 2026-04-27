// Handle Paystack webhooks (subscription renewals, cancellations)
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    // Verify webhook is from Paystack
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    await connectDB();

    switch (event.event) {
      
      // Subscription renewed successfully
      case 'subscription.create':
      case 'invoice.payment_failed':
        console.log('Subscription event:', event.event);
        break;

      // Payment successful (recurring)
      case 'charge.success':
        const metadata = event.data.metadata;
        if (metadata?.userId) {
          await User.findByIdAndUpdate(metadata.userId, {
            subscriptionStatus: 'active',
            plan: metadata.planType,
            subscriptionEndDate: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            )
          });
        }
        break;

      // Subscription cancelled
      case 'subscription.disable':
        const customerCode = event.data.customer.customer_code;
        await User.findOneAndUpdate(
          { paystackCustomerCode: customerCode },
          { 
            plan: 'free',
            subscriptionStatus: 'cancelled'
          }
        );
        break;

      default:
        console.log('Unhandled event:', event.event);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook failed' },
      { status: 500 }
    );
  }
}