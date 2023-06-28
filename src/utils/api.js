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

// export const getGoogleCalendarEvents = async (email) => {
//   const res = await Axios.get(
//     `https://apidata.googleusercontent.com/caldav/v2/${email}/user`
//   );
//   return res
// }

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

export const postEvent = (event, token) => {
  const res = Axios.post(
    `${devUrl}/new/event`,
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
  Axios.get(`${devUrl}/${username}/events`)
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

export const updateList = (token, listId, listTitle, data) => {
  const res = Axios.patch(
    `${devUrl}/update/list/${listTitle}`,
    {
      data: { data, listId },
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
