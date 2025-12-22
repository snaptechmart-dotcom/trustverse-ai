import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/dbConnect";
import ProfileHistory from "../../../../models/ProfileHistory";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const { username } = req.query;

  try {
    await dbConnect();

    // ⏱ last 15 minutes check
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    const recentView = await ProfileHistory.findOne({
      profileUsername: username,
      action: "Profile Viewed",
      createdAt: { $gte: fifteenMinutesAgo },
    });

    // 🚫 duplicate block
    if (recentView) {
      return res.status(200).json({
        success: true,
        skipped: true,
      });
    }

    // ✅ new history entry
    await ProfileHistory.create({
      profileUsername: username,
      action: "Profile Viewed",
      impact: -1,
      reason: "Someone viewed the profile",
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
}
