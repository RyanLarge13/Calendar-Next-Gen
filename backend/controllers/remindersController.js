import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getReminders = async (req, res) => {
  const { id } = req.user;
  const reminders = await prisma.reminder.findMany({
    where: {
      userId: id,
    },
  });
  res.status(201).json({ reminders: reminders });
};

export const addNewReminder = async (req, res) => {
  const { title, notes, time } = req.body.reminder;
  const { id } = req.user;
  const newReminder = {
    title,
    notes,
    time,
    userId: id,
  };
  const returnedReminder = await prisma.reminder.create({
    data: newReminder,
  });
  if (returnedReminder) {
    return res.status(201).json({
      message: "Succesfully created a new reminder",
      reminder: returnedReminder,
    });
  }
  if (!returnedReminder) {
    return res.status(401).json({
      message: "An error occured while creating a reminder",
      reminder: null,
    });
  }
};
