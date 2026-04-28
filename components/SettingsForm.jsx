// components/SettingsForm.jsx
// COMPLETE FILE with clear Google Review link section

'use client';

import { useState } from 'react';
import {
  Building2,
  Link,
  Phone,
  Save,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

const businessTypes = [
  { value: 'restaurant', label: 'Restaurant / Cafe' },
  { value: 'salon', label: 'Salon / Barbershop' },
  { value: 'clinic', label: 'Clinic / Hospital' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'gym', label: 'Gym / Fitness' },
  { value: 'retail', label: 'Retail Store' },
  { value: 'other', label: 'Other Business' },
];

export default function SettingsForm({ user }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    businessName: user?.businessName || '',
    businessType: user?.businessType || 'other',
    googleReviewLink: user?.googleReviewLink || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasReviewLink = form.googleReviewLink.trim().length > 0;

  const isValidGoogleLink =
    form.googleReviewLink.includes('google') ||
    form.googleReviewLink.includes('g.page') ||
    form.googleReviewLink.includes('maps.app') ||
    form.googleReviewLink.includes('goo.gl');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!form.businessName.trim()) {
      toast.error('Please enter your business name');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to save settings');
        return;
      }

      toast.success('Settings saved successfully!');

    } catch (err) {
      toast.error('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyTestLink = async () => {
    const testLink = 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4';
    await navigator.clipboard.writeText(testLink);
    setCopied(true);
    setForm({ ...form, googleReviewLink: testLink });
    toast.success('Test link pasted! Replace with your real link later.');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">

      {/* Google Review Link - MOST IMPORTANT SECTION */}
      <div className={
        'rounded-2xl p-6 border-2 ' +
        (hasReviewLink && isValidGoogleLink
          ? 'bg-green-50 border-green-300'
          : 'bg-amber-50 border-amber-300')
      }>
        {/* Status Header */}
        <div className="flex items-center gap-2 mb-1">
          {hasReviewLink && isValidGoogleLink ? (
            <CheckCircle size={20} className="text-green-600" />
          ) : (
            <AlertCircle size={20} className="text-amber-600" />
          )}
          <h3 className={
            'font-bold text-lg ' +
            (hasReviewLink && isValidGoogleLink
              ? 'text-green-800'
              : 'text-amber-800')
          }>
            {hasReviewLink && isValidGoogleLink
              ? 'Google Review Link is Set!'
              : 'Action Required: Add Your Google Review Link'}
          </h3>
        </div>

        <p className={
          'text-sm mb-4 ' +
          (hasReviewLink && isValidGoogleLink
            ? 'text-green-700'
            : 'text-amber-700')
        }>
          {hasReviewLink && isValidGoogleLink
            ? 'Your customers will be sent to this link to leave reviews.'
            : 'You cannot send review requests until you add this link.'}
        </p>

        {/* Input */}
        <div className="mb-3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Google Review Link
          </label>
          <div className="relative">
            <Link
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
            <input
              type="url"
              placeholder="https://g.page/r/your-business/review"
              value={form.googleReviewLink}
              onChange={(e) =>
                setForm({ ...form, googleReviewLink: e.target.value })
              }
              className={
                'w-full pl-10 pr-4 py-3 border-2 rounded-xl ' +
                'focus:outline-none focus:ring-2 focus:ring-purple-500 ' +
                'bg-white text-gray-800 ' +
                (hasReviewLink && isValidGoogleLink
                  ? 'border-green-300'
                  : 'border-amber-300')
              }
            />
          </div>
        </div>

        {/* How to get link */}
        <div className="bg-white bg-opacity-70 rounded-xl p-4 mb-3">
          <p className="text-sm font-bold text-gray-700 mb-3">
            How to get your Google Review link:
          </p>

          <div className="space-y-2">
            {[
              {
                step: '1',
                text: 'Go to',
                link: 'https://business.google.com',
                linkText: 'business.google.com',
              },
              {
                step: '2',
                text: 'Sign in and select your business',
              },
              {
                step: '3',
                text: 'Click "Ask for reviews" button',
              },
              {
                step: '4',
                text: 'Copy the link and paste it above',
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {item.step}
                </span>
                <p className="text-sm text-gray-600">
                  {item.text}{' '}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      {item.linkText}
                      <ExternalLink size={12} />
                    </a>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* OR use Google Maps */}
        <div className="bg-white bg-opacity-70 rounded-xl p-4 mb-3">
          <p className="text-sm font-bold text-gray-700 mb-2">
            OR find it on Google Maps:
          </p>
          <div className="space-y-1.5">
            {[
              'Open Google Maps and search your business name',
              'Click on your business',
              'Scroll down and click "Reviews"',
              'Click "Write a review"',
              'Copy the URL from your browser',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-purple-500 font-bold text-sm flex-shrink-0">
                  {i + 1}.
                </span>
                <p className="text-sm text-gray-600">{step}</p>
              </div>
            ))}
          </div>

          {/* Open Google Maps button */}
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-2 text-sm text-blue-600 font-semibold hover:underline"
          >
            <ExternalLink size={14} />
            Open Google Maps
          </a>
        </div>

        {/* Test with sample link */}
        {!hasReviewLink && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <p className="text-xs text-blue-700 font-semibold mb-2">
              Want to test first? Use a sample link:
            </p>
            <button
              type="button"
              onClick={copyTestLink}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Pasted!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Use Sample Link for Testing
                </>
              )}
            </button>
            <p className="text-xs text-blue-600 mt-2">
              Replace with your real Google Review link before going live
            </p>
          </div>
        )}

        {/* Valid link preview */}
        {hasReviewLink && isValidGoogleLink && (
          <div className="flex items-center gap-2 mt-2">
            <CheckCircle size={16} className="text-green-600" />
            <p className="text-sm text-green-700 font-medium">
              Valid Google link detected!
            </p>
            <a
              href={form.googleReviewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              Test link
              <ExternalLink size={12} />
            </a>
          </div>
        )}

        {/* Invalid link warning */}
        {hasReviewLink && !isValidGoogleLink && (
          <div className="flex items-center gap-2 mt-2">
            <AlertCircle size={16} className="text-red-500" />
            <p className="text-sm text-red-600 font-medium">
              This does not look like a Google link. Please check it.
            </p>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-800">
          Business Information
        </h3>

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Your Full Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            required
          />
        </div>

        {/* Business Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Business Name *
          </label>
          <div className="relative">
            <Building2
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={form.businessName}
              onChange={(e) =>
                setForm({ ...form, businessName: e.target.value })
              }
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              required
            />
          </div>
        </div>

        {/* Business Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Business Type
          </label>
          <select
            value={form.businessType}
            onChange={(e) =>
              setForm({ ...form, businessType: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white transition"
          >
            {businessTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Phone Number{' '}
            <span className="text-gray-400 font-normal">
              (optional)
            </span>
          </label>
          <div className="relative">
            <Phone
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
            <input
              type="tel"
              placeholder="+234 800 000 0000"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 shadow-lg"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Save size={18} />
        )}
        Save Settings
      </button>
    </form>
  );
}