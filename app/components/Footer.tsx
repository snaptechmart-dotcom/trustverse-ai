"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-gray-300 py-8 mt-10">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Brand Info */}
          <div>
            <h2 className="text-white text-xl font-semibold">Trustverse AI</h2>
            <p className="mt-2 text-sm text-gray-400">
              Your trusted AI-powered productivity and automation platform.
            </p>
          </div>

          {/* Important Links */}
          <div>
            <h2 className="text-white text-lg font-medium mb-3">Quick Links</h2>
            <ul className="space-y-2 text-sm">

              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>

              <li>
                <Link href="/pricing" className="hover:text-white">
                  Pricing
                </Link>
              </li>

            </ul>
          </div>

          {/* Policies Section */}
          <div>
            <h2 className="text-white text-lg font-medium mb-3">Legal</h2>
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

        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Trustverse AI — All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}
