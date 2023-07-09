import { createContext, useState, useEffect } from "react";
import { holidays, weekDays } from "../constants";
import {
  getUserData,
  getGoogleData,
  loginWithGoogle,
  getEvents,
  getReminders,
  requestAndSubscribe,
  getAllLists,
  getNotifications,
  getNotificationsAtStart,
} from "../utils/api";

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || false
  );
  const [events, setEvents] = useState(
    JSON.parse(localStorage.getItem("events")) || []
  );
  const [lists, setLists] = useState([]);
  const [reminders, setReminders] = useState(
    JSON.parse(localStorage.getItem("reminders")) || []
  );
  const [notifications, setNotifications] = useState([]);
  const [googleToken, setGoogleToken] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    window.navigator.onLine
      ? setIsOnline(() => true)
      : setIsOnline(() => false);
    if (!isOnline) alert("You are offline");
  }, [events]);

  useEffect(() => {
    if (googleToken && !authToken) {
      setLoginLoading(true);
      getGoogleData(googleToken)
        .then((res) => {
          loginWithGoogle(res.data)
            .then((response) => {
              setUser(response.data.user);
              setAuthToken(response.data.token);
              localStorage.setItem("user", JSON.stringify(response.data.user));
              localStorage.setItem("authToken", response.data.token);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
          setUser(false);
          setEvents(localStorage.getItem("events") || []);
        });
    }
  }, [googleToken]);

  useEffect(() => {
    if (authToken) {
      getUserData(authToken)
        .then((res) => {
          setUser(res.data.user);
          if (!res.data.user.notifSub) {
            requestPermissonsAndSubscribe(authToken, res.data.user.id);
          }
          if (res.data.user.notifSub) {
            send(authToken, res.data.user.id);
          }
          getEvents(res.data.user.username, authToken)
            .then((response) => {
              setEvents(response.data.events);
            })
            .catch((err) => {
              console.log(err);
            });
          getReminders(res.data.user.username, authToken)
            .then((response) => {
              setReminders(response.data.reminders);
            })
            .catch((err) => {
              console.log(err);
            });
          getAllLists(authToken, res.data.user.username)
            .then((response) => {
              setLists(response.data.lists);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (!authToken && user) {
      localStorage.removeItem("authToken");
      setUser(false);
    }
  }, [authToken]);

  const requestPermissonsAndSubscribe = (token, userId) => {
    requestAndSubscribe(token, userId);
  };

  const send = async (token, userId) => {
    try {
      if (token && user) {
        const parsedUser = JSON.parse(user);
        if (parsedUser.notifSub) {
          const serverSentSource = getNotifications(userId);
          getNotificationsAtStart(parsedUser.username, token)
            .then((res) => {
              const oldNotifs = res.data.notifs;
              setNotifications(oldNotifs);
              setupNotifListener(serverSentSource);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const setupNotifListener = (serverSentSource) => {
    console.log("Set up and listening for notifications");
    serverSentSource.addEventListener("open", () => {
      console.log("Open");
    });
    serverSentSource.addEventListener("message", (event) => {
      const notification = JSON.parse(event.data);
      setNotifications((prev) => [notification, ...prev]);
      console.log("Received notification:", notification);
    });
    serverSentSource.addEventListener("error", (error) => {
      console.error("SSE error:", error);
      serverSentSource.close();
    });
  };

  return (
    <UserContext.Provider
      value={{
        holidays,
        weekDays,
        user,
        events,
        reminders,
        googleToken,
        loginLoading,
        isOnline,
        lists,
        notifications,
        setNotifications,
        setLists,
        setUser,
        setEvents,
        setGoogleToken,
        setLoginLoading,
        setAuthToken,
        setReminders,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
