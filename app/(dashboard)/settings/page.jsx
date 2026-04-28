// app/(dashboard)/settings/page.jsx

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import PricingCards from '@/components/PricingCard';
import SettingsForm from '@/components/SettingsForm';

export default async function SettingsPage({ searchParams }) {
  // ✅ Await searchParams first
  const params = await searchParams;

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  await connectDB();

  const user = await User.findById(session.user.id).lean();

  // ✅ Use params not searchParams
  const activeTab = params?.tab || 'profile';

  const planLimits = {
    free: 10,
    starter: 100,
    pro: 'Unlimited',
  };

  return (
    <div className="p-6 max-w-5xl">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your account and billing
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-gray-200">
        {[
          { id: 'profile', label: '👤 Profile' },
          { id: 'billing', label: '💳 Billing & Plans' },
          { id: 'notifications', label: '🔔 Notifications' },
        ].map((tab) => (
          <a
            key={tab.id}
            href={'/settings?tab=' + tab.id}
            className={
              'px-6 py-3 font-medium transition-all border-b-2 text-sm ' +
              (activeTab === tab.id
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-800')
            }
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <SettingsForm user={JSON.parse(JSON.stringify(user))} />
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div>

          {/* Current Plan Card */}
          <div
            className="rounded-2xl p-6 text-white mb-8"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium uppercase tracking-wider">
                  Current Plan
                </p>
                <h2 className="text-3xl font-bold mt-1">
                  {(user?.plan || 'free').toUpperCase()}
                </h2>
                <p className="text-purple-200 mt-1">
                  {user?.reviewRequestsSentThisMonth || 0} requests
                  sent this month
                </p>
              </div>
              <div className="text-right">
                <p className="text-purple-200 text-sm">
                  Monthly limit
                </p>
                <p className="text-3xl font-bold">
                  {planLimits[user?.plan || 'free']}
                </p>
              </div>
            </div>

            {/* Usage bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-purple-200 mb-1">
                <span>Usage this month</span>
                <span>
                  {user?.reviewRequestsSentThisMonth || 0}
                  {user?.plan !== 'pro' &&
                    ' / ' + planLimits[user?.plan || 'free']}
                </span>
              </div>
              <div className="w-full bg-purple-400 bg-opacity-40 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all"
                  style={{
                    width:
                      user?.plan === 'pro'
                        ? '30%'
                        : Math.min(
                            ((user?.reviewRequestsSentThisMonth || 0) /
                              planLimits[user?.plan || 'free']) *
                              100,
                            100
                          ) + '%',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Pricing Plans */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Choose Your Plan
          </h2>
          <PricingCards currentPlan={user?.plan || 'free'} />
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-xl">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Email Notifications
          </h2>
          <div className="space-y-4">
            {[
              {
                label: 'New review left',
                desc: 'When a customer leaves a review',
                defaultOn: true,
              },
              {
                label: 'Weekly report',
                desc: 'Summary of reviews sent each week',
                defaultOn: true,
              },
              {
                label: 'Monthly limit warning',
                desc: 'When you reach 80% of your limit',
                defaultOn: true,
              },
              {
                label: 'Product updates',
                desc: 'New features and improvements',
                defaultOn: false,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {item.label}
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {item.desc}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={item.defaultOn}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
                </label>
              </div>
            ))}
          </div>

          <button className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
            Save Preferences
          </button>
        </div>
      )}
    </div>
  );
}