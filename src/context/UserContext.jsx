import { createContext, useState, useEffect } from "react";
import { holidays, weekDays } from "../constants";
import { loginWithGoogle } from "../utils/api";

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  const [events, setEvents] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [provider, setProvider] = useState("jwt");

  useEffect(() => {
    if (token) {
      setLoginLoading(true);
      if (provider === "google") {
        loginWithGoogle(token)
          .then((res) => {
            console.log(res);
            setUser(res.data);
            // search for user on Railway
            // if !user create one
            // if user fetch events by id
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log("Hey, I am tokenized");
      }
    }
    if (!token) {
      setEvents(JSON.parse(localStorage.getItem("events")) || []);
    }
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        holidays,
        weekDays,
        user,
        events,
        token,
        loginLoading,
        provider,
        setUser,
        setEvents,
        setToken,
        setLoginLoading,
        setProvider,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
