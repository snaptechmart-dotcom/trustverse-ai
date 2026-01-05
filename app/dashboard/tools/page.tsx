"use client";

import Link from "next/link";

const tools = [
  {
    title: "Trust Score Analyzer",
    desc: "AI-powered trust scoring with risk level classification.",
    credits: 1,
    color: "bg-blue-600",
    link: "/dashboard/tools/trust-score",
    free: true,
  },
  {
    title: "Phone Number Checker",
    desc: "Detect validity, activity status, and spam probability.",
    credits: 1,
    color: "bg-green-600",
    link: "/dashboard/tools/phone-checker",
    free: true,
  },
  {
    title: "Email Address Checker",
    desc: "Identify risky, disposable, or suspicious email addresses.",
    credits: 1,
    color: "bg-emerald-600",
    link: "/dashboard/tools/email-checker",
    free: true,
  },
  {
    title: "Profile Trust Checker",
    desc: "Analyze profile details to estimate trustworthiness and risk.",
    credits: 2,
    color: "bg-indigo-600",
    link: "/pricing",
    pro: true,
  },
  {
    title: "Business / Domain Checker",
    desc: "Evaluate business and website trust before engagement.",
    credits: 2,
    color: "bg-teal-600",
    link: "/pricing",
    pro: true,
  },
  {
    title: "Social Analyzer",
    desc: "Analyze usernames from social platforms.",
    credits: 1,
    color: "bg-purple-600",
    link: "/dashboard/tools/social-analyzer",
    free: true,
  },
  {
    title: "Advanced AI Analysis",
    desc: "Deep AI reasoning, scam & risk signals.",
    credits: 3,
    color: "bg-orange-600",
    link: "/pricing",
    pro: true,
  },
  {
    title: "Report History",
    desc: "View previous verification and AI reports.",
    credits: 0,
    color: "bg-gray-800",
    link: "/dashboard/history",
    free: true,
  },
];

export default function DashboardToolsPage() {
  return (
    <div className="relative w-full h-full">
      {/* SCROLLABLE CONTENT WITH VISIBLE DROP LINE */}
      <div className="relative max-h-[calc(100vh-120px)] overflow-y-scroll pr-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">AI Tools</h1>
            <p className="text-gray-600 text-sm mt-1">
              Use AI-powered tools to verify, analyze, and protect yourself.
            </p>
          </div>

          {/* CREDITS + PRO (AS ORIGINAL) */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">
              Credits Available: <b>9999</b>
            </span>
            <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
              PRO – Unlimited
            </span>
          </div>
        </div>

        {/* TOOLS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {tools.map((tool, idx) => (
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

              <Link href={tool.link}>
                <button className="mt-5 bg-white text-black px-4 py-2 rounded-lg text-sm font-medium w-full">
                  {tool.pro ? "Upgrade to Pro" : "Open Tool"}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
