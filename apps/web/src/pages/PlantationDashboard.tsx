import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@pmis/ui/components/ui/card';
import { Button } from '@pmis/ui/components/ui/button';
import { Input } from '@pmis/ui/components/ui/input';
import { Label } from '@pmis/ui/components/ui/label';
import { offlineDb, queueSync } from '@/lib/db';
import { syncManager } from '@/lib/sync';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function PlantationDashboard() {
  const [plantations, setPlantations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    loadPlantations();
  }, []);

  useEffect(() => {
    if (isOnline) syncManager.sync();
  }, [isOnline]);

  const loadPlantations = async () => {
    try {
      if (isOnline) {
        const data = await (await import('@/lib/api')).api.plantations.list();
        setPlantations(data);
        await offlineDb.plantations.clear();
        await offlineDb.plantations.bulkAdd(data.map((p: any) => ({ ...p, _status: 'synced' as const })));
      } else {
        const local = await offlineDb.plantations.toArray();
        setPlantations(local);
      }
    } catch (err) {
      console.error('Failed to load plantations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      farmerId: formData.get('farmerId') as string,
      speciesId: formData.get('speciesId') as string,
      variety: formData.get('variety') as string,
      area: formData.get('area') ? parseFloat(formData.get('area') as string) : null,
      status: formData.get('status') as any,
      officerId: 'officer-1',
    };

    const tempId = `temp-${Date.now()}`;
    const newPlantation = { ...data, id: tempId, _status: 'pending' as const };

    await offlineDb.plantations.add(newPlantation);
    await queueSync('plantations', tempId, 'create', newPlantation);
    setPlantations([newPlantation, ...plantations]);
    setShowForm(false);
    
    if (isOnline) syncManager.sync();
  };

  return (
    <div style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#006A4E' }}>Plantation Registry</h1>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {isOnline ? 'Online' : 'Offline'} | {plantations.length} plantations
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Plantation'}
        </Button>
      </div>

      {showForm && (
        <Card style={{ marginBottom: '16px' }}>
          <CardHeader>
            <CardTitle>New Plantation Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <Label htmlFor="farmerId">Farmer ID *</Label>
                <Input id="farmerId" name="farmerId" required />
              </div>
              <div>
                <Label htmlFor="speciesId">Species *</Label>
                <Input id="speciesId" name="speciesId" defaultValue="Mango" required />
              </div>
              <div>
                <Label htmlFor="variety">Variety *</Label>
                <Input id="variety" name="variety" defaultValue="Amrapali" required />
              </div>
              <div>
                <Label htmlFor="area">Area (hectares)</Label>
                <Input id="area" name="area" type="number" step="0.01" />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select id="status" name="status" defaultValue="planned"
                  style={{ height: '40px', padding: '0 12px', borderRadius: '6px', border: '1px solid #d1d5db', width: '100%' }}>
                  <option value="planned">Planned</option>
                  <option value="active">Active</option>
                  <option value="dormant">Dormant</option>
                  <option value="harvested">Harvested</option>
                </select>
              </div>
              <Button type="submit" style={{ gridColumn: '1 / -1' }}>
                {isOnline ? 'Save Plantation' : 'Save Offline (will sync)'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {plantations.length === 0 && (
            <Card>
              <CardContent style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                No plantations registered yet. Click "New Plantation" to add one.
              </CardContent>
            </Card>
          )}
          {plantations.map((plantation) => (
            <Card key={plantation.id}>
              <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{plantation.speciesId} - {plantation.variety}</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Farmer: {plantation.farmerId}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    Area: {plantation.area || 'N/A'} ha | Status: {plantation.status}
                  </div>
                  <div style={{ fontSize: '12px', color: plantation._status === 'pending' ? '#D90429' : '#006A4E', marginTop: '4px' }}>
                    {plantation.id} {plantation._status === 'pending' ? '(Pending Sync)' : ''}
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
