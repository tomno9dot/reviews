'use client';
import { useState } from 'react';
import { Check, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const plans = [
  {
    name: 'Free',
    price: '₦0',
    period: 'forever',
    type: 'free',
    color: 'gray',
    features: [
      '10 review requests/month',
      '1 business location',
      'Email support',
      'Basic dashboard'
    ]
  },
  {
    name: 'Starter',
    price: '₦5,000',
    period: '/month',
    type: 'starter',
    color: 'purple',
    popular: true,
    features: [
      '100 review requests/month',
      '1 business location',
      'Priority email support',
      'Full analytics',
      'Custom email templates'
    ]
  },
  {
    name: 'Pro',
    price: '₦10,000',
    period: '/month',
    type: 'pro',
    color: 'blue',
    features: [
      'Unlimited review requests',
      'Up to 3 locations',
      'Priority support',
      'Advanced analytics',
      'API access',
      'White-label emails'
    ]
  }
];

export default function PricingCards({ currentPlan }) {
  const [loading, setLoading] = useState(null);

  const handleUpgrade = async (planType) => {
    if (planType === 'free' || planType === currentPlan) return;
    
    setLoading(planType);
    
    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      // Redirect to Paystack checkout
      window.location.href = data.authorizationUrl;

    } catch (err) {
      toast.error('Payment initialization failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {plans.map((plan) => (
        <div
          key={plan.type}
          className={`relative bg-white rounded-2xl p-6 border-2 transition-all ${
            plan.popular
              ? 'border-purple-500 shadow-xl shadow-purple-100'
              : 'border-gray-100 shadow-sm'
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </span>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {plan.name}
            </h3>
            <div className="mt-2">
              <span className="text-3xl font-bold text-gray-900">
                {plan.price}
              </span>
              <span className="text-gray-500 text-sm">
                {plan.period}
              </span>
            </div>
          </div>

          <ul className="space-y-3 mb-6">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <Check size={16} className="text-green-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleUpgrade(plan.type)}
            disabled={loading === plan.type || currentPlan === plan.type}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              currentPlan === plan.type
                ? 'bg-green-50 text-green-600 border border-green-200 cursor-default'
                : plan.popular
                ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {loading === plan.type ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : currentPlan === plan.type ? (
              '✅ Current Plan'
            ) : plan.type === 'free' ? (
              'Downgrade'
            ) : (
              <>
                <Zap size={16} />
                Upgrade Now
              </>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}