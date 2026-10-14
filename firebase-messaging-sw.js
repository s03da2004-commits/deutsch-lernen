/* Firebase Cloud Messaging service worker for GitHub Pages.
   Keep this file in the repository root beside index.html. */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB9rvJLEOBP0s7E33PRkugAP7bunZjx2U8",
  authDomain: "deutsch-92c70.firebaseapp.com",
  projectId: "deutsch-92c70",
  storageBucket: "deutsch-92c70.firebasestorage.app",
  messagingSenderId: "363816409439",
  appId: "1:363816409439:web:249806f814832b29923eea",
  measurementId: "G-D3ZFRMDTTJ"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || "Deutsch mit so3da";
  const options = {
    body: (payload.notification && payload.notification.body) || "عندك تحديث جديد في موقع الألماني.",
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    data: payload.data || { url: "./" }
  };
  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "./";
  event.waitUntil((async () => {
    const allClients = await clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of allClients) {
      if ("focus" in client) {
        await client.focus();
        if ("navigate" in client) await client.navigate(target);
        return;
      }
    }
    if (clients.openWindow) await clients.openWindow(target);
  })());
});
