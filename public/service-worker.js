const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",
    "./service-worker.js",
    "./assets/css/styles.css",
    "./assets/images/icons/icon-72x72.png",
    "./assets/images/icons/icon-96x96.png",
    "./assets/images/icons/icon-128x128.png",
    "./assets/images/icons/icon-144x144.png",
    "./assets/images/icons/icon-152x152.png",
    "./assets/images/icons/icon-192x192.png",
    "./assets/images/icons/icon-384x384.png",
    "./assets/images/icons/icon-512x512.png",
    "./assets/js/index.js",
    "./assets/db/db.js",
    "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

self.addEventListener("install", function (evt) {
    evt.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                console.log("Your files were pre-cached successfully!");
                return cache.addAll(FILES_TO_CACHE);
            })
            .then(self.skipWaiting())
    );
});

// The activate takes care of cleaning up old caches.
self.addEventListener("activate", function (evt) {
    const currentCaches = [CACHE_NAME, DATA_CACHE_NAME];
    evt.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return cacheNames.filter(
                    (cacheName) => !currentCaches.includes(cacheName)
                );
            })
            .then((cachesToDelete) => {
                return Promise.all(
                    cachesToDelete.map((cacheToDelete) => {
                        return caches.delete(cacheToDelete);
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});


//fetch
self.addEventListener("fetch", function (evt) {
    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches
                .open(DATA_CACHE_NAME)
                .then((cache) => {
                    return fetch(evt.request)
                        .then((response) => {
                            if (response.status === 200) {
                                cache.put(evt.request.url, response.clone());
                            }
                            return response;
                        })
                        .catch((err) => {
                            console.log(err);
                            return cache.match(evt.request);
                        });
                })
                .catch((err) => console.log(err))
        );
        return;
    }
    evt.respondWith(
        caches.match(evt.request).then(function (response) {
            return response || fetch(evt.response);
        })
    );
});