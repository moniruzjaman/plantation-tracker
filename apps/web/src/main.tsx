import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('[PWA] New version detected - activating & reloading.');
    updateSW(true);
  },
  onOfflineReady() {
    console.log('Offline ready');
  },
  onRegistered(registration) {
    if (!registration) return;
    const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;
    setInterval(() => {
      registration.update().catch(() => {});
    }, UPDATE_CHECK_INTERVAL_MS);
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
