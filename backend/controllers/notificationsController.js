import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getNotifications = async (req, res) => {
  const id = req.user.id;
  const notifs = await prisma.notifications.findMany({
    where: {
      userId: id,
    },
  });
  if (notifs) {
    return res
      .status(201)
      .json({ message: "Successfully fetched notifications", notifs: notifs });
  }
  if (!notifs) {
  	return res.status(401).json({message: "Failed to fetch notifications"})
  }
};
