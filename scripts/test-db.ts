import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client/client";

const DEMO_USER_EMAIL = "demo@devstash.io";
const EXPECTED_ITEM_TYPE_COUNT = 7;
const EXPECTED_COLLECTION_COUNT = 5;
const EXPECTED_ITEM_COUNT = 18;
const EXPECTED_RECENT_ITEM_COUNT = 4;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run scripts/test-db.ts");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

function assertCondition(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  console.log("Checking database connection...\n");

  const result = await prisma.$queryRaw<Array<{ now: Date }>>`SELECT NOW() AS now`;
  console.log(`Connected successfully. Server time: ${result[0]?.now.toISOString()}\n`);

  const demoUser = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    include: {
      collections: {
        include: {
          items: {
            include: {
              itemType: true,
            },
            orderBy: {
              title: "asc",
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      },
      recentItems: {
        include: {
          item: {
            include: {
              itemType: true,
            },
          },
        },
        orderBy: {
          visitedAt: "desc",
        },
      },
    },
  });

  assertCondition(Boolean(demoUser), `Demo user ${DEMO_USER_EMAIL} was not found.`);

  const itemTypes = await prisma.itemType.findMany({
    include: {
      _count: {
        select: {
          items: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  const demoCollections = demoUser.collections;
  const demoItems = demoCollections.flatMap((collection) => collection.items);

  assertCondition(itemTypes.length === EXPECTED_ITEM_TYPE_COUNT, `Expected ${EXPECTED_ITEM_TYPE_COUNT} item types, found ${itemTypes.length}.`);
  assertCondition(demoCollections.length === EXPECTED_COLLECTION_COUNT, `Expected ${EXPECTED_COLLECTION_COUNT} collections, found ${demoCollections.length}.`);
  assertCondition(demoItems.length === EXPECTED_ITEM_COUNT, `Expected ${EXPECTED_ITEM_COUNT} items, found ${demoItems.length}.`);
  assertCondition(demoUser.recentItems.length === EXPECTED_RECENT_ITEM_COUNT, `Expected ${EXPECTED_RECENT_ITEM_COUNT} recent items, found ${demoUser.recentItems.length}.`);

  console.log("Demo user:");
  console.log(`  Name: ${demoUser.name ?? "(missing)"}`);
  console.log(`  Email: ${demoUser.email ?? "(missing)"}`);
  console.log(`  Pro: ${demoUser.isPro}`);
  console.log(`  Email verified: ${demoUser.emailVerified?.toISOString() ?? "(missing)"}`);
  console.log("");

  console.log("System item types:");
  for (const itemType of itemTypes) {
    console.log(
      `  - ${itemType.id}: icon=${itemType.icon}, color=${itemType.color}, system=${itemType.isSystem}, items=${itemType._count.items}`,
    );
  }
  console.log("");

  console.log("Collections and items:");
  for (const collection of demoCollections) {
    const itemTypeSummary = Array.from(new Set(collection.items.map((item) => item.itemType.id))).join(", ");
    console.log(`  - ${collection.name} (${collection.items.length} items)`);
    console.log(`    Description: ${collection.description ?? "(none)"}`);
    console.log(`    Item types: ${itemTypeSummary || "(none)"}`);

    for (const item of collection.items) {
      console.log(
        `    * ${item.title} [${item.itemType.id}] ${item.fileExtension} pinned=${item.isPinned}`,
      );
    }
  }
  console.log("");

  console.log("Recent items:");
  for (const recentItem of demoUser.recentItems) {
    console.log(
      `  - ${recentItem.item.title} [${recentItem.item.itemType.id}] at ${recentItem.visitedAt.toISOString()}`,
    );
  }
  console.log("");

  console.log("All demo seed checks passed.");
}

main()
  .catch((error) => {
    console.error("Database verification failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
