self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("botton-app").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./app.js"
      ]);
    })
  );
});