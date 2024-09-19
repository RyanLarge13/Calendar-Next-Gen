const devUrl = "http://localhost:8080";
const productionUrl = "https://calendar-next-gen-production.up.railway.app";

if ("serviceWorker" in navigator && "PushManager" in window) {
  window.addEventListener("load", async () => {
    try {
      const existingRegistration =
        await navigator.serviceWorker.getRegistration();
      if (existingRegistration) {
        console.log("Service worker already exists, canceling registration of a new worker")
        return
      }
      const registration = await navigator.serviceWorker.register("./sw.js");
      console.log("Service Worker registered:", registration);
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });
}
