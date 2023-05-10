import { createContext, useState, useEffect } from "react";
import { holidays, weekDays } from "../constants";
import {
  getUserData,
  getGoogleData,
  loginWithGoogle,
  getEvents,
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
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [authToken]);

  return (
    <UserContext.Provider
      value={{
        holidays,
        weekDays,
        user,
        events,
        googleToken,
        loginLoading,
        setUser,
        setEvents,
        setGoogleToken,
        setLoginLoading,
        isOnline,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
