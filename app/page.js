import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <span className="text-xl font-bold text-gray-800">ReviewBoost</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-900">
            Login
          </Link>
          <Link
            href="/register"
            className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 font-medium"
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <span className="bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-2 rounded-full">
          🚀 Trusted by 500+ businesses
        </span>
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mt-6 leading-tight">
          Get More Google Reviews{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            On Autopilot
          </span>
        </h1>
        
        <p className="text-xl text-gray-500 mt-6 max-w-2xl mx-auto">
          Send automatic review requests to your customers after every visit. 
          Most businesses see <strong>3x more reviews</strong> in 30 days.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/register"
            className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-700 shadow-xl shadow-purple-200"
          >
            Start Free — No Credit Card
          </Link>
          <Link
            href="#demo"
            className="border border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50"
          >
            Watch Demo ▶
          </Link>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          Free plan includes 10 review requests/month
        </p>
      </section>

      {/* Social Proof */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-6 py-10">
        {[
          { stat: '3x', label: 'More reviews on average' },
          { stat: '500+', label: 'Active businesses' },
          { stat: '30 sec', label: 'Setup time' }
        ].map(({ stat, label }) => (
          <div key={label} className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-4xl font-bold text-purple-600">{stat}</p>
            <p className="text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </section>

    </main>
  );
}