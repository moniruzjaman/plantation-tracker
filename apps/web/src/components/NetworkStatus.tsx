import { useState, useEffect } from 'react';

export type NetworkStatusData = { isOnline: boolean; serviceWorkerReady: boolean };

export default function NetworkStatus({ onStateChange }: { onStateChange?: (data: NetworkStatusData) => void }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swReady, setSwReady] = useState(false);

  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); onStateChange?.({ isOnline: true, serviceWorkerReady: swReady }); };
    const handleOffline = () => { setIsOnline(false); onStateChange?.({ isOnline: false, serviceWorkerReady: swReady }); };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => setSwReady(true));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [swReady, onStateChange]);

  return (
    <div style={{
      position: 'fixed', top: '8px', right: '8px', zIndex: 100,
      padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500,
      background: isOnline ? '#dcfce7' : '#fee2e2',
      color: isOnline ? '#166534' : '#991b1b'
    }}>
      {isOnline ? 'Online' : 'Offline'}
    </div>
  );
}
