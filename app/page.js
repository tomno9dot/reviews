// review-saas/app/page.jsx

import Link from 'next/link';

export const metadata = {
  title: 'ReviewBoost - Get More Google Reviews Automatically | Free Trial',
  description:
    'ReviewBoost automatically sends review requests to your customers ' +
    'via email after every visit. Get 3x more Google reviews in 30 days. ' +
    'Works for restaurants, salons, clinics, hotels worldwide. ' +
    'Start free - no credit card needed.',
  keywords: [
    'google review software',
    'review automation tool',
    'get more google reviews fast',
    'review request emails',
    'restaurant review tool',
    'salon review software',
    'automated review generation',
  ],
  openGraph: {
    title: 'ReviewBoost - Get 3x More Google Reviews in 30 Days',
    description:
      'Automatically ask customers for reviews after every visit. ' +
      'Free 14-day trial. No credit card needed.',
    images: ['/og-image.png'],
  },
};

const stats = [
  { number: '10,000+', label: 'Reviews Generated' },
  { number: '500+', label: 'Active Businesses' },
  { number: '3x', label: 'More Reviews on Average' },
  { number: '30 days', label: 'To See Results' },
];

const features = [
  {
    emoji: '⭐',
    title: 'Automatic Review Requests',
    desc: 'Send personalized email requests to customers instantly after their visit. No manual work needed.',
  },
  {
    emoji: '📊',
    title: 'Track Your Growth',
    desc: 'See exactly how many requests were sent, opened, and converted to reviews with detailed analytics.',
  },
  {
    emoji: '🔔',
    title: 'Smart Follow-Ups',
    desc: 'Automatically send gentle reminders to customers who did not respond to the first request.',
  },
  {
    emoji: '📱',
    title: 'Mobile App Included',
    desc: 'Send review requests on the go with our iOS and Android app. Perfect for busy business owners.',
  },
  {
    emoji: '🤖',
    title: 'AI Response Suggestions',
    desc: 'Get AI-powered suggestions to respond to your Google reviews professionally and quickly.',
  },
  {
    emoji: '🌍',
    title: 'Works Worldwide',
    desc: 'Available for businesses in any country. Works with Google Business Profile globally.',
  },
];

const businessTypes = [
  { emoji: '🍽️', name: 'Restaurants' },
  { emoji: '💇', name: 'Salons' },
  { emoji: '🏥', name: 'Clinics' },
  { emoji: '💊', name: 'Pharmacies' },
  { emoji: '🏨', name: 'Hotels' },
  { emoji: '💪', name: 'Gyms' },
  { emoji: '🚗', name: 'Auto Repair' },
  { emoji: '🛍️', name: 'Retail Shops' },
  { emoji: '🦷', name: 'Dentists' },
  { emoji: '👁️', name: 'Optometrists' },
  { emoji: '🐾', name: 'Vet Clinics' },
  { emoji: '🏛️', name: 'Law Firms' },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    business: 'The Green Kitchen, London',
    country: '🇬🇧',
    text: 'We went from 23 reviews to 156 in just 8 weeks. Our bookings are up 60%!',
    rating: 5,
  },
  {
    name: 'Amaka Okafor',
    business: 'Glow Hair Salon, Lagos',
    country: '🇳🇬',
    text: 'ReviewBoost is a game changer. 12 reviews to 89 in 6 weeks. Customers find us on Google daily now.',
    rating: 5,
  },
  {
    name: 'Carlos Martinez',
    business: 'Dr Martinez Dental, Miami',
    country: '🇺🇸',
    text: 'Best investment for our clinic. 300% more reviews and our Google ranking improved dramatically.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    business: 'Wellness Spa, Dubai',
    country: '🇦🇪',
    text: 'Simple, effective and affordable. We have more reviews than any competitor in our area now.',
    rating: 5,
  },
];

const faqs = [
  {
    q: 'How does ReviewBoost work?',
    a: 'After a customer visits your business, you enter their name and email. ReviewBoost automatically sends them a friendly review request email with a direct link to your Google review page. Simple!',
  },
  {
    q: 'Do I need a Google Business account?',
    a: 'Yes. You need a free Google Business Profile (business.google.com). This is where your reviews appear. Setup takes about 5 minutes.',
  },
  {
    q: 'What countries does ReviewBoost support?',
    a: 'ReviewBoost works in any country where Google Business Profile is available. That includes USA, UK, Canada, Australia, Nigeria, Ghana, Kenya, South Africa, UAE, India and 100+ more countries.',
  },
  {
    q: 'How much does it cost?',
    a: 'We have a free plan with 10 review requests per month. Paid plans start at just $9/month (or local equivalent) for 100 requests. No contracts, cancel anytime.',
  },
  {
    q: 'How quickly will I see results?',
    a: 'Most businesses receive their first new review within 48 hours. On average, businesses get 3x more reviews in their first 30 days.',
  },
  {
    q: 'Is there a mobile app?',
    a: 'Yes! ReviewBoost has iOS and Android apps. You can send review requests directly from your phone right after serving a customer.',
  },
  {
    q: 'What if customers do not respond?',
    a: 'ReviewBoost automatically sends a gentle follow-up reminder to customers who did not respond. This increases review rates by 40%.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No contracts, no cancellation fees. Cancel from your dashboard anytime with one click.',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      '10 review requests/month',
      '1 business location',
      'Email review requests',
      'Basic dashboard',
      'Mobile app access',
    ],
    cta: 'Start Free',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Starter',
    price: '$9',
    period: '/month',
    features: [
      '100 review requests/month',
      '1 business location',
      'Auto follow-up emails',
      'Full analytics dashboard',
      'Custom email templates',
      'Priority email support',
      'Mobile app access',
    ],
    cta: 'Start Free Trial',
    href: '/register',
    highlight: true,
    badge: 'MOST POPULAR',
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    features: [
      'Unlimited review requests',
      'Up to 3 locations',
      'AI response suggestions',
      'Advanced analytics',
      'Weekly email reports',
      'API access',
      'Priority support',
      'Everything in Starter',
    ],
    cta: 'Start Free Trial',
    href: '/register',
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ✅ Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'ReviewBoost',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web, iOS, Android',
            description:
              'Automatically send Google review requests to customers. Get 3x more reviews in 30 days.',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              reviewCount: '500',
            },
          }),
        }}
      />

      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="text-xl font-bold text-gray-800">
              ReviewBoost
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">
              Pricing
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900 font-medium">
              Reviews
            </a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900 font-medium">
              FAQ
            </a>
            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Login
            </Link>
          </div>
          <Link
            href="/register"
            className="bg-purple-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-purple-700 transition"
          >
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 px-6 text-center bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <span>🌍</span>
            <span>Trusted by 500+ businesses in 50+ countries</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6">
            Get More{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Google Reviews
            </span>{' '}
            Automatically
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Send automatic review requests to your customers after every visit.
            Most businesses see{' '}
            <strong className="text-gray-900">3x more reviews in 30 days.</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/register"
              className="bg-purple-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-purple-700 transition shadow-xl shadow-purple-200"
            >
              Start Free — No Credit Card
            </Link>
            <a
              href="#how-it-works"
              className="border-2 border-gray-300 text-gray-700 px-10 py-5 rounded-2xl text-xl font-semibold hover:border-purple-400 transition"
            >
              See How It Works ↓
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span>✅ 14-day free trial</span>
            <span>✅ No credit card</span>
            <span>✅ Cancel anytime</span>
            <span>✅ Works worldwide</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-black text-purple-600">
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
      <section id="how-it-works" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              How ReviewBoost Works
            </h2>
            <p className="text-xl text-gray-600">
              3 simple steps to 3x more Google reviews
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                emoji: '👤',
                title: 'Add Customer',
                desc: 'Enter your customer\'s name and email after their visit. Takes 10 seconds.',
              },
              {
                step: '2',
                emoji: '📧',
                title: 'Auto Email Sent',
                desc: 'ReviewBoost instantly sends them a friendly, personalized review request.',
              },
              {
                step: '3',
                emoji: '⭐',
                title: 'Reviews Come In',
                desc: 'Customers click the link and leave you a Google review. You grow automatically.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100 relative"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-black text-sm">
                  {item.step}
                </div>
                <div className="text-5xl mb-4 mt-2">{item.emoji}</div>
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

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features to grow your online reputation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
              >
                <span className="text-4xl block mb-4">{feature.emoji}</span>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 px-6 bg-purple-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Perfect For Any Local Business
            </h2>
            <p className="text-xl text-gray-600">
              Works for businesses in any industry, in any country
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {businessTypes.map((biz) => (
              <div
                key={biz.name}
                className="bg-white rounded-2xl p-4 text-center hover:shadow-md transition cursor-default"
              >
                <span className="text-3xl block mb-2">{biz.emoji}</span>
                <span className="text-xs font-semibold text-gray-600">
                  {biz.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Businesses Love ReviewBoost
            </h2>
            <p className="text-xl text-gray-600">
              Real results from real businesses around the world
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-xl">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4 leading-relaxed text-lg">
                  {'"' + t.text + '"'}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">
                      {t.name} {t.country}
                    </p>
                    <p className="text-gray-500 text-sm">{t.business}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free. Upgrade when you are ready. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={
                  'bg-white rounded-3xl p-8 border-2 relative ' +
                  (plan.highlight
                    ? 'border-purple-500 shadow-2xl shadow-purple-100'
                    : 'border-gray-100 shadow-sm')
                }
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-purple-600 text-white text-xs font-black px-4 py-1.5 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-black text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="text-green-500 font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={
                    'block text-center py-4 rounded-xl font-bold transition ' +
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

          <p className="text-center text-gray-500 mt-8 text-sm">
            All prices in USD. Local currency accepted.
            Paystack, Stripe, and more payment methods supported.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <h3 className="font-bold text-gray-800 mb-2 text-lg">
                  {faq.q}
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to Get More Google Reviews?
          </h2>
          <p className="text-xl text-purple-200 mb-10">
            Join 500+ businesses worldwide already growing with ReviewBoost.
            Start your free trial today.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-purple-600 px-12 py-5 rounded-2xl text-xl font-black hover:bg-gray-100 transition shadow-2xl"
          >
            Start Free Trial — No Credit Card
          </Link>
          <p className="text-purple-300 mt-4 text-sm">
            14-day free trial &bull; Cancel anytime &bull; Works worldwide
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⭐</span>
                <span className="text-white font-bold text-xl">
                  ReviewBoost
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                Helping local businesses worldwide get more Google reviews automatically.
              </p>
              <div className="flex gap-3">
                <a href="https://twitter.com/reviewboostapp" className="text-gray-400 hover:text-white transition">
                  Twitter
                </a>
                <a href="https://instagram.com/reviewboostapp" className="text-gray-400 hover:text-white transition">
                  Instagram
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><Link href="/register" className="hover:text-white transition">Free Trial</Link></li>
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} ReviewBoost. All rights reserved.
            </p>
            <p className="text-sm">
              🌍 Available worldwide &bull; 50+ countries
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}