"use strict";

const CACHE_VERSION = "v6";

const STATIC_CACHE =
  `cbgrid-static-${CACHE_VERSION}`;

const RUNTIME_CACHE =
  `cbgrid-runtime-${CACHE_VERSION}`;

const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.webmanifest",
  "./CBGrid_Icon.png"
];

self.addEventListener(
  "install",
  event => {
    event.waitUntil(
      caches
        .open(STATIC_CACHE)
        .then(cache => {
          return cache.addAll(APP_SHELL);
        })
        .then(() => {
          return self.skipWaiting();
        })
    );
  }
);

self.addEventListener(
  "activate",
  event => {
    event.waitUntil(
      caches
        .keys()
        .then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              const isCurrentCache =
                cacheName === STATIC_CACHE ||
                cacheName === RUNTIME_CACHE;

              if (!isCurrentCache) {
                return caches.delete(
                  cacheName
                );
              }

              return Promise.resolve();
            })
          );
        })
        .then(() => {
          return self.clients.claim();
        })
    );
  }
);

self.addEventListener(
  "fetch",
  event => {
    const request = event.request;
    const requestUrl =
      new URL(request.url);

    if (request.method !== "GET") {
      return;
    }

    const supportedProtocols = [
      "http:",
      "https:"
    ];

    if (
      !supportedProtocols.includes(
        requestUrl.protocol
      )
    ) {
      return;
    }

    if (request.mode === "navigate") {
      event.respondWith(
        networkFirstPage(request)
      );

      return;
    }

    if (
      requestUrl.origin ===
      self.location.origin
    ) {
      event.respondWith(
        cacheFirst(request)
      );

      return;
    }

    event.respondWith(
      networkFirstExternal(request)
    );
  }
);

async function networkFirstPage(
  request
) {
  try {
    const networkResponse =
      await fetch(request);

    if (
      isCacheableResponse(
        networkResponse
      )
    ) {
      const cache =
        await caches.open(
          RUNTIME_CACHE
        );

      await cache.put(
        "./index.html",
        networkResponse.clone()
      );
    }

    return networkResponse;
  } catch (error) {
    const cachedPage =
      await caches.match(
        "./index.html"
      );

    if (cachedPage) {
      return cachedPage;
    }

    const cachedRoot =
      await caches.match("./");

    if (cachedRoot) {
      return cachedRoot;
    }

    throw error;
  }
}

async function cacheFirst(
  request
) {
  const cachedResponse =
    await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse =
    await fetch(request);

  if (
    isCacheableResponse(
      networkResponse
    )
  ) {
    const cache =
      await caches.open(
        RUNTIME_CACHE
      );

    await cache.put(
      request,
      networkResponse.clone()
    );
  }

  return networkResponse;
}

async function networkFirstExternal(
  request
) {
  try {
    const networkResponse =
      await fetch(request);

    /*
      Cross-origin responses can be
      opaque. We return them normally,
      but do not attempt to cache them.
    */
    if (
      isCacheableResponse(
        networkResponse
      )
    ) {
      const cache =
        await caches.open(
          RUNTIME_CACHE
        );

      await cache.put(
        request,
        networkResponse.clone()
      );
    }

    return networkResponse;
  } catch (error) {
    const cachedResponse =
      await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

function isCacheableResponse(
  response
) {
  return Boolean(
    response &&
    response.status === 200 &&
    response.type !== "opaque" &&
    response.type !== "error"
  );
}

self.addEventListener(
  "message",
  event => {
    if (
      event.data &&
      event.data.type ===
        "SKIP_WAITING"
    ) {
      self.skipWaiting();
    }
  }
);