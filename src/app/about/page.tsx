export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-[#F9FBF4]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              About FarmMart
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              We&apos;re revolutionizing agricultural commerce by connecting
              farmers, buyers, and markets with cutting-edge technology and
              transparent practices.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                FarmMart was born out of a simple idea: every farmer
                deserves fair access to markets, and every buyer deserves
                transparency in their supply chain.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Founded by a team of agricultural experts and technology
                innovators, we&apos;ve built a platform that bridges the gap
                between traditional farming and modern commerce.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Today, we&apos;re proud to serve farmers and buyers
                across Nigeria, helping them connect, trade, and grow together.
              </p>
            </div>
            <div className="bg-[#F9FBF4] rounded-3xl p-10 shadow-lg border border-gray-100">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <h3 className="text-5xl font-bold text-emerald-600 mb-2">
                    2024
                  </h3>
                  <p className="text-gray-600 text-sm font-semibold">Founded</p>
                </div>
                <div className="text-center">
                  <h3 className="text-5xl font-bold text-emerald-600 mb-2">
                    Growing
                  </h3>
                  <p className="text-gray-600 text-sm font-semibold">Community</p>
                </div>
                <div className="text-center">
                  <h3 className="text-5xl font-bold text-emerald-600 mb-2">
                    Verified
                  </h3>
                  <p className="text-gray-600 text-sm font-semibold">Farmers</p>
                </div>
                <div className="text-center">
                  <h3 className="text-5xl font-bold text-emerald-600 mb-2">
                    Secure
                  </h3>
                  <p className="text-gray-600 text-sm font-semibold">Trades</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-24 bg-[#F9FBF4]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What We Do
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;re building the future of agricultural commerce, one
              connection at a time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Connect Farmers &amp; Buyers
              </h3>
              <p className="text-gray-600">
                We bring verified farmers and trusted buyers together on a
                single, easy-to-use platform.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Ensure Transparency
              </h3>
              <p className="text-gray-600">
                Verified sellers, transparent pricing, and complete
                traceability from farm to table with protected transactions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Empower Growth
              </h3>
              <p className="text-gray-600">
                Tools, analytics, and insights to help farmers and buyers scale
                their operations sustainably.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} FarmMart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
