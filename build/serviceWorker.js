const CACHE_NAME = "LSD_CACHE";

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          "./",
          "./index.html",
          "./index.css",
          "./bundle.js",
          "./assets/fonts/fa-solid-900.eot",
          "./assets/fonts/fa-solid-900.ttf",
          "./assets/fonts/fa-solid-900.woff",
          "./assets/fonts/fa-solid-900.woff2",
          "./assets/images/svg/AND_ANSI.svg",
          "./assets/images/svg/Buffer_ANSI.svg",
          "./assets/images/svg/OR_ANSI.svg",
          "./assets/images/svg/NOT_ANSI.svg",
          "./assets/images/svg/XOR_ANSI.svg",
          "./assets/images/svg/Delay.svg",
          "./assets/images/svg/Input.svg",
          "./assets/images/svg/Output.svg",
        ]);
      })
  );
});

self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    caches.match(evt.request)
      .then((response) => {
        return response ? response : fetch(evt.request);
      })
      .catch((err) => {
        throw err;
      })
  );
});
