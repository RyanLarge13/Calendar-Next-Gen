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
  const [user, setUser] = useState(false);
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || false
  );
  const [events, setEvents] = useState([]);
  const [lists, setLists] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [localDB, setLocalDB] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [systemNotif, setSystemNotif] = useState({ show: false });
  const [backOnlineTrigger, setBackOnlineTrigger] = useState(false);
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
          { text: "close", func: () => setSystemNotif({ show: false }) },
          { text: "refresh", func: () => window.location.reload() },
        ],
      };
      setSystemNotif(newNotif);
      setBackOnlineTrigger(true);
    }
    if (isOnline && backOnlineTrigger === true) {
      // Logic to show notification when going back online
      const newNotif = {
        show: true,
        title: "Network",
        text: "You are back online",
        color: "bg-green-300",
        actions: [
          { text: "close", func: () => setSystemNotif({ show: false }) },
        ],
      };
      setSystemNotif(newNotif);
      setBackOnlineTrigger(false);
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
          if (res.data.user.notifSub === null) {
            requestPermissonsAndSubscribe(authToken, res.data.user.id);
          }
          if (res.data.user.notifSub !== null) {
            send(authToken, res.data.user.id, res.data.user.notifSub);
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
              const sortedReminders = response.data.reminders.sort(
                (a, b) => b.time - a.time
              );
              setReminders(sortedReminders);
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

  const requestPermissonsAndSubscribe = async (token, userId) => {
    try {
      requestAndSubscribe(token, userId)
        .then((res) => res.json())
        .then((data) => {
          setUser(data.user);
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          send(data.token, data.user.id, data.user.notifSub);
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.error("Error getting service worker registration:", err);
    }
  };

  const send = async (token, userId, notifSub) => {
    try {
      if (notifSub) {
        console.log(userId);
        const serverSentSource = getNotifications(userId);
        getNotificationsAtStart(user.username, token)
          .then((res) => {
            const oldNotifs = res.data.notifs;
            const sortedOldNotifs = oldNotifs.sort((a, b) => b.time - a.time);
            setNotifications(sortedOldNotifs);
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
      setSystemNotif({
        show: true,
        title: event.data.type,
        text: "",
        color: "bg-purple-300",
        actions: [
          { text: "close", func: () => setSystemNotif({ show: false }) },
          { text: "open", func: (customFunc) => customFunc() },
        ],
      });
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
