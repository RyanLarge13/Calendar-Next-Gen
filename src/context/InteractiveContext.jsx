import { createContext, useState, useEffect } from "react";
import Axios from "axios";

const InteractiveContext = createContext({});

export const InteractiveProvider = ({ children }) => {
  const [menu, setMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      send();
    }
  }, []);

  function urlBase64ToUint8Array(base64String) {
    var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const send = async (reminder) => {
      const reg = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY
        ),
      });
    if (reminder) {
      Axios.post(
        "http://localhost:8080/subscribe/reminders",
        { sub: JSON.stringify(sub), reminder: reminder },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  };

  return (
    <InteractiveContext.Provider
      value={{
        menu,
        showLogin,
        confirm,
        send,
        setConfirm,
        setMenu,
        setShowLogin,
      }}
    >
      {children}
    </InteractiveContext.Provider>
  );
};

export default InteractiveContext;
