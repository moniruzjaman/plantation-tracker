import { ConflictResolution } from './types';

export function resolveConflict(
  serverRecord: Record<string, unknown>,
  clientRecord: Record<string, unknown>,
  strategy: 'server_wins' | 'client_wins' | 'merge' = 'server_wins'
): ConflictResolution {
  let winner: Record<string, unknown>;
  let loser: Record<string, unknown>;

  switch (strategy) {
    case 'client_wins':
      winner = clientRecord;
      loser = serverRecord;
      break;
    case 'merge':
      winner = { ...serverRecord, ...clientRecord };
      loser = { ...serverRecord };
      break;
    case 'server_wins':
    default:
      winner = serverRecord;
      loser = clientRecord;
      break;
  }

  return {
    strategy,
    winner,
    loser,
    resolvedAt: new Date().toISOString()
  };
}

export function detectConflict(server: Record<string, unknown>, client: Record<string, unknown>): boolean {
  const serverUpdated = server.updatedAt as string;
  const clientUpdated = client.updatedAt as string;

  if (!serverUpdated || !clientUpdated) return false;

  return new Date(serverUpdated) < new Date(clientUpdated);
}