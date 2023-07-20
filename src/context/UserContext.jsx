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
import IndexedDBManager from "../utils/indexDBApi";

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const systemNotifReset = {
    show: false,
    title: null,
    text: null,
    color: null,
    actions: null,
  };
  const [user, setUser] = useState(false);
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || false
  );
  const [events, setEvents] = useState([]);
  const [lists, setLists] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [localDB, setLocalDB] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [systemNotif, setSystemNotif] = useState({
    show: true,
    title: "Welcome",
    text: "Welcome to Calng! Is this your first time? Take a tour..",
    color: "bg-green-300",
    actions: [
      { text: "close", func: () => setSystemNotif(systemNotifReset) },
      { text: "start tour 😊", func: () => console.log("start tour") },
    ],
  });
  const [googleToken, setGoogleToken] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const updateStatus = () => {
    setIsOnline(navigator.onLine);
  };

  useEffect(() => {
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      const newNotif = {
        show: true,
        title: "Network",
        text: "You are offline",
        color: "bg-red-300",
        actions: [
          { text: "close", func: () => setSystemNotif(systemNotifReset) },
          { text: "refresh", func: () => window.reload() },
        ],
      };
      setSystemNotif(newNotif);
    }
  }, [isOnline]);

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
  }, [isOnline, googleToken]);

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
      openIndexDB();
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
      if (error.eventPhase === EventSource.CLOSED) {
        console.log("SSE connection closed.");
        setTimeout(() => {
          const source = getNotifications(user.id);
          setupNotifListener(source);
        }, 3000);
      }
    });
  };

  const openIndexDB = () => {
    const request = indexedDB.open("myCalngDB", 1);
    calngIndexDBManager = new IndexedDBManager(request);
    setLocalDB(calngIndexDBManager);
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
        systemNotif,
        setSystemNotif,
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
