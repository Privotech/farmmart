export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-[#F9FBF4]">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Last updated: August 13, 2026
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using FarmMart (TerraTrace Pro), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 leading-relaxed">
                FarmMart (TerraTrace Pro) provides an online digital marketplace platform that connects buyers and sellers of agricultural animals and livestock. The platform includes features for listing animals, managing inventory, processing orders, tracking logistics, and facilitating secure payments.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts & Registration</h2>
              <p className="text-gray-600 mb-3 leading-relaxed">
                To access certain features of the platform, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>You may not register as a buyer and seller with separate accounts using the same credentials without authorization</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Roles & Responsibilities</h2>
              <div className="bg-[#F9FBF4] p-6 rounded-2xl space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-emerald-700 mb-2">Sellers</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-600">
                    <li>Listings must be accurate and truthful regarding animal health, breed, age, and condition</li>
                    <li>All animals listed must be legally owned and available for sale</li>
                    <li>Sellers are responsible for delivering listings as described</li>
                    <li>Maintain proper documentation including health certificates</li>
                    <li>All veterinary records must be accurate and verifiable</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-emerald-700 mb-2">Buyers</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-600">
                    <li>Inspect animals or request verified documentation before purchase</li>
                    <li>Complete payment for successful orders</li>
                    <li>Provide accurate delivery information</li>
                    <li>Report discrepancies within 24 hours of delivery</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-emerald-700 mb-2">Administrators</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-600">
                    <li>Moderate platform content and listings</li>
                    <li>Resolve disputes between buyers and sellers</li>
                    <li>Ensure compliance with terms and conditions</li>
                    <li>Maintain platform security and integrity</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Listings & Transactions</h2>
              <p className="text-gray-600 mb-3 leading-relaxed">
                All animal listings on the platform must comply with the following:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Pricing must be clear and in Naira (₦) unless otherwise specified</li>
                <li>Images must accurately represent the animal being sold</li>
                <li>Animals must meet minimum health standards before listing</li>
                <li>No endangered or protected species may be listed</li>
                <li>Sellers must honor valid bids or purchases confirmed by the platform</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payments & Fees</h2>
              <p className="text-gray-600 mb-3 leading-relaxed">
                Our platform integrates with Paystack for secure payment processing. By using our services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Buyers agree to pay all amounts due for confirmed purchases</li>
                <li>Platform transaction fees will be clearly disclosed before processing</li>
                <li>All payments are processed through verified third-party providers</li>
                <li>Refunds are subject to our refund policy and dispute resolution process</li>
                <li>Payment disputes should be raised within 7 days of the transaction</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Delivery & Logistics</h2>
              <p className="text-gray-600 mb-3 leading-relaxed">
                Logistics and animal transportation services provided through or arranged by our platform:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Delivery timelines are estimates and not guaranteed unless confirmed in writing</li>
                <li>Buyers are responsible for providing access and safe reception of animals</li>
                <li>Transportation insurance is available and disclosed at checkout</li>
                <li>Any transportation claims must be documented immediately upon delivery</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Prohibited Activities</h2>
              <p className="text-gray-600 mb-3">Users may NOT engage in any of the following activities:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Violate any applicable laws, regulations, or animal welfare standards</li>
                <li>Engage in fraudulent listings, misrepresentations, or deceptive practices</li>
                <li>Interfere with platform security features or other user accounts</li>
                <li>Circumvent platform fees or payment systems</li>
                <li>Harass, abuse, or harm another user or animal</li>
                <li>Use platform data for commercial purposes without authorization</li>
                <li>Upload viruses, malware, or harmful code</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed">
                All content, trademarks, logos, and intellectual property on the FarmMart platform, including but not limited to text, graphics, user interfaces, and software, is the property of TerraTrace Pro or its licensors and is protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-600 mt-3 leading-relaxed">
                Users retain ownership of content they upload, but grant FarmMart a non-exclusive license to use, display, and distribute that content for the purposes of providing the service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Privacy & Data</h2>
              <p className="text-gray-600 leading-relaxed">
                Your use of FarmMart is also governed by our Privacy Policy, which outlines how we collect, use, and protect your personal information. By using our platform, you consent to our collection and use of data as described in the Privacy Policy.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
              <p className="text-gray-600 mb-3 leading-relaxed">
                We reserve the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Terminate or suspend user accounts that violate these terms</li>
                <li>Remove any content or listings at our discretion</li>
                <li>Discontinue any part of the service at any time</li>
                <li>Users may terminate their accounts at any time by contacting support</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Disclaimers & Limitation of Liability</h2>
              <p className="text-gray-600 mb-3 leading-relaxed">
                The platform is provided on an "as is" and "as available" basis. We make no warranties, express or implied, regarding:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                <li>The accuracy or reliability of any listings or user-generated content</li>
                <li>The health, quality, or condition of animals sold through third parties</li>
                <li>Uninterrupted or error-free access to the platform</li>
                <li>Outcomes of transactions between users</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                TerraTrace Pro shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Dispute Resolution</h2>
              <p className="text-gray-600 leading-relaxed">
                Any disputes between users of the platform will first be mediated by our admin team. Failing resolution, disputes shall be governed by the laws of Nigeria and submitted to the exclusive jurisdiction of the courts in Lagos State, Nigeria.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We may modify or update these Terms and Conditions at any time. Changes will be effective upon posting to the platform. Continued use of the platform after changes are posted constitutes your acceptance of the updated terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
              <p className="text-gray-600 leading-relaxed mb-2">
                For questions regarding these terms, please reach out to us through:
              </p>
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
                <p className="mb-1"><span className="font-semibold text-emerald-800">Email:</span> support@terratracepro.com</p>
                <p className="mb-1"><span className="font-semibold text-emerald-800">Phone:</span> +234 800 123 4567</p>
                <p className="mb-1"><span className="font-semibold text-emerald-800">Address:</span> Lagos, Nigeria</p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-500 italic">
                By using FarmMart (TerraTrace Pro), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; 2026 TerraTrace Pro (FarmMart). All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
