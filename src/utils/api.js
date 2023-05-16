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
  const res = Axios.delete(`${productionUrl}/${username}/delete/event/${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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
