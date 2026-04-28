// review-saas/components/auth/LoginForm.jsx

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const from = searchParams.get('from') || '/dashboard';

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting login for:', form.email);

      const result = await signIn('credentials', {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        redirect: false,
        callbackUrl: from,
      });

      console.log('SignIn result:', result);

      // ✅ Handle different error types
      if (result?.error) {
        const friendlyErrors = {
          'No account found with this email':
            '❌ No account found with this email.',
          'Incorrect password':
            '❌ Incorrect password. Please try again.',
          'Email and password are required':
            '⚠️ Please enter your email and password.',
          'Database connection failed':
            '🔧 Server error. Please try again.',
          CredentialsSignin:
            '❌ Invalid email or password.',
          AccessDenied:
            '🚫 Access denied.',
        };

        const message =
          friendlyErrors[result.error] ||
          '❌ ' + result.error;

        toast.error(message, { duration: 4000 });
        return;
      }

      // ✅ Success
      if (result?.ok) {
        toast.success('Welcome back! 🎉');

        // ✅ Force full page reload for reliable session
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      }

    } catch (err) {
      console.error('Login exception:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <span className="text-3xl">⭐</span>
          <span className="text-2xl font-bold text-gray-800">
            ReviewBoost
          </span>
        </div>

        {/* Registration success */}
        {registered && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-6 text-sm text-center font-medium">
            🎉 Account created! Please sign in.
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Welcome back
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Sign in to your ReviewBoost account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@business.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                required
                autoComplete="email"
                autoCapitalize="none"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-purple-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full px-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-xl"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-purple-600 font-semibold hover:underline"
          >
            Start free trial
          </Link>
        </p>
      </div>
    </div>
  );
}