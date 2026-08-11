/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request }) => request.mode === 'navigate',
  new StaleWhileRevalidate({ cacheName: 'pages' })
);

setCatchHandler(async ({ event }) => {
  // setCatchHandler's callback types `event` as the base ExtendableEvent,
  // which has no `.request` -- but a catch handler reached via a fetch
  // route (as this one is, registered against navigate requests above)
  // is always actually invoked with a FetchEvent. Workbox's own type
  // signature doesn't narrow this automatically, hence the assertion.
  const fetchEvent = event as FetchEvent;
  if (fetchEvent.request.mode === 'navigate') {
    return caches.match('/offline.html');
  }
  return Response.error();
});
