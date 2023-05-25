import { createContext, useState, useEffect } from "react";
import { holidays, weekDays } from "../constants";
import {
  getUserData,
  getGoogleData,
  loginWithGoogle,
  getEvents,
  getReminders,
  getNotifications,
  // getGoogleCalendarEvents,
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
          getEvents(res.data.user.username, authToken)
            .then((response) => {
              // setEvents((prev) => [...prev, response.data.events]);
              setEvents(response.data.events);
            })
            .catch((err) => {
              console.log(err);
            });
          getReminders(res.data.user.username, authToken)
            .then((response) => {
              // localStorage.setItem(
              //   "reminders",
              //   JSON.stringify(response.data.reminders)
              // );
              setReminders(response.data.reminders);
            })
            .catch((err) => {
              console.log(err);
            });
          const recursiveNotifs = () => {
            getNotifications(res.data.user.username, authToken)
              .then((response) => {
                setNotifications(response.data.notifs);
                setTimeout(() => {
                  recursiveNotifs();
                }, 5000);
              })
              .catch((err) => {
                console.log(err);
                if (axios.isCancel(err)) {
                  console.log("Request canceled:", err.message);
                } else {
                  console.error(err);
                  recursiveNotifs();
                }
              });
          };
          recursiveNotifs();
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
        notifications,
        setNotifications,
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
