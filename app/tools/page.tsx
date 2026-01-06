import { redirect } from "next/navigation";

/**
 * 🚫 PUBLIC TOOLS PAGE BLOCKED
 * Anyone visiting /tools will be forced to login
 * Real tools are available only inside /dashboard/tools
 */

export default function ToolsPage() {
  redirect("/login");
}
