import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@pmis/ui/components/ui/card';
import { Button } from '@pmis/ui/components/ui/button';
import { Input } from '@pmis/ui/components/ui/input';
import { Label } from '@pmis/ui/components/ui/label';
import { api, apiFetch } from '@/lib/api';
import { offlineDb, queueSync } from '@/lib/db';
import { syncManager } from '@/lib/sync';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function FarmerDashboard() {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    loadFarmers();
  }, []);

  useEffect(() => {
    if (isOnline) syncManager.sync();
  }, [isOnline]);

  const loadFarmers = async () => {
    try {
      if (isOnline) {
        const data = await api.farmers.list();
        setFarmers(data);
        await offlineDb.farmers.clear();
        await offlineDb.farmers.bulkAdd(data.map((f: any) => ({ ...f, _status: 'synced' as const })));
      } else {
        const local = await offlineDb.farmers.toArray();
        setFarmers(local);
      }
    } catch (err) {
      console.error('Failed to load farmers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name') as string,
      mobile: formData.get('mobile') as string,
      division: formData.get('division') as string,
      district: formData.get('district') as string,
      upazila: formData.get('upazila') as string,
      union: formData.get('union') as string,
      village: formData.get('village') as string,
    };

    const tempId = `temp-${Date.now()}`;
    const newFarmer = { ...data, id: tempId, _status: 'pending' as const };

    await offlineDb.farmers.add(newFarmer);
    await queueSync('farmers', tempId, 'create', newFarmer);
    setFarmers([newFarmer, ...farmers]);
    setShowForm(false);
    
    if (isOnline) syncManager.sync();
  };

  return (
    <div style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#006A4E' }}>Farmer Registry</h1>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {isOnline ? 'Online' : 'Offline'} | {farmers.length} farmers
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Register Farmer'}
        </Button>
      </div>

      {showForm && (
        <Card style={{ marginBottom: '16px' }}>
          <CardHeader>
            <CardTitle>New Farmer Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input id="mobile" name="mobile" type="tel" required />
              </div>
              <div>
                <Label htmlFor="division">Division</Label>
                <Input id="division" name="division" defaultValue="Dhaka" />
              </div>
              <div>
                <Label htmlFor="district">District *</Label>
                <Input id="district" name="district" required />
              </div>
              <div>
                <Label htmlFor="upazila">Upazila *</Label>
                <Input id="upazila" name="upazila" required />
              </div>
              <div>
                <Label htmlFor="union">Union *</Label>
                <Input id="union" name="union" required />
              </div>
              <div>
                <Label htmlFor="village">Village *</Label>
                <Input id="village" name="village" required />
              </div>
              <Button type="submit" style={{ gridColumn: '1 / -1' }}>
                {isOnline ? 'Save Farmer' : 'Save Offline (will sync)'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {farmers.length === 0 && (
            <Card>
              <CardContent style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                No farmers registered yet. Click "Register Farmer" to add one.
              </CardContent>
            </Card>
          )}
          {farmers.map((farmer) => (
            <Card key={farmer.id}>
              <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{farmer.name}</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>{farmer.mobile}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {farmer.village}, {farmer.union}, {farmer.upazila}, {farmer.district}
                  </div>
                  <div style={{ fontSize: '12px', color: farmer._status === 'pending' ? '#D90429' : '#006A4E', marginTop: '4px' }}>
                    {farmer.id} {farmer._status === 'pending' ? '(Pending Sync)' : ''}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
