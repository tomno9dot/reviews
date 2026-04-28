// app/api/reviews/send/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';

export async function POST(req) {
  try {
    // Step 1: Auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Step 2: Parse body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    console.log('Request body:', body);

    const customerName = (body?.customerName || '').trim();
    const customerEmail = (body?.customerEmail || '').trim().toLowerCase();
    const customerPhone = (body?.customerPhone || '').trim();

    // Step 3: Validate
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

    // Step 4: Connect DB first
    await connectDB();

    // Step 5: Import models AFTER connecting
    // This ensures mongoose is ready before models register
    const UserModel = (await import('@/models/User')).default;
    const CustomerModel = (await import('@/models/Customer')).default;
    const ReviewRequestModel = (await import('@/models/ReviewRequest')).default;

    // Step 6: Get user
    const user = await UserModel.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Step 7: Reset monthly count if new month
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

    // Step 8: Check limits
    const limits = { free: 10, starter: 100, pro: 999999 };
    const limit = limits[user.plan] || 10;

    if (user.reviewRequestsSentThisMonth >= limit) {
      return NextResponse.json(
        {
          error: 'Monthly limit reached. Please upgrade.',
          upgradeRequired: true,
          currentPlan: user.plan,
          limit,
        },
        { status: 403 }
      );
    }

    // Step 9: Check review link
    if (!user.googleReviewLink || !user.googleReviewLink.trim()) {
      return NextResponse.json(
        {
          error:
            'Please add your Google Review link in Settings first.',
        },
        { status: 400 }
      );
    }

    // Step 10: Find or create customer
    let customer;
    try {
      customer = await CustomerModel.findOne({
        userId: user._id,
        email: customerEmail,
      });

      if (!customer) {
        console.log('Creating new customer:', customerName, customerEmail);
        customer = await CustomerModel.create({
          userId: user._id,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          reviewRequestSent: false,
        });
        console.log('Customer created:', customer._id);
      } else {
        console.log('Customer exists:', customer._id);
      }
    } catch (err) {
      console.error('Customer error:', err.message);
      return NextResponse.json(
        { error: 'Customer error: ' + err.message },
        { status: 500 }
      );
    }

    // Step 11: Create review request
    let reviewRequest;
    try {
      console.log('Creating review request for:', {
        customerName,
        customerEmail,
        businessName: user.businessName,
      });

      reviewRequest = await ReviewRequestModel.create({
        userId: user._id,
        customerId: customer._id,
        customerName: customerName,
        customerEmail: customerEmail,
        businessName: user.businessName,
        status: 'sent',
        sentAt: new Date(),
      });

      console.log('Review request created:', reviewRequest._id);
    } catch (err) {
      console.error('ReviewRequest error:', err.message);
      return NextResponse.json(
        { error: 'Review request error: ' + err.message },
        { status: 500 }
      );
    }

    // Step 12: Send email
    let emailSent = false;
    try {
      await sendReviewEmail({
        customerName,
        customerEmail,
        businessName: user.businessName,
        googleReviewLink: user.googleReviewLink.trim(),
      });
      emailSent = true;
    } catch (emailError) {
      console.error('Email error:', emailError.message);
    }

    // Step 13: Update counts
    await CustomerModel.findByIdAndUpdate(customer._id, {
      reviewRequestSent: true,
      sentAt: new Date(),
    });

    await UserModel.findByIdAndUpdate(user._id, {
      $inc: { reviewRequestsSentThisMonth: 1 },
    });

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
      { error: 'Something went wrong: ' + error.message },
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
  html += '<div style="background:linear-gradient(135deg,#7c3aed,#2563eb);';
  html += 'border-radius:20px;padding:36px;text-align:center;margin-bottom:16px;">';
  html += '<h1 style="color:white;margin:0;font-size:26px;">How was your visit? &#11088;</h1>';
  html += '</div>';
  html += '<div style="background:white;border-radius:20px;padding:28px;margin-bottom:16px;">';
  html += '<p style="font-size:18px;color:#1f2937;font-weight:600;margin:0 0 12px;">';
  html += 'Hi ' + firstName + '! &#128075;</p>';
  html += '<p style="color:#555;line-height:1.7;margin:0 0 24px;">';
  html += 'Thank you for visiting <strong>' + businessName + '</strong>! ';
  html += 'Could you spare 30 seconds to leave us a Google review?</p>';
  html += '<div style="text-align:center;margin-bottom:20px;">';
  html += '<a href="' + googleReviewLink + '" ';
  html += 'style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#2563eb);';
  html += 'color:white;padding:16px 44px;border-radius:50px;text-decoration:none;font-size:17px;font-weight:700;">';
  html += '&#11088; Leave a Google Review</a></div>';
  html += '<p style="color:#9ca3af;font-size:13px;text-align:center;">Takes less than 30 seconds!</p>';
  html += '</div>';
  html += '<p style="text-align:center;color:#9ca3af;font-size:12px;">' + businessName + ' &bull; Powered by ReviewBoost</p>';
  html += '</div></body></html>';

  await resend.emails.send({
    from: 'ReviewBoost <onboarding@resend.dev>',
    to: customerEmail,
    subject: 'How was your experience at ' + businessName + '?',
    html: html,
  });
}