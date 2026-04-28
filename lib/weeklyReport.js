import { Resend } from 'resend';
import connectDB from './mongodb';
import User from '@/models/User';
import ReviewRequest from '@/models/ReviewRequest';
import Customer from '@/models/Customer';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWeeklyReports() {
  await connectDB();

  // Get all active users
  const users = await User.find({
    plan: { $in: ['starter', 'pro'] }
  });

  console.log(`Sending weekly reports to ${users.length} users`);

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  for (const user of users) {
    try {
      // This week stats
      const [
        thisWeekRequests,
        lastWeekRequests,
        totalCustomers,
        newCustomersThisWeek
      ] = await Promise.all([
        ReviewRequest.countDocuments({
          userId: user._id,
          createdAt: { $gte: oneWeekAgo }
        }),
        ReviewRequest.countDocuments({
          userId: user._id,
          createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo }
        }),
        Customer.countDocuments({ userId: user._id }),
        Customer.countDocuments({
          userId: user._id,
          createdAt: { $gte: oneWeekAgo }
        })
      ]);

      // Calculate growth
      const growth = lastWeekRequests > 0
        ? Math.round(((thisWeekRequests - lastWeekRequests) / lastWeekRequests) * 100)
        : 0;

      const growthText = growth > 0 
        ? `📈 +${growth}% vs last week`
        : growth < 0 
        ? `📉 ${growth}% vs last week`
        : '➡️ Same as last week';

      const growthColor = growth > 0 ? '#059669' : growth < 0 ? '#dc2626' : '#6b7280';

      // Monthly limit info
      const limits = { free: 10, starter: 100, pro: 999999 };
      const limit = limits[user.plan];
      const usagePercent = Math.round(
        (user.reviewRequestsSentThisMonth / limit) * 100
      );

      // Personalized tip based on usage
      const getTip = () => {
        if (thisWeekRequests === 0) {
          return {
            title: '💡 You haven\'t sent any requests this week',
            body: 'Businesses that send requests daily get 5x more reviews. Try sending one right now!'
          };
        }
        if (usagePercent > 80) {
          return {
            title: '⚠️ You\'re approaching your monthly limit',
            body: 'Upgrade to Pro for unlimited review requests and 3 business locations.'
          };
        }
        if (thisWeekRequests < 5) {
          return {
            title: '🚀 Tip: More requests = More reviews',
            body: 'Businesses sending 10+ requests/week see 3x more reviews. Try adding more customers!'
          };
        }
        return {
          title: '🌟 Great work this week!',
          body: 'Keep the momentum going. Consistent review requests build long-term trust.'
        };
      };

      const tip = getTip();

      await resend.emails.send({
        from: 'ReviewBoost Weekly <weekly@yourdomain.com>',
        to: user.email,
        subject: `📊 Your Weekly Review Report - ${user.businessName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body style="margin:0;padding:0;background:#f8f7ff;font-family:Inter,Arial,sans-serif;">
            
            <div style="max-width:600px;margin:0 auto;padding:24px 16px;">
              
              <!-- Header -->
              <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);border-radius:20px;padding:32px;text-align:center;margin-bottom:20px;">
                <p style="color:rgba(255,255,255,0.8);margin:0;font-size:13px;letter-spacing:1px;text-transform:uppercase;">
                  WEEKLY REPORT
                </p>
                <h1 style="color:white;margin:8px 0;font-size:26px;font-weight:800;">
                  ${user.businessName}
                </h1>
                <p style="color:rgba(255,255,255,0.7);margin:0;font-size:14px;">
                  ${new Date().toLocaleDateString('en-NG', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <!-- Stats Grid -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
                
                <div style="background:white;border-radius:16px;padding:20px;text-align:center;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
                  <p style="font-size:36px;font-weight:800;color:#7c3aed;margin:0;">
                    ${thisWeekRequests}
                  </p>
                  <p style="color:#6b7280;font-size:13px;margin:4px 0 0;font-weight:600;">
                    Requests This Week
                  </p>
                  <p style="color:${growthColor};font-size:12px;margin:4px 0 0;">
                    ${growthText}
                  </p>
                </div>
                
                <div style="background:white;border-radius:16px;padding:20px;text-align:center;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
                  <p style="font-size:36px;font-weight:800;color:#059669;margin:0;">
                    ${newCustomersThisWeek}
                  </p>
                  <p style="color:#6b7280;font-size:13px;margin:4px 0 0;font-weight:600;">
                    New Customers
                  </p>
                  <p style="color:#6b7280;font-size:12px;margin:4px 0 0;">
                    ${totalCustomers} total
                  </p>
                </div>
              </div>

              <!-- Usage Bar -->
              <div style="background:white;border-radius:16px;padding:20px;margin-bottom:20px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                  <p style="margin:0;font-weight:700;color:#1f2937;font-size:14px;">
                    Monthly Usage
                  </p>
                  <span style="background:#f3f0ff;color:#7c3aed;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;">
                    ${user.plan.toUpperCase()}
                  </span>
                </div>
                <div style="background:#f3f4f6;border-radius:10px;height:10px;overflow:hidden;">
                  <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);height:10px;width:${Math.min(usagePercent, 100)}%;border-radius:10px;transition:width 0.3s;">
                  </div>
                </div>
                <div style="display:flex;justify-content:space-between;margin-top:8px;">
                  <p style="margin:0;color:#6b7280;font-size:12px;">
                    ${user.reviewRequestsSentThisMonth} sent
                  </p>
                  <p style="margin:0;color:#6b7280;font-size:12px;">
                    ${user.plan === 'pro' ? 'Unlimited' : `${limit} limit`}
                  </p>
                </div>
              </div>

              <!-- Tip Box -->
              <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:16px;padding:20px;margin-bottom:20px;">
                <p style="margin:0 0 6px;font-weight:700;color:#92400e;font-size:14px;">
                  ${tip.title}
                </p>
                <p style="margin:0;color:#92400e;font-size:13px;line-height:1.6;">
                  ${tip.body}
                </p>
              </div>

              <!-- CTA -->
              <div style="text-align:center;margin-bottom:20px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
                   style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#2563eb);color:white;padding:16px 40px;border-radius:50px;text-decoration:none;font-size:16px;font-weight:700;box-shadow:0 4px 15px rgba(124,58,237,0.4);">
                  Go to Dashboard →
                </a>
              </div>

              <!-- Footer -->
              <div style="text-align:center;padding:20px 0;">
                <p style="color:#9ca3af;font-size:12px;margin:0;">
                  ReviewBoost • Helping ${user.businessName} grow
                </p>
                <p style="color:#9ca3af;font-size:12px;margin:8px 0 0;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings?tab=notifications" 
                     style="color:#9ca3af;">
                    Manage email preferences
                  </a>
                </p>
              </div>
            </div>
          </body>
          </html>
        `
      });

      console.log(`✅ Weekly report sent to ${user.email}`);

    } catch (err) {
      console.error(`❌ Failed to send report to ${user.email}:`, err);
    }
  }
}