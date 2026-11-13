const CACHE_NAME = 'projeto-ativa-v88-conexoes';
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
