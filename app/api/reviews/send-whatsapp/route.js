import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Customer from '@/models/Customer';
import ReviewRequest from '@/models/ReviewRequest';
import { 
  sendWhatsAppMessage, 
  createReviewRequestMessage 
} from '@/lib/whatsapp';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { 
      customerName, 
      customerPhone,
      customerEmail
    } = await req.json();

    if (!customerPhone) {
      return NextResponse.json(
        { error: 'Phone number required for WhatsApp' },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(session.user.id);

    // Check plan limits
    if (!user.canSendRequest()) {
      return NextResponse.json(
        { 
          error: 'Monthly limit reached. Please upgrade.',
          upgradeRequired: true
        },
        { status: 403 }
      );
    }

    if (!user.googleReviewLink) {
      return NextResponse.json(
        { error: 'Add your Google Review link in Settings first' },
        { status: 400 }
      );
    }

    // Check if Pro plan (WhatsApp is Pro feature)
    if (user.plan !== 'pro') {
      return NextResponse.json(
        { 
          error: 'WhatsApp requests require Pro plan',
          upgradeRequired: true
        },
        { status: 403 }
      );
    }

    // Create message
    const message = createReviewRequestMessage(
      customerName,
      user.businessName,
      user.googleReviewLink
    );

    // Send WhatsApp
    const result = await sendWhatsAppMessage({
      to: customerPhone,
      message
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send WhatsApp message' },
        { status: 500 }
      );
    }

    // Save to DB
    let customer = await Customer.findOne({
      userId: user._id,
      $or: [
        { phone: customerPhone },
        { email: customerEmail }
      ]
    });

    if (!customer) {
      customer = await Customer.create({
        userId: user._id,
        name: customerName,
        email: customerEmail || '',
        phone: customerPhone
      });
    }

    await ReviewRequest.create({
      userId: user._id,
      customerId: customer._id,
      customerName,
      customerEmail: customerEmail || '',
      businessName: user.businessName,
      channel: 'whatsapp',
      status: 'sent',
      sentAt: new Date()
    });

    await User.findByIdAndUpdate(user._id, {
      $inc: { reviewRequestsSentThisMonth: 1 }
    });

    return NextResponse.json({
      success: true,
      message: `WhatsApp sent to ${customerName}! 📱`
    });

  } catch (error) {
    console.error('WhatsApp route error:', error);
    return NextResponse.json(
      { error: 'Failed to send WhatsApp message' },
      { status: 500 }
    );
  }
}