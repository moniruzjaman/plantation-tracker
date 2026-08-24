import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    // Auto-activate the new service worker and reload so users always
    // receive the latest deployed application version.
    console.log('[PWA] New version detected — activating & reloading.');
    updateSW(true);
  },
  onOfflineReady() {
    console.log('Offline ready');
  },
  onRegistered(registration) {
    // Field officers commonly leave this open for an entire day of data
    // entry rather than reloading, and the browser only checks for a new
    // service worker on navigation/registration by default -- which may
    // not happen for hours. Poll for updates periodically so a mid-day
    // deploy still reaches an already-open tab instead of waiting for the
    // next full reload.
    if (!registration) return;
    const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
    setInterval(() => {
      registration.update().catch(() => {
        // Offline or otherwise unreachable -- fine, just retry next tick.
      });
    }, UPDATE_CHECK_INTERVAL_MS);
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

