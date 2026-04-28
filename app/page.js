// app/page.jsx - Full SEO optimized landing page

import Link from 'next/link';

export const metadata = {
  title: 'ReviewBoost - Get More Google Reviews Automatically in Nigeria',
  description:
    'Send automatic Google review requests to your customers via email. ' +
    'Restaurants, salons, clinics get 3x more reviews in 30 days. ' +
    'Start free - no credit card needed.',
};

const testimonials = [
  {
    name: 'Amaka Johnson',
    business: 'Glow Hair Salon, Lagos',
    text: 'We went from 8 reviews to 67 in 6 weeks. Our bookings increased by 40%!',
    rating: 5,
    avatar: 'A',
  },
  {
    name: 'Chidi Okafor',
    business: 'Chidi Restaurant, Abuja',
    text: 'ReviewBoost is a game changer. Customers actually leave reviews now!',
    rating: 5,
    avatar: 'C',
  },
  {
    name: 'Fatima Hassan',
    business: 'HealthPlus Pharmacy, Kano',
    text: 'So easy to use. I send review requests right after serving customers.',
    rating: 5,
    avatar: 'F',
  },
];

const faqs = [
  {
    q: 'How does ReviewBoost work?',
    a: 'You enter your customer name and email after their visit. ' +
      'ReviewBoost automatically sends them a friendly email asking ' +
      'for a Google review. Simple!',
  },
  {
    q: 'Do I need a Google Business account?',
    a: 'Yes. You need a free Google Business Profile. ' +
      'Go to business.google.com to set it up if you have not already.',
  },
  {
    q: 'How much does it cost?',
    a: 'We have a free plan with 10 requests per month. ' +
      'Paid plans start at ₦5,000/month for 100 requests.',
  },
  {
    q: 'Will this work for my type of business?',
    a: 'Yes! ReviewBoost works for restaurants, salons, barbershops, ' +
      'clinics, pharmacies, hotels, gyms and any local business.',
  },
  {
    q: 'Is there a contract or commitment?',
    a: 'No contracts. Cancel anytime. We offer a 14-day free trial ' +
      'with no credit card required.',
  },
  {
    q: 'How quickly will I see more reviews?',
    a: 'Most businesses see their first new review within 48 hours. ' +
      'On average, businesses get 3x more reviews in 30 days.',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="text-xl font-bold text-gray-800">
              ReviewBoost
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              How it Works
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              FAQ
            </a>
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Login
            </Link>
          </div>
          <Link
            href="/register"
            className="bg-purple-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-purple-700 transition shadow-sm"
          >
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 text-center bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-purple-100 text-purple-700 text-sm font-bold px-4 py-2 rounded-full mb-6">
            🚀 Trusted by 500+ Nigerian Businesses
          </span>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Get More Google Reviews{' '}
            <span className="text-purple-600">Automatically</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Send automatic review requests to your customers after
            every visit. Most Nigerian businesses see{' '}
            <strong>3x more Google reviews</strong> in 30 days.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/register"
              className="bg-purple-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-purple-700 transition shadow-lg"
            >
              Start Free - No Credit Card
            </Link>
            <a
              href="#how-it-works"
              className="border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-full text-lg font-semibold hover:border-purple-400 transition"
            >
              See How It Works ↓
            </a>
          </div>

          <p className="text-sm text-gray-400">
            ✅ 14-day free trial &nbsp;&nbsp;
            ✅ No credit card &nbsp;&nbsp;
            ✅ Cancel anytime
          </p>
        </div>
      </section>

      {/* Social Proof Numbers */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { number: '500+', label: 'Active Businesses' },
              { number: '3x', label: 'More Reviews on Average' },
              { number: '30 days', label: 'To See Results' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold text-purple-600">
                  {stat.number}
                </p>
                <p className="text-gray-500 mt-1 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 px-6 bg-gray-50"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How ReviewBoost Works
            </h2>
            <p className="text-xl text-gray-600">
              3 simple steps to get more Google reviews
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                emoji: '👤',
                title: 'Add Customer',
                desc: 'Enter your customer name and email after their visit. Takes 10 seconds.',
              },
              {
                step: '2',
                emoji: '📧',
                title: 'Auto Email Sent',
                desc: 'ReviewBoost instantly sends them a friendly review request email.',
              },
              {
                step: '3',
                emoji: '⭐',
                title: 'Get Reviews',
                desc: 'Customers click the link and leave you a Google review. Simple!',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100"
              >
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Perfect For Nigerian Local Businesses
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: '🍽️', name: 'Restaurants' },
              { emoji: '💇', name: 'Salons' },
              { emoji: '🏥', name: 'Clinics' },
              { emoji: '💊', name: 'Pharmacies' },
              { emoji: '🏨', name: 'Hotels' },
              { emoji: '💪', name: 'Gyms' },
              { emoji: '🚗', name: 'Car Wash' },
              { emoji: '🛍️', name: 'Retail Shops' },
            ].map((biz) => (
              <div
                key={biz.name}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-purple-50 transition cursor-default"
              >
                <span className="text-4xl block mb-2">
                  {biz.emoji}
                </span>
                <span className="font-semibold text-gray-700">
                  {biz.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-purple-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Nigerian Businesses Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-xl">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4 leading-relaxed">
                  {'"' + t.text + '"'}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">
                      {t.name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {t.business}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Affordable Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free. Upgrade when you are ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Free',
                price: '₦0',
                period: 'forever',
                features: [
                  '10 review requests/month',
                  '1 business location',
                  'Email review requests',
                  'Basic dashboard',
                ],
                cta: 'Start Free',
                href: '/register',
                highlight: false,
              },
              {
                name: 'Starter',
                price: '₦5,000',
                period: '/month',
                features: [
                  '100 review requests/month',
                  '1 business location',
                  'Email review requests',
                  'Auto follow-ups',
                  'Full analytics',
                  'Priority support',
                ],
                cta: 'Start Free Trial',
                href: '/register',
                highlight: true,
              },
              {
                name: 'Pro',
                price: '₦10,000',
                period: '/month',
                features: [
                  'Unlimited requests',
                  'Up to 3 locations',
                  'Email + WhatsApp',
                  'AI response suggestions',
                  'Advanced analytics',
                  'Weekly reports',
                ],
                cta: 'Start Free Trial',
                href: '/register',
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={
                  'rounded-2xl p-8 border-2 ' +
                  (plan.highlight
                    ? 'border-purple-500 bg-purple-50 shadow-xl relative'
                    : 'border-gray-100 bg-white shadow-sm')
                }
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-gray-600 text-sm"
                    >
                      <span className="text-green-500 font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={
                    'block text-center py-3 px-6 rounded-xl font-bold transition ' +
                    (plan.highlight
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                  }
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h3 className="font-bold text-gray-800 mb-2 text-lg">
                  {faq.q}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-purple-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Get More Google Reviews?
          </h2>
          <p className="text-xl text-purple-200 mb-8">
            Join 500+ Nigerian businesses already growing with ReviewBoost.
            Start your free trial today.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-purple-600 px-12 py-4 rounded-full text-xl font-bold hover:bg-gray-100 transition shadow-xl"
          >
            Start Free - No Credit Card Needed
          </Link>
          <p className="text-purple-300 mt-4 text-sm">
            14-day free trial &bull; Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⭐</span>
                <span className="text-white font-bold text-lg">
                  ReviewBoost
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                Helping Nigerian businesses get more Google reviews automatically.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#how-it-works" className="hover:text-white transition">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition">
                    Free Trial
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#faq" className="hover:text-white transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@reviewboost.com.ng"
                    className="hover:text-white transition"
                  >
                    Email Us
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/234XXXXXXXXXX"
                    className="hover:text-white transition"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} ReviewBoost. All rights reserved.
              Made with ❤️ in Nigeria.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}