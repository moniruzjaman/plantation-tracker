export interface AuditLogEntry {
  log_id: string;
  entity: 'submission' | 'site' | 'plant' | 'personnel';
  entity_id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SYNC' | 'APPROVE' | 'REJECT';
  user_id: string;
  user_name: string;
  device: string;
  gps: { latitude: number; longitude: number } | null;
  old_value?: string;
  new_value?: string;
  timestamp: string;
}

export type ValidationDecision = 'pending' | 'approved' | 'rejected';

export interface ValidationTaskRecord {
  task_id: string;
  submission_id: string;
  site_id: string;
  saao_id?: string;
  saao_name?: string;
  assigned_date: string;
  due_date?: string;
  decision: ValidationDecision;
  remarks?: string;
  decided_at?: string;
}

export interface CarbonHistoryEntry {
  history_id: string;
  site_id: string;
  date: string;
  carbon_tons: number;
  method: 'ndvi_derived' | 'biomass_equation' | 'species_allometric';
}

export interface NotificationRecord {
  notification_id: string;
  recipient_id: string;
  role: string;
  title: string;
  message: string;
  status: 'unread' | 'read';
  created_at: string;
  read_at?: string;
}
