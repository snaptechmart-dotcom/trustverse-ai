import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";

type ProfileUser = {
  email: string;
  plan: string | null;
  billing: string | null;
  credits: number;
  planExpiresAt: Date | null;
  createdAt: Date;
};

export default async function ProfilePage() {
  // 🔐 SESSION (FINAL & STABLE)
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // ✅ NORMALIZE EMAIL
  const email = session.user.email.toLowerCase();

  // 👤 USER (PRISMA – SINGLE SOURCE OF TRUTH)
  const user = (await prisma.user.findUnique({
    where: { email },
    select: {
      email: true,
      plan: true,
      billing: true,
      credits: true,
      planExpiresAt: true,
      createdAt: true,
    },
  })) as ProfileUser | null;

  if (!user) {
    redirect("/login");
  }

  const planName = user.plan ?? "free";

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

      {/* ACCOUNT DETAILS CARD */}
      <div className="bg-white border rounded-xl p-6 space-y-6">
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Plan</p>
          <p className="font-medium capitalize">
            {planName}
            {user.billing ? ` (${user.billing})` : ""}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Credits</p>
          <p className="font-medium">{user.credits}</p>
        </div>

        {user.planExpiresAt && (
          <div>
            <p className="text-sm text-gray-500">Plan Expiry</p>
            <p className="font-medium">
              {new Date(user.planExpiresAt).toLocaleDateString()}
            </p>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-500">Account Created</p>
          <p className="font-medium">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <a
          href="/dashboard/settings"
          className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded"
        >
          Account Settings
        </a>

        {planName === "free" && (
          <a
            href="/pricing"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
          >
            Upgrade Plan
          </a>
        )}
      </div>
    </div>
  );
}
