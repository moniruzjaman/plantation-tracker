import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import CertificateCard from './CertificateCard';

export default function CertificatePortal() {
  const [portalContainer, setPortalContainer] = useState<Element | null>(null);

  useEffect(() => {
    const tryFind = () => {
      const iframe = document.querySelector('iframe') as HTMLIFrameElement | null;
      if (iframe?.contentDocument?.getElementById('certificate-portal-slot')) {
        setPortalContainer(iframe.contentDocument.getElementById('certificate-portal-slot'));
      }
      return portalContainer !== null;
    };
    
    if (tryFind()) return;
    const interval = setInterval(() => { if (tryFind()) clearInterval(interval); }, 500);
    return () => clearInterval(interval);
  }, []);

  if (!portalContainer) return null;

  return createPortal(
    <div className="p-4 border-t border-gray-100 mt-2">
      <h4 className="text-[11px] font-bold text-gray-400 uppercase mb-3 text-center">আপনার রোপণ সনদ</h4>
      <CertificateCard 
        treeName="আম গাছ (Mango Tree)"
        location="কুড়িগ্রাম সদর"
        date={new Date().toLocaleDateString('bn-BD')}
        co2Value="৪৫.৬"
      />
    </div>,
    portalContainer
  );
}
