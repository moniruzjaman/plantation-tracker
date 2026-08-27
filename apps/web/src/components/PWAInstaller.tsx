import { useState, useEffect } from 'react';

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler as any);
    return () => window.removeEventListener('beforeinstallprompt', handler as any);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  if (!deferredPrompt && !isIOS) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '16px', left: '16px', right: '16px', zIndex: 100,
      background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Install PMIS V2</div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          {isIOS ? 'Tap Share then Add to Home Screen' : 'Install this app for offline access'}
        </div>
      </div>
      {deferredPrompt && (
        <button onClick={handleInstall} style={{
          background: '#006A4E', color: 'white', border: 'none', padding: '8px 16px',
          borderRadius: '4px', cursor: 'pointer', fontWeight: 500
        }}>
          Install
        </button>
      )}
    </div>
  );
}
