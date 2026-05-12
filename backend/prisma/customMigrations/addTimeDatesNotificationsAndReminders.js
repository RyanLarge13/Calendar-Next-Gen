import { PrismaClient } from "@prisma/client";

console.log("Migration file started");

const prisma = new PrismaClient();

const migrateDates = async () => {
  console.log("Finding notifications...");

  const notifs = await prisma.notification.findMany();
  console.log(`Found ${notifs.length} notifications`);

  for (const n of notifs) {
    const parsedDate = new Date(n.time);

    if (isNaN(parsedDate.getTime())) {
      console.log("Invalid notification date", n.id, n.time);
      continue;
    }

    await prisma.notification.update({
      where: { id: n.id },
      data: { timeDate: parsedDate },
    });

    console.log("Updated notification", n.id);
  }

  console.log("Finding reminders...");

  const reminders = await prisma.reminder.findMany();
  console.log(`Found ${reminders.length} reminders`);

  for (const r of reminders) {
    const parsedDate = new Date(r.time);

    if (isNaN(parsedDate.getTime())) {
      console.log("Invalid reminder date", r.id, r.time);
      continue;
    }

    await prisma.reminder.update({
      where: { id: r.id },
      data: { timeDate: parsedDate },
    });

    console.log("Updated reminder", r.id);
  }

  console.log("Migration complete");
};

migrateDates()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    console.log("Disconnecting prisma...");
    await prisma.$disconnect();
  });
