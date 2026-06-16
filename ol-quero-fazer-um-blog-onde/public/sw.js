self.addEventListener("push", (event) => {
  const data = event.data
    ? event.data.json()
    : {
        title: "Nexus Nerd",
        body: "Tem post novo no blog.",
        url: "/",
        image: "/nexus-nerd-logo.png"
      };

  event.waitUntil(
    self.registration.showNotification(data.title || "Nexus Nerd", {
      body: data.body || "Tem post novo no blog.",
      icon: "/nexus-nerd-logo.png",
      badge: "/nexus-nerd-logo.png",
      image: data.image || "/nexus-nerd-logo.png",
      tag: data.tag || "nexus-nerd-new-post",
      renotify: true,
      vibrate: [120, 60, 120],
      actions: [
        {
          action: "open",
          title: "Ler agora"
        }
      ],
      data: {
        url: data.url || "/"
      }
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }

      return clients.openWindow(url);
    })
  );
});
