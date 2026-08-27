import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@pmis/ui/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@pmis/ui/components/ui/tabs';
import { Button } from '@pmis/ui/components/ui/button';

export function AdminDashboard() {
  const [stats, setStats] = useState({ totalFarmers: 0, totalPlantations: 0, totalVisits: 0, totalUsers: 0 });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // In production, fetch from API
      setStats({
        totalFarmers: 0,
        totalPlantations: 0,
        totalVisits: 0,
        totalUsers: 0
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  return (
    <div style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#006A4E', marginBottom: '16px' }}>Admin Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <CardContent style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#006A4E' }}>{stats.totalFarmers}</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Farmers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#006A4E' }}>{stats.totalPlantations}</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Plantations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#006A4E' }}>{stats.totalVisits}</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Visits</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#006A4E' }}>{stats.totalUsers}</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Users</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {activeTab === 'overview' && (
            <div style={{ padding: '16px 0', color: '#6b7280' }}>
              <p>PMIS V2 Admin Dashboard - Overview</p>
              <p style={{ marginTop: '8px' }}>System operational. All modules ready for deployment.</p>
            </div>
          )}
          {activeTab === 'users' && (
            <div style={{ padding: '16px 0', color: '#6b7280' }}>
              <p>User management interface coming soon.</p>
            </div>
          )}
          {activeTab === 'reports' && (
            <div style={{ padding: '16px 0', color: '#6b7280' }}>
              <p>Report generation interface coming soon.</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div style={{ padding: '16px 0', color: '#6b7280' }}>
              <p>System settings interface coming soon.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
