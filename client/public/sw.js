const CACHE_NAME = 'ruhit-shell-dev-v2'
const PRECACHE_URLS = ['/','/kelas/5/','/kelas/5/pecahan/','/laporan/','/privasi/','/manifest.webmanifest','/favicon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)))))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('ruhit-shell-') && key !== CACHE_NAME).map((key) => caches.delete(key)))))
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (request.mode === 'navigate') {
    if (!PRECACHE_URLS.includes(url.pathname) && url.pathname !== '/404.html') return
    event.respondWith((async () => {
      try {
        const response = await fetch(request)
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME)
          await cache.put(url.pathname, response.clone())
        }
        return response
      } catch {
        return (await caches.match(url.pathname)) || (await caches.match('/')) || Response.error()
      }
    })())
    return
  }
  const isStaticAsset = /\.(?:css|js|svg|png|woff2|webmanifest)$/.test(url.pathname) || /^\/(?:assets|brand|icons|images)\//.test(url.pathname)
  if (!isStaticAsset) return
  event.respondWith((async () => {
    const cached = await caches.match(request)
    if (cached) return cached
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      await cache.put(request, response.clone())
    }
    return response
  })())
})
