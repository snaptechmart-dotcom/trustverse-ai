import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";


export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id).lean();

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      planValidTill: user.planValidTill,
      trustChecksUsed: user.trustChecksUsed,
      reportsUsed: user.reportsUsed,
      subscriptionId: user.subscriptionId,
      subscriptionStatus: user.subscriptionStatus,
      lastPaymentId: user.lastPaymentId,
    });
  } catch (err) {
    console.error("USER ME API ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
