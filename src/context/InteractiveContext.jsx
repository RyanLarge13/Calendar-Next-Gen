import { createContext, useState, useEffect } from "react";
import { subscribe } from "../utils/api";
import { urlBase64ToUint8Array } from "../utils/helpers";

const InteractiveContext = createContext({});

export const InteractiveProvider = ({ children }) => {
  const [menu, setMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [globalSubscription, setGlobalSubscription] = useState(null);

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

      setGlobalSubscription(subscription);

    } catch (err) {
      console.log(err);
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
