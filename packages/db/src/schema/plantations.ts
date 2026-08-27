import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

export const plantations = sqliteTable('plantations', {
  id: text('id').primaryKey(),
  farmerId: text('farmer_id').notNull().references(() => farmers.id),
  speciesId: text('species_id').notNull().references(() => species.id),
  variety: text('variety').notNull(),
  latitude: real('latitude'),
  longitude: real('longitude'),
  polygon: text('polygon', { mode: 'json' }),
  area: real('area'),
  status: text('status', { enum: ['planned', 'active', 'dormant', 'harvested'] }).notNull().default('planned'),
  plantedAt: text('planted_at'),
  officerId: text('officer_id').notNull().references(() => users.id),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
});

export type Plantation = typeof plantations.$inferSelect;
export type NewPlantation = typeof plantations.$inferInsert;
