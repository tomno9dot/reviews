import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import ReviewRequest from '@/models/ReviewRequest';
import Customer from '@/models/Customer';
import AnalyticsCharts from '@/components/analytics/AnalyticsCharts';

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  await connectDB();

  const userId = session.user.id;

  // Get last 30 days data
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  );

  // Requests per day (last 30 days)
  const requestsByDay = await ReviewRequest.aggregate([
    {
      $match: {
        userId: userId,
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { 
            format: '%Y-%m-%d', 
            date: '$createdAt' 
          }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Status breakdown
  const statusBreakdown = await ReviewRequest.aggregate([
    { $match: { userId: userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Total stats
  const [totalRequests, totalCustomers] = await Promise.all([
    ReviewRequest.countDocuments({ userId }),
    Customer.countDocuments({ userId })
  ]);

  // Open rate calculation
  const opened = statusBreakdown.find(s => s._id === 'opened')?.count || 0;
  const openRate = totalRequests > 0 
    ? Math.round((opened / totalRequests) * 100)
    : 0;

  return (
    <div className="p-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Analytics
      </h1>
      <p className="text-gray-500 mb-8">
        Track your review performance
      </p>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { 
            label: 'Total Requests', 
            value: totalRequests, 
            icon: '📨',
            color: 'blue'
          },
          { 
            label: 'Total Customers', 
            value: totalCustomers, 
            icon: '👥',
            color: 'green'
          },
          { 
            label: 'Email Open Rate', 
            value: `${openRate}%`, 
            icon: '👁️',
            color: 'yellow'
          },
          { 
            label: 'This Month', 
            value: requestsByDay.reduce((a, b) => a + b.count, 0), 
            icon: '📅',
            color: 'purple'
          }
        ].map(stat => (
          <div 
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Component */}
      <AnalyticsCharts 
        requestsByDay={requestsByDay}
        statusBreakdown={statusBreakdown}
      />

      {/* Status Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Request Status Breakdown
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { status: 'sent', label: 'Sent', color: 'blue', emoji: '📤' },
            { status: 'opened', label: 'Opened', color: 'yellow', emoji: '👁️' },
            { status: 'clicked', label: 'Clicked', color: 'orange', emoji: '🖱️' },
            { status: 'reviewed', label: 'Reviewed', color: 'green', emoji: '⭐' }
          ].map(item => {
            const count = statusBreakdown.find(
              s => s._id === item.status
            )?.count || 0;
            const percentage = totalRequests > 0
              ? Math.round((count / totalRequests) * 100)
              : 0;

            return (
              <div 
                key={item.status}
                className={`bg-${item.color}-50 border border-${item.color}-100 rounded-xl p-4`}
              >
                <p className="text-2xl">{item.emoji}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {count}
                </p>
                <p className={`text-sm font-medium text-${item.color}-600`}>
                  {item.label}
                </p>
                <p className="text-xs text-gray-400">
                  {percentage}% of total
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}