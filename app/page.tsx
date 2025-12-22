export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-[#061826] text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Trustverse AI
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Verify people, numbers and profiles with AI-powered trust analysis.
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
      </header>

      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg">Trust Score Analyzer</h3>
          <p className="text-gray-500 mt-2">
            AI-based trust score using reputation & risk signals.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg">Phone Verification</h3>
          <p className="text-gray-500 mt-2">
            Detect spam, fraud & activity signals.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg">Profile History</h3>
          <p className="text-gray-500 mt-2">
            Track reports & trust history.
          </p>
        </div>
      </section>
    </main>
  );
}
