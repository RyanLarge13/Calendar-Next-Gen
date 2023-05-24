self.addEventListener("push", (event) => {
  const data = event.data.json();
  const options = {
    body: data.notes,
    icon: "/favicon.svg",
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
  const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
  const newNotif = {
    id: Math.floor(Math.random() * 2341674363554926),
    title: data.title,
    notes: data.notes,
  };
  notifications.push(newNotif);
  localStorage.setItem("notifications", JSON.stringify(notifications));
});
