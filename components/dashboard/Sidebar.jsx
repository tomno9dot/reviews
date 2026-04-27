'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Users, 
  Star, 
  Settings, 
  LogOut,
  Zap
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/customers', icon: Users, label: 'Customers' },
  { href: '/reviews', icon: Star, label: 'Reviews' },
  { href: '/settings', icon: Settings, label: 'Settings' }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0">
      
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Star className="text-purple-600" size={24} fill="currentColor" />
          <span className="text-xl font-bold text-gray-800">
            ReviewBoost
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {session?.user?.businessName}
        </p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Plan Badge + Upgrade */}
      <div className="p-4 border-t border-gray-200">
        {session?.user?.plan === 'free' && (
          <Link
            href="/settings?tab=billing"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-xl mb-3 hover:opacity-90 transition"
          >
            <Zap size={16} fill="currentColor" />
            <span className="font-semibold text-sm">
              Upgrade Plan
            </span>
          </Link>
        )}
        
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 text-gray-500 hover:text-red-500 px-4 py-2 w-full rounded-xl hover:bg-red-50 transition"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}