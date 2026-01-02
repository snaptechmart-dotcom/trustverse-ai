"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SessionWatcher() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // 🔥 SESSION CHANGED OR LOGOUT
      router.replace("/login");
    }
  }, [status, router]);

  return null;
}
