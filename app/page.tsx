"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="w-full bg-[#081b33] text-white pt-20 pb-28 px-4 md:px-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* LEFT TEXT SECTION */}
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            Trustverse AI — Verify Anything with Confidence
          </h1>

          <p className="text-gray-300 text-base md:text-lg">
            AI-powered trust detection for profiles, phone numbers, social
            accounts, and digital identities. Make safer decisions with
            real-time AI scoring.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-center md:justify-start">
            <Link
              href="/waitlist"
              className="bg-white text-black font-semibold px-6 py-3 rounded-lg w-full md:w-auto text-center"
            >
              Get Started Free
            </Link>

            <Link
              href="/tools"
              className="border border-white px-6 py-3 rounded-lg font-semibold w-full md:w-auto text-center"
            >
              Explore Tools
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center md:justify-end">
          <Image
            src="/hero-illustration.png"
            alt="Trustverse AI Hero Image"
            width={450}
            height={450}
            className="w-[70%] md:w-[90%] lg:w-[100%]"
            priority
          />
        </div>

      </div>
    </section>
  );
}
