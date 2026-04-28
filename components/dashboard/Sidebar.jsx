// review-saas/components/dashboard/Sidebar.jsx
// This sidebar only shows on desktop (lg and above)

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Users,
  Star,
  BarChart2,
  Settings,
  LogOut,
  Zap,
  Gift,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/customers', icon: Users, label: 'Customers' },
  { href: '/reviews', icon: Star, label: 'Reviews' },
  { href: '/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/referrals', icon: Gift, label: 'Referrals' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="
      w-64 bg-white border-r border-gray-200
      h-screen flex flex-col
      fixed left-0 top-0 z-40
    ">

      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <span className="text-xl font-bold text-gray-800">
            ReviewBoost
          </span>
        </div>
        {session?.user?.businessName && (
          <p className="text-xs text-gray-500 mt-1.5 truncate">
            {session.user.businessName}
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive =
            pathname === href ||
            (href !== '/dashboard' && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-3 px-4 py-3 rounded-xl',
                'transition-all duration-200 font-medium text-sm',
                isActive
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700',
              ].join(' ')}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100 space-y-2">

        {/* Upgrade Button */}
        {session?.user?.plan === 'free' && (
          <Link
            href="/settings?tab=billing"
            className="flex items-center gap-2 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-xl hover:opacity-90 transition"
          >
            <Zap size={16} fill="currentColor" />
            <span className="font-semibold text-sm">
              Upgrade Plan
            </span>
          </Link>
        )}

        {/* User Info */}
        {session?.user && (
          <div className="px-3 py-2">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {session.user.name}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {session.user.email}
            </p>
          </div>
        )}

        {/* Sign Out */}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 w-full text-gray-500 hover:text-red-500 px-4 py-2.5 rounded-xl hover:bg-red-50 transition text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}