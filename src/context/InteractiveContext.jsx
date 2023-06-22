import { createContext, useState, useEffect } from "react";
import { getNotifications, getNotificationsAtStart } from "../utils/api";

const InteractiveContext = createContext({});

export const InteractiveProvider = ({ children }) => {
  const [menu, setMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
const [showNotifs, setShowNotifs] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [view, setView] = useState("month");
  const [addNewEvent, setAddNewEvent] = useState(false);
  const [type, setType] = useState(null);

  useEffect(() => {
    send();
  }, []);

  const send = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const user = localStorage.getItem("user");
      if (token && user) {
        const parsedUser = JSON.parse(user);
        const userId = parsedUser.id;
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
    <InteractiveContext.Provider
      value={{
        menu,
        showLogin,
        confirm,
        notifications,
        view,
        addNewEvent,
        type,
        showNotifs, 
        setShowNotifs, 
        setType,
        setAddNewEvent,
        setView,
        setConfirm,
        setMenu,
        setNotifications,
        setShowLogin,
      }}
    >
      {children}
    </InteractiveContext.Provider>
  );
};

export default InteractiveContext;
