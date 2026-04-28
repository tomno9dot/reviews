import { Resend } from 'resend';
import connectDB from './mongodb';
import ReviewRequest from '@/models/ReviewRequest';
import User from '@/models/User';

const resend = new Resend(process.env.RESEND_API_KEY);

// Run this as a CRON job daily
// Use Vercel Cron (free) or Railway Cron

export async function sendFollowUpEmails() {
  await connectDB();

  // Find requests sent 3 days ago with no response
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);

  // First follow-up (3 days after initial request)
  const firstFollowUps = await ReviewRequest.find({
    status: 'sent',
    sentAt: {
      $gte: sixDaysAgo,
      $lte: threeDaysAgo
    },
    followUp1Sent: { $ne: true }
  }).populate('userId');

  console.log(`Sending ${firstFollowUps.length} first follow-ups`);

  for (const request of firstFollowUps) {
    try {
      const user = request.userId;
      if (!user?.googleReviewLink) continue;

      await resend.emails.send({
        from: `${user.businessName} <reviews@yourdomain.com>`,
        to: request.customerEmail,
        subject: `Still enjoying ${user.businessName}? ⭐`,
        html: `
          <div style="font-family: Arial; max-width: 560px; margin: auto; padding: 20px;">
            <h2 style="color: #333;">
              Quick reminder, ${request.customerName}! 👋
            </h2>
            
            <p style="color: #555; line-height: 1.6;">
              We noticed you haven't had a chance to leave us 
              a review yet. We'd really appreciate your feedback!
            </p>
            
            <p style="color: #555;">
              It only takes <strong>30 seconds</strong> and 
              helps other customers discover us 🙏
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${user.googleReviewLink}"
                 style="background: #7c3aed; color: white; padding: 16px 36px; border-radius: 50px; text-decoration: none; font-size: 16px; font-weight: bold;">
                ⭐ Leave a Review Now
              </a>
            </div>
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              ${user.businessName} • 
              <a href="#" style="color: #999;">Unsubscribe</a>
            </p>
          </div>
        `
      });

      // Mark follow-up as sent
      await ReviewRequest.findByIdAndUpdate(request._id, {
        followUp1Sent: true,
        followUp1SentAt: new Date()
      });

    } catch (err) {
      console.error('Follow-up error:', err);
    }
  }
}