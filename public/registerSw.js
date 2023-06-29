const devUrl = "http://localhost:8080";
const productionUrl = "https://calendar-next-gen-production.up.railway.app";

if ("serviceWorker" in navigator && "PushManager" in window) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("./sw.js");
      console.log("Service Worker registered:", registration);
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);
      if (permission === "granted") {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            "BDPEMIjUhO_wFc9YuC3WDrSeKPRGLM9w9zFPaaTmbij3GUCz5zDRQbUlGfg0awB9unEVgd-nypliFOWwEQ4lHCM",
        });
        console.log("Push subscription:", subscription);
        await sendSubscriptionToServer(subscription);
      }
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });
}

async function sendSubscriptionToServer(subscription) {
  try {
    const response = await fetch(`${productionUrl}/subscribe/notifs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });

    if (response.ok) {
      console.log("Subscription sent to server successfully");
    } else {
      console.error("Failed to send subscription to server");
    }
  } catch (error) {
    console.error("Error sending subscription to server:", error);
  }
}
