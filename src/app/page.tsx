import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#121212]">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-green-900 via-green-800 to-black"></div>
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            The Digital Agronomist
          </h1>
          <p className="text-2xl md:text-3xl mb-4 font-light text-green-100">
            FarmMart
          </p>
          <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-gray-200">
            Transform your agricultural operations with cutting-edge technology.
            Track, manage, and optimize your farm with precision and ease.
          </p>
        </div>
      </section>

      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-100">
            Ecosystem Architecture
          </h2>
          <p className="text-xl text-center text-gray-400 mb-16 max-w-3xl mx-auto">
            A comprehensive platform designed for modern agricultural management
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition border border-gray-700">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-green-900/30 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    className="w-8 h-8 text-green-400"
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
                <h3 className="text-2xl font-bold text-gray-100">
                  Strategic Acquisition
                </h3>
              </div>
              <p className="text-gray-400 mb-6">
                Make informed purchasing decisions with real-time market data
                and analytics. Connect with verified sellers and access
                transparent pricing.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
                  Live Market Data
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
                  Smart Contracts
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
                  Price Analytics
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition border border-gray-700">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-green-900/30 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    className="w-8 h-8 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-100">
                  Inventory Mastery
                </h3>
              </div>
              <p className="text-gray-400 mb-6">
                Complete control over your livestock and resources. Track health
                metrics, breeding records, and inventory levels in real-time.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
                  Manage Herd
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
                  Health Records
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
                  Feed Management
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition border border-gray-700">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-green-900/30 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    className="w-8 h-8 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-100">
                  Sustainable Practices
                </h3>
              </div>
              <p className="text-gray-400 mb-6">
                Implement eco-friendly farming methods with carbon footprint
                tracking, soil health monitoring, and waste management
                solutions.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
                  Carbon Tracking
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
                  Soil Health
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
                  Waste Reduction
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition border border-gray-700">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-green-900/30 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    className="w-8 h-8 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-100">
                  Community Network
                </h3>
              </div>
              <p className="text-gray-400 mb-6">
                Connect with a global community of farmers, veterinarians, and
                agricultural experts. Share knowledge and access mentorship.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
                  Expert Connect
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
                  Knowledge Base
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
                  Community Forum
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#121212]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-100">
            Command & Control
          </h2>
          <p className="text-xl text-center text-gray-400 mb-16 max-w-3xl mx-auto">
            Centralized dashboard for complete operational oversight
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-700">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-medium">
                      Total Revenue
                    </span>
                    <span className="text-2xl font-bold text-green-400">
                      ₦2.4M
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-medium">
                      Active Listings
                    </span>
                    <span className="text-2xl font-bold text-green-400">
                      156
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-medium">
                      Health Score
                    </span>
                    <span className="text-2xl font-bold text-green-400">
                      94%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: "94%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border-2 border-green-200 rounded-xl p-6 hover:border-green-400 transition">
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  Real-Time Monitoring
                </h4>
                <p className="text-gray-600">
                  Track your entire operation from a single dashboard. Get
                  instant alerts and notifications for critical events.
                </p>
              </div>

              <div className="bg-white border-2 border-green-200 rounded-xl p-6 hover:border-green-400 transition">
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  Data Analytics
                </h4>
                <p className="text-gray-600">
                  Advanced analytics and reporting tools to help you make
                  data-driven decisions for your farm.
                </p>
              </div>

              <div className="bg-white border-2 border-green-200 rounded-xl p-6 hover:border-green-400 transition">
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  Automated Workflows
                </h4>
                <p className="text-gray-600">
                  Streamline operations with automated processes for feeding,
                  health checks, and maintenance schedules.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Granular Origin Tracking Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
            Granular Origin Tracking
          </h2>
          <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            Complete traceability from birth to market
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-green-600"
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
                  <h3 className="text-2xl font-bold text-gray-800">
                    Genetic Verification
                  </h3>
                </div>
                <p className="text-gray-600">
                  Verify the genetic lineage and health history of every animal.
                  Ensure quality and authenticity with blockchain-verified
                  records.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Geo-Fence Logs
                  </h3>
                </div>
                <p className="text-gray-600">
                  Track movement and location history with precision geofencing.
                  Monitor grazing patterns and ensure optimal land utilization.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-linear-to-br from-green-100 to-green-200 rounded-2xl p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg
                      className="w-10 h-10 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-green-800 font-semibold">
                    Health Certified
                  </p>
                </div>
              </div>

              <div className="bg-linear-to-br from-green-100 to-green-200 rounded-2xl p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg
                      className="w-10 h-10 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <p className="text-green-800 font-semibold">
                    Verified Origin
                  </p>
                </div>
              </div>

              <div className="bg-linear-to-br from-green-100 to-green-200 rounded-2xl p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg
                      className="w-10 h-10 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-green-800 font-semibold">Real-Time Data</p>
                </div>
              </div>

              <div className="bg-linear-to-br from-green-100 to-green-200 rounded-2xl p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg
                      className="w-10 h-10 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <p className="text-green-800 font-semibold">Analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-linear-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to modernize your operations?
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto text-green-100">
            Join thousands of farmers who are transforming their agricultural
            operations with FarmMart
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-green-400">
                FarmMart
              </h3>
              <p className="text-gray-400">
                The Digital Agronomist - Transforming agriculture with
                technology.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition">
                    Email Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition">
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} FarmMart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
