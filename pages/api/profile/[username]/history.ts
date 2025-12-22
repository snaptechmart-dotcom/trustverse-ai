import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/dbConnect";
import ProfileHistory from "../../../../models/ProfileHistory";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username } = req.query;

  await dbConnect();

  const history = await ProfileHistory.find({
    profileUsername: username,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    history,
  });
}
