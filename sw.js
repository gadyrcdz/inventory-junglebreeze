// Estrategia "network-first, cache de respaldo":
// - Si hay conexión: siempre trae la versión más reciente de internet y actualiza la
//   caché en segundo plano. Así nunca te quedas viendo una versión vieja después de un
//   push, sin tener que subir manualmente un número de versión cada vez.
// - Si NO hay conexión (por ejemplo en el sitio de canopy): sirve la última copia
//   guardada, para que la app siga abriendo y funcionando.
// Los datos de Firestore (salida/entrada/historial) tienen su propia caché offline
// aparte (enableIndexedDbPersistence en app.js) y no dependen de este Service Worker.

const CACHE = 'brisas-inventario-shell';
const SHELL = ['./index.html', './style.css', './app.js', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; // no interceptar Firestore/gstatic/jsdelivr

  e.respondWith(
    fetch(e.request)
      .then(res => {
        const resClone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, resClone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});