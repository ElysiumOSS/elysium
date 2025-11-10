/**
 * Elysium Service Worker
 * Copyright 2025 Elysium OSS
 *
 * This service worker provides offline functionality and caching
 * for the Elysium web application.
 */

const CACHE_VERSION = "elysium-v1.0.0";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Assets to cache immediately on install
const STATIC_ASSETS = [
	'/',
	'/about',
	'/support',
	'/favicon.svg',
	'/assets/images/logo-192.png',
	'/assets/images/logo-512.png',
	'/assets/images/logo-96.png',
	'/assets/images/og.jpg',
	'/assets/images/screenshot-mobile.png',
	'/manifest.json'
];

// Maximum cache sizes
const MAX_DYNAMIC_CACHE_SIZE = 50;
const MAX_IMAGE_CACHE_SIZE = 30;

/**
 * Limit cache size by removing oldest entries
 */
async function limitCacheSize(cacheName, maxItems) {
	const cache = await caches.open(cacheName);
	const keys = await cache.keys();

	if (keys.length > maxItems) {
		const keysToDelete = keys.slice(0, keys.length - maxItems);
		await Promise.all(keysToDelete.map((key) => cache.delete(key)));
	}
}

/**
 * Install event - cache static assets
 */
self.addEventListener("install", (event) => {
	console.log("[Service Worker] Installing service worker...");

	event.waitUntil(
		caches
			.open(STATIC_CACHE)
			.then((cache) => {
				console.log("[Service Worker] Caching static assets");
				return cache.addAll(STATIC_ASSETS);
			})
			.then(() => self.skipWaiting())
			.catch((err) =>
				console.error("[Service Worker] Cache installation failed:", err),
			),
	);
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener("activate", (event) => {
	console.log("[Service Worker] Activating service worker...");

	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames
						.filter((cacheName) => {
							// Remove old caches that don't match current version
							return (
								cacheName.startsWith("elysium-") &&
								!cacheName.startsWith(CACHE_VERSION)
							);
						})
						.map((cacheName) => {
							console.log("[Service Worker] Removing old cache:", cacheName);
							return caches.delete(cacheName);
						}),
				);
			})
			.then(() => self.clients.claim()),
	);
});

/**
 * Fetch event - serve from cache, fallback to network
 */
self.addEventListener("fetch", (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET requests
	if (request.method !== "GET") {
		return;
	}

	// Skip API calls and external resources
	if (url.pathname.startsWith("/api/") || url.origin !== location.origin) {
		return;
	}

	// Handle image requests
	if (request.destination === "image") {
		event.respondWith(
			caches
				.match(request)
				.then((cachedResponse) => {
					if (cachedResponse) {
						return cachedResponse;
					}

					return fetch(request).then((response) => {
						return caches.open(IMAGE_CACHE).then((cache) => {
							cache.put(request, response.clone());
							limitCacheSize(IMAGE_CACHE, MAX_IMAGE_CACHE_SIZE);
							return response;
						});
					});
				})
				.catch(() => {
					// Return a fallback image if available
					return caches.match("/favicon.ico");
				}),
		);
		return;
	}

	// Handle all other requests with Cache-First strategy for static assets
	// and Network-First for dynamic content
	const isStaticAsset = STATIC_ASSETS.some(
		(asset) => url.pathname === asset || url.pathname.startsWith("/assets/"),
	);

	if (isStaticAsset) {
		// Cache-First strategy for static assets
		event.respondWith(
			caches
				.match(request)
				.then((cachedResponse) => {
					if (cachedResponse) {
						return cachedResponse;
					}

					return fetch(request).then((response) => {
						return caches.open(STATIC_CACHE).then((cache) => {
							cache.put(request, response.clone());
							return response;
						});
					});
				})
				.catch(() => {
					// Return offline page if available
					if (request.destination === "document") {
						return caches.match("/");
					}
				}),
		);
	} else {
		// Network-First strategy for dynamic content
		event.respondWith(
			fetch(request)
				.then((response) => {
					return caches.open(DYNAMIC_CACHE).then((cache) => {
						cache.put(request, response.clone());
						limitCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_SIZE);
						return response;
					});
				})
				.catch(() => {
					return caches.match(request).then((cachedResponse) => {
						if (cachedResponse) {
							return cachedResponse;
						}

						// Return offline page for documents
						if (request.destination === "document") {
							return caches.match("/");
						}
					});
				}),
		);
	}
});

/**
 * Message event - handle cache updates from client
 */
self.addEventListener("message", (event) => {
	if (event.data && event.data.type === "SKIP_WAITING") {
		self.skipWaiting();
	}

	if (event.data && event.data.type === "CLEAR_CACHE") {
		event.waitUntil(
			caches
				.keys()
				.then((cacheNames) => {
					return Promise.all(
						cacheNames.map((cacheName) => caches.delete(cacheName)),
					);
				})
				.then(() => {
					return self.clients.matchAll();
				})
				.then((clients) => {
					clients.forEach((client) => {
						client.postMessage({ type: "CACHE_CLEARED" });
					});
				}),
		);
	}
});

/**
 * Background sync for offline actions
 */
self.addEventListener("sync", (event) => {
	console.log("[Service Worker] Background sync:", event.tag);

	if (event.tag === "sync-data") {
		event.waitUntil(
			// Implement your sync logic here
			Promise.resolve(),
		);
	}
});

/**
 * Push notification handler
 */
self.addEventListener("push", (event) => {
	console.log("[Service Worker] Push notification received");

	const options = {
		body: event.data ? event.data.text() : "New update available",
		icon: "/assets/images/logo.png",
		badge: "/assets/images/logo.png",
		vibrate: [200, 100, 200],
		tag: "elysium-notification",
		data: {
			url: "/",
		},
	};

	event.waitUntil(self.registration.showNotification("Elysium", options));
});

/**
 * Notification click handler
 */
self.addEventListener("notificationclick", (event) => {
	console.log("[Service Worker] Notification clicked");

	event.notification.close();

	event.waitUntil(
		clients
			.matchAll({ type: "window", includeUncontrolled: true })
			.then((clientList) => {
				// Check if there's already a window open
				for (const client of clientList) {
					if (client.url === event.notification.data.url && "focus" in client) {
						return client.focus();
					}
				}

				// Open new window if none exists
				if (clients.openWindow) {
					return clients.openWindow(event.notification.data.url);
				}
			}),
	);
});

console.log("[Service Worker] Service worker script loaded");
