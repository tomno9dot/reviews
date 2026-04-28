// review-saas/components/dashboard/MobileBottomNav.jsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Star,
  BarChart2,
  Settings,
} from 'lucide-react';

const tabs = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { href: '/customers', icon: Users, label: 'Customers' },
  { href: '/reviews', icon: Star, label: 'Reviews' },
  { href: '/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
      {tabs.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href ||
          (href !== '/dashboard' && pathname.startsWith(href));

        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all"
          >
            <Icon
              size={22}
              className={isActive ? 'text-purple-600' : 'text-gray-400'}
              strokeWidth={isActive ? 2.5 : 1.8}
            />
            <span className={[
              'text-xs font-semibold',
              isActive ? 'text-purple-600' : 'text-gray-400',
            ].join(' ')}>
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}