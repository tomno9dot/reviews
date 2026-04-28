// components/SendReviewForm.jsx
// Make sure field names match exactly what API expects

'use client';

import { useState } from 'react';
import { Send, User, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SendReviewForm() {
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.customerName.trim()) {
      toast.error('Please enter customer name');
      return;
    }

    if (!form.customerEmail.trim()) {
      toast.error('Please enter customer email');
      return;
    }

    setLoading(true);

    // ✅ Log what we are sending
    const payload = {
      customerName: form.customerName.trim(),
      customerEmail: form.customerEmail.trim().toLowerCase(),
      customerPhone: form.customerPhone.trim(),
    };

    console.log('Sending payload:', payload);

    try {
      const res = await fetch('/api/reviews/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('Response:', data);

      if (!res.ok) {
        if (data.upgradeRequired) {
          toast.error('Monthly limit reached! Upgrade your plan.');
        } else {
          toast.error(data.error || 'Failed to send request');
        }
        return;
      }

      toast.success(data.message || 'Review request sent!');

      // Clear form
      setForm({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
      });

    } catch (err) {
      console.error('Network error:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Customer Name *
        </label>
        <div className="relative">
          <User
            className="absolute left-3 top-3.5 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="e.g. John Doe"
            value={form.customerName}
            onChange={(e) =>
              setForm({ ...form, customerName: e.target.value })
            }
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Customer Email *
        </label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-3.5 text-gray-400"
            size={18}
          />
          <input
            type="email"
            placeholder="john@email.com"
            value={form.customerEmail}
            onChange={(e) =>
              setForm({ ...form, customerEmail: e.target.value })
            }
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Phone{' '}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="relative">
          <Phone
            className="absolute left-3 top-3.5 text-gray-400"
            size={18}
          />
          <input
            type="tel"
            placeholder="+234 800 000 0000"
            value={form.customerPhone}
            onChange={(e) =>
              setForm({ ...form, customerPhone: e.target.value })
            }
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={18} />
            Send Review Request
          </>
        )}
      </button>
    </form>
  );
}