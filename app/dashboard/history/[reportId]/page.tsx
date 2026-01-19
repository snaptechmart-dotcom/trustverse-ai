import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import ReportActions from "./ReportActions";

/* =========================
   TYPES
========================= */
interface Summary {
  trustScore?: number;
  riskLevel?: string;
  verdict?: string;
  explanation?: string;
}

interface HistoryReport {
  id: string;
  userId: string;
  tool: string;
  input: any;
  summary?: Summary;
  creditsUsed?: number;
  createdAt: Date;
}

/* =========================
   TOOL LABELS
========================= */
const TOOL_LABELS: Record<string, string> = {
  TRUST_SCORE: "Trust Score Analyzer",
  phone_checker: "Phone Number Checker",
  email_checker: "Email Address Checker",
  profile_checker: "Profile Trust Checker",
  business_checker: "Business / Domain Checker",
  social_analyzer: "Social Analyzer",
  advanced_ai_analysis: "Advanced AI Analysis",
};

/* =========================
   POWERFUL EXECUTIVE SUMMARY
   (Dynamic + Non-repetitive)
========================= */
function buildExecutiveSummary(
  tool: string,
  riskLevel?: string,
  trustScore?: number
) {
  const scoreLine =
    typeof trustScore === "number"
      ? `Trust Confidence Score: ${trustScore}/100.`
      : "";

  /* ===== ADVANCED AI ===== */
  if (tool === "advanced_ai_analysis") {
    if (riskLevel === "Low Risk") {
      return `🟢 HIGH CONFIDENCE ANALYSIS
${scoreLine}

Trustverse AI™ Advanced Intelligence did not detect any scam, fraud, impersonation, or manipulation patterns.
The behavioral flow, intent structure, and contextual language strongly align with legitimate human activity.

This analysis reflects a **very strong trust posture**. Engagement is considered safe under normal precautions.`;
    }

    if (riskLevel === "Medium Risk") {
      return `🟡 MODERATE CONFIDENCE ANALYSIS
${scoreLine}

The advanced AI engine identified mixed behavioral signals.
While no confirmed scam activity was detected, certain persuasion or intent patterns require attention.

Independent verification is strongly recommended before proceeding.`;
    }

    return `🔴 HIGH RISK ANALYSIS
${scoreLine}

Multiple high-risk behavioral indicators were detected.
The content closely matches known scam, fraud, or social-engineering patterns.

Engagement is **strongly discouraged** without strict independent verification.`;
  }

  /* ===== PHONE ===== */
  if (tool === "phone_checker") {
    return riskLevel === "Low Risk"
      ? `🟢 TRUSTED PHONE PROFILE
${scoreLine}

This phone number demonstrates stable and legitimate usage patterns.
No known spam, fraud, or abuse indicators were identified.

Safe for normal communication.`
      : riskLevel === "Medium Risk"
      ? `🟡 CAUTION ADVISED
${scoreLine}

This phone number shows mixed trust indicators.
Proceed carefully and avoid sharing sensitive information.`
      : `🔴 HIGH RISK PHONE NUMBER
${scoreLine}

Strong spam or fraud-associated patterns detected.
Avoid calls, messages, or engagement.`;
  }

  /* ===== EMAIL ===== */
  if (tool === "email_checker") {
    return riskLevel === "Low Risk"
      ? `🟢 VERIFIED EMAIL SIGNAL
${scoreLine}

This email address appears legitimate.
No disposable or malicious indicators were detected.`
      : riskLevel === "Medium Risk"
      ? `🟡 MIXED EMAIL SIGNAL
${scoreLine}

This email shows partial risk indicators.
Independent verification is recommended.`
      : `🔴 HIGH RISK EMAIL
${scoreLine}

Disposable or unsafe patterns detected.
Do not trust unsolicited communication.`;
  }

  /* ===== PROFILE ===== */
  if (tool === "profile_checker") {
    return riskLevel === "Low Risk"
      ? `🟢 STRONG PROFILE TRUST
${scoreLine}

The identity elements show strong consistency.
Low impersonation or misuse risk detected.`
      : riskLevel === "Medium Risk"
      ? `🟡 MODERATE PROFILE CONFIDENCE
${scoreLine}

Some identity signals require validation.
Proceed with verification.`
      : `🔴 HIGH RISK PROFILE
${scoreLine}

Strong impersonation or reliability concerns detected.`;
  }

  /* ===== BUSINESS ===== */
  if (tool === "business_checker") {
    return riskLevel === "Low Risk"
      ? `🟢 LEGITIMATE BUSINESS SIGNAL
${scoreLine}

The business/domain structure appears authentic.
No major scam indicators found.`
      : riskLevel === "Medium Risk"
      ? `🟡 BUSINESS VERIFICATION ADVISED
${scoreLine}

Some trust signals require confirmation.
Independent checks recommended.`
      : `🔴 HIGH RISK BUSINESS
${scoreLine}

Multiple scam-associated indicators detected.
Avoid engagement without verification.`;
  }

  /* ===== SOCIAL ===== */
  if (tool === "social_analyzer") {
    return riskLevel === "Low Risk"
      ? `🟢 SAFE SOCIAL BEHAVIOR
${scoreLine}

No manipulation or deception patterns detected.`
      : riskLevel === "Medium Risk"
      ? `🟡 CAUTIONARY SOCIAL SIGNAL
${scoreLine}

Persuasion or urgency signals observed.`
      : `🔴 HIGH RISK SOCIAL ACTIVITY
${scoreLine}

Manipulation or scam-aligned behavior detected.`;
  }

  return `Analysis completed successfully.
Please review the details above.`;
}

export default async function HistoryReportPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return <div className="p-6 text-red-500">Please login</div>;
  }

  const report = (await prisma.history.findFirst({
    where: {
      id: reportId,
      userId: session.user.id,
    },
  })) as HistoryReport | null;

  if (!report) {
    return <div className="p-6 text-red-500">Report not found</div>;
  }

  const summary = report.summary || {};

  const displayCredits =
    typeof report.creditsUsed === "number" && report.creditsUsed > 0
      ? String(report.creditsUsed)
      : "Unlimited (Pro)";

  return (
    <div className="p-6 max-w-5xl">
      <div id="report-pdf-content" className="space-y-6">
        <h1 className="text-2xl font-bold text-green-400">
          {TOOL_LABELS[report.tool] || report.tool} – Full AI Report
        </h1>

        {/* INFO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <InfoCard label="Tool" value={TOOL_LABELS[report.tool] || report.tool} />
          <InfoCard
            label="Input"
            value={
              typeof report.input === "string"
                ? report.input
                : JSON.stringify(report.input)
            }
          />
          <InfoCard label="Credits Used" value={displayCredits} />
        </div>

        {/* POWER EXECUTIVE RESULT */}
        <div className="rounded-xl p-6 bg-gradient-to-br from-green-900 via-black to-green-950 border border-green-700">
          <h2 className="text-lg font-bold text-green-300">
            🧠 Trustverse AI™ Executive Confidence Result
          </h2>

          <div className="bg-black/70 p-5 rounded-lg">
            <p className="text-sm leading-relaxed text-green-300 whitespace-pre-line">
              {buildExecutiveSummary(
                report.tool,
                summary.riskLevel,
                summary.trustScore
              )}
            </p>
          </div>
        </div>

        <p className="text-xs opacity-60">
          Created at: {new Date(report.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="mt-6">
        <ReportActions />
      </div>
    </div>
  );
}

/* =========================
   INFO CARD
========================= */
function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-gray-900 text-white p-3 rounded-lg">
      <p className="text-xs opacity-60">{label}</p>
      <p className="text-sm font-semibold break-all">{value}</p>
    </div>
  );
}
