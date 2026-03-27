import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run the cleanup script.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DEMO_USER_EMAIL = "demo@devstash.io";

async function main() {
  await prisma.$connect();

  const demoUser = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true, email: true },
  });

  if (!demoUser) {
    throw new Error(`Demo user ${DEMO_USER_EMAIL} was not found.`);
  }

  const usersToDelete = await prisma.user.findMany({
    where: {
      id: { not: demoUser.id },
    },
    select: {
      id: true,
      email: true,
    },
  });

  const emailsToDelete = usersToDelete
    .map((user) => user.email)
    .filter((email): email is string => Boolean(email));

  if (emailsToDelete.length > 0) {
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: {
          in: emailsToDelete,
        },
      },
    });
  }

  const deletedUsers = await prisma.user.deleteMany({
    where: {
      id: { not: demoUser.id },
    },
  });

  console.log(
    `Deleted ${deletedUsers.count} user(s) and preserved ${demoUser.email}.`,
  );
}

main()
  .catch((error) => {
    console.error("Cleanup failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
