/// <reference lib="webworker" />

export const getPayload = (event) => {
  let payload = {};
  if (event.data) {
    try {
      payload = event.data.json();
    } catch (error) {
      payload = {
        title: "Notification",
        body: event.data.text(),
      };
    }
  } else {
    payload = {
      title: "were so sorry",
      body: "An issue occurred sending the correct notification data, please open the app to see what might be coming up for you",
    };
  }

  return payload;
};

export const sendNotification = (
  event,
  iconPath,
  vibrate,
  actions,
  payload,
) => {
  const { title, body, data } = payload;
  const { time } = data;

  event.waitUntil(
    self.registration.showNotification(title, {
      body: `${body} \n ${new Date(time).toLocaleTimeString("en-US")}`,
      data,
      icon: iconPath,
      badge: "./badge.png",
      vibrate: vibrate,
      actions: actions,
    }),
  );
};
