const CACHE_NAME = 'choco-rail-map-v2'; // 更新版本号，确保旧 SW 被替换
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => console.warn('部分资源缓存失败', err));
    })
  );
});

self.addEventListener('fetch', event => {
  // 只处理 http/https 请求，忽略 chrome-extension、file 等
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      const fetchRequest = event.request.clone();
      return fetch(fetchRequest).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(error => {
        console.warn('网络请求失败', event.request.url, error);
        return new Response('离线状态下无法访问该资源', { status: 503 });
      });
    })
  );
});