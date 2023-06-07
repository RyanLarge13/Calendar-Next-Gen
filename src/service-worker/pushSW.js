importScripts("/sw.js");

self.addEventListener("activate", (event) => {
  event.waitUntil(
    self.registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
      })
      .then((subscription) => {
        fetch("/subscribe/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription),
        })
          .then((response) => {
            console.log("Subscription Response Push Notifs: ", response);
          })
          .catch((error) => {
            console.log("Error Subscribing To Push Notifs: ", error);
          });
      })
      .catch((error) => {
        console.log("Error With Initially Subscribing To Push Notifs: ", error);
      })
  );
});
