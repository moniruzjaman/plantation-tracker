import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const farmers = sqliteTable('farmers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  mobile: text('mobile').notNull(),
  division: text('division').notNull(),
  district: text('district').notNull(),
  upazila: text('upazila').notNull(),
  union: text('union').notNull(),
  village: text('village').notNull(),
  latitude: real('latitude'),
  longitude: real('longitude'),
  documents: text('documents', { mode: 'json' }),
  officerId: text('officer_id').notNull().references(() => users.id),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
});

export type Farmer = typeof farmers.$inferSelect;
export type NewFarmer = typeof farmers.$inferInsert;
