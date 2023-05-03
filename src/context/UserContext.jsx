import { createContext, useState, useEffect } from "react";
import { holidays, weekDays } from "../constants";
import {
  getGoogleData,
  loginWithGoogle,
  // getGoogleCalendarEvents,
} from "../utils/api";

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  const [events, setEvents] = useState(
    JSON.parse(localStorage.getItem("events")) || []
  );
  const [googleToken, setGoogleToken] = useState(
    localStorage.getItem("googleToken") || false
  );
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    if (googleToken) {
      setLoginLoading(true);
      getGoogleData(googleToken)
        .then((res) => {
          loginWithGoogle(res.data)
            .then((res) => {
              setUser(res.data.user);
              setEvents((prev) => [...prev, res.data.events]);
              localStorage.setItem("events", JSON.stringify(res.data.events));
              // getGoogleCalendarEvents(res.data.user.email)
              // .then((res) => {
              //   console.log(res);
              // })
              // .catch((err) => console.log(err));
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          localStorage.removeItem("googleToken");
          setUser(false);
          setEvents(localStorage.getItem("events") || []);
        });
    }
    if (!googleToken) {
      setEvents(JSON.parse(localStorage.getItem("events")) || []);
    }
  }, [googleToken]);

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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
