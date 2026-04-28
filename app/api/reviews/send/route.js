// review-saas/app/api/reviews/send/route.js

import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/mobileAuth';
import Customer from '@/models/Customer';
import ReviewRequest from '@/models/ReviewRequest';
import User from '@/models/User';

export async function POST(req) {
  try {
    console.log('=== /api/reviews/send called ===');

    // ✅ Log all headers for debugging
    const authHeader = req.headers.get('authorization');
    console.log('Authorization header:', authHeader
      ? authHeader.slice(0, 30) + '...'
      : 'MISSING'
    );

    // ✅ Get authenticated user
    const user = await getAuthUser(req);

    if (!user) {
      console.log('❌ Auth failed - returning 401');
      return NextResponse.json(
        { error: 'Not authenticated. Please login.' },
        { status: 401 }
      );
    }

    console.log('✅ Authenticated as:', user.email);

    // ✅ Parse body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const customerName = (body?.customerName || '').trim();
    const customerEmail = (body?.customerEmail || '').trim().toLowerCase();
    const customerPhone = (body?.customerPhone || '').trim();

    console.log('Customer:', customerName, customerEmail);

    if (!customerName) {
      return NextResponse.json(
        { error: 'Customer name is required' },
        { status: 400 }
      );
    }

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // ✅ Reset monthly count if new month
    const now = new Date();
    const lastReset = new Date(user.lastResetDate);
    if (
      now.getMonth() !== lastReset.getMonth() ||
      now.getFullYear() !== lastReset.getFullYear()
    ) {
      user.reviewRequestsSentThisMonth = 0;
      user.lastResetDate = now;
      await user.save();
    }

    // ✅ Check plan limits
    const limits = { free: 10, starter: 100, pro: 999999 };
    const limit = limits[user.plan] || 10;

    if (user.reviewRequestsSentThisMonth >= limit) {
      return NextResponse.json(
        {
          error: 'Monthly limit reached. Please upgrade your plan.',
          upgradeRequired: true,
          currentPlan: user.plan,
          limit: limit,
        },
        { status: 403 }
      );
    }

    if (!user.googleReviewLink) {
      return NextResponse.json(
        {
          error:
            'Please add your Google Review link in Settings first.',
        },
        { status: 400 }
      );
    }

    // ✅ Find or create customer
    let customer = await Customer.findOne({
      userId: user._id,
      email: customerEmail,
    });

    if (!customer) {
      customer = await Customer.create({
        userId: user._id,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        reviewRequestSent: false,
      });
    }

    // ✅ Create review request
    const reviewRequest = await ReviewRequest.create({
      userId: user._id,
      customerId: customer._id,
      customerName: customerName,
      customerEmail: customerEmail,
      businessName: user.businessName,
      status: 'sent',
      sentAt: new Date(),
    });

    // ✅ Send email
    let emailSent = false;
    try {
      await sendReviewEmail({
        customerName,
        customerEmail,
        businessName: user.businessName,
        googleReviewLink: user.googleReviewLink,
      });
      emailSent = true;
    } catch (emailError) {
      console.error('Email error:', emailError.message);
    }

    // ✅ Update counts
    await Customer.findByIdAndUpdate(customer._id, {
      reviewRequestSent: true,
      sentAt: new Date(),
    });

    await User.findByIdAndUpdate(user._id, {
      $inc: { reviewRequestsSentThisMonth: 1 },
    });

    console.log('✅ Review request sent successfully');

    return NextResponse.json({
      success: true,
      message: emailSent
        ? 'Review request sent to ' + customerName + '!'
        : 'Request saved! Email pending.',
      emailSent,
      requestId: reviewRequest._id.toString(),
    });

  } catch (error) {
    console.error('Send review error:', error.message);
    return NextResponse.json(
      { error: 'Failed to send. Please try again.' },
      { status: 500 }
    );
  }
}

async function sendReviewEmail({
  customerName,
  customerEmail,
  businessName,
  googleReviewLink,
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set');
    return;
  }

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);
  const firstName = customerName.split(' ')[0];

  var html = '';
  html += '<!DOCTYPE html><html><head><meta charset="utf-8"></head>';
  html += '<body style="margin:0;padding:0;background:#f8f7ff;font-family:Arial,sans-serif;">';
  html += '<div style="max-width:560px;margin:0 auto;padding:24px;">';
  html += '<div style="background:linear-gradient(135deg,#7c3aed,#2563eb);border-radius:20px;padding:36px;text-align:center;">';
  html += '<h1 style="color:white;margin:0;font-size:26px;">How was your visit? &#11088;</h1>';
  html += '</div>';
  html += '<div style="background:white;border-radius:20px;padding:28px;margin-top:16px;">';
  html += '<p style="font-size:18px;color:#1f2937;font-weight:600;margin:0 0 12px;">Hi ' + firstName + '! &#128075;</p>';
  html += '<p style="color:#555;line-height:1.7;margin:0 0 24px;">Thank you for visiting <strong>' + businessName + '</strong>! Could you spare 30 seconds to leave us a Google review?</p>';
  html += '<div style="text-align:center;">';
  html += '<a href="' + googleReviewLink + '" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#2563eb);color:white;padding:16px 44px;border-radius:50px;text-decoration:none;font-size:17px;font-weight:700;">&#11088; Leave a Google Review</a>';
  html += '</div>';
  html += '</div>';
  html += '<p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">' + businessName + ' &bull; Powered by ReviewBoost</p>';
  html += '</div></body></html>';

  await resend.emails.send({
    from: 'ReviewBoost <onboarding@resend.dev>',
    to: customerEmail,
    subject: 'How was your experience at ' + businessName + '?',
    html: html,
  });
}