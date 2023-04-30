import Axios from "axios";

const baseUrl = "http://localhost:8080";

export const login = () => {
  Axios.post(`${baseUrl}/login`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

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
