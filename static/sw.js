const CACHE = "pv-v1";

self.addEventListener("install", e => {
	e.waitUntil(
		caches.open(CACHE).then(cache =>
			cache.addAll(["/", "/static/css/style.css"])
		)
	);
});

self.addEventListener("fetch", e => {
	e.respondWith(
		caches.match(e.request).then(r => r || fetch(e.request))
	);
});