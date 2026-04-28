// app/(dashboard)/reviews/page.jsx

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import ReviewRequest from '@/models/ReviewRequest';

export const metadata = {
  title: 'Reviews | ReviewBoost',
  description: 'Track all your review requests',
};

export default async function ReviewsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  await connectDB();

  const reviewsDocs = await ReviewRequest.find({
    userId: session.user.id,
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  // ✅ Serialize all mongoose objects to plain values
  const reviews = reviewsDocs.map((req) => ({
    _id: req._id.toString(),
    userId: req.userId ? req.userId.toString() : '',
    customerId: req.customerId ? req.customerId.toString() : '',
    customerName: req.customerName || '',
    customerEmail: req.customerEmail || '',
    businessName: req.businessName || '',
    status: req.status || 'sent',
    channel: req.channel || 'email',
    sentAt: req.sentAt ? req.sentAt.toISOString() : null,
    createdAt: req.createdAt ? req.createdAt.toISOString() : null,
    updatedAt: req.updatedAt ? req.updatedAt.toISOString() : null,
  }));

  // Count by status
  const stats = {
    total: reviews.length,
    sent: reviews.filter((r) => r.status === 'sent').length,
    opened: reviews.filter((r) => r.status === 'opened').length,
    clicked: reviews.filter((r) => r.status === 'clicked').length,
    reviewed: reviews.filter((r) => r.status === 'reviewed').length,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Review Requests
        </h1>
        <p className="text-gray-500 mt-1">
          Track all review requests you have sent
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Sent',
            value: stats.total,
            emoji: '📨',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
          },
          {
            label: 'Opened',
            value: stats.opened,
            emoji: '👁️',
            bg: 'bg-yellow-50',
            text: 'text-yellow-600',
          },
          {
            label: 'Clicked',
            value: stats.clicked,
            emoji: '🖱️',
            bg: 'bg-orange-50',
            text: 'text-orange-600',
          },
          {
            label: 'Reviewed',
            value: stats.reviewed,
            emoji: '⭐',
            bg: 'bg-green-50',
            text: 'text-green-600',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            <span className="text-2xl">{stat.emoji}</span>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">
            All Review Requests
          </h2>
          <span className="text-sm text-gray-400">
            {reviews.length} total
          </span>
        </div>

        {/* Empty State */}
        {reviews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <h3 className="text-lg font-semibold text-gray-400">
              No review requests yet
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Go to the Dashboard to send your first request
            </p>
            <a
              href="/dashboard"
              className="inline-block mt-4 bg-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition text-sm"
            >
              Go to Dashboard
            </a>
          </div>
        ) : (
          <>
            {/* Table Head */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-3">Customer</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Channel</div>
              <div className="col-span-2">Date Sent</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-50">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                >
                  {/* Customer Name */}
                  <div className="md:col-span-3 flex items-center gap-3">
                    <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm flex-shrink-0">
                      {review.customerName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {review.customerName || 'Unknown'}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="md:col-span-3">
                    <p className="text-sm text-gray-500 truncate">
                      {review.customerEmail}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="md:col-span-2">
                    <span className={
                      'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ' +
                      (review.status === 'sent'
                        ? 'bg-blue-50 text-blue-600'
                        : review.status === 'opened'
                        ? 'bg-yellow-50 text-yellow-600'
                        : review.status === 'clicked'
                        ? 'bg-orange-50 text-orange-600'
                        : 'bg-green-50 text-green-600')
                    }>
                      {review.status === 'sent' && '📤 '}
                      {review.status === 'opened' && '👁️ '}
                      {review.status === 'clicked' && '🖱️ '}
                      {review.status === 'reviewed' && '⭐ '}
                      {review.status.charAt(0).toUpperCase() +
                        review.status.slice(1)}
                    </span>
                  </div>

                  {/* Channel */}
                  <div className="md:col-span-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                      {review.channel === 'email' && '📧 '}
                      {review.channel === 'whatsapp' && '💬 '}
                      {review.channel === 'sms' && '📱 '}
                      {review.channel || 'email'}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-400">
                      {review.sentAt
                        ? new Date(review.sentAt).toLocaleDateString(
                            'en-NG',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )
                        : 'Unknown'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}