import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface text-text-secondary py-12 mt-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.svg" alt="FarmMart" width={40} height={40} className="w-10 h-10" />
              <h3 className="text-2xl font-bold text-foreground">FarmMart</h3>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Your trusted platform for buying and selling high-quality livestock and farm animals across Nigeria.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-lg bg-primary-50 border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary-200 hover:bg-primary-50 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-lg bg-primary-50 border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary-200 hover:bg-primary-50 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-lg bg-primary-50 border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary-200 hover:bg-primary-50 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-lg bg-primary-50 border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary-200 hover:bg-primary-50 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Marketplace</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/listings" className="hover:text-primary transition">
                  Browse Animals
                </Link>
              </li>
              <li>
                <Link href="/buyer/price-index" className="hover:text-primary transition">
                  Price Index
                </Link>
              </li>
              <li>
                <Link href="/logistics" className="hover:text-primary transition">
                  Logistics &amp; Delivery
                </Link>
              </li>
              <li>
                <Link href="/buyer/live-bids" className="hover:text-primary transition">
                  Live Bids
                </Link>
              </li>
              <li>
                <Link href="/seller/animals/new" className="hover:text-primary transition">
                  Sell Your Livestock
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="hover:text-primary transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/mission" className="hover:text-primary transition">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/vision" className="hover:text-primary transition">
                  Our Vision
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-primary transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Monthly Digest</h4>
            <p className="text-text-secondary mb-4 leading-relaxed">Get market price trends, new livestock alerts, and farming tips in your inbox.</p>
            <form className="space-y-2.5">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 border border-border rounded-xl bg-primary-50 text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-surface transition text-sm"
              />
              <button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary-hover text-secondary-foreground font-semibold px-4 py-2.5 rounded-xl transition text-sm shadow-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-secondary">
            © {currentYear} FarmMart. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <Link href="/terms" className="hover:text-primary transition">Terms</Link>
            <span className="text-border">•</span>
            <Link href="#" className="hover:text-primary transition">Privacy Policy</Link>
            <span className="text-border">•</span>
            <Link href="/contact-us" className="hover:text-primary transition">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
