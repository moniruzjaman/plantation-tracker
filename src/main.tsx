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
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

