self.addEventListener("push", (event) => {
  const data = event.data.json();
  const options = {
    body: data.notes,
    icon: "/favicon.svg",
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});
