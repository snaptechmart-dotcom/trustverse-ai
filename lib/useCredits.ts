import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function deductCredit(userId: string, amount = 1) {
  await dbConnect();

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Pro users = unlimited
  if (user.plan === "PRO") {
    return { success: true, remaining: "unlimited" };
  }

  if (user.credits < amount) {
    throw new Error("NO_CREDITS");
  }

  user.credits -= amount;
  await user.save();

  return {
    success: true,
    remaining: user.credits,
  };
}
