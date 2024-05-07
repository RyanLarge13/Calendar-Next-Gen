import prisma from "../utils/prismaClient.js";
import { v4 as v4 } from "uuid";

const addMultipleEvents = async (newEvent) => {
  const howOften = newEvent.repeats.howOften;
  if (!howOften || howOften < 1) return [];

  const repeats = [];
  let startDate = new Date(newEvent.startDate);
  let endDate = new Date(newEvent.endDate);

  for (let i = 1; i <= newEvent.repeats.interval - 1; i++) {
    const nextEventStartDate = new Date(startDate);
    const nextEventEndDate = new Date(endDate);
    let nextStartDate;
    let nextEndDate;

    if (howOften === "Daily") {
      nextStartDate = nextEventStartDate.setDate(startDate.getDate() + i);
      nextEndDate = nextEventEndDate.setDate(endDate.getDate() + i);
    }
    if (howOften === "Weekly") {
      nextStartDate = nextEventStartDate.setDate(startDate.getDate() + 7 * i);
      nextEndDate = nextEventEndDate.setDate(endDate.getDate() + 7 * i);
    }
    if (howOften === "Bi Weekly") {
      nextStartDate = nextEventStartDate.setDate(startDate.getDate() + 14 * i);
      nextEndDate = nextEventEndDate.setDate(endDate.getDate() + 14 * i);
    }
    if (howOften === "Monthly") {
      nextStartDate = nextEventStartDate.setMonth(startDate.getMonth() + i);
      nextEndDate = nextEventEndDate.setMonth(endDate.getMonth() + i);
    }
    if (howOften === "Yearly") {
      nextStartDate = nextEventStartDate.setFullYear(
        startDate.getFullYear() + i
      );
      nextEndDate = nextEventEndDate.setFullYear(endDate.getFullYear() + i);
    }
    if (newEvent.reminders.reminder) {
      const reminderTime = new Date(newEvent.reminders.when);
      let reminderDate = new Date(reminderTime); // Create a copy of reminderTime

      if (howOften === "Daily") {
        reminderDate.setDate(reminderDate.getDate() + i);
      }
      if (howOften === "Weekly") {
        reminderDate.setDate(reminderDate.getDate() + 7 * i);
      }
      if (howOften === "Bi Weekly") {
        reminderDate.setDate(reminderDate.getDate() + 14 * i);
      }
      if (howOften === "Monthly") {
        reminderDate.setMonth(reminderDate.getMonth() + i);
      }
      if (howOften === "Yearly") {
        reminderDate.setFullYear(reminderDate.getFullYear() + i);
      }
      const newReminderTime = reminderDate;
      const nextEvent = {
        ...newEvent,
        id: v4(),
        parentId: newEvent.id,
        date: new Date(nextStartDate).toLocaleDateString(),
        startDate: new Date(nextStartDate),
        endDate: new Date(nextEndDate),
        // nextStartDate: new Date(nextStartDate),
        reminders: {
          when: newReminderTime,
          reminderTimeString: newReminderTime.toLocaleTimeString(),
        },
      };
      // const newNotif = {
      //   type: "event",
      //   read: false,
      //   readTime: null,
      //   time: nextStartDate.toString(),
      //   notifData: newReminder,
      //   sentNotification: false,
      //   sentWebPush: false,
      //   userId: newEvent.userId,
      // };
      // createNotification(newNotif)
      repeats.push(nextEvent);
      // const newReminder = {
      //   eventRefId: newEvent.id,
      //   title: newEvent.summary,
      //   notes: newEvent.description,
      //   time: newReminderTime,
      //   userId: newEvent.userId,
      // };
      // const newNotif = {
      //   type: "event",
      //   read: false,
      //   readTime: null,
      //   time: newReminderTime,
      //   notifData: newReminder,
      //   sentNotification: false,
      //   sentWebPush: false,
      //   userId: event.userId,
      // };
      // createNotification(newReminderTime, newNotif, newEvent.userId);
      // createReminder(nextEvent);
    } else {
      // Reminders are disabled
      const nextEvent = {
        ...newEvent,
        id: v4(),
        parentId: newEvent.id,
        date: new Date(nextStartDate).toLocaleDateString(),
        startDate: new Date(nextStartDate),
        endDate: new Date(nextEndDate),
        // nextStartDate: new Date(nextStartDate),
      };
      repeats.push(nextEvent);
      // date = new Date(nextStartDate);
    }
  }
  // Save to the database using Prisma
  await prisma.event.createMany({
    data: repeats,
  });
  return repeats;
};

export const getEvents = async (req, res) => {
  const { id } = req.user;
  const usersEvents = await prisma.event.findMany({
    where: {
      userId: id,
    },
    orderBy: [{ date: "asc" }],
  });
  res.status(200).json({ events: usersEvents, message: "Success" });
};

// const createNotification = async (when, newNotif, userId) => {
//   const newNotif = {
//     type: "event",
//     read: false,
//     readTime: null,
//     time: when.toString(),
//     notifData: newNotif,
//     sentNotification: false,
//     sentWebPush: false,
//     userId: userId,
//   };
//   await prisma.notification.create({
//     data: newNotif,
//   });
// };

const createReminder = async (event) => {
  const newReminder = {
    eventRefId: event.id,
    title: event.summary,
    notes: event.description,
    time: event.reminders.when.toString(),
    userId: event.userId,
  };
  const newNotif = {
    type: "event",
    read: false,
    readTime: null,
    time: event.reminders.when.toString(),
    notifData: newReminder,
    sentNotification: false,
    sentWebPush: false,
    userId: event.userId,
  };
  if (event.reminders.onlyNotify) {
    await prisma.notification.create({
      data: newNotif,
    });
    return [];
  }
  const reminder = await prisma.reminder.create({
    data: newReminder,
  });
  await prisma.notification.create({
    data: { ...newNotif, reminderRefId: reminder.id },
  });
  return reminder;
};

export const createAttachments = async (req, res) => {
  const newEventId = req.params.newEventId;
  const { attachments } = req.body;
  try {
    const createdAttachments = await Promise.all(
      attachments.map(async (attachment) => {
        const { filename, mimetype, content } = attachment;
        const byteBuffer = Buffer.from(Object.values(content));
        return prisma.attachment.create({
          data: {
            filename,
            mimetype,
            content: byteBuffer,
            eventId: newEventId,
          },
        });
      })
    );
    if (createdAttachments) {
      res.status(201).json({
        message: `Successfully created new attachments for event ${newEventId}`,
      });
      console.log("Attachments created:", createdAttachments);
    }
  } catch (err) {
    res.status(401).json({ message: `Error creating new attachments ${err}` });
    console.log(`Error creating attachments: ${err}`);
  }
};

export const addEvent = async (req, res) => {
  const newEvent = req.body.event;
  const user = req.user;
  let reminder;
  const createdEvent = await prisma.event.create({
    data: { ...newEvent, id: newEvent.id },
  });
  if (createdEvent) {
    const repeatEvents = await addMultipleEvents(createdEvent);
    if (newEvent.reminders.reminder) {
      reminder = await createReminder(newEvent);
    }
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
      event: [createdEvent, ...repeatEvents],
      reminders: reminder,
    });
  }
};

export const getAttachments = async (req, res) => {
  const eventId = req.params.eventId;
  const attachments = await prisma.attachment.findMany({ where: { eventId } });
  res.status(201).json({ message: "Success", attachments: attachments });
};

export const deleteEvent = async (req, res) => {
  const id = req.params.eventId;
  const deletedReminders = await prisma.reminder.deleteMany({
    where: { eventRefId: id },
  });
  const deletedEvent = await prisma.event.delete({
    where: {
      id: id,
    },
  });
  if (deletedEvent) {
    return res.json({
      message: "Successfully deleted event",
      eventId: deletedEvent.id,
    });
  }
};

export const deleteManyEvents = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res
      .status(401)
      .json({ message: "Please log back in to make this request" });
  }
  const eventId = req.params.eventId;
  if (!eventId) {
    return res
      .status(400)
      .json({ message: "Please choose an event you would like to delete" });
  }
  const eventParentId = req.params.eventParentId;
  if (!eventParentId || eventParentId === null || eventParentId === "null") {
    const deletedRepeats = await prisma.event.deleteMany({
      where: { parentId: eventId },
    });
    const deletedEvent = await prisma.event.deleteMany({
      where: { id: eventId },
    });
    return res.status(200).json({
      message: "Successfully deleted your event and all following events",
    });
  }
  const deletedRepeats = await prisma.event.deleteMany({
    where: { parentId: eventParentId },
  });
  const deletedParent = await prisma.event.deleteMany({
    where: { id: eventParentId },
  });
  return res.status(200).json({
    message: "Successfully deleted your event and all following events",
  });
};
