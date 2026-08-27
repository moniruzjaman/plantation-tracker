import { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { PlantationDashboard } from './pages/PlantationDashboard';
import { MonitoringDashboard } from './pages/MonitoringDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { NetworkStatus } from './components/NetworkStatus';
import { PWAInstaller } from './components/PWAInstaller';

type Page = 'login' | 'farmers' | 'plantations' | 'monitoring' | 'admin';

export default function App() {
  const [page, setPage] = useState<Page>('login');
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  if (!user) {
    return <LoginPage onLogin={(u) => { setUser(u); setPage('farmers'); }} />;
  }

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: '#006A4E', padding: '12px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
          PMIS V2 - KrishiAI
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ color: 'white', fontSize: '14px' }}>{user.name} ({user.role})</span>
          <button onClick={() => { setUser(null); setPage('login'); }}
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>
      
      <div style={{ paddingTop: '60px', height: '100vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', gap: '8px', padding: '8px 16px', borderBottom: '1px solid #e5e7eb', background: 'white' }}>
          {[
            { id: 'farmers', label: 'Farmers' },
            { id: 'plantations', label: 'Plantations' },
            { id: 'monitoring', label: 'Monitoring' },
            { id: 'admin', label: 'Admin' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setPage(tab.id as Page)}
              style={{
                padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer',
                background: page === tab.id ? '#006A4E' : '#f3f4f6',
                color: page === tab.id ? 'white' : '#374151'
              }}>
              {tab.label}
            </button>
          ))}
        </div>
        
        {page === 'farmers' && <FarmerDashboard />}
        {page === 'plantations' && <PlantationDashboard />}
        {page === 'monitoring' && <MonitoringDashboard />}
        {page === 'admin' && <AdminDashboard />}
      </div>
      
      <NetworkStatus />
      <PWAInstaller />
    </div>
  );
}
