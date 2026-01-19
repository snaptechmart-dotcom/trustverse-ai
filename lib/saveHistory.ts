import prisma from "@/lib/prisma";

export async function saveHistory({
  userId,
  tool,
  input,
  result,
}: {
  userId: string;
  tool: string;
  input: any;
  result: any;
}) {
  console.log("🟢 saveHistory called:", {
    userId,
    tool,
    input,
    result,
  });

  try {
    const created = await prisma.history.create({
      data: {
        userId,
        tool,
        input,
        result,
      },
    });

    console.log("✅ History saved:", created.id);
  } catch (error) {
    console.error("❌ saveHistory failed:", error);
  }
}
