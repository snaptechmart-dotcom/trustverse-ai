import { notFound } from "next/navigation";
import Link from "next/link";
import TrustProfile from "@/models/TrustProfile";
import dbConnect from "@/lib/db";
import { calculateTrustScore } from "@/lib/trustScore";

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function VerifyProfilePage({ params }: PageProps) {
  const { username } = await params;
  if (!username) notFound();

  await dbConnect();

  const profile = await TrustProfile.findOne({
    username: username.toLowerCase(),
  }).lean();

  if (!profile) notFound();

  const trust = calculateTrustScore(profile);

  return (
    /* ✅ MAIN FIX: navbar se distance */
    <div className="flex justify-center px-4 pt-24 pb-16">
      <div className="w-full max-w-xl">
        <div className="rounded-2xl border bg-white p-8 shadow-lg text-center">
          {/* VERIFIED BADGE */}
          <div className="mb-4 flex justify-center">
            <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
              ✔ Verified by Trustverse AI
            </span>
          </div>

          {/* BUSINESS NAME */}
          <h1 className="text-2xl font-bold tracking-tight">
            {profile.displayName}
          </h1>

          {/* CATEGORY + LOCATION */}
          <p className="mt-1 text-sm text-gray-500">
            {profile.category}
            {profile.location ? ` • ${profile.location}` : ""}
          </p>

          {/* TRUST SCORE CARD */}
          <div className="mt-8 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white">
            <p className="text-sm uppercase tracking-wide text-gray-300">
              Trust Score
            </p>
            <p className="mt-2 text-5xl font-extrabold">
              {trust.score}
              <span className="text-xl font-medium text-gray-300">/100</span>
            </p>
          </div>

          {/* DESCRIPTION */}
          <p className="mt-6 text-sm leading-relaxed text-gray-600">
            This trust score is generated using verified identity, profile
            completeness, admin review, and complaint history. Higher score
            means higher credibility.
          </p>

          {/* CTA BUTTON */}
          <div className="mt-8">
            <Link
              href={`/profile/${username}`}
              className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              View Full Trust Profile →
            </Link>
          </div>

          {/* FOOTER */}
          <p className="mt-8 text-xs text-gray-400">
            Powered by Trustverse AI • India’s First Trust System
          </p>
        </div>
      </div>
    </div>
  );
}
