import Axios from "axios";

const baseUrl = "http://localhost:8080";
const productionUrl = "https://calendar-next-gen-production.up.railway.app";

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
    `${productionUrl}/login`,
    {
      user: user,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
};

// export const getGoogleCalendarEvents = async (email) => {
//   const res = await Axios.get(
//     `https://apidata.googleusercontent.com/caldav/v2/${email}/user`
//   );
//   return res
// }

export const getEvents = (username, token) => {
  Axios.get(`${baseUrl}/${username}/events`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postEvent = (event, token) => {
  Axios.get(`${baseUrl}/${username}/events`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteEvent = (event, token) => {
  Axios.get(`${baseUrl}/${username}/events`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateEvent = (event, token) => {
  Axios.get(`${baseUrl}/${username}/events`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};
