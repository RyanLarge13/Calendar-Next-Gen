/// <reference lib="webworker" />

const productionUrl = "https://calendar-next-gen-production.up.railway.app";

const openApp = (event, urlAddition: string = "") => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then(() => clients.openWindow(`https://www.calng.app/${urlAddition}`)),
  );
};

export const handleOpenApp = (event) => {
  let urlAddition = "";

  const type = event.notification.data?.notifType;
  const eventRefId = event.notification.data?.eventRefId;

  switch (type) {
    case "event":
      // Update to carry real ID
      if (eventRefId !== null) {
        urlAddition = `event/${eventRefId}`;
      }
      break;
    case "reminder":
      urlAddition = "notifications";
      break;
    case "system":
      urlAddition = "notifications";
      break;
    default:
      urlAddition = "";
      break;
  }
  openApp(event, urlAddition);
};

export const handleMarkAsRead = async (event) => {
  event.notification.close();
  try {
    const response = await fetch(`${productionUrl}/mark-as-read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notifId: notifId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
  } catch (err) {
    event.notification.close();
    console.log(`Error marking notification as read: ${err}`);
  }
};

export const handleDeleteNotif = async (event) => {
  event.notification.close();

  try {
    const response = await fetch(
      `${productionUrl}/delete-notif/notification/${notifId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notifId: notifId,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
  } catch (err) {
    console.log(`Error marking notification as read: ${err}`);
  }
};

export const closeOpenNotifications = () => {
  self.registration.getNotifications().then((notifications) => {
    console.log(`Fetched notifications. length: ${notifications.length}`);
    notifications.forEach((notification, index) => {
      console.log(`Closing notification at index: ${index}`);
      notification.close();
    });
  });
};
