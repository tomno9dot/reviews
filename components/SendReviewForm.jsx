'use client';
import { useState } from 'react';
import { Send, User, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SendReviewForm() {
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/reviews/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.upgradeRequired) {
          toast.error('Monthly limit reached! Please upgrade your plan.');
        } else {
          toast.error(data.error || 'Something went wrong');
        }
        return;
      }

      toast.success(`Review request sent to ${form.customerName}! 🎉`);
      setForm({ customerName: '', customerEmail: '', customerPhone: '' });

    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* Customer Name */}
      <div className="relative">
        <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Customer Name"
          value={form.customerName}
          onChange={e => setForm({...form, customerName: e.target.value})}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>

      {/* Customer Email */}
      <div className="relative">
        <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
        <input
          type="email"
          placeholder="Customer Email"
          value={form.customerEmail}
          onChange={e => setForm({...form, customerEmail: e.target.value})}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>

      {/* Customer Phone (Optional) */}
      <div className="relative">
        <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
        <input
          type="tel"
          placeholder="Phone Number (optional)"
          value={form.customerPhone}
          onChange={e => setForm({...form, customerPhone: e.target.value})}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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