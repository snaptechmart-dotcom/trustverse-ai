"use client";

import Link from "next/link";

type Tool = {
  title: string;
  description: string;
  href: string;
  color: string;
  credits: number | "Free";
  pro?: boolean;
};

const tools: Tool[] = [
  {
    title: "Trust Score Analyzer",
    description: "AI-powered trust scoring with risk level classification.",
    href: "/dashboard/tools/trust-score",
    color: "bg-blue-600",
    credits: 1,
  },
  {
    title: "Phone Number Checker",
    description: "Detect validity, activity status, and spam probability.",
    href: "/dashboard/tools/phone-checker",
    color: "bg-green-600",
    credits: 1,
  },
  {
    title: "Email Address Checker",
    description:
      "Identify risky, disposable, or suspicious email addresses.",
    href: "/dashboard/tools/email-checker",
    color: "bg-emerald-600",
    credits: 1,
  },
  {
    title: "Profile Trust Checker",
    description:
      "Analyze profile details to estimate trustworthiness and risk.",
    href: "/dashboard/tools/profile-checker",
    color: "bg-blue-700",
    credits: 2,
    pro: true,
  },
  {
    title: "Business / Domain Checker",
    description:
      "Evaluate business and website trust before engagement.",
    href: "/dashboard/tools/business-checker",
    color: "bg-teal-600",
    credits: 2,
    pro: true,
  },
  {
    title: "Social Analyzer",
    description: "Analyze usernames from social platforms.",
    href: "/dashboard/tools/social-analyzer",
    color: "bg-purple-600",
    credits: 1,
  },
  {
    title: "Advanced AI Analysis",
    description: "Deep AI reasoning, scam & risk signals.",
    href: "/dashboard/tools/advanced-analysis",
    color: "bg-orange-600",
    credits: 3,
    pro: true,
  },
  {
    title: "Report History",
    description: "View previous verification and AI reports.",
    href: "/dashboard/history",
    color: "bg-gray-800",
    credits: "Free",
  },
];

export default function DashboardToolsPage() {
  return (
    /* ✅ Page-level scroll → scrollbar goes FULL RIGHT (arrow wali jagah) */
    <div className="h-screen overflow-y-auto">

      {/* CONTENT WRAPPER */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-6">

        {/* ✅ Credits / PRO — NO extra navbar, just floating on white */}
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <span className="text-sm text-gray-600">
            Credits Available: <b>9999</b>
          </span>
          <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
            PRO – Unlimited
          </span>
        </div>

        {/* PAGE TITLE */}
        <div className="mb-6 pr-40">
          <h1 className="text-2xl font-bold">AI Tools</h1>
          <p className="text-sm text-gray-600 mt-1">
            Use AI-powered tools to verify, analyze, and protect yourself.
          </p>
        </div>

        {/* TOOLS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className={`${tool.color} text-white rounded-xl p-6 flex flex-col justify-between min-h-[220px]`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    {tool.title}
                  </h2>
                  {tool.pro && (
                    <span className="text-xs bg-black/30 px-2 py-1 rounded">
                      PRO
                    </span>
                  )}
                </div>

                <p className="text-sm mt-2 opacity-90">
                  {tool.description}
                </p>

                <p className="text-xs mt-3 opacity-80">
                  Credits per use: {tool.credits}
                </p>
              </div>

              <Link href={tool.href}>
                <button className="mt-5 bg-white text-black px-4 py-2 rounded font-medium hover:bg-gray-100 transition">
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
