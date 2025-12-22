"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-gray-600">

        {/* BRAND */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Trustverse AI
          </h3>
          <p className="mt-2">
            AI-powered trust & reputation platform to verify people,
            phone numbers, profiles and digital identities with confidence.
          </p>
        </div>

        {/* PRODUCT */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">
            Product
          </h4>
          <ul className="space-y-1">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/tools" className="hover:underline">
                AI Tools
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:underline">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* TRUST & SAFETY */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">
            Trust & Safety
          </h4>
          <ul className="space-y-1">
            <li>
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:underline">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/data-safety" className="hover:underline">
                Data Safety
              </Link>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">
            Support
          </h4>
          <ul className="space-y-1">
            <li>
              <Link href="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/waitlist" className="hover:underline">
                Join Waitlist
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Trustverse AI. All rights reserved.
      </div>
    </footer>
  );
}
