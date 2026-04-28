// review-saas/app/api/auth/forgot-password/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';

export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    const email = body.email;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    // ✅ Always return success even if user not found
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If this email exists, a reset link has been sent',
      });
    }

    // ✅ Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // ✅ Save token to user
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = new Date(
      Date.now() + 60 * 60 * 1000 // 1 hour
    );
    await user.save();

    // ✅ Send reset email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000';
    const resetUrl = appUrl + '/reset-password?token=' + resetToken;

    try {
      await sendResetEmail(user.email, user.name, resetUrl);
    } catch (emailErr) {
      console.error('Reset email failed:', emailErr.message);
      // Still return success - don't reveal email issues
    }

    return NextResponse.json({
      success: true,
      message: 'If this email exists, a reset link has been sent',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

async function sendResetEmail(email, name, resetUrl) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set');
    return;
  }

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const firstName = name ? name.split(' ')[0] : 'there';

  var html = '';
  html += '<!DOCTYPE html><html><head><meta charset="utf-8"></head>';
  html += '<body style="margin:0;padding:0;background:#f8f7ff;font-family:Arial,sans-serif;">';
  html += '<div style="max-width:560px;margin:0 auto;padding:24px;">';
  html += '<div style="background:linear-gradient(135deg,#7c3aed,#2563eb);border-radius:20px;padding:36px;text-align:center;margin-bottom:16px;">';
  html += '<h1 style="color:white;margin:0;font-size:26px;">Reset Your Password 🔐</h1>';
  html += '</div>';
  html += '<div style="background:white;border-radius:20px;padding:28px;margin-bottom:16px;">';
  html += '<p style="font-size:18px;color:#1f2937;font-weight:600;margin:0 0 12px;">Hi ' + firstName + '!</p>';
  html += '<p style="color:#555;line-height:1.7;margin:0 0 8px;">We received a request to reset your ReviewBoost password.</p>';
  html += '<p style="color:#555;line-height:1.7;margin:0 0 24px;">Click the button below to create a new password. This link expires in <strong>1 hour</strong>.</p>';
  html += '<div style="text-align:center;margin-bottom:24px;">';
  html += '<a href="' + resetUrl + '" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#2563eb);color:white;padding:16px 44px;border-radius:50px;text-decoration:none;font-size:16px;font-weight:700;">Reset My Password</a>';
  html += '</div>';
  html += '<p style="color:#9ca3af;font-size:13px;text-align:center;">If you did not request this, you can safely ignore this email.</p>';
  html += '<p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:12px;">Or copy this link: ' + resetUrl + '</p>';
  html += '</div>';
  html += '<p style="text-align:center;color:#9ca3af;font-size:12px;">ReviewBoost &bull; Your Google Review Partner</p>';
  html += '</div></body></html>';

  await resend.emails.send({
    from: 'ReviewBoost <noreply@reviewboost.app>',
    to: email,
    subject: 'Reset your ReviewBoost password',
    html: html,
  });
}