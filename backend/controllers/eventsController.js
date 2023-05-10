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

export const addEvent = async (req, res) => {
  const newEvent = req.body.event;
  const user = req.user;
  const createdEvent = await prisma.event.create({
    data: newEvent,
  });
  if (createdEvent) {
    return res.json({
      message: "Successfully added new event",
      user: {
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        birthday: user.birthday,
        id: user.id,
        createdAt: user.createAt,
      },
      event: createdEvent,
    });
  }
};
