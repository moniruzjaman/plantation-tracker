import { describe, it, expect } from 'vitest';
import { resolveConflict, detectConflict } from './conflict-resolver';

describe('conflict-resolver', () => {
  it('server_wins returns server record', () => {
    const server = { name: 'Server', updatedAt: '2024-01-01T00:00:00Z' };
    const client = { name: 'Client', updatedAt: '2024-01-02T00:00:00Z' };
    const result = resolveConflict(server, client, 'server_wins');
    expect(result.winner).toEqual(server);
    expect(result.strategy).toBe('server_wins');
  });

  it('client_wins returns client record', () => {
    const server = { name: 'Server', updatedAt: '2024-01-01T00:00:00Z' };
    const client = { name: 'Client', updatedAt: '2024-01-02T00:00:00Z' };
    const result = resolveConflict(server, client, 'client_wins');
    expect(result.winner).toEqual(client);
    expect(result.strategy).toBe('client_wins');
  });

  it('detects conflict when client is newer', () => {
    const server = { updatedAt: '2024-01-01T00:00:00Z' };
    const client = { updatedAt: '2024-01-02T00:00:00Z' };
    expect(detectConflict(server, client)).toBe(true);
  });

  it('does not detect conflict when server is newer', () => {
    const server = { updatedAt: '2024-01-02T00:00:00Z' };
    const client = { updatedAt: '2024-01-01T00:00:00Z' };
    expect(detectConflict(server, client)).toBe(false);
  });
});
