import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getEvents = async (req, res) => {
  const { id } = req.user;
  const usersEvents = await prisma.event.findMany({
    where: {
      userId: id,
    },
  });
  res.status(200).json({ events: usersEvents, message: "Success" });
};
