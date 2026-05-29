import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 animate-zoom-in">Welcome to FarmMart</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '120ms' }}>
            Your trusted marketplace for buying and selling farm animals. Connect with farmers across the country.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/listings"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 motion-safe:animate-pulse-slow"
              style={{ animationDelay: '220ms' }}
            >
              Browse Listings
            </Link>
            <Link
              href="/dashboard"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition transform hover:scale-105"
              style={{ animationDelay: '280ms' }}
            >
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-up" style={{ animationDelay: '320ms' }}>Why Choose FarmMart?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md card-hover-raise animate-fade-up" style={{ animationDelay: '360ms' }}>
              <img src="/cow.svg" alt="Cow" className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Wide Selection</h3>
              <p className="text-gray-600">Browse through hundreds of farm animals from trusted sellers</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md card-hover-raise animate-fade-up" style={{ animationDelay: '420ms' }}>
              <img src="/lock.svg" alt="Secure" className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure Transactions</h3>
              <p className="text-gray-600">Safe and secure payment processing with Paystack</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md card-hover-raise animate-fade-up" style={{ animationDelay: '480ms' }}>
              <img src="/handshake.svg" alt="Direct" className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Direct Connection</h3>
              <p className="text-gray-600">Connect directly with farmers and sellers</p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-md card-hover-raise animate-fade-up" style={{ animationDelay: '520ms' }}>
              <h4 className="text-lg font-bold mb-2">Verified Sellers</h4>
              <p className="text-gray-600">All sellers go through verification to ensure trust and quality.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md card-hover-raise animate-fade-up" style={{ animationDelay: '580ms' }}>
              <h4 className="text-lg font-bold mb-2">Fast Delivery</h4>
              <p className="text-gray-600">Options for local pickup and delivery partners to get animals to you quickly.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md card-hover-raise animate-fade-up" style={{ animationDelay: '640ms' }}>
              <h4 className="text-lg font-bold mb-2">Quality Assurance</h4>
              <p className="text-gray-600">Health checks and transparent histories for each listing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 animate-fade-up" style={{ animationDelay: '700ms' }}>What our users say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-lg animate-fade-up" style={{ animationDelay: '760ms' }}>
              <p className="text-gray-700">“FarmMart helped me sell my first herd in under a week. The platform is easy and reliable.”</p>
              <p className="mt-4 font-bold">— Amina, Farmer</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg animate-fade-up" style={{ animationDelay: '820ms' }}>
              <p className="text-gray-700">“Great selection and fast support. I found healthy animals at fair prices.”</p>
              <p className="mt-4 font-bold">— Chidi, Buyer</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg animate-fade-up" style={{ animationDelay: '880ms' }}>
              <p className="text-gray-700">“Secure payments and transparent listings — very happy with the experience.”</p>
              <p className="mt-4 font-bold">— Mercy, Farmer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Listings (placeholder) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 animate-fade-up" style={{ animationDelay: '920ms' }}>Latest Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-md animate-fade-up card-hover-raise" style={{ animationDelay: '960ms' }}>
              <h4 className="font-bold">Healthy Cow — 2 yrs</h4>
              <p className="text-gray-600 mb-4">Located in Oyo • ₦120,000</p>
              <Link href="/listings" className="text-green-600 font-semibold">View Listing</Link>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md animate-fade-up card-hover-raise" style={{ animationDelay: '1020ms' }}>
              <h4 className="font-bold">Dairy Goat — 6 months</h4>
              <p className="text-gray-600 mb-4">Located in Kaduna • ₦40,000</p>
              <Link href="/listings" className="text-green-600 font-semibold">View Listing</Link>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md animate-fade-up card-hover-raise" style={{ animationDelay: '1080ms' }}>
              <h4 className="font-bold">Layer Chickens — 20pcs</h4>
              <p className="text-gray-600 mb-4">Located in Lagos • ₦25,000</p>
              <Link href="/listings" className="text-green-600 font-semibold">View Listing</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 animate-fade-up" style={{ animationDelay: '1140ms' }}>Ready to Get Started?</h2>
          <p className="text-xl mb-8 animate-fade-up" style={{ animationDelay: '1180ms' }}>Join thousands of farmers and buyers on FarmMart today</p>
          <Link
            href="/listings"
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 animate-float-slow"
            style={{ animationDelay: '1240ms' }}
          >
            Explore Now
          </Link>
        </div>
      </section>
    </div>
  );
}
