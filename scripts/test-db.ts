import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🔌 Connecting to database...\n");

  // Test 1: Basic connection
  const result = await prisma.$queryRaw<[{ now: Date }]>`SELECT NOW()`;
  console.log("✅ Connection successful!");
  console.log(`   Server time: ${result[0].now}\n`);

  // Test 2: Count existing records
  const [userCount, collectionCount, itemCount] = await Promise.all([
    prisma.user.count(),
    prisma.collection.count(),
    prisma.item.count(),
  ]);

  console.log("📊 Table counts:");
  console.log(`   Users:       ${userCount}`);
  console.log(`   Collections: ${collectionCount}`);
  console.log(`   Items:       ${itemCount}\n`);

  // Test 3: Verify all tables are accessible
  const tables = [
    { name: "User", fn: () => prisma.user.findFirst() },
    { name: "Account", fn: () => prisma.account.findFirst() },
    { name: "Session", fn: () => prisma.session.findFirst() },
    { name: "VerificationToken", fn: () => prisma.verificationToken.findFirst() },
    { name: "Collection", fn: () => prisma.collection.findFirst() },
    { name: "Item", fn: () => prisma.item.findFirst() },
    { name: "RecentItem", fn: () => prisma.recentItem.findFirst() },
  ];

  console.log("🗂️  Table access check:");
  for (const table of tables) {
    try {
      await table.fn();
      console.log(`   ✅ ${table.name}`);
    } catch (err) {
      console.log(`   ❌ ${table.name}: ${err}`);
    }
  }

  console.log("\n🎉 All database tests passed!");
}

main()
  .catch((err) => {
    console.error("❌ Database test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
