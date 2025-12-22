import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Complaint from "@/models/Complaint";
import TrustScore from "@/models/TrustScore";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { complaintId, action } = await req.json();

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return NextResponse.json({ error: "Not found" });
    }

    complaint.status =
      action === "resolve" ? "resolved" : "rejected";
    await complaint.save();

    if (action === "resolve") {
      const username =
        complaint.againstUsername.toLowerCase().trim();

      const updated = await TrustScore.findOneAndUpdate(
        { username },
        {
          username,
          score: 90,
          lastUpdatedReason: "Complaint resolved",
        },
        { upsert: true, new: true }
      );

      console.log("🔥 TRUST SCORE UPDATED:", updated);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("FINAL ERROR:", err);
    return NextResponse.json(
      { error: "server error" },
      { status: 500 }
    );
  }
}
