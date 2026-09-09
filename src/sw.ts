/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);

// vite-plugin-pwa's registerType:'autoUpdate' + main.tsx's onNeedRefresh
// handler call updateSW(true), which posts {type:'SKIP_WAITING'} to this
// worker while it's waiting to activate -- but with the injectManifest
// strategy that message is only ever ACTED on if the custom worker itself
// listens for it and calls self.skipWaiting(). Without this listener the
// whole auto-update chain was silently a no-op: existing users stayed on
// whatever version installed first, only ever picking up a new deploy once
// every single open tab happened to be fully closed (the standard,
// slow, easy-to-never-happen SW lifecycle fallback). This is the missing
// piece that makes "new version detected -> activate & reload" in
// main.tsx actually take effect.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

registerRoute(
  ({ request }) => request.mode === 'navigate',
  new StaleWhileRevalidate({ cacheName: 'pages' })
);

setCatchHandler(async ({ event }) => {
  if (event instanceof FetchEvent && event.request.mode === 'navigate') {
    return caches.match('/offline.html');
  }
  return Response.error();
})
