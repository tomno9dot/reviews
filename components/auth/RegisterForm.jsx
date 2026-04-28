// components/auth/RegisterForm.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building2,
  ArrowRight,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

const businessTypes = [
  { value: 'restaurant', label: '🍽️ Restaurant / Cafe' },
  { value: 'salon', label: '💇 Salon / Barbershop' },
  { value: 'clinic', label: '🏥 Clinic / Hospital' },
  { value: 'pharmacy', label: '💊 Pharmacy' },
  { value: 'hotel', label: '🏨 Hotel' },
  { value: 'gym', label: '💪 Gym / Fitness' },
  { value: 'retail', label: '🛍️ Retail Store' },
  { value: 'other', label: '🏢 Other Business' },
];

export default function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    businessType: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = 'Enter a valid email';
    if (!form.password) newErrors.password = 'Password is required';
    if (form.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!form.businessName.trim())
      newErrors.businessName = 'Business name is required';
    if (!form.businessType)
      newErrors.businessType = 'Please select business type';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Registration failed');
        return;
      }

      toast.success('Account created!');
      router.push('/login?registered=true');

    } catch (err) {
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <Star size={28} className="text-purple-600" fill="currentColor" />
          <span className="text-xl font-bold text-gray-800">
            ReviewBoost
          </span>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3 flex-1">
              <div className={
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ' +
                (step >= s
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-400')
              }>
                {step > s ? <Check size={16} /> : s}
              </div>
              <span className={
                'text-sm font-medium ' +
                (step >= s ? 'text-purple-600' : 'text-gray-400')
              }>
                {s === 1 ? 'Your Account' : 'Your Business'}
              </span>
              {s === 1 && (
                <div className={
                  'flex-1 h-1 rounded-full ' +
                  (step > 1 ? 'bg-purple-600' : 'bg-gray-200')
                } />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {step === 1 ? 'Create your account' : 'About your business'}
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            {step === 1
              ? 'Start your free 14-day trial'
              : 'Help us set up ReviewBoost for you'}
          </p>

          <form onSubmit={step === 2 ? handleSubmit : handleNext}>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      className={
                        'w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ' +
                        (errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200')
                      }
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input
                      type="email"
                      placeholder="john@business.com"
                      value={form.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      className={
                        'w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ' +
                        (errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200')
                      }
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 6 characters"
                      value={form.password}
                      onChange={(e) => updateForm('password', e.target.value)}
                      className={
                        'w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ' +
                        (errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200')
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition mt-2"
                >
                  Continue
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Business Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="e.g. Mama Titi Restaurant"
                      value={form.businessName}
                      onChange={(e) => updateForm('businessName', e.target.value)}
                      className={
                        'w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ' +
                        (errors.businessName ? 'border-red-400 bg-red-50' : 'border-gray-200')
                      }
                    />
                  </div>
                  {errors.businessName && (
                    <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Business Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {businessTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => updateForm('businessType', type.value)}
                        className={
                          'p-3 border-2 rounded-xl text-sm font-medium text-left transition-all ' +
                          (form.businessType === type.value
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 text-gray-600 hover:border-purple-300')
                        }
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                  {errors.businessType && (
                    <p className="text-red-500 text-xs mt-1">{errors.businessType}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Create Account
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-purple-600 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}