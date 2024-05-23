const devUrl = "http://localhost:8080";
const productionUrl = "https://calendar-next-gen-production.up.railway.app";

if ("serviceWorker" in navigator && "PushManager" in window) {
  window.addEventListener("load", async () => {
    try {
      const existingRegistration =
        await navigator.serviceWorker.getRegistration();
      if (existingRegistration) {
        console.log("SW Previously registered but still registering new one");
      }
      const registration = await navigator.serviceWorker.register("./sw.js");
      console.log("Service Worker registered:", registration);
      if (registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });
}
