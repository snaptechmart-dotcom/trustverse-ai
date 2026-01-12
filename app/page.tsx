export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* ================= HERO SECTION ================= */}
      <header className="bg-[#061826] text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Trustverse AI
        </h1>

        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Verify people, phone numbers, and online profiles using AI-powered trust,
          fraud detection, and risk analysis.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/login"
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
          >
            Login
          </a>
          <a
            href="/waitlist"
            className="border border-white px-6 py-3 rounded-lg"
          >
            Join Waitlist
          </a>
        </div>

        <p className="mt-4 text-sm text-gray-400">
          No credit card required • Free access available
        </p>
      </header>

      {/* ================= FEATURES HEADING ================= */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Powerful AI Tools to Detect Scams & Fraud
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Trustverse AI provides intelligent trust analysis tools designed to help you
            verify people, phone numbers, and online profiles before making critical
            decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="font-semibold text-lg mb-2">
              Trust Score Analyzer
            </h3>
            <p className="text-gray-600">
              AI-powered trust scoring that analyzes reputation data, fraud patterns,
              and risk signals to instantly identify suspicious people and profiles.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="font-semibold text-lg mb-2">
              Phone Verification
            </h3>
            <p className="text-gray-600">
              Detect spam calls, scam numbers, and fraudulent activity using intelligent
              phone verification and real-world behavior signals.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="font-semibold text-lg mb-2">
              Profile History
            </h3>
            <p className="text-gray-600">
              Track trust reports, user complaints, and historical risk data to understand
              a profile’s credibility over time.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SEO BOOST PARAGRAPH ================= */}
      <section className="px-6 pb-20 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">
          AI-Powered Scam Detection & Trust Analysis Platform
        </h2>
        <p className="text-gray-600">
          Trustverse AI is an advanced trust and fraud detection platform designed to help
          users verify people, phone numbers, and online profiles before taking action.
          Our AI-driven trust score system analyzes reputation data, scam patterns, and
          activity signals to prevent online fraud and financial loss.
        </p>
      </section>

      {/* ================= TESTIMONIALS SECTION ================= */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Trusted by Users to Detect Scams & Fraud
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-12">
            Thousands of users rely on Trustverse AI to verify people, phone numbers,
            and online profiles before making important decisions.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  R
                </div>
              </div>
              <div className="text-yellow-500 text-lg mb-2">★★★★★</div>
              <p className="text-gray-700 mb-4">
                Trustverse AI helped me instantly detect a scam call.
                The trust score feature is surprisingly accurate.
              </p>
              <div className="font-semibold text-sm">Rahul S.</div>
              <div className="text-xs text-gray-500">Small Business Owner</div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                  N
                </div>
              </div>
              <div className="text-yellow-500 text-lg mb-2">★★★★★</div>
              <p className="text-gray-700 mb-4">
                I checked a suspicious online profile before sending money.
                This platform saved me from a potential fraud.
              </p>
              <div className="font-semibold text-sm">Neha P.</div>
              <div className="text-xs text-gray-500">Freelancer</div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                  A
                </div>
              </div>
              <div className="text-yellow-500 text-lg mb-2">★★★★★</div>
              <p className="text-gray-700 mb-4">
                Phone verification and profile history features are extremely useful.
                Highly recommended for anyone dealing online.
              </p>
              <div className="font-semibold text-sm">Aman K.</div>
              <div className="text-xs text-gray-500">Startup Founder</div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Start Verifying Before You Trust
            </h3>
            <p className="text-gray-600 mb-6">
              Join Trustverse AI today and protect yourself from scams, fraud,
              and risky online interactions.
            </p>
            <a
              href="/login"
              className="inline-block bg-[#061826] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </section>

      {/* ================= BLOG PREVIEW SECTION ================= */}
      <section className="bg-gray-100 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Trust & Scam Awareness Blog
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg mb-2">
                How to Identify Online Scams in 2026
              </h3>
              <p className="text-gray-600 text-sm">
                Learn common scam patterns, red flags, and how AI trust analysis
                can protect you before financial loss occurs.
              </p>
              <a href="/blog" className="text-blue-600 text-sm font-semibold mt-3 inline-block">
                Read More →
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg mb-2">
                Phone Number Verification Explained
              </h3>
              <p className="text-gray-600 text-sm">
                Understand how scam calls operate and how phone verification
                helps reduce fraud and identity theft.
              </p>
              <a href="/blog" className="text-blue-600 text-sm font-semibold mt-3 inline-block">
                Read More →
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg mb-2">
                Why Trust Scores Matter Online
              </h3>
              <p className="text-gray-600 text-sm">
                Discover how trust scores help individuals and businesses
                make safer online decisions.
              </p>
              <a href="/blog" className="text-blue-600 text-sm font-semibold mt-3 inline-block">
                Read More →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold">
                What is Trustverse AI?
              </h3>
              <p className="text-gray-600">
                Trustverse AI is an AI-powered trust and fraud detection platform
                that helps users verify people, phone numbers, and online profiles.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Is Trustverse AI free to use?
              </h3>
              <p className="text-gray-600">
                Yes, free access is available with limited usage.
                PRO plans offer unlimited advanced analysis features.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                How accurate are trust scores?
              </h3>
              <p className="text-gray-600">
                Trust scores are generated using AI models trained on fraud patterns,
                reputation data, and behavioral signals for high accuracy.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Can businesses use Trustverse AI?
              </h3>
              <p className="text-gray-600">
                Absolutely. Trustverse AI is designed for individuals,
                professionals, and businesses worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
