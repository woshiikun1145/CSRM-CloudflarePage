// 空 Service Worker，仅用于 PWA 安装，不进行任何缓存
self.addEventListener('install', () => {});
self.addEventListener('fetch', () => {});