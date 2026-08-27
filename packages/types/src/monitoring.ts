export interface MonitoringVisitInput {
  plantationId: string;
  latitude: number | null;
  longitude: number | null;
  healthScore: number | null;
  survivalRate: number | null;
  notes: string;
  measurements: Omit<Measurement, 'id' | 'visitId'>[];
}

export interface MonitoringStats {
  totalVisits: number;
  averageHealthScore: number;
  averageSurvivalRate: number;
  lastVisitDate: string | null;
}

export interface PlantationHealthTrend {
  date: string;
  healthScore: number;
  survivalRate: number;
}

export interface OfficerStats {
  assignments: number;
  visits: number;
  overdue: number;
  gpsCompliance: number;
}
