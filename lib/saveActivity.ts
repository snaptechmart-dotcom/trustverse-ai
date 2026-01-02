import dbConnect from "@/lib/dbConnect";
import ActivityHistory from "@/models/ActivityHistory";

type SaveActivityParams = {
  userEmail: string;
  tool: string;
  input: string;
  riskLevel?: string;
  trustScore?: number;
  resultSummary?: string;
  signals?: string[];
};

export async function saveActivity({
  userEmail,
  tool,
  input,
  riskLevel = "",
  trustScore = 0,
  resultSummary = "",
  signals = [],
}: SaveActivityParams) {
  try {
    console.log("🔥 saveActivity CALLED", {
      userEmail,
      tool,
      input,
    });

    // 1️⃣ DB CONNECT
    await dbConnect();

    // 2️⃣ SAFETY CHECKS (HARD GUARD)
    if (!userEmail || !tool || !input) {
      console.error("❌ saveActivity missing required fields", {
        userEmail,
        tool,
        input,
      });
      return;
    }

    // 3️⃣ NORMALIZED INPUT KEY (🔥 GOLDEN RULE 🔥)
    const inputKey = String(input)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");

    // 4️⃣ UPSERT LOGIC (NO DUPLICATE SAME TOOL + SAME INPUT)
    const history = await ActivityHistory.findOneAndUpdate(
      {
        userEmail,
        tool,
        inputKey,
      },
      {
        userEmail,
        tool,
        input,       // 🔹 original input (UI display)
        inputKey,    // 🔹 normalized (dedupe logic)
        riskLevel,
        trustScore,
        resultSummary,
        signals,
        updatedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log("✅ HISTORY SAVED / UPDATED:", history._id.toString());
  } catch (error) {
    console.error("🔥 saveActivity ERROR:", error);
  }
}
