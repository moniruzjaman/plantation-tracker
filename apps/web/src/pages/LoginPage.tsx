import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@pmis/ui/components/ui/card';
import { Button } from '@pmis/ui/components/ui/button';
import { Input } from '@pmis/ui/components/ui/input';
import { Label } from '@pmis/ui/components/ui/label';

interface LoginPageProps {
  onLogin: (user: { name: string; role: string }) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Demo login - in production this would call the API
    if (email && password) {
      const role = email.includes('admin') ? 'admin' : email.includes('officer') ? 'officer' : 'field_officer';
      onLogin({ name: email.split('@')[0], role });
    } else {
      setError('Please enter email and password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #006A4E 0%, #005a42 100%)', padding: '16px'
    }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <CardHeader style={{ textAlign: 'center' }}>
          <CardTitle style={{ color: '#006A4E', fontSize: '24px' }}>PMIS V2 Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="officer@da.gov.bd" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {error && <div style={{ color: '#D90429', fontSize: '14px' }}>{error}</div>}
            <Button type="submit" style={{ width: '100%' }}>Login</Button>
            <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
              Demo: Use any email/password to login
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
