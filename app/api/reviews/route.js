import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Customer from '@/models/Customer';
import ReviewRequest from '@/models/ReviewRequest';
import { sendReviewRequest } from '@/lib/resend';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { customerName, customerEmail, customerPhone } = 
      await req.json();

    if (!customerName || !customerEmail) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Get user and check plan limits
    const user = await User.findById(session.user.id);
    user.resetMonthlyCount();  // Reset if new month

    if (!user.canSendRequest()) {
      return NextResponse.json(
        { 
          error: 'Monthly limit reached. Please upgrade your plan.',
          upgradeRequired: true
        },
        { status: 403 }
      );
    }

    if (!user.googleReviewLink) {
      return NextResponse.json(
        { error: 'Please add your Google Review link in Settings first' },
        { status: 400 }
      );
    }

    // Save customer
    let customer = await Customer.findOne({
      userId: user._id,
      email: customerEmail
    });

    if (!customer) {
      customer = await Customer.create({
        userId: user._id,
        name: customerName,
        email: customerEmail,
        phone: customerPhone || ''
      });
    }

    // Create review request record
    const reviewRequest = await ReviewRequest.create({
      userId: user._id,
      customerId: customer._id,
      customerName,
      customerEmail,
      businessName: user.businessName,
      status: 'sent',
      sentAt: new Date()
    });

    // Send email
    await sendReviewRequest({
      customerName,
      customerEmail,
      businessName: user.businessName,
      googleReviewLink: user.googleReviewLink,
      reviewRequestId: reviewRequest._id.toString()
    });

    // Update customer record
    await Customer.findByIdAndUpdate(customer._id, {
      reviewRequestSent: true,
      sentAt: new Date()
    });

    // Increment usage count
    await User.findByIdAndUpdate(user._id, {
      $inc: { reviewRequestsSentThisMonth: 1 }
    });

    return NextResponse.json({
      success: true,
      message: `Review request sent to ${customerName}!`
    });

  } catch (error) {
    console.error('Send review error:', error);
    return NextResponse.json(
      { error: 'Failed to send review request' },
      { status: 500 }
    );
  }
}