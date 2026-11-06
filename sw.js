// Cambia la versión al publicar cambios para retirar el caché anterior.
const CACHE_NAME = 'mathjr-cache-v13';

// Archivos básicos a guardar al instalar la app
const urlsToCache = [
  './',
  './index.html',
  './sumas.html',
  './restas.html',
  './mental.html',
  './multiplicaciones.html',
  './divisiones.html',
  './geometria.html',
  './reloj.html',
  './leer-numeros.html',
  './manifest.json',
  './ui.css',
  './accessibility.js',
  './theme.js',
  './practice-guide.js',
  './practice-help.js',
  './fox-mark.svg',
  './dojo-icons.svg',
  './icon-192.png',
  './icon-512.png'
];

// INSTALACIÓN: Guardamos lo básico en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// ACTIVACIÓN: Limpiamos cachés antiguas si cambiamos el CACHE_NAME
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ESTRATEGIA "NETWORK FIRST" (Red primero, caché de respaldo)
self.addEventListener('fetch', event => {
  // Ignoramos peticiones que no sean GET (como envíos de formularios) o extensiones de Chrome
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Red primero: el contenido publicado se muestra en cuanto está disponible.
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Si NO hay internet (falla el fetch), buscamos en la caché
        return caches.match(event.request);
      })
  );
});
