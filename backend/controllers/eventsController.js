import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const addMultipleEvents = async (newEvent, howOften) => {
  if (!howOften) return [];
  let interval = newEvent.repeats.interval;
  let day = new Date(newEvent.date).getDate();
  let month = new Date(newEvent.date).getMonth() + 1;
  let year = new Date(newEvent.date).getFullYear();
  let daysInMonth = new Date(year, month, 0).getDate();
  let repeats = [];
  if (howOften === "Daily") {
    for (let i = 1; i < interval; i++) {
      day === daysInMonth && (month += 1);
      month === 13 && (year += 1);
      month === 13 && (month = 1);
      day === daysInMonth ? (day = 1) : (day += 1);
      const nextEvent = {
        ...newEvent,
        date: `${month}/${day}/${year}`,
        nextDate: `${month}/${day + 1}/${year}`,
      };
      repeats.push(nextEvent);
    }
    return repeats;
    // prisma.event.createMany({
    //   data: repeats
    // });
  }
  if (howOften === "Weekly") {
    let diff = daysInMonth - 7;
    for (let i = 1; i < interval; i++) {
      day > diff && (month += 1);
      month === 13 && (year += 1);
      month === 13 && (month = 1);
      day >= diff && (day = (day - daysInMonth) * 1);
      day < diff && (day += 7);
      const nextEvent = {
        ...newEvent,
        date: `${month}/${day}/${year}`,
        nextDate: `${month}/${day + 7}/${year}`,
      };
      repeats.push(nextEvent);
    }
    return repeats;
    // prisma.event.createMany({
    //   data: repeats
    // });
  }
  if (howOften === "Bi Weekly") {
    let diff = daysInMonth - 7;
    for (let i = 1; i < interval; i++) {
      day > diff && (month += 1);
      month === 13 && (year += 1);
      month === 13 && (month = 1);
      day >= diff && (day = (day - daysInMonth) * 1);
      day < diff && (day += 14);
      const nextEvent = {
        ...newEvent,
        date: `${month}/${day}/${year}`,
        nextDate: `${month}/${day + 14}/${year}`,
      };
      repeats.push(nextEvent);
    }
    return repeats;
    // prisma.event.createMany({
    //   data: repeats
    // });
  }
  if (howOften === "Monthly") {
    for (let i = 1; i < interval; i++) {
      month += 1;
      month === 13 && (year += 1);
      month === 13 && (month = 1);
      const nextEvent = {
        ...newEvent,
        date: `${month}/${day}/${year}`,
        nextDate: `${month + 1}/${day}/${year}`,
      };
      repeats.push(nextEvent);
    }
    return repeats;
    // prisma.event.createMany({
    //   data: repeats
    // });
  }
  if (howOften === "Yearly") {
    for (let i = 1; i < interval; i++) {
      year += 1;
      const nextEvent = {
        ...newEvent,
        date: `${month}/${day}/${year}`,
        nextDate: `${month}/${day}/${year + 1}`,
      };
      repeats.push(nextEvent);
    }
    return repeats;
    // prisma.event.createMany({
    //   data: repeats
    // });
  }
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

const createReminder = async (event) => {
  const newReminder = {
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

export const addEvent = async (req, res) => {
  const newEvent = req.body.event;
  const user = req.user;
  let reminder;
  const repeatEvents = await addMultipleEvents(
    newEvent,
    newEvent.repeats.howOften
  );
  if (newEvent.reminders.reminder) {
    reminder = await createReminder(newEvent);
  }
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
      event: [createdEvent, ...repeatEvents],
      reminders: reminder,
    });
  }
};

export const deleteEvent = async (req, res) => {
  const id = req.params.eventId;
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
