import { createContext, useState, useEffect } from "react";
import { subscribe } from "../utils/api";
import { urlBase64ToUint8Array } from "../utils/helpers";

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

  const send = async (reminder) => {
    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
      })
      .then((registration) => {
        // console.log("Registered", registration);
        registration.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              import.meta.env.VITE_VAPID_PUBLIC_KEY
            ),
          })
          .then((sub) => {
            // console.log("Subscription", sub);
            if (reminder) {
              const token = localStorage.getItem("authToken");
              subscribe(token, sub, reminder)
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
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
