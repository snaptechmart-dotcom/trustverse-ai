import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

type ProfileUser = {
  email: string;
  plan: "free" | "pro";
  credits: number;
  createdAt: Date;
};

export default async function ProfilePage() {
  // 🔐 SESSION
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // 🔌 DB
  await dbConnect();

  // 👤 USER (SAFE TYPING)
  const user = (await User.findOne(
    { email: session.user.email },
    {
      email: 1,
      plan: 1,
      credits: 1,
      createdAt: 1,
    }
  ).lean()) as ProfileUser | null;

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Profile / Account
        </h1>
        <p className="text-gray-500 mt-1">
          View your account details and subscription status
        </p>
      </div>

      {/* ACCOUNT CARD */}
      <div className="bg-white border rounded-xl p-6 space-y-6">
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Plan</p>
          <p className="font-medium">
            {user.plan === "pro" ? "Pro (Unlimited)" : "Free"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Credits</p>
          <p className="font-medium">
            {user.plan === "pro" ? "Unlimited" : user.credits}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Account Created</p>
          <p className="font-medium">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <a
          href="/dashboard/settings"
          className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded"
        >
          Account Settings
        </a>

        {user.plan !== "pro" && (
          <a
            href="/pricing"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
          >
            Upgrade to Pro
          </a>
        )}
      </div>
    </div>
  );
}
