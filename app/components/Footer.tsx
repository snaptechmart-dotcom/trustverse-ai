"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-gray-300 py-8 mt-10">
      <div className="max-w-6xl mx-auto px-4">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          {/* Brand */}
          <div>
            <h2 className="text-white text-xl font-semibold">
              Trustverse AI
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              AI-powered trust & reputation platform to verify people,
              phone numbers, profiles and digital identities with confidence.
            </p>
          </div>

          {/* Product */}
          <div>
            <h2 className="text-white text-lg font-medium mb-3">
              Product
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>

              {/* AI Tools → Login */}
              <li>
                <Link href="/login" className="hover:text-white">
                  AI Tools
                </Link>
              </li>

              <li>
                <Link href="/pricing" className="hover:text-white">
                  Pricing
                </Link>
              </li>

              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources (NEW – SEO GOLD) */}
          <div>
            <h2 className="text-white text-lg font-medium mb-3">
              Resources
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>

              <li>
                <Link href="/faq" className="hover:text-white">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div>
            <h2 className="text-white text-lg font-medium mb-3">
              Trust & Safety
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>

              <li>
                <Link href="/refund-policy" className="hover:text-white">
                  Refund Policy
                </Link>
              </li>

              <li>
                <Link href="/data-safety" className="hover:text-white">
                  Data Safety
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h2 className="text-white text-lg font-medium mb-3">
              Support
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>

              <li>
                <Link href="/waitlist" className="hover:text-white">
                  Join Waitlist
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Trustverse AI. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
