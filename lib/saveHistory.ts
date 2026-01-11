import dbConnect from "@/lib/dbConnect";
import History from "@/models/History";

/* =========================
   TYPES
========================= */
type SaveHistoryParams = {
  userId: string;               // MUST be string
  tool: string;
  input: string;

  summary: {
    trustScore: number;
    riskLevel: string;
    verdict: string;
  };

  creditsUsed?: number;
};

/* =========================
   SAVE HISTORY (FINAL)
========================= */
export async function saveHistory({
  userId,
  tool,
  input,
  summary,
  creditsUsed = 0,
}: SaveHistoryParams) {
  try {
    /* 🔥 HARD DEBUG (DO NOT REMOVE NOW) */
    console.log("🧪 saveHistory CALLED");
    console.log("🧪 PARAMS:", {
      userId,
      tool,
      input,
      summary,
      creditsUsed,
    });

    /* -------------------------
       BASIC VALIDATION
    -------------------------- */
    if (!userId || !tool || !input || !summary) {
      console.error("❌ saveHistory missing required fields");
      return;
    }

    /* -------------------------
       DB CONNECT
    -------------------------- */
    await dbConnect();
    console.log("🧪 DB CONNECTED");

    /* -------------------------
       NORMALIZE INPUT
    -------------------------- */
    const inputKey = input.toLowerCase().trim();

    /* -------------------------
       CREATE HISTORY (NO UPSERT)
    -------------------------- */
    const doc = await History.create({
      userId,
      tool,
      input,
      inputKey,
      summary,
      creditsUsed,
    });

    console.log("✅ HISTORY SAVED SUCCESSFULLY:", doc._id.toString());
  } catch (error) {
    console.error("🔥 saveHistory ERROR:", error);
  }
}
