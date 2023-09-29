import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function migrateDates() {
  const events = await prisma.event.findMany();

  for (const event of events) {
    const startDate = new Date(event.date);
    const endDate = new Date(event.date);

    await prisma.event.update({
      where: { id: event.id },
      data: {
        startDate,
        endDate,
      },
    });
  }

  await prisma.$disconnect();
}

migrateDates()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
