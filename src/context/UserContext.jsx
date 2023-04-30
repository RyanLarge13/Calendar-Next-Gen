import { createContext, useState, useEffect } from "react";

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  const [events, setEvents] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || false);
  const [loginLogout, setLoginLogout] = useState(true);

  return (
    <UserContext.Provider
      value={{ user, setUser, events, setEvents, token, setToken }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
