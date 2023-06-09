function urlBase64ToUint8Array(base64String) {
  var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

self.addEventListener("push", (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: "/favicon.svg",
  });
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    self.registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BDPEMIjUhO_wFc9YuC3WDrSeKPRGLM9w9zFPaaTmbij3GUCz5zDRQbUlGfg0awB9unEVgd-nypliFOWwEQ4lHCM"
        ),
      })
      .then((subscription) => {
        console.log("Successfully subscribed: ", subscription);
        // fetch(`${devUrl}/subscribe/notifications`, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(subscription),
        // })
        //   .then((response) => {
        //     console.log("Subscription Response Push Notifs: ", response);
        //   })
        //   .catch((error) => {
        //     console.log("Error Subscribing To Push Notifs: ", error);
        //   });
      })
      .catch((error) => {
        console.log("Error With Initially Subscribing To Push Notifs: ", error);
      })
  );
});
