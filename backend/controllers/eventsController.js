import prisma from "../utils/prismaClient.js";

const addMultipleEvents = async (newEvent) => {
  const howOften = newEvent.repeats.howOften;
  if (!howOften) return [];
  const repeats = [];
  let date = new Date(newEvent.date);
  for (let i = 0; i < newEvent.repeats.interval; i++) {
    const nextEventDate = new Date(date);
    let nextDate;
    if (howOften === "Daily") {
      nextDate = nextEventDate.setDate(date.getDate() + 1);
    } else if (howOften === "Weekly") {
      nextDate = nextEventDate.setDate(date.getDate() + 7);
    } else if (howOften === "Bi Weekly") {
      nextDate = nextEventDate.setDate(date.getDate() + 14);
    } else if (howOften === "Monthly") {
      nextDate = nextEventDate.setMonth(date.getMonth() + 1);
      // Calculate the number of days to add based on the month change
      const daysToAdd = nextEventDate.getDate() - date.getDate();
      nextDate = new Date(
        nextEventDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000
      );
    } else if (howOften === "Yearly") {
      nextDate = nextEventDate.setFullYear(date.getFullYear() + 1);
      // Calculate the number of days to add based on the year change
      const daysToAdd =
        nextEventDate.getDate() -
        date.getDate() +
        (nextEventDate.getMonth() - date.getMonth()) * 30;
      nextDate = new Date(
        nextEventDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000
      );
    }
    // Check if reminders are enabled
    if (newEvent.reminders.reminder) {
      let reminderTime = new Date(newEvent.reminders.when);
      reminderTime = new Date(
        reminderTime.getTime() +
          i * newEvent.repeats.interval * 24 * 60 * 60 * 1000
      );
      const nextEvent = {
        ...newEvent,
        id: newEvent.id,
        date: new Date(date).toLocaleDateString(),
        // nextDate: new Date(nextDate),
        reminders: {
          when: reminderTime,
          reminderTimeString: reminderTime.toLocaleTimeString(),
        },
      };
      repeats.push(nextEvent);
      date = new Date(nextDate);
      await createNotification(nextEvent);
    } else {
      // Reminders are disabled
      const nextEvent = {
        ...newEvent,
        id: newEvent.id,
        date: new Date(date).toLocaleDateString(),
        // nextDate: new Date(nextDate),
      };
      repeats.push(nextEvent);
      date = new Date(nextDate);
    }
  }
  // Save to the database using Prisma
  console.log(repeats);
  await prisma.event.createMany({
    data: repeats,
  });
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

const createNotification = async (event) => {
  const newNotif = {
    type: "event",
    read: false,
    readTime: null,
    time: event.reminders.when,
    notifData: newReminder,
    sentNotification: false,
    sentWebPush: false,
    userId: event.userId,
  };
  await prisma.notification.create({
    data: newNotif,
  });
};

const createReminder = async (event) => {
  const newReminder = {
    eventRefId: event.id,
    title: event.summary,
    notes: event.description,
    time: event.reminders.when,
    userId: event.userId,
  };
  const newNotif = {
    type: "event",
    read: false,
    readTime: null,
    time: event.reminders.when,
    notifData: newReminder,
    sentNotification: false,
    sentWebPush: false,
    userId: event.userId,
  };
  const reminder = await prisma.reminder.create({
    data: newReminder,
  });
  await prisma.notification.create({
    data: newNotif,
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
  const repeatEvents = await addMultipleEvents(newEvent);
  const createdEvent = await prisma.event.create({
    data: { ...newEvent, id: newEvent.id },
  });
  if (createdEvent) {
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
      event: [createdEvent],
      repeats: repeatEvents,
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

export const deleteManyEvents = () => {};
