/* scripts/migrateUsers.ts */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function migrateUsers() {
  try {
    console.log("🔁 Starting user migration...");

    // 🔹 Get all users
    const users = await prisma.user.findMany();

    for (const user of users) {
      let updated = false;

      const data: any = {};

      // ✅ Fix missing plan
      if (!user.plan) {
        data.plan = "free";
        updated = true;
      }

      // ✅ Fix missing credits
      if (user.credits === null || user.credits === undefined) {
        data.credits = 10;
        updated = true;
      }

      // ✅ Fix missing password hash (VERY IMPORTANT)
      if (!user.password || user.password.length < 20) {
        // temporary password → user should reset later
        const hashed = await bcrypt.hash("Temp@1234", 10);
        data.password = hashed;
        updated = true;
      }

      if (updated) {
        await prisma.user.update({
          where: { id: user.id },
          data,
        });

        console.log(`✅ Fixed user: ${user.email}`);
      }
    }

    console.log("🎉 Migration completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateUsers();
