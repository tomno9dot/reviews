// review-saas/components/dashboard/MobileNav.jsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Star,
  BarChart2,
  Settings,
  Gift,
  LogOut,
  Zap,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/customers', icon: Users, label: 'Customers' },
  { href: '/reviews', icon: Star, label: 'Reviews' },
  { href: '/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/referrals', icon: Gift, label: 'Referrals' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* ✅ Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">

        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
          onClick={closeMenu}
        >
          <span className="text-xl">⭐</span>
          <span className="text-lg font-bold text-gray-800">
            ReviewBoost
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Plan Badge */}
          <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
            {(session?.user?.plan || 'FREE').toUpperCase()}
          </span>

          {/* Hamburger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ✅ Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* ✅ Slide-in Menu */}
      <div className={[
        'fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl',
        'transform transition-transform duration-300 ease-in-out lg:hidden',
        menuOpen ? 'translate-x-0' : 'translate-x-full',
      ].join(' ')}>

        {/* Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <p className="font-bold text-gray-800 text-sm">
              {session?.user?.name}
            </p>
            <p className="text-xs text-gray-400 truncate max-w-40">
              {session?.user?.email}
            </p>
          </div>
          <button
            onClick={closeMenu}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Upgrade Banner */}
        {session?.user?.plan === 'free' && (
          <div className="mx-4 mt-4">
            <Link
              href="/settings?tab=billing"
              onClick={closeMenu}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-xl"
            >
              <Zap size={16} fill="currentColor" />
              <span className="font-semibold text-sm">
                Upgrade Plan
              </span>
            </Link>
          </div>
        )}

        {/* Nav Links */}
        <nav className="p-4 space-y-1 mt-2">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href ||
              (href !== '/dashboard' && pathname.startsWith(href));

            return (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className={[
                  'flex items-center gap-3 px-4 py-3.5 rounded-xl',
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

        {/* Sign Out */}
        <div className="absolute bottom-8 left-4 right-4">
          <button
            onClick={() => {
              closeMenu();
              signOut({ callbackUrl: '/login' });
            }}
            className="flex items-center gap-3 w-full text-red-500 hover:text-red-600 px-4 py-3 rounded-xl hover:bg-red-50 transition font-medium text-sm"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}