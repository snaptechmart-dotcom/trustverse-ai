import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const getAuthSession = async () => {
  return await getServerSession(authOptions);
};
