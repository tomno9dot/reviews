// components/referral/ReferralClient.jsx
// ✅ Twitter was renamed to X in newer lucide-react
// Replace Twitter with a custom X icon or use text

'use client';

import { useState } from 'react';
import {
  Copy,
  Check,
  Share2,
  Gift,
  Users,
  Star,
  MessageCircle,
  Mail,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

const toneLabels = {
  professional: { label: 'Professional', color: 'blue' },
  friendly: { label: 'Friendly', color: 'green' },
  enthusiastic: { label: 'Enthusiastic', color: 'purple' },
};

export default function ReferralClient({
  referralLink,
  referralCode,
  stats,
}) {
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 3000);
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCodeCopied(true);
    toast.success('Code copied!');
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      'Hey! I have been using ReviewBoost to get more Google reviews for my business automatically.\n\n' +
      'Sign up free here: ' + referralLink + '\n\n' +
      'You get 14 days free trial!'
    );
    window.open('https://wa.me/?text=' + text, '_blank');
  };

  // ✅ Use X (formerly Twitter) - open URL directly
  const shareTwitter = () => {
    const text = encodeURIComponent(
      'Getting more Google reviews on autopilot with ReviewBoost! ' +
      'Perfect for local businesses. Try it free: ' +
      referralLink
    );
    window.open(
      'https://twitter.com/intent/tweet?text=' + text,
      '_blank'
    );
  };

  const shareEmail = () => {
    const subject = encodeURIComponent(
      'Get more Google reviews automatically'
    );
    const body = encodeURIComponent(
      'Hi,\n\n' +
      'I wanted to share this tool called ReviewBoost that automatically ' +
      'sends review requests to your customers.\n\n' +
      'Since I started using it, my business got 3x more Google reviews.\n\n' +
      'You can try it free for 14 days here: ' + referralLink + '\n\n' +
      'Best regards'
    );
    window.open('mailto:?subject=' + subject + '&body=' + body);
  };

  const statItems = [
    {
      label: 'Total Referred',
      value: stats?.totalReferrals || 0,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Signed Up',
      value: stats?.signedUp || 0,
      icon: Check,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Upgraded',
      value: stats?.converted || 0,
      icon: Star,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Free Months Earned',
      value: stats?.freeMonthsEarned || 0,
      icon: Gift,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">

      {/* How it works */}
      <div
        className="rounded-2xl p-6 text-white"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
        }}
      >
        <h2 className="text-xl font-bold mb-4">
          How the referral program works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              emoji: '🔗',
              title: 'Share your link',
              desc: 'Share your unique referral link with other business owners',
            },
            {
              emoji: '✅',
              title: 'They sign up',
              desc: 'They create a free account using your link',
            },
            {
              emoji: '🎁',
              title: 'You get rewarded',
              desc: 'When they upgrade, you get 1 FREE month added',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white bg-opacity-10 rounded-2xl p-4"
            >
              <span className="text-3xl">{item.emoji}</span>
              <p className="font-bold mt-2 text-white">
                {item.title}
              </p>
              <p className="text-sm text-purple-200 mt-1">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center"
            >
              <div
                className={
                  'w-10 h-10 ' +
                  stat.bg +
                  ' rounded-xl flex items-center justify-center mx-auto mb-2'
                }
              >
                <Icon size={20} className={stat.color} />
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Referral Link Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Your Referral Link
        </h3>

        {/* Link + Copy button */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 truncate font-mono">
            {referralLink}
          </div>
          <button
            onClick={copyLink}
            className={
              'flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ' +
              (copied
                ? 'bg-green-600 text-white'
                : 'bg-purple-600 text-white hover:bg-purple-700')
            }
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy
              </>
            )}
          </button>
        </div>

        {/* Referral Code */}
        <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-500 font-medium">
              Your referral code
            </p>
            <p className="text-2xl font-bold text-purple-600 font-mono">
              {referralCode}
            </p>
          </div>
          <button
            onClick={copyCode}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            {codeCopied ? (
              <>
                <Check size={14} className="text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy Code
              </>
            )}
          </button>
        </div>

        {/* Share Buttons */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Share via:
          </p>
          <div className="grid grid-cols-3 gap-3">

            {/* WhatsApp */}
            <button
              onClick={shareWhatsApp}
              className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-2xl transition-all group"
            >
              <MessageCircle
                size={24}
                className="text-green-600 group-hover:scale-110 transition-transform"
              />
              <span className="text-xs font-semibold text-green-700">
                WhatsApp
              </span>
            </button>

            {/* ✅ Twitter/X - using ExternalLink icon instead */}
            <button
              onClick={shareTwitter}
              className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl transition-all group"
            >
              {/* ✅ Custom X icon using SVG - no lucide dependency */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-gray-800 group-hover:scale-110 transition-transform"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="text-xs font-semibold text-gray-700">
                Twitter / X
              </span>
            </button>

            {/* Email */}
            <button
              onClick={shareEmail}
              className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl transition-all group"
            >
              <Mail
                size={24}
                className="text-blue-600 group-hover:scale-110 transition-transform"
              />
              <span className="text-xs font-semibold text-blue-700">
                Email
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Gift size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-800">
            No limit on referrals!
          </p>
          <p className="text-sm text-amber-700 mt-0.5">
            Refer 5 businesses and get 5 free months.
            Refer 12 and get a whole year free!
          </p>
        </div>
      </div>
    </div>
  );
}