import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

export const satelliteSnapshots = sqliteTable('satellite_snapshots', {
  id: text('id').primaryKey(),
  plantationId: text('plantation_id').notNull().references(() => plantations.id),
  ndvi: real('ndvi').notNull(),
  evi: real('evi').notNull(),
  ndwi: real('ndwi').notNull(),
  capturedAt: text('captured_at').notNull(),
  source: text('source').notNull().default('sentinel-2'),
});

export type SatelliteSnapshot = typeof satelliteSnapshots.$inferSelect;
export type NewSatelliteSnapshot = typeof satelliteSnapshots.$inferInsert;
