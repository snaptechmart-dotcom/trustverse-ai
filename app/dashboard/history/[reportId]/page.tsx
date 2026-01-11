import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import History from "@/models/History";
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
  _id: string;
  userId: string;
  tool: string;
  input: string;
  summary?: Summary;
  creditsUsed?: number;
  createdAt: string;
}

/* =========================
   TOOL LABELS
========================= */
const TOOL_LABELS: Record<string, string> = {
  TRUST_SCORE: "Trust Score Analyzer",
  PHONE_CHECK: "Phone Number Checker",
  EMAIL_CHECK: "Email Address Checker",
  PROFILE_CHECK: "Profile Trust Checker",
  BUSINESS_CHECK: "Business / Domain Checker",
};

/* =========================
   PAGE
========================= */
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

  await dbConnect();

  const report = (await History.findOne({
    _id: reportId,
    userId: session.user.id,
  }).lean()) as HistoryReport | null;

  if (!report) {
    return <div className="p-6 text-red-500">Report not found</div>;
  }

  const summary = report.summary || {};

  /* =========================
     HUMAN MESSAGE (FALLBACK)
  ========================= */
  const fallbackMessage =
    summary.riskLevel === "Low Risk"
      ? `Our analysis indicates that this input is generally safe.
The detected patterns align with trusted behavior and no significant red flags were found.
You can proceed with confidence, while still following basic online safety practices.`
      : summary.riskLevel === "Medium Risk"
      ? `This input shows a mix of safe and risky indicators.
While it is not confirmed as malicious, certain behavioral patterns suggest caution.
We recommend verifying details independently before proceeding.`
      : summary.riskLevel === "High Risk"
      ? `Multiple high-risk indicators were detected for this input.
These patterns are commonly associated with scams, fraud, or abusive activity.
It is strongly advised to avoid engagement or sharing sensitive information.`
      : `The analysis was completed successfully. Please review the details above for insights.`;

  const humanExplanation =
    summary.explanation && summary.explanation.length > 20
      ? summary.explanation
      : fallbackMessage;

  return (
    <div className="p-6 space-y-8 max-w-5xl">
      {/* TITLE */}
      <h1 className="text-3xl font-bold">
        {TOOL_LABELS[report.tool] || report.tool} – Full Report
      </h1>

      {/* META CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard
          label="Tool"
          value={TOOL_LABELS[report.tool] || report.tool}
        />
        <InfoCard label="Input" value={report.input} />
        <InfoCard
          label="Credits Used"
          value={String(report.creditsUsed ?? 0)}
        />
      </div>

      {/* EXECUTIVE SUMMARY */}
      <div className="bg-black text-green-400 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Executive Analysis Summary
        </h2>

        <div className="space-y-3 text-sm">
          {typeof summary.trustScore === "number" && (
            <p>
              <b>Trust Score:</b>{" "}
              <span className="font-semibold">
                {summary.trustScore}/100
              </span>
            </p>
          )}

          {summary.riskLevel && (
            <p>
              <b>Risk Level:</b>{" "}
              <span
                className={
                  summary.riskLevel === "Low Risk"
                    ? "text-green-400 font-semibold"
                    : summary.riskLevel === "Medium Risk"
                    ? "text-yellow-400 font-semibold"
                    : "text-red-400 font-semibold"
                }
              >
                {summary.riskLevel}
              </span>
            </p>
          )}

          {summary.verdict && (
            <p>
              <b>Verdict:</b> {summary.verdict}
            </p>
          )}
        </div>

        {/* HUMAN INTERPRETATION */}
        <div className="mt-6 bg-gray-900 text-white p-5 rounded-lg space-y-2">
          <p className="font-semibold text-base">
            What does this mean for you?
          </p>
          <p className="text-sm leading-relaxed opacity-90">
            {humanExplanation}
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <ReportActions />

      {/* DATE */}
      <p className="text-sm opacity-60">
        Created at: {new Date(report.createdAt).toLocaleString()}
      </p>
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
    <div className="bg-gray-900 text-white p-4 rounded-xl">
      <p className="text-sm opacity-70">{label}</p>
      <p className="text-lg font-semibold break-all">{value}</p>
    </div>
  );
}
