// app/(auth)/login/page.jsx

import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';

// ✅ Wrap the component that uses useSearchParams in Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}

// Loading state while suspense resolves
function LoginLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}