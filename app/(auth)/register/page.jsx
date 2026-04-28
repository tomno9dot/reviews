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
  Check
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
  { value: 'other', label: '🏢 Other Business' }
];

const benefits = [
  'Get 3x more Google reviews',
  'Automated email requests',
  'Track review performance',
  'Free 14-day trial'
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // Multi-step form
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    businessType: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!form.password) newErrors.password = 'Password is required';
    if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!form.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    if (!form.businessType) {
      newErrors.businessType = 'Please select business type';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Registration failed');
        return;
      }

      toast.success('Account created! Redirecting...');
      router.push('/login?registered=true');

    } catch (err) {
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex">
      
      {/* Left Panel - Benefits (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-blue-600 p-12 flex-col justify-between">
        
        <div className="flex items-center gap-3">
          <Star size={32} className="text-white" fill="white" />
          <span className="text-2xl font-bold text-white">
            ReviewBoost
          </span>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-white leading-tight">
            Get More Reviews,<br />
            Get More Customers
          </h2>
          <p className="text-purple-200 mt-4 text-lg">
            Join 500+ businesses already growing 
            with ReviewBoost
          </p>

          <div className="mt-8 space-y-4">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={14} className="text-white" />
                </div>
                <span className="text-white text-lg">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-12 bg-white bg-opacity-10 rounded-2xl p-6">
            <p className="text-white text-lg italic">
              "We went from 12 reviews to 89 reviews 
              in just 6 weeks. Our bookings increased by 40%!"
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <p className="text-white font-semibold">Amaka Johnson</p>
                <p className="text-purple-300 text-sm">
                  Glow Salon, Lagos
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-purple-300 text-sm">
          © 2024 ReviewBoost. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Star size={28} className="text-purple-600" fill="currentColor" />
            <span className="text-xl font-bold text-gray-800">
              ReviewBoost
            </span>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-3 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {step > s ? <Check size={16} /> : s}
                </div>
                <span className={`text-sm font-medium ${
                  step >= s ? 'text-purple-600' : 'text-gray-400'
                }`}>
                  {s === 1 ? 'Your Account' : 'Your Business'}
                </span>
                {s === 1 && (
                  <div className={`flex-1 h-1 rounded-full ${
                    step > 1 ? 'bg-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {step === 1 ? 'Create your account' : 'Tell us about your business'}
          </h1>
          <p className="text-gray-500 mb-6 text-sm">
            {step === 1 
              ? 'Start your free 14-day trial today' 
              : 'Help us customize ReviewBoost for you'
            }
          </p>

          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4">
                
                {/* Name */}
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
                      onChange={e => updateForm('name', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                        errors.name 
                          ? 'border-red-400 bg-red-50' 
                          : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
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
                      onChange={e => updateForm('email', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                        errors.email 
                          ? 'border-red-400 bg-red-50' 
                          : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
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
                      onChange={e => updateForm('password', e.target.value)}
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                        errors.password 
                          ? 'border-red-400 bg-red-50' 
                          : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword 
                        ? <EyeOff size={18} /> 
                        : <Eye size={18} />
                      }
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                  
                  {/* Password strength */}
                  {form.password && (
                    <div className="mt-2 flex gap-1">
                      {[1,2,3,4].map(i => (
                        <div 
                          key={i}
                          className={`h-1 flex-1 rounded-full ${
                            form.password.length >= i * 2
                              ? i <= 2 ? 'bg-red-400' 
                              : i === 3 ? 'bg-yellow-400'
                              : 'bg-green-400'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
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
                
                {/* Business Name */}
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
                      onChange={e => updateForm('businessName', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                        errors.businessName 
                          ? 'border-red-400 bg-red-50' 
                          : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.businessName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.businessName}
                    </p>
                  )}
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Business Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {businessTypes.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => updateForm('businessType', type.value)}
                        className={`p-3 border-2 rounded-xl text-sm font-medium text-left transition-all ${
                          form.businessType === type.value
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 text-gray-600 hover:border-purple-300'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                  {errors.businessType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.businessType}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    WhatsApp / Phone 
                    <span className="text-gray-400 font-normal ml-1">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={form.phone}
                    onChange={e => updateForm('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex gap-3">
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
                    className="flex-2 flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50"
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

                <p className="text-xs text-gray-400 text-center">
                  By signing up, you agree to our{' '}
                  <a href="/terms" className="text-purple-600 hover:underline">
                    Terms
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-purple-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            )}
          </form>

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
    </div>
  );
}