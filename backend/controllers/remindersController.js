import prisma from "../utils/prismaClient.js";

export const getReminders = async (req, res) => {
  const { id } = req.user;
  const reminders = await prisma.reminder.findMany({
    where: {
      userId: id,
    },
    orderBy: [{ time: "asc" }],
  });
  res.status(201).json({ reminders: reminders });
};

export const updateReminderTitle = async (req, res) => {
  const { reminderId, newTitle } = req.body;
  const { id } = req.user;

  if (!id) {
    res
      .status(401)
      .json({ message: "You are not authorized to update this reminder" });
    return;
  }

  if (!reminderId || !newTitle) {
    // Reminder notes required in DB
    res
      .status(400)
      .json({ message: "Please provide a reminder or title to update" });
    return;
  }

  try {
    await prisma.reminder.update({ where: reminderId, userId: id });
    res.status(200).json({ message: "Successfully updated reminder title" });
  } catch (err) {
    console.log(`Error updating reminder title. Error: ${err}`);
    res.status(500).json({
      message: `Something went wrong on the server. Contact developer immediately. Error: ${err}`,
    });
    return;
  }
};

export const updateReminderNotes = async (req, res) => {
  const { reminderId, newDesc } = req.body;
  const { id } = req.user;

  if (!id) {
    res
      .status(401)
      .json({ message: "You are not authorized to update this reminder" });
    return;
  }

  if (!reminderId || !newDesc) {
    // Reminder notes required in DB
    res
      .status(400)
      .json({ message: "Please provide a reminder or notes to update" });
    return;
  }

  try {
    await prisma.reminder.update({
      where: { id: reminderId, userId: id },
      data: { notes: newDesc },
    });
    res.status(200).json({ message: "Successfully updated reminders notes" });
    return;
  } catch (err) {
    console.log(`Error updating reminder description. Error: ${err}`);
    res.status(500).json({
      message: `Something went wrong on the server. Contact developer immediately. Error: ${err}`,
    });
    return;
  }
};

export const updateReminderComplete = async (req, res) => {
  const { reminderId, completed } = req.body.reminder;
  const { id } = req.user;

  try {
    await prisma.reminder.update({
      where: { userId: id, id: reminderId },
      data: {
        completed: completed,
      },
    });

    res.status(200).json({ message: "reminder update" });
  } catch (err) {
    console.log(
      "Error updating reminder in database for completing a reminder"
    );
    console.log(err);
    res
      .status(500)
      .json({ message: `Error updating reminder on server. Error: ${err}` });
  }
};

export const addNewReminder = async (req, res) => {
  const { title, notes, time, eventRefId } = req.body.reminder;
  const { id } = req.user;
  const newReminder = {
    title,
    notes,
    time,
    eventRefId,
    userId: id,
  };
  const newNotif = {
    type: "reminder",
    read: false,
    readTime: null,
    time,
    notifData: newReminder,
    sentNotification: false,
    sentWebPush: false,
    userId: id,
  };
  const returnedReminder = await prisma.reminder.create({
    data: newReminder,
  });

  // Make sure the event also has the reminder
  // referenced
  if (eventRefId) {
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventRefId },
    });

    if (existingEvent) {
      await prisma.event.update({
        where: { id: eventRefId },
        data: { reminders: returnedReminder },
      });
    }
  }

  await prisma.notification.create({
    data: newNotif,
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

export const deleteReminder = async (req, res) => {
  const id = req.params.reminderId;
  const deletedReminder = await prisma.reminder.delete({
    where: {
      id: id,
    },
  });
  if (deletedReminder) {
    return res.json({
      message: "Successfully deleted reminder",
      reminderId: deletedReminder.id,
    });
  }
};
