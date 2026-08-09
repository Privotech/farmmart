import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-black text-emerald-50 py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-emerald-300 mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="text-emerald-200/70 text-lg">
            Last updated: August 8, 2026
          </p>
        </div>

        <div className="mb-10">
          <Card className="border-2 border-rose-600/40 bg-rose-950/20">
            <div className="flex gap-4 items-start">
              <div className="text-4xl flex-shrink-0 text-rose-400">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-10 h-10"
                >
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-rose-300 mb-3">
                  CRITICAL: OFF-PLATFORM COMMUNICATION DISCLAIMER
                </h2>
                <p className="text-rose-100/90 font-semibold mb-3">
                  PLEASE READ THIS SECTION CAREFULLY — IT AFFECTS YOUR LEGAL
                  RIGHTS.
                </p>
                <p className="text-emerald-100/80 leading-relaxed mb-3">
                  <strong className="text-rose-300">
                    FarmMart (the &quot;Platform&quot;, &quot;we&quot;,
                    &quot;us&quot;, or &quot;our&quot;) does NOT mediate,
                    facilitate, monitor, guarantee, or take ANY responsibility
                    whatsoever for transactions, discussions, agreements,
                    meetings, or communications that occur between buyers and
                    sellers OUTSIDE of the FarmMart platform or outside of
                    FarmMart&apos;s official in-app messaging system.
                  </strong>
                </p>
                <p className="text-emerald-100/80 leading-relaxed mb-3">
                  This includes, but is not limited to: communications via
                  WhatsApp, Telegram, SMS, phone calls, personal email, Facebook
                  Messenger, Instagram DM, physical meetings, handshakes, or any
                  other channel that is NOT the official FarmMart website
                  (farmmart.ng or farmmart.com) or its built-in messaging /
                  inquiry / checkout system.
                </p>
                <p className="text-emerald-100/80 leading-relaxed">
                  <strong className="text-rose-300">
                    If you choose to contact or meet a buyer or seller outside
                    the Platform, you do so AT YOUR OWN RISK. We are NOT liable
                    and will NOT be held responsible for any fake animals,
                    counterfeit goods, misrepresented livestock, scams, fraud,
                    financial losses, theft, personal injury, breach of
                    contract, or any other damages or harm that result from such
                    off-platform contact.
                  </strong>
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-300 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="leading-relaxed text-emerald-100/85 mb-3">
            By accessing or using FarmMart (&quot;the Platform&quot;), you
            signify your agreement to be bound by these Terms and Conditions. If
            you do not agree to these terms, please do not use the Platform.
            Continued use after changes to these terms constitutes your
            acceptance of such changes.
          </p>
        </Card>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-300 mb-4">
            2. Platform Role
          </h2>
          <p className="leading-relaxed text-emerald-100/85 mb-3">
            FarmMart operates as an online marketplace that enables independent
            third-party sellers (&quot;Sellers&quot;) to list livestock and
            related agricultural products for sale to registered buyers
            (&quot;Buyers&quot;).
          </p>
          <p className="leading-relaxed text-emerald-100/85">
            <strong className="text-emerald-200">
              We are an intermediary platform, NOT the seller of record.
            </strong>{" "}
            We do not own the animals listed. The actual sales contract is
            between Buyer and Seller directly. We are not a party to that
            contract beyond facilitating payment processing through our
            integrated Paystack payment gateway.
          </p>
        </Card>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-300 mb-4">
            3. Protected Transactions (ONLY On-Platform)
          </h2>
          <p className="leading-relaxed text-emerald-100/85 mb-3">
            To protect both Buyers and Sellers from fraud, ALL transactions and
            inquiries MUST be conducted through the Platform using:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-emerald-100/85 mb-3">
            <li>The official &quot;Add to Cart&quot; and Checkout flow</li>
            <li>
              The built-in &quot;Send Inquiry&quot; messaging on each listing
            </li>
            <li>
              The official Paystack payment integration (NOT bank transfers to
              personal accounts)
            </li>
            <li>The logistics partners displayed on the Platform</li>
          </ul>
          <p className="leading-relaxed text-emerald-100/85">
            Only payments made through the on-platform checkout are eligible for
            our
            <strong className="text-emerald-200">
              {" "}
              Purchase Protection{" "}
            </strong>{" "}
            program. Any payment made outside the checkout flow is completely
            excluded from any refund, dispute, or guarantee.
          </p>
        </Card>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-300 mb-4">
            4. User Accounts &amp; Verification
          </h2>
          <p className="leading-relaxed text-emerald-100/85 mb-3">
            All users must create an account to buy or sell. You agree to
            provide accurate, current, and complete information. FarmMart
            reserves the right to request additional identity verification (ID
            card, BVN, proof of address, utility bill) at any time, especially
            for Sellers listing high-value livestock.
          </p>
          <p className="leading-relaxed text-emerald-100/85">
            Accounts found to be encouraging off-platform contact — by listing
            phone numbers, WhatsApp links, or social media handles in animal
            descriptions, usernames, or profile bios — will receive an immediate
            warning and may be permanently banned from the Platform without
            refund of any fees.
          </p>
        </Card>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-300 mb-4">
            5. Seller Responsibilities &amp; Listing Accuracy
          </h2>
          <p className="leading-relaxed text-emerald-100/85 mb-3">
            Sellers are SOLELY responsible for the accuracy of their listings,
            including: animal breed, age, weight, health status, vaccinations,
            gender, photographs, and price.
          </p>
          <p className="leading-relaxed text-emerald-100/85">
            While FarmMart performs random listing reviews and provides an
            optional verification badge (&quot;Verified Seller&quot;), such
            badges do NOT constitute a guarantee of product authenticity or
            seller trustworthiness. They only indicate that the Seller has
            passed our identity check at a single point in time.
          </p>
        </Card>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-300 mb-4">
            6. Fees &amp; Payments
          </h2>
          <p className="leading-relaxed text-emerald-100/85 mb-2">
            • A platform commission of 5% is applied to every completed
            on-platform sale.
          </p>
          <p className="leading-relaxed text-emerald-100/85 mb-2">
            • A standard logistics &amp; insurance fee is added to all checkouts
            (currently ₦5,000 within Nigeria, subject to change by distance).
          </p>
          <p className="leading-relaxed text-emerald-100/85">
            • A 7.5% VAT is applied per Nigerian tax law.
          </p>
        </Card>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-300 mb-4">
            7. Logistics &amp; Delivery
          </h2>
          <p className="leading-relaxed text-emerald-100/85 mb-3">
            Buyers may choose (a) Platform-vetted logistics partners listed on
            the logistics page, or (b) self-arranged pickup.
          </p>
          <p className="leading-relaxed text-emerald-100/85">
            If a Buyer arranges their own transportation or meets the Seller in
            person to collect animals, the Platform bears no responsibility for
            animal condition, health, authenticity, or accidents during
            transport, even if the arrangement was discussed via on-platform
            messages.
          </p>
        </Card>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-300 mb-4">
            8. Dispute Resolution (On-Platform Only)
          </h2>
          <p className="leading-relaxed text-emerald-100/85 mb-3">
            For disputes arising from on-platform orders, FarmMart will attempt
            to mediate based on order records, chat logs, and evidence photos
            submitted within 48 hours of delivery. Mediation outcomes are final
            and binding on both parties.
          </p>
          <p className="leading-relaxed text-emerald-100/85">
            <strong className="text-rose-300">
              Disputes related to off-platform communications or transactions
              will NOT be entertained or reviewed by FarmMart, under any
              circumstances. Such disputes are the exclusive responsibility of
              the individuals involved and must be resolved directly between
              them, or through relevant legal authorities.
            </strong>
          </p>
        </Card>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-300 mb-4">
            9. Limitation of Liability
          </h2>
          <p className="leading-relaxed text-emerald-100/85 mb-3">
            To the FULLEST EXTENT PERMITTED BY APPLICABLE LAW, FarmMart, its
            officers, directors, employees, agents, affiliates, successors, and
            assigns shall NOT be liable for any indirect, incidental, special,
            consequential, or punitive damages — including but not limited to
            loss of profits, loss of animals, loss of data, business
            interruption, or personal injury — arising out of or related to your
            use (or inability to use) the Platform, or any dealings between you
            and other users, whether on or off the Platform.
          </p>
          <p className="leading-relaxed text-emerald-100/85">
            FarmMart&apos;s maximum aggregate liability under this Agreement
            shall in NO event exceed the total amount of fees actually paid by
            you to FarmMart in the 12-month period immediately preceding the
            event giving rise to the claim.
          </p>
        </Card>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-300 mb-4">
            10. Indemnification
          </h2>
          <p className="leading-relaxed text-emerald-100/85">
            You agree to indemnify, defend, and hold harmless FarmMart from any
            claims, actions, damages, losses, costs, and expenses (including
            reasonable attorneys&apos; fees) arising from: (a) your breach of
            these Terms; (b) your violation of any law or third-party right; or
            (c) any off-platform dealings, communications, or disputes between
            you and another user.
          </p>
        </Card>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-300 mb-4">
            11. Termination
          </h2>
          <p className="leading-relaxed text-emerald-100/85">
            We may terminate or suspend your account immediately, without prior
            notice or liability, for any reason including, without limitation,
            if you breach these Terms by sharing off-platform contact details,
            soliciting off-platform payments, or engaging in fraudulent or
            deceptive listings. Upon termination, your right to use the Platform
            ceases immediately.
          </p>
        </Card>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-300 mb-4">
            12. Governing Law
          </h2>
          <p className="leading-relaxed text-emerald-100/85">
            These Terms shall be governed by and construed in accordance with
            the laws of the Federal Republic of Nigeria, without regard to its
            conflict of law provisions. Any legal action or proceeding arising
            out of or relating to these Terms or your use of the Platform shall
            be brought exclusively in the courts located in Lagos State,
            Nigeria.
          </p>
        </Card>

        <Card className="mb-10">
          <h2 className="text-2xl font-bold text-emerald-300 mb-4">
            13. Contact Us
          </h2>
          <p className="leading-relaxed text-emerald-100/85 mb-2">
            For questions about these Terms, please contact us through:
          </p>
          <ul className="list-disc list-inside ml-4 text-emerald-100/85 space-y-1">
            <li>
              Support Email:{" "}
              <span className="text-emerald-300 font-mono">
                support@farmmart.ng
              </span>
            </li>
            <li>
              In-App Support Tickets: /buyer/support or /seller/help-center
            </li>
            <li>Registered Address: Lagos, Nigeria</li>
          </ul>
        </Card>

        <div className="text-center pt-4 pb-8 border-t border-emerald-900">
          <p className="text-emerald-200/60 text-sm mb-6">
            By continuing to use FarmMart, you acknowledge that you have READ,
            UNDERSTOOD, and AGREED to all of these Terms and Conditions,
            including the OFF-PLATFORM COMMUNICATION DISCLAIMER above.
          </p>
          <Link href="/">
            <span className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-lg shadow-emerald-900/60 cursor-pointer">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4 inline-block mr-2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Return to Home
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
