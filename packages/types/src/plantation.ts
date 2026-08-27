export interface Farmer {
  id: string;
  name: string;
  mobile: string;
  division: string;
  district: string;
  upazila: string;
  union: string;
  village: string;
  latitude: number | null;
  longitude: number | null;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Species {
  id: string;
  name: string;
  nameBn: string;
  category: string;
  varieties: string[];
}

export interface Plantation {
  id: string;
  farmerId: string;
  speciesId: string;
  variety: string;
  latitude: number | null;
  longitude: number | null;
  polygon: [number, number][] | null;
  area: number | null;
  status: 'planned' | 'active' | 'dormant' | 'harvested';
  plantedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MonitoringVisit {
  id: string;
  plantationId: string;
  officerId: string;
  latitude: number | null;
  longitude: number | null;
  healthScore: number | null;
  survivalRate: number | null;
  notes: string;
  photos: string[];
  measurements: Measurement[];
  createdAt: string;
}

export interface Measurement {
  id: string;
  visitId: string;
  type: 'height' | 'dbh' | 'canopy' | 'ndvi';
  value: number;
  unit: string;
  notes: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  type: 'weekly' | 'monthly' | 'species' | 'officer' | 'district';
  title: string;
  data: Record<string, unknown>;
  generatedAt: string;
  generatedBy: string;
}
