import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import ReviewRequest from '@/models/ReviewRequest';
import Customer from '@/models/Customer';
import SendReviewForm from '@/components/SendReviewForm';
import StatsCards from '@/components/dashboard/StatsCards';

export default async function DashboardPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  await connectDB();

  // Get stats
  const [user, totalRequests, totalCustomers] = await Promise.all([
    User.findById(session.user.id),
    ReviewRequest.countDocuments({ userId: session.user.id }),
    Customer.countDocuments({ userId: session.user.id })
  ]);

  // Get recent requests
  const recentRequests = await ReviewRequest
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const stats = {
    totalRequests,
    totalCustomers,
    sentThisMonth: user.reviewRequestsSentThisMonth,
    plan: user.plan,
    limit: user.plan === 'free' ? 10 : 
           user.plan === 'starter' ? 100 : 'Unlimited'
  };

  return (
    <div className="p-6 max-w-6xl">
      
      {/* Payment Success/Failed Banner */}
      {searchParams?.payment === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl mb-6 flex items-center gap-2">
          🎉 <strong>Payment successful!</strong> Your plan has been upgraded.
        </div>
      )}
      
      {searchParams?.payment === 'failed' && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6">
          ❌ Payment failed. Please try again.
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {session.user.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          {user.businessName} • {user.plan.toUpperCase()} Plan
        </p>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Main Action */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {/* Send Review Request */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            ⭐ Send Review Request
          </h2>
          <SendReviewForm />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📊 Recent Activity
          </h2>
          
          {recentRequests.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No review requests sent yet.<br/>
              Send your first one! 👆
            </p>
          ) : (
            <div className="space-y-3">
              {recentRequests.map((req) => (
                <div 
                  key={req._id}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {req.customerName}
                    </p>
                    <p className="text-sm text-gray-400">
                      {req.customerEmail}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    req.status === 'sent' 
                      ? 'bg-blue-50 text-blue-600'
                      : req.status === 'opened'
                      ? 'bg-yellow-50 text-yellow-600'
                      : 'bg-green-50 text-green-600'
                  }`}>
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