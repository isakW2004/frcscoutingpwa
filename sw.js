var CACHE_NAME = '2530events';
var urlsToCache = [
  'assets/material.css',
  'assets/bootstrapcustom.min.css',
  'assets/material.js',
  'assets/jquery.js',
  'assets/icons.woff2',
  'assets/style.css',
  'index.html',
  'scout.html',
  'assets/charts.js',
  'assets/genQRCode.js',
  'assets/qrreader/alignpat.js',
  'assets/qrreader/bitmat.js',
  'assets/qrreader/bmparser.js',
  'assets/qrreader/datablock.js',
  'assets/qrreader/databr.js',
  'assets/qrreader/datamask.js',
  'assets/qrreader/decoder.js',
  'assets/qrreader/detector.js',
  'assets/qrreader/errorlevel.js',
  'assets/qrreader/findpat.js',
  'assets/qrreader/formatinf.js',
  'assets/qrreader/gf256.js',
  'assets/qrreader/gf256poly.js',
  'assets/qrreader/grid.js',
  'assets/qrreader/qrcode.js',
  'assets/qrreader/rsdecoder.js',
  'assets/qrreader/version.js',
  'assets/jquery.tablesorter.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        try{
          return cache.addAll(urlsToCache);
        }catch(err){
          console.log(err);
        }
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});
self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['pages-cache-v1', 'blog-posts-cache-v1'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});