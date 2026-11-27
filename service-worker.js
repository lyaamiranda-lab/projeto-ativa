const CACHE_NAME = 'ativa-habitus-v110-push-em-segundo-plano';
const APP_FILES = [
  './',
  './index.html',
  './supabase-config.js',
  './manifest.webmanifest',
  './icons/icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  const sameOrigin = requestUrl.origin === self.location.origin;
  const isAppPage = event.request.mode === 'navigate' ||
    (sameOrigin && requestUrl.pathname.endsWith('/index.html'));

  // A página principal tenta buscar a versão mais recente e usa a cópia
  // armazenada quando o aparelho estiver sem conexão.
  if (isAppPage) {
    event.respondWith(
      fetch(event.request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
        }
        return response;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Só armazenamos arquivos do próprio aplicativo. Serviços externos,
  // como autenticação e bibliotecas CDN, não recebem a página HTML como fallback.
  if (!sameOrigin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});


// Recebe avisos enviados pelo servidor mesmo quando o aplicativo não está aberto.
self.addEventListener('push', event => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; } catch { payload = { body: event.data?.text() || '' }; }
  const title = payload.title || 'Está na hora de cuidar de você 🌿';
  const options = {
    body: payload.body || 'Um pequeno passo também conta.',
    icon: './icons/icon.svg',
    badge: './icons/icon.svg',
    tag: payload.tag || 'ativa-habitus-lembrete',
    data: { url: payload.url || '/projeto-ativa/' },
    renotify: false
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || '/projeto-ativa/', self.location.origin).href;
  event.waitUntil((async () => {
    const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientsList) {
      if (client.url.startsWith(self.location.origin) && 'focus' in client) return client.focus();
    }
    if (self.clients.openWindow) return self.clients.openWindow(target);
  })());
});
