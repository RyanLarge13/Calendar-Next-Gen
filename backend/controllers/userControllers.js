import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const findAllEvents = async (id) => {
  const events = await prisma.event.findMany({
    where: {
      userId: id,
    },
  });
  return events;
};

export const login = async (req, res) => {
  const { id, name, email, picture } = req.body.user;
  const exsistingUser = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  const newUser = {
    id: id,
    username: name,
    email,
    avatarUrl: picture,
  };
  if (!exsistingUser) {
    const returnedUser = await prisma.user.create({
      data: newUser,
    });
    const events = await findAllEvents(returnedUser.id);
    res.json({ user: returnedUser, events: events });
  }
  if (exsistingUser) {
    const events = await findAllEvents(exsistingUser.id);
    res.json({ user: exsistingUser, events: events });
  }
};
