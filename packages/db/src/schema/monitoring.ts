import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

export const monitoringVisits = sqliteTable('monitoring_visits', {
  id: text('id').primaryKey(),
  plantationId: text('plantation_id').notNull().references(() => plantations.id),
  officerId: text('officer_id').notNull().references(() => users.id),
  latitude: real('latitude'),
  longitude: real('longitude'),
  healthScore: real('health_score'),
  survivalRate: real('survival_rate'),
  notes: text('notes'),
  photos: text('photos', { mode: 'json' }),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
});

export const visitMeasurements = sqliteTable('visit_measurements', {
  id: text('id').primaryKey(),
  visitId: text('visit_id').notNull().references(() => monitoringVisits.id),
  type: text('type', { enum: ['height', 'dbh', 'canopy', 'ndvi'] }).notNull(),
  value: real('value').notNull(),
  unit: text('unit').notNull(),
  notes: text('notes'),
});

export type MonitoringVisit = typeof monitoringVisits.$inferSelect;
export type NewMonitoringVisit = typeof monitoringVisits.$inferInsert;
export type VisitMeasurement = typeof visitMeasurements.$inferSelect;
export type NewVisitMeasurement = typeof visitMeasurements.$inferInsert;
