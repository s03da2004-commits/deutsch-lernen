/* Firebase Cloud Messaging service worker for Deutsch mit so3da. */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
firebase.initializeApp({
  apiKey: 'AIzaSyB9rvJLEOBP0s7E33PRkugAP7bunZjx2U8',
  authDomain: 'deutsch-92c70.firebaseapp.com',
  projectId: 'deutsch-92c70',
  storageBucket: 'deutsch-92c70.firebasestorage.app',
  messagingSenderId: '363816409439',
  appId: '1:363816409439:web:249806f814832b29923eea',
  measurementId: 'G-D3ZFRMDTTJ'
});
const messaging = firebase.messaging();
messaging.onBackgroundMessage(payload => {
  const data = payload.notification || payload.data || {};
  const title = data.title || 'Deutsch mit so3da';
  const options = {
    body: data.body || 'عندك تحديث جديد في موقع تعلّم الألماني.',
    icon: './icon-192.png',
    badge: './icon-192.png',
    data: { url: data.url || './' },
    tag: payload.messageId || ('deutsch-' + Date.now())
  };
  self.registration.showNotification(title, options);
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL((event.notification.data && event.notification.data.url) || './', self.location.origin).href;
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
    for (const client of clients) {
      if (client.url.startsWith(self.location.origin) && 'focus' in client) {
        client.navigate(target);
        return client.focus();
      }
    }
    return self.clients.openWindow ? self.clients.openWindow(target) : undefined;
  }));
});

// Offline shell cache, preserving the existing Firebase Messaging handlers.
const DE_OFFLINE_CACHE = "deutsch-app-shell-v1";
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(DE_OFFLINE_CACHE);
    await cache.add(new Request("./", { cache: "reload" })).catch(() => {});
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith("deutsch-app-shell-") && key !== DE_OFFLINE_CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      const cache = await caches.open(DE_OFFLINE_CACHE);
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.ok) await cache.put("./", fresh.clone());
        return fresh;
      } catch (_) {
        return (await cache.match(request)) || (await cache.match("./")) || Response.error();
      }
    })());
  }
});
