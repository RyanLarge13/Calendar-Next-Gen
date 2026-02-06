import prisma from "../utils/prismaClient.js";
import { v4 as uuidv4 } from "uuid";
import { bucket } from "../utils/googleStorage.js";

const getSignedUrl = async (filename) => {
  const file = bucket.file(filename);

  // Expires in 15 minutes
  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 20000,
  });

  return url;
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

const createReminders = async (event) => {
  let newReminders = [];
  let newNotifs = [];

  const remindersToSave = event.reminders.eventReminders;

  if (remindersToSave.length < 1) {
    return;
  }

  for (let i = 0; i < remindersToSave.length; i++) {
    const reminder = remindersToSave[i];
    const reminderId = uuidv4();

    if (!reminder) {
      continue;
    }

    const { onlyNotify, time } = reminder;

    const newReminder = {
      id: reminderId,
      eventRefId: event.id,
      title: event.summary,
      notes: event.description,
      time: time,
      completed: false,
      userId: event.userId,
    };

    const newNotif = {
      type: "event",
      read: false,
      readTime: null,
      time: time,
      notifData: newReminder,
      sentNotification: false,
      sentWebPush: false,
      userId: event.userId,
    };

    // If this reminder is only set to notify
    if (onlyNotify) {
      newNotifs.push(newNotif);
      continue;
    }

    newNotifs.push({ ...newNotif, reminderRefId: reminderId });

    newReminders.push(newReminder);
  }

  await prisma.reminder.createMany({ data: newReminders });

  await prisma.notification.createMany({
    data: newNotifs,
  });

  // No need to return notificatons
  return newReminders;
};

export const createAttachments = async (req, res) => {
  const newEventId = req.params.newEventId;
  // Does new event id exist? It should always from frontend...
  const { attachments } = req.body;
  const { id } = req.user;

  if (!id) {
    res
      .status(401)
      .json({ message: "You are not authorized to make this request" });
    return;
  }

  // Why did we not first create or check if first the event already exists before creating attachments?? Hmmmmmmmmmm
  // Well we know in the frontend that you can only create attachments if you are currently making a new event
  // or if..... you already have an event and are trying to update it.

  // So what do we do, lets review.

  // Well, do we check to see if the event is there and has an attachments property? I must say yes, probably. Because if this is anm update
  //Then we need to make sure the event has a true value in that spot!!!!

  try {
    const event = await prisma.event.findUnique({ where: { id: newEventId } });

    if (!event) {
      console.log(
        "Why is there no event here when trying to create an attachment!?",
      );
      res.status(400).json({
        message:
          "Yes, a 400 status. This is most likely you doing something you should not be doing on my app.",
      });
      return;
    }

    // Nope! Do not need to check for length only add length.
    // Another try catch for custom error handling? This is crazy
    // I just thought.. Hopefully the event exists first huh? I guess I should look back at the steps before we get here

    try {
      await prisma.event.update({
        where: { id: newEventId },
        data: { attachmentLength: event.attachmentLength + attachments.length },
      });
      res.status(200).json({ message: "Nice. New attachments created!" });
    } catch (err) {
      console.log("Error updating event in db for longer attachment length");
      console.log(err);
      res.status(500).json({ message: "Sorry, server dump" });
      return;
    }
  } catch (err) {
    console.log("Error checking for event in DB when creating attachments");
    console.log(err);
    res.status(500).json({
      message:
        "Failed to create attachments due to server taking dump? I mean, I guess. Sorry",
    });
    return;
  }

  try {
    const createdAttachments = await Promise.all(
      attachments.map(async (attachment) => {
        // Logic body
        const { filename, mimetype, content } = attachment;
        const byteBuffer = Buffer.from(Object.values(content));

        const file = bucket.file(filename);

        await file.save(byteBuffer, {
          metadata: { contentType: mimetype },
          resumable: false,
        });

        // await file.makePublic();

        // const pubUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

        return prisma.attachment.create({
          data: {
            filename,
            mimetype,
            content: filename,
            eventId: newEventId,
            userId: id,
          },
        });
        // Logic body
      }),
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

  const createdEvent = await prisma.event.create({
    data: { ...newEvent, id: newEvent.id },
  });

  if (createdEvent) {
    let newReminders = [];

    if (newEvent.reminders.reminder) {
      newReminders = await createReminders(newEvent);
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
      reminders: newReminders,
    });
  }
};

export const getAttachments = async (req, res) => {
  const eventId = req.params.eventId;
  const { id } = req.user;

  if (!id) {
    res
      .status(401)
      .json({ message: "You are not authorized to make this request" });
    return;
  }

  if (!eventId) {
    res.status(400).json({ message: "Please pass in a valid event id" });
    return;
  }

  const attachments = await prisma.attachment.findMany({
    where: { eventId: eventId, userId: id },
  });

  const tempAttachmentUrls = await Promise.all(
    attachments.map((a) => getSignedUrl(a.content)),
  );

  res.status(200).json({ message: "Success", attachments: tempAttachmentUrls });
};

export const updateEventTitle = async (req, res) => {
  const { newTitle, eventId } = req.body;
  const { id } = req.user;

  if (!id) {
    res
      .status(401)
      .json({ message: "You are not authorized to make this request" });
    return;
  }

  if (!newTitle || !eventId) {
    res
      .status(404)
      .json({ message: "Bad request, missing new event title or eventId" });
    return;
  }

  try {
    await prisma.event.update({
      where: { userId: id, id: eventId },
      data: {
        summary: newTitle,
      },
    });

    res.status(200).json({ message: "Event title successfully updated" });
  } catch (err) {
    res
      .status(500)
      .json({ message: `Server error updating event title. Error: ${err}` });
    console.log(`Error updating event title. Error: ${err}`);
  }
};

export const updateEventDescription = async (req, res) => {
  const { eventId, newDesc } = req.body;
  const { id } = req.user;

  if (!id) {
    res
      .status(401)
      .json({ message: "You are not authorized to make this request" });
    return;
  }

  if (!eventId || !newDesc) {
    res.status(404).json({
      message: "Bad request, missing new event description or eventId",
    });
    return;
  }

  try {
    await prisma.event.update({
      where: { id: eventId, userId: id },
      data: { description: newDesc },
    });

    res.status(200).json({ message: "Successfully updated event description" });
    return;
  } catch (err) {
    console.log(`Error updating event description. Error: ${err}`);
    res.status(500).json({
      message: `Server error updating event description. Error: ${err}`,
    });
  }
};

export const updateEventLocation = async (req, res) => {
  const { eventId, newLocation, newCoords } = req.body;
  const { id } = req.user;

  if (!id) {
    res
      .status(401)
      .json({ message: "You are not authorized to make this request" });
    return;
  }

  if (!eventId) {
    res.status(404).json({
      message: "Bad request, missing new event location or eventId",
    });
    return;
  }

  try {
    await prisma.event.update({
      where: { id: eventId, userId: id },
      data: { location: { string: newLocation, coordinates: newCoords } },
    });

    res.status(200).json({ message: "Successfully updated event location" });
  } catch (err) {
    console.log(`Error updating event location. Error: ${err}`);
    res.status(500).json({
      message: `Server error updating event location. Error: ${err}`,
    });
  }
};

export const updateEventStartAndEndTime = async (req, res) => {
  const { eventId, offset } = req.body;
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    return res.status(404).json({
      message: "We could not find this event attached to your account",
    });
  }
  const startDate = new Date(event.start.startTime);
  const endDate = new Date(event.end.endTime);
  startDate.setMinutes(startDate.getMinutes() + offset * 30);
  endDate.setMinutes(endDate.getMinutes() + offset * 30);
  const updatedEvent = {
    ...event,
    startDate: startDate,
    start: { ...event.start, startTime: startDate },
    end: { ...event.end, endTime: endDate },
  };
  const newlyUpdatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: updatedEvent,
  });
  if (!newlyUpdatedEvent) {
    return res.status(500).json({
      message:
        "There was a problem updating the time on your event, Please try again",
    });
  }
  return res
    .status(200)
    .json({ message: "Successfully updating your event time" });
};

const deleteAttachments = async (eventId) => {
  try {
    const attachments = await prisma.attachment.findMany({
      where: { eventId: eventId },
    });

    if (!attachments) {
      return;
    }

    for (const a of attachments) {
      const filename = a.content;
      const file = bucket.file(filename);
      await file.delete().catch((err) => {
        console.log(
          `Error deleting an attachment connected to an event. Error: ${err}`,
        );
        // Probably email myself of notify myself or something. Do not want photos in storage taking up space that shouldn't be there
      });
    }

    await prisma.attachment.deleteMany({ where: { eventId: eventId } });
  } catch (err) {
    console.log(`Error deleting attachments. Error: ${err}`);
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
    await prisma.reminder.deleteMany({
      where: { eventRefId: id },
    });
    await deleteAttachments(id);
    return res.json({
      message: "Successfully deleted event",
      eventId: deletedEvent.id,
    });
  }
};

// Deprecated ------------------
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
