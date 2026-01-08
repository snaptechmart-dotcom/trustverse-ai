import dbConnect from "@/lib/dbConnect";
import ActivityHistory from "@/models/ActivityHistory";

/* =========================
   TYPES
========================= */
type SaveActivityParams = {
  userEmail: string;
  tool: string;

  // user input
  input: string;

  // analysis output
  riskLevel?: string;
  trustScore?: number;
  resultSummary?: string;
  signals?: string[];

  // billing
  creditsUsed?: number;
};

/* =========================
   MASTER SAVE FUNCTION
========================= */
export async function saveActivity({
  userEmail,
  tool,
  input,
  riskLevel = "",
  trustScore = 0,
  resultSummary = "",
  signals = [],
  creditsUsed = 0,
}: SaveActivityParams) {
  try {
    /* -------------------------
       HARD GUARDS
    -------------------------- */
    if (!userEmail || !tool || !input) {
      console.error("❌ saveActivity: missing required fields", {
        userEmail,
        tool,
        input,
      });
      return;
    }

    /* -------------------------
       DB CONNECT
    -------------------------- */
    await dbConnect();

    /* -------------------------
       NORMALIZE INPUT (DEDUPE)
       🔥 GOLDEN RULE 🔥
    -------------------------- */
    const inputKey = String(input)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");

    /* -------------------------
       UPSERT ACTIVITY
       (same user + same tool + same input = update)
    -------------------------- */
    const activity = await ActivityHistory.findOneAndUpdate(
      {
        userEmail,
        tool,
        inputKey,
      },
      {
        userEmail,
        tool,

        input,        // original user input (UI)
        inputKey,     // normalized (DB logic)

        riskLevel,
        trustScore,
        resultSummary,
        signals,

        creditsUsed,

        lastSeenAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    /* -------------------------
       DEBUG LOG (SAFE)
    -------------------------- */
    if (process.env.NODE_ENV !== "production") {
      console.log("✅ Activity saved:", {
        id: activity._id.toString(),
        tool,
        input,
        creditsUsed,
      });
    }
  } catch (error) {
    console.error("🔥 saveActivity ERROR:", error);
  }
}
