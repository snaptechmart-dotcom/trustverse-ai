import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Complaint from "@/models/Complaint";
import ProfileHistory from "@/models/ProfileHistory";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  try {
    await dbConnect();

    const { username } = req.query;
    const { reason } = req.body;

    if (!reason) {
      return res
        .status(400)
        .json({ success: false, message: "Reason required" });
    }

    // 1️⃣ Save complaint
    await Complaint.create({
      profileUsername: username,
      reason,
    });

    // 2️⃣ Auto add to history
    await ProfileHistory.create({
      profileUsername: username,
      action: "Profile Reported",
      impact: -10,
      reason,
    });

    return res.json({
      success: true,
      message: "Complaint submitted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }
}
