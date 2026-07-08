import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    // Auto-activate the new service worker and reload, so users always get
    // the latest deployed version on their next visit. Without this, the SW
    // detects the new version but never swaps it in — users get stuck on
    // the old precached legacy-nursery.html forever.
    console.log('[PWA] New version detected — activating & reloading.');
    updateSW(true);
  },
  onOfflineReady() {
    console.log('Offline ready');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

