import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@pmis/ui/components/ui/card';
import { Button } from '@pmis/ui/components/ui/button';
import { Input } from '@pmis/ui/components/ui/input';
import { Label } from '@pmis/ui/components/ui/label';
import { offlineDb, queueSync } from '@/lib/db';
import { syncManager } from '@/lib/sync';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function MonitoringDashboard() {
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    loadVisits();
  }, []);

  useEffect(() => {
    if (isOnline) syncManager.sync();
  }, [isOnline]);

  const loadVisits = async () => {
    try {
      if (isOnline) {
        const data = await (await import('@/lib/api')).api.monitoring.list();
        setVisits(data);
        await offlineDb.monitoringVisits.clear();
        await offlineDb.monitoringVisits.bulkAdd(data.map((v: any) => ({ ...v, _status: 'synced' as const })));
      } else {
        const local = await offlineDb.monitoringVisits.toArray();
        setVisits(local);
      }
    } catch (err) {
      console.error('Failed to load visits:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      plantationId: formData.get('plantationId') as string,
      healthScore: formData.get('healthScore') ? parseFloat(formData.get('healthScore') as string) : null,
      survivalRate: formData.get('survivalRate') ? parseFloat(formData.get('survivalRate') as string) : null,
      notes: formData.get('notes') as string,
      officerId: 'officer-1',
    };

    const tempId = `temp-${Date.now()}`;
    const newVisit = { ...data, id: tempId, _status: 'pending' as const };

    await offlineDb.monitoringVisits.add(newVisit);
    await queueSync('monitoring', tempId, 'create', newVisit);
    setVisits([newVisit, ...visits]);
    setShowForm(false);
    
    if (isOnline) syncManager.sync();
  };

  return (
    <div style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#006A4E' }}>Monitoring Visits</h1>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {isOnline ? 'Online' : 'Offline'} | {visits.length} visits
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Visit'}
        </Button>
      </div>

      {showForm && (
        <Card style={{ marginBottom: '16px' }}>
          <CardHeader>
            <CardTitle>New Monitoring Visit</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <Label htmlFor="plantationId">Plantation ID *</Label>
                <Input id="plantationId" name="plantationId" required />
              </div>
              <div>
                <Label htmlFor="healthScore">Health Score (0-100)</Label>
                <Input id="healthScore" name="healthScore" type="number" min="0" max="100" />
              </div>
              <div>
                <Label htmlFor="survivalRate">Survival Rate (%)</Label>
                <Input id="survivalRate" name="survivalRate" type="number" min="0" max="100" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" name="notes" />
              </div>
              <Button type="submit" style={{ gridColumn: '1 / -1' }}>
                {isOnline ? 'Save Visit' : 'Save Offline (will sync)'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {visits.length === 0 && (
            <Card>
              <CardContent style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                No monitoring visits recorded yet. Click "New Visit" to add one.
              </CardContent>
            </Card>
          )}
          {visits.map((visit) => (
            <Card key={visit.id}>
              <CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Plantation: {visit.plantationId}</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      Health: {visit.healthScore || 'N/A'} | Survival: {visit.survivalRate || 'N/A'}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>{visit.notes || 'No notes'}</div>
                    <div style={{ fontSize: '12px', color: visit._status === 'pending' ? '#D90429' : '#006A4E', marginTop: '4px' }}>
                      {visit.id} {visit._status === 'pending' ? '(Pending Sync)' : ''}
                    </div>
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
