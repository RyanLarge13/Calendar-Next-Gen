import prisma from "./prismaClient.js";
import { v4 as uuidv4 } from "uuid";
import { sendNotification } from "./notificationService.js";
import { reminderFutureDays } from "./helpers.js";

// Potential stale repeat query
/**
const staleRepeatingReminders = await prisma.reminder.findMany({
  where: {
    paused: false,
    completed: false,
    timeDate: {
      lte: new Date(),
    },
    repeat: {
      path: ["on"],
      equals: true,
    },
    notification: {
      none: {
        sentWebPush: false,
      },
    },
  },
});
 */

const updateRepeatingReminder = async (notification) => {
  const reminderRefId = notification.reminderRefId;

  const reminderRepeating = await prisma.reminder.findFirst({
    where: {
      id: reminderRefId,
      paused: false,
      completed: false,
      repeat: {
        path: ["on"],
        equals: true,
      },
    },
  });

  if (reminderRepeating) {
    const interval = reminderRepeating.repeat?.interval || 0;
    const isOutOfRepeats = interval !== "infinity" && Number(interval) <= 0;

    if (isOutOfRepeats) {
      await prisma.reminder.update({
        where: { id: reminderRepeating.id },
        data: { repeat: { ...(reminderRepeating.repeat || {}), on: false } },
      });
      return true;
    }
    const newTime = new Date(reminderFutureDays(reminderRepeating, 1)[0]);
    const newPreviousData = {
      time: reminderRepeating.time,
      status: {
        complete: reminderRepeating.completed,
        when: new Date(), // CHANGE!!! I don't think I event have this value in the table stored yet
      },
      snoozed: reminderRepeating.snoozes?.snoozes?.length > 0,
    };
    const newNotification = {
      id: uuidv4(),
      type: notification.type,
      time: newTime.toISOString(),
      timeDate: newTime,
      read: false,
      readTime: null,
      notifData: notification.notifData,
      sentNotification: false,
      sentWebPush: false,

      User: {
        connect: { id: notification.userId },
      },

      reminderRef: {
        connect: { id: reminderRefId },
      },

      ...(notification.eventRefId && {
        eventRef: {
          connect: { id: notification.eventRefId },
        },
      }),
    };

    try {
      await prisma.$transaction([
        prisma.reminder.update({
          where: { id: reminderRefId },
          data: {
            time: newTime.toISOString(),
            timeDate: newTime,
            completed: false,
            repeat: {
              ...(reminderRepeating.repeat || {}),
              interval: reminderRepeating.repeat?.interval
                ? reminderRepeating.repeat?.interval === "infinity"
                  ? "infinity"
                  : Number(reminderRepeating.repeat.interval) - 1
                : 0,
              previousReminders: [
                ...(reminderRepeating.repeat?.previousReminders || []),
                newPreviousData,
              ],
            },
          },
        }),

        prisma.notification.create({
          data: newNotification,
        }),
      ]);

      return true;
    } catch (err) {
      console.log("Error updating repeating reminder");
      console.log(err);
      return false;
    }
  }

  return true;
};

const processPushNotifications = async () => {
  // Include below processes to make sure stale crap is taken care of
  // repairStaleRepeats(take: 25)
  try {
    const notificationIdsToUpdate = [];
    const notifications = await prisma.notification.findMany({
      where: {
        sentWebPush: false,
        timeDate: {
          lte: new Date(),
        },
        User: {
          notifSub: {
            isEmpty: false,
          },
        },
      },
      include: {
        User: {
          select: {
            id: true,
            notifSub: true,
          },
        },
      },
      orderBy: {
        timeDate: "asc",
      },
      take: 500,
    });
    for (const notification of notifications) {
      const user = notification.User;
      const payload = JSON.stringify({
        title: notification.notifData.title,
        body: notification.notifData.notes,
        data: {
          id: notification.id,
          userId: notification.userId,
          time: notification.time,
          notifType: notification.type,
          eventRefId:
            notification.type === "event" ? notification.eventRefId : null,
          deviceExceptions: notification.deviceExceptions || [],
        },
      });
      // Update reminder here???
      if (notification.reminderRefId) {
        const reminderUpdated = await updateRepeatingReminder(notification);
        if (!reminderUpdated) {
          // Handle reminder not being updated???? continue for now
          continue;
        }
      }
      if (user.notifSub.length > 1) {
        await sendNotification(payload, [...user.notifSub], user.id);
        notificationIdsToUpdate.push(notification.id);
      }
      if (user.notifSub.length < 2) {
        await sendNotification(
          payload,
          [JSON.parse(...user.notifSub)],
          user.id,
        );
        notificationIdsToUpdate.push(notification.id);
      }
    }
    if (notificationIdsToUpdate.length > 0) {
      await prisma.notification.updateMany({
        where: { id: { in: notificationIdsToUpdate } },
        data: { sentWebPush: true },
      });
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};

export default processPushNotifications;
