"use client";

/* 🔥 FORCE FULLY DYNAMIC (VERY IMPORTANT FOR VERCEL) */
export const dynamic = "force-dynamic";


import Link from "next/link";
import { useSession } from "next-auth/react";

type Tool = {
  title: string;
  desc: string;
  credits: number;
  color: string;
  link: string;
  pro?: boolean;
};

const tools: Tool[] = [
  {
    title: "Trust Score Analyzer",
    desc: "AI-powered trust scoring with risk level classification.",
    credits: 1,
    color: "bg-blue-600",
    link: "/dashboard/tools/trust-score",
  },
  {
    title: "Phone Number Checker",
    desc: "Detect validity, activity status, and spam probability.",
    credits: 1,
    color: "bg-green-600",
    link: "/dashboard/tools/phone-checker",
  },
  {
    title: "Email Address Checker",
    desc: "Identify risky, disposable, or suspicious email addresses.",
    credits: 1,
    color: "bg-emerald-600",
    link: "/dashboard/tools/email-checker",
  },
  {
    title: "Profile Trust Checker",
    desc: "Analyze profile details to estimate trustworthiness and risk.",
    credits: 2,
    color: "bg-indigo-600",
    link: "/dashboard/tools/profile-checker",
    pro: true,
  },
  {
    title: "Business / Domain Checker",
    desc: "Evaluate business and website trust before engagement.",
    credits: 2,
    color: "bg-teal-600",
    link: "/dashboard/tools/business-checker",
    pro: true,
  },
  {
    title: "Social Analyzer",
    desc: "Analyze usernames from social platforms.",
    credits: 2,
    color: "bg-purple-600",
    link: "/dashboard/tools/social-analyzer",
    pro: true,
  },
  {
    title: "Advanced AI Analysis",
    desc: "Deep AI reasoning, scam & risk signals.",
    credits: 3,
    color: "bg-orange-600",
    link: "/dashboard/tools/advanced-analysis",
    pro: true,
  },
  {
    title: "Report History",
    desc: "View previous verification and AI reports.",
    credits: 0,
    color: "bg-gray-800",
    link: "/dashboard/history",
  },
];

export default function DashboardToolsPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-gray-500">Loading tools…</p>;
  }

  const isPro = session?.user?.plan === "PRO";

  return (
    <div className="relative w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">AI Tools</h1>
          <p className="text-gray-600 text-sm mt-1">
            Use AI-powered tools to verify, analyze, and protect yourself.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <span className="text-sm text-gray-700">
            Credits Available: <b>{isPro ? "Unlimited" : "Limited"}</b>
          </span>

          {isPro && (
            <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
              PRO
            </span>
          )}
        </div>
      </div>

      {/* TOOLS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, idx) => {
          const locked = tool.pro && !isPro;
          const targetLink = locked ? "/pricing" : tool.link;

          return (
            <div
              key={idx}
              className={`${tool.color} text-white rounded-2xl p-6 flex flex-col justify-between min-h-[220px]`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold">{tool.title}</h2>

                  {tool.pro && (
                    <span className="bg-black/30 text-xs px-2 py-0.5 rounded">
                      PRO
                    </span>
                  )}
                </div>

                <p className="text-sm opacity-90">{tool.desc}</p>

                {tool.credits > 0 && (
                  <p className="text-xs mt-3 opacity-80">
                    Credits per use: {tool.credits}
                  </p>
                )}
              </div>

              <Link href={targetLink}>
                <button
                  className={`mt-5 px-4 py-2 rounded-lg text-sm font-medium w-full transition
                  ${
                    locked
                      ? "bg-black/30 text-white"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  {locked ? "Upgrade to Pro" : "Open Tool"}
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
