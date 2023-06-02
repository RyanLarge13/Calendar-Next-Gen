import { createContext, useState, useEffect } from "react";
import { subscribe, getNotifications } from "../utils/api";
import { urlBase64ToUint8Array } from "../utils/helpers";

const InteractiveContext = createContext({});

export const InteractiveProvider = ({ children }) => {
  const [menu, setMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [view, setView] = useState("month");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      send();
    }
  }, []);

  const send = async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY
        ),
      });
      subscribe(localStorage.getItem("authToken"), subscription)
        .then((res) => {
          console.log("Subscription:", res);
        })
        .catch((err) => {
          console.log(err);
        });
      setTimeout(() => {
        if (JSON.parse(localStorage.getItem("user"))) {
          const user = JSON.parse(localStorage.getItem("user"));
          const userId = user.id;
          const serverSentSource = getNotifications(userId);
          setupNotifListener(serverSentSource);
        }
      }, 10000);
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
      setNotifications((prev) => [...prev, notification]);
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
        setView,
        send,
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
