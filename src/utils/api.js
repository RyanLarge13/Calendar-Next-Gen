import Axios from "axios";

const devUrl = "http://localhost:8080";
const productionUrl = "https://calendar-next-gen-production.up.railway.app";

export const getUserData = (token) => {
  const res = Axios.get(`${productionUrl}/user/data`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const getGoogleData = async (token) => {
  const res = await Axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  return res;
};

export const loginWithGoogle = async (user) => {
  const res = await Axios.post(
    `${productionUrl}/login/google`,
    {
      user: {
        id: user.id,
        username: user.name,
        email: user.email,
        avatarUrl: user.picture,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
};

export const loginWithPasswordAndUsername = async (credentials) => {
  const { username, email, password, avatarUrl } = credentials;
  const res = Axios.post(`${productionUrl}/login/classic`, {
    username,
    email,
    password,
    avatarUrl,
  });
  return res;
};

export const getGoogleCalendarEvents = async (authToken, accessToken) => {
  const res = await Axios.get(
    `${productionUrl}/google/calendar/events/${accessToken}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return res;
};

export const getEvents = async (username, token) => {
  const res = await Axios.get(`${productionUrl}/${username}/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "appliction/json",
    },
  });
  return res;
};

export const fetchAttachments = async (eventId) => {
  const res = Axios.get(`${productionUrl}/attachments/${eventId}`);
  return res;
};

export const postEvent = (event, token) => {
  const res = Axios.post(
    `${productionUrl}/new/event`,
    { event: event },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

export const deleteEvent = (username, eventId, token) => {
  const res = Axios.delete(
    `${productionUrl}/${username}/delete/event/${eventId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

export const updateEvent = (event, token) => {
  Axios.get(`${productionUrl}/${username}/events`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

//Reminder api's
export const getReminders = (username, token) => {
  const res = Axios.get(`${productionUrl}/${username}/reminders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const addReminder = (reminder, token) => {
  const res = Axios.post(
    `${productionUrl}/new/reminder`,
    { reminder },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

export const deleteReminder = (username, reminderId, token) => {
  const res = Axios.delete(
    `${productionUrl}/${username}/delete/reminder/${reminderId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res;
};

//Notifications

export const getNotificationsAtStart = (username, token) => {
  const res = Axios.get(`${productionUrl}/${username}/notifs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const requestAndSubscribe = async (token) => {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    const subscribeFunction = navigator.serviceWorker.ready.then(
      (registration) => {
        return Notification.requestPermission()
          .then((permission) => {
            // If permission is granted, subscribe the user
            if (permission === "granted") {
              // Subscribe the user
              return registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
              });
            } else {
              throw new Error("Permission denied for notifications");
            }
          })
          .then((subscription) => {
            // Send the subscription details to the server
            return fetch(`${productionUrl}/subscribe/notifs`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(subscription),
            });
          });
      }
    );
    return subscribeFunction;
  } else {
    console.warn("Push notifications are not supported");
  }
};

export const checkSubscription = () => {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    const subscriptionCheck = navigator.serviceWorker.ready.then(
      (registration) => {
        return Notification.requestPermission().then((permission) => {
          // If permission is granted, subscribe the user
          if (permission === "granted") {
            // Subscribe the user
            return registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
            });
          } else {
            throw new Error("Permission denied for notifications");
          }
        });
      }
    );
    return subscriptionCheck;
  }
};

export const addSubscriptionToUser = (sub, token) => {
  const response = Axios.post(
    `${productionUrl}/add/subscription`,
    { sub },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const getNotifications = (userId) => {
  const eventSource = new EventSource(
    `${productionUrl}/${userId}/notifications`
  );
  return eventSource;
};

export const updateNotification = (idArray, token, username) => {
  const res = Axios.patch(
    `${productionUrl}/${username}/update/notif`,
    { notifs: idArray },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

export const markAsRead = (notifId) => {
  const res = Axios.post(`${productionUrl}/mark-as-read`, { notifId });
  return res;
};

export const deleteNotification = (token, id) => {
  const res = Axios.delete(`${productionUrl}/notification/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

// List apis
export const getAllLists = (token, username) => {
  const res = Axios.get(`${productionUrl}/${username}/lists`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const createNewList = (token, username, newList) => {
  const res = Axios.post(
    `${productionUrl}/new/list/${username}`,
    { newList },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

export const updateList = (token, listUpdate) => {
  const res = Axios.patch(
    `${productionUrl}/update/lists`,
    {
      listUpdate,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

export const deleteList = (token, listId) => {
  const res = Axios.delete(`${productionUrl}/delete/list/${listId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};
