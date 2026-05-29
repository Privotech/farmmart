import Link from "next/link";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 text-gray-700 py-12 mt-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.svg" alt="FarmMart" className="w-10 h-10" />
              <h3 className="text-2xl font-bold text-gray-900">FarmMart</h3>
            </div>
            <p className="text-gray-600">
              Your trusted platform for buying and selling high-quality livestock and farm animals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link href="/listings" className="hover:text-emerald-600 transition">
                  Browse Animals
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-600 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-600 transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link href="/help" className="hover:text-emerald-600 transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-600 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-emerald-600 transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay in touch</h4>
            <p className="text-gray-600 mb-4">Get updates on new listings and offers.</p>
            <form className="flex gap-2">
              <input placeholder="Your email" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400" />
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="pt-8">
          <p className="text-center text-gray-500">
            © {currentYear} FarmMart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
