// review-saas/app/(dashboard)/layout.jsx

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Sidebar from '@/components/dashboard/Sidebar';
import MobileNav from '@/components/dashboard/MobileNav';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ✅ Desktop Sidebar - only visible on large screens */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* ✅ Mobile Top Bar - only on mobile */}
      <div className="lg:hidden">
        <MobileNav />
      </div>

      {/* ✅ Main Content */}
      <main className="
        lg:ml-64
        pt-16
        lg:pt-0
        pb-24
        lg:pb-6
        min-h-screen
      ">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* ✅ Mobile Bottom Tab Bar */}
      <nav className="
        fixed bottom-0 left-0 right-0 z-50
        bg-white border-t border-gray-200
        lg:hidden
        safe-area-pb
      ">
        <MobileBottomNav />
      </nav>
    </div>
  );
}