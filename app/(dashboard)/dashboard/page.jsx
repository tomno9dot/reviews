// app/(dashboard)/dashboard/page.jsx

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import ReviewRequest from '@/models/ReviewRequest';
import Customer from '@/models/Customer';
import SendReviewForm from '@/components/SendReviewForm';

export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  await connectDB();

  const [user, totalRequests, totalCustomers] = await Promise.all([
    User.findById(session.user.id).lean(),
    ReviewRequest.countDocuments({ userId: session.user.id }),
    Customer.countDocuments({ userId: session.user.id }),
  ]);

  const recentRequestsDocs = await ReviewRequest.find({
    userId: session.user.id,
  })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

  // ✅ Serialize recent requests
  const recentRequests = recentRequestsDocs.map((req) => ({
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

  const planLimits = {
    free: 10,
    starter: 100,
    pro: 'Unlimited',
  };

  const paymentStatus = params?.payment || null;

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {paymentStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-2xl mb-6 flex items-center gap-2">
          <span>🎉</span>
          <span>
            <strong>Payment successful!</strong> Your plan has been upgraded.
          </span>
        </div>
      )}

      {paymentStatus === 'failed' && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl mb-6 flex items-center gap-2">
          <span>❌</span>
          <span>Payment failed. Please try again.</span>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session.user.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          {user?.businessName} &bull;{' '}
          <span className="font-semibold text-purple-600">
            {(user?.plan || 'free').toUpperCase()} Plan
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Requests Sent',
            value: totalRequests,
            icon: '📨',
          },
          {
            label: 'Total Customers',
            value: totalCustomers,
            icon: '👥',
          },
          {
            label: 'This Month',
            value: user?.reviewRequestsSentThisMonth || 0,
            icon: '📅',
          },
          {
            label: 'Monthly Limit',
            value: planLimits[user?.plan || 'free'],
            icon: '🎯',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            ⭐ Send Review Request
          </h2>
          <SendReviewForm />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📊 Recent Activity
          </h2>

          {recentRequests.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-400 font-medium">
                No requests yet
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Send your first review request!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentRequests.map((req) => (
                <div
                  key={req._id}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm flex-shrink-0">
                      {req.customerName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {req.customerName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {req.customerEmail}
                      </p>
                    </div>
                  </div>
                  <span
                    className={
                      'px-3 py-1 rounded-full text-xs font-semibold ' +
                      (req.status === 'sent'
                        ? 'bg-blue-50 text-blue-600'
                        : req.status === 'opened'
                        ? 'bg-yellow-50 text-yellow-600'
                        : req.status === 'clicked'
                        ? 'bg-orange-50 text-orange-600'
                        : 'bg-green-50 text-green-600')
                    }
                  >
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}