import crypto from 'crypto';
import connectDB from './mongodb';
import User from '@/models/User';
import Referral from '@/models/Referral';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate unique referral code
export function generateReferralCode(userId) {
  const hash = crypto
    .createHash('sha256')
    .update(userId.toString() + Date.now())
    .digest('hex');
  return hash.slice(0, 8).toUpperCase();
}

// Get or create referral code for user
export async function getUserReferralCode(userId) {
  await connectDB();
  
  let referral = await Referral.findOne({ 
    referrerId: userId,
    status: 'pending'
  });

  if (!referral) {
    const code = generateReferralCode(userId);
    referral = await Referral.create({
      referrerId: userId,
      referralCode: code
    });
  }

  return referral.referralCode;
}

// Process referral when new user signs up
export async function processReferral(referralCode, newUserId) {
  await connectDB();

  const referral = await Referral.findOne({ 
    referralCode,
    status: 'pending'
  });

  if (!referral) return false;

  // Update referral status
  await Referral.findByIdAndUpdate(referral._id, {
    referredUserId: newUserId,
    status: 'signed_up'
  });

  return true;
}

// Give reward when referred user pays
export async function giveReferralReward(referredUserId) {
  await connectDB();

  const referral = await Referral.findOne({
    referredUserId,
    status: 'signed_up',
    rewardGiven: false
  });

  if (!referral) return;

  // Give referrer 1 free month (upgrade their plan)
  const referrer = await User.findById(referral.referrerId);
  if (!referrer) return;

  // Extend their subscription by 30 days
  const currentEnd = referrer.subscriptionEndDate || new Date();
  const newEnd = new Date(
    Math.max(currentEnd.getTime(), Date.now()) + 
    30 * 24 * 60 * 60 * 1000
  );

  await User.findByIdAndUpdate(referral.referrerId, {
    subscriptionEndDate: newEnd,
    plan: referrer.plan === 'free' ? 'starter' : referrer.plan
  });

  await Referral.findByIdAndUpdate(referral._id, {
    status: 'rewarded',
    rewardGiven: true,
    rewardType: 'free_month',
    convertedAt: new Date()
  });

  // Send reward email to referrer
  await resend.emails.send({
    from: 'ReviewBoost <rewards@yourdomain.com>',
    to: referrer.email,
    subject: '🎉 You earned a FREE month on ReviewBoost!',
    html: `
      <div style="font-family:Arial;max-width:560px;margin:auto;padding:20px;">
        <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);border-radius:20px;padding:32px;text-align:center;">
          <h1 style="color:white;margin:0;font-size:28px;">
            🎉 You earned a free month!
          </h1>
        </div>
        <div style="padding:24px 0;">
          <p style="font-size:18px;color:#333;">
            Hi ${referrer.name}!
          </p>
          <p style="color:#555;line-height:1.6;">
            Someone you referred just upgraded their 
            ReviewBoost plan. As a thank you, 
            <strong>we've added 30 free days</strong> 
            to your account! 🙌
          </p>
          <div style="background:#f5f3ff;border-radius:16px;padding:20px;margin:20px 0;text-align:center;">
            <p style="color:#7c3aed;font-size:32px;font-weight:800;margin:0;">
              +30 Days FREE
            </p>
            <p style="color:#6b7280;margin:8px 0 0;font-size:14px;">
              Added to your account automatically
            </p>
          </div>
          <p style="color:#555;">
            Keep sharing your referral link to earn 
            more free months! There's no limit 🚀
          </p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/referrals"
               style="background:#7c3aed;color:white;padding:14px 36px;border-radius:50px;text-decoration:none;font-weight:700;">
              View Referrals →
            </a>
          </div>
        </div>
      </div>
    `
  });
}

// Get referral stats for user
export async function getReferralStats(userId) {
  await connectDB();

  const referrals = await Referral.find({ referrerId: userId });
  
  return {
    totalReferrals: referrals.length,
    signedUp: referrals.filter(r => r.status !== 'pending').length,
    converted: referrals.filter(r => 
      r.status === 'converted' || r.status === 'rewarded'
    ).length,
    rewarded: referrals.filter(r => r.status === 'rewarded').length,
    freeMonthsEarned: referrals.filter(r => r.rewardGiven).length
  };
}