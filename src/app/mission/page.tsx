
export default function MissionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-emerald-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block px-6 py-2 bg-white/20 rounded-full mb-6">
              <span className="font-bold text-sm">Our Purpose</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our Mission
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
              To transform African agriculture through technology, empowering farmers to thrive
              and ensuring food security for generations to come.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Details Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">What Drives Us</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At TerraTrace Pro, our mission is rooted in a deep belief that African agriculture
                holds the key to the continent&apos;s future prosperity. We&apos;re committed to removing
                barriers that have long prevented smallholder farmers from accessing fair markets.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We believe that every farmer deserves the chance to earn a dignified livelihood,
                and every buyer deserves access to quality, traceable produce.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Through our platform, we&apos;re creating an ecosystem where trust, transparency, and
                collaboration thrive – ensuring that agriculture works for everyone.
              </p>
            </div>
            <div className="space-y-6">
              <div className="bg-[#F9FBF4] p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Economic Empowerment</h3>
                </div>
                <p className="text-gray-600">
                  Ensuring farmers receive fair prices and sustainable income for their hard work.
                </p>
              </div>

              <div className="bg-[#F9FBF4] p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Food Security</h3>
                </div>
                <p className="text-gray-600">
                  Strengthening food systems to ensure availability and accessibility for all.
                </p>
              </div>

              <div className="bg-[#F9FBF4] p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Sustainability</h3>
                </div>
                <p className="text-gray-600">
                  Promoting farming practices that protect our planet for future generations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-[#F9FBF4]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These are the principles that guide everything we do.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Integrity", desc: "We are honest, transparent, and ethical in all our interactions." },
              { title: "Innovation", desc: "We continuously seek better ways to serve our community." },
              { title: "Collaboration", desc: "We believe in the power of partnerships and shared success." },
              { title: "Impact", desc: "We measure our success by the positive change we create." }
            ].map((value, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
                <h3 className="text-2xl font-bold text-emerald-600 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>&copy; 2024 TerraTrace Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
