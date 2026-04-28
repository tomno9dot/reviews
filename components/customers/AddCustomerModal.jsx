'use client';
import { useState } from 'react';
import { X, UserPlus, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddCustomerModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [sendRequest, setSendRequest] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Add customer
      const addRes = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const addData = await addRes.json();

      if (!addRes.ok) {
        toast.error(addData.error);
        return;
      }

      // Optionally send review request immediately
      if (sendRequest) {
        const sendRes = await fetch('/api/reviews/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });

        const sendData = await sendRes.json();
        
        if (sendRes.ok) {
          toast.success(`${form.name} added & review request sent! ⭐`);
        } else {
          toast.success(`${form.name} added!`);
          if (sendData.upgradeRequired) {
            toast.error('Monthly limit reached for review requests');
          }
        }
      } else {
        toast.success(`${form.name} added successfully!`);
      }

      onSuccess();

    } catch (err) {
      toast.error('Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <UserPlus size={20} className="text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Add Customer
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="john@email.com"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number 
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="tel"
              placeholder="+234 800 000 0000"
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Send Request Toggle */}
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
            <input
              type="checkbox"
              id="sendRequest"
              checked={sendRequest}
              onChange={e => setSendRequest(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="sendRequest" className="flex items-center gap-2 cursor-pointer">
              <Send size={16} className="text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-800">
                  Send review request immediately
                </p>
                <p className="text-xs text-purple-600">
                  Customer will receive email right away
                </p>
              </div>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              Cancel
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
                  <UserPlus size={16} />
                  Add Customer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}