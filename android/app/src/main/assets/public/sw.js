/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "d544154808439fa8be9a9ee2d3bd6f2e"
  }, {
    "url": "pwa-512x512.png",
    "revision": "d18e0f47d8a3a3579e191db50e00e019"
  }, {
    "url": "pwa-192x192.png",
    "revision": "955ebf8425fd35f987d08b55f03d2d27"
  }, {
    "url": "privacy.html",
    "revision": "0f910d96ff926812a3125013bf9374f1"
  }, {
    "url": "index.html",
    "revision": "173308559a403cb39f315e24b6f6e79e"
  }, {
    "url": "icon.svg",
    "revision": "90f30d66a1c653d7ee7ca7328a44e4e6"
  }, {
    "url": "favicon.ico",
    "revision": "5291147369cf558ae7f770598c83c6cc"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "3ac51ac0263dcbc602253a5cee0c8d4c"
  }, {
    "url": "assets/web-v2ZHuZTd.js",
    "revision": null
  }, {
    "url": "assets/web-CwB4v-iB.js",
    "revision": null
  }, {
    "url": "assets/web-CIBtOZcU.js",
    "revision": null
  }, {
    "url": "assets/web-Bi904hWu.js",
    "revision": null
  }, {
    "url": "assets/vendor-Di5KXSeB.js",
    "revision": null
  }, {
    "url": "assets/upload-ucrfks5m.js",
    "revision": null
  }, {
    "url": "assets/trash-2-ByYD1XC7.js",
    "revision": null
  }, {
    "url": "assets/smartphone-LA4Db-Ka.js",
    "revision": null
  }, {
    "url": "assets/shield-check-DxHmyA_V.js",
    "revision": null
  }, {
    "url": "assets/share-2-NOT7z6Oq.js",
    "revision": null
  }, {
    "url": "assets/refresh-cw-CdC4u8RY.js",
    "revision": null
  }, {
    "url": "assets/palette-KDz_QcWv.js",
    "revision": null
  }, {
    "url": "assets/lock-DzcOR4HB.js",
    "revision": null
  }, {
    "url": "assets/layers-DVVYTvyS.js",
    "revision": null
  }, {
    "url": "assets/key-round-DmleBOZF.js",
    "revision": null
  }, {
    "url": "assets/index-vz54d27s.css",
    "revision": null
  }, {
    "url": "assets/index-CRPyEaT-.js",
    "revision": null
  }, {
    "url": "assets/history-Q1QK72bM.js",
    "revision": null
  }, {
    "url": "assets/download-C8NsLzYt.js",
    "revision": null
  }, {
    "url": "assets/check-Bt1I0pgB.js",
    "revision": null
  }, {
    "url": "assets/capacitor-kTurfa8G.js",
    "revision": null
  }, {
    "url": "assets/arrow-left-IKTSikim.js",
    "revision": null
  }, {
    "url": "assets/WallpaperGrid-Du2JEoEl.js",
    "revision": null
  }, {
    "url": "assets/WallpaperCard-DwPUGxaZ.js",
    "revision": null
  }, {
    "url": "assets/StickersScreen-DaFwl5pS.js",
    "revision": null
  }, {
    "url": "assets/SearchScreen-D2A3P5aV.js",
    "revision": null
  }, {
    "url": "assets/RewardedAdModal-Jpgq-Uz_.js",
    "revision": null
  }, {
    "url": "assets/ProfileScreen-BvKDAu9f.js",
    "revision": null
  }, {
    "url": "assets/NativeBannerAd-BMEAwdqH.js",
    "revision": null
  }, {
    "url": "assets/Modal-C9tCkzOz.js",
    "revision": null
  }, {
    "url": "assets/InterstitialAdModal-uSE2cUJB.js",
    "revision": null
  }, {
    "url": "assets/HomeScreen-DPo-gQpM.js",
    "revision": null
  }, {
    "url": "assets/FullscreenViewer-CLdGJYoZ.js",
    "revision": null
  }, {
    "url": "assets/FavoritesScreen-D4SJZmPx.js",
    "revision": null
  }, {
    "url": "assets/ExploreScreen-nskqqguQ.js",
    "revision": null
  }, {
    "url": "assets/CollectionCard-BXSFW1SZ.js",
    "revision": null
  }, {
    "url": "assets/Button-BO5VsEqq.js",
    "revision": null
  }, {
    "url": "assets/ApplyWallpaperModal-QGyu6b45.js",
    "revision": null
  }, {
    "url": "assets/AdminPanel-BfeHdyKW.js",
    "revision": null
  }, {
    "url": "assets/AdminAuthModal--ocq4n3U.js",
    "revision": null
  }, {
    "url": "assets/AdFreePassCard-kxXXufHa.js",
    "revision": null
  }, {
    "url": "assets/AdChoicesModal-BnSDq7zc.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "3ac51ac0263dcbc602253a5cee0c8d4c"
  }, {
    "url": "favicon.ico",
    "revision": "5291147369cf558ae7f770598c83c6cc"
  }, {
    "url": "icon.svg",
    "revision": "90f30d66a1c653d7ee7ca7328a44e4e6"
  }, {
    "url": "pwa-192x192.png",
    "revision": "955ebf8425fd35f987d08b55f03d2d27"
  }, {
    "url": "pwa-512x512.png",
    "revision": "d18e0f47d8a3a3579e191db50e00e019"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "d544154808439fa8be9a9ee2d3bd6f2e"
  }, {
    "url": "manifest.webmanifest",
    "revision": "5c4751d76e4ead6e39991368abd6eaf3"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/images\.unsplash\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "yugen-wallpapers-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 120,
      maxAgeSeconds: 2592000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
