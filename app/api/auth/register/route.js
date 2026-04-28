import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const name = body.name;
    const email = body.email;
    const password = body.password;
    const businessName = body.businessName;
    const businessType = body.businessType;
    const phone = body.phone;

    if (!name || !email || !password || !businessName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    try {
      await connectDB();
    } catch (dbError) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let newUser;
    try {
      newUser = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        businessName: businessName.trim(),
        businessType: businessType || 'other',
        phone: phone || '',
        plan: 'free',
        reviewRequestsSentThisMonth: 0,
        lastResetDate: new Date(),
        trialStartDate: new Date(),
        trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      });
    } catch (createError) {
      if (createError.code === 11000) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    try {
      await sendWelcomeEmail(
        newUser.name,
        newUser.email,
        newUser.businessName
      );
    } catch (emailError) {
      console.warn('Email failed:', emailError.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully!',
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          businessName: newUser.businessName,
          plan: newUser.plan,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

async function sendWelcomeEmail(userName, userEmail, userBusinessName) {
  if (!process.env.RESEND_API_KEY) {
    return;
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const html = buildEmail(userName, userBusinessName, appUrl);

    await resend.emails.send({
      from: 'ReviewBoost <onboarding@resend.dev>',
      to: userEmail,
      subject: 'Welcome to ReviewBoost!',
      html: html,
    });
  } catch (err) {
    console.warn('Send email error:', err.message);
  }
}

function buildEmail(userName, businessName, appUrl) {
  var firstName = userName.split(' ')[0];
  var link = appUrl + '/dashboard';

  var p1 = '<html><body style="font-family:Arial,sans-serif;background:#f8f7ff;margin:0;padding:0;">';
  var p2 = '<div style="max-width:580px;margin:0 auto;padding:20px;">';
  var p3 = '<div style="background:linear-gradient(135deg,#7c3aed,#2563eb);border-radius:16px;padding:36px;text-align:center;">';
  var p4 = '<h1 style="color:white;margin:0;font-size:28px;">Welcome to ReviewBoost!</h1>';
  var p5 = '</div>';
  var p6 = '<div style="background:white;border-radius:16px;padding:28px;margin-top:16px;">';
  var p7 = '<p style="font-size:18px;color:#333;margin:0 0 12px;">Hi <b>' + firstName + '</b>!</p>';
  var p8 = '<p style="color:#555;line-height:1.7;margin:0 0 20px;">Your account for <b>' + businessName + '</b> is ready. You have a <b>14-day free trial</b> - no credit card needed.</p>';
  var p9 = '<p style="color:#555;font-weight:700;margin:0 0 12px;">Get started:</p>';
  var p10 = '<p style="color:#555;margin:0 0 8px;">1. Add your Google Review link in Settings</p>';
  var p11 = '<p style="color:#555;margin:0 0 8px;">2. Add your first customer</p>';
  var p12 = '<p style="color:#555;margin:0 0 24px;">3. Send your first review request</p>';
  var p13 = '<div style="text-align:center;">';
  var p14 = '<a href="' + link + '" style="background:#7c3aed;color:white;padding:14px 36px;border-radius:50px;text-decoration:none;font-weight:700;font-size:16px;">Go to Dashboard</a>';
  var p15 = '</div></div>';
  var p16 = '<p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">ReviewBoost - Helping ' + businessName + ' grow</p>';
  var p17 = '</div></body></html>';

  return p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9 + p10 + p11 + p12 + p13 + p14 + p15 + p16 + p17;
}