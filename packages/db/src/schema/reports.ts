import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const reports = sqliteTable('reports', {
  id: text('id').primaryKey(),
  type: text('type', { enum: ['weekly', 'monthly', 'species', 'officer', 'district'] }).notNull(),
  title: text('title').notNull(),
  data: text('data', { mode: 'json' }).notNull(),
  generatedAt: text('generated_at').notNull().default(new Date().toISOString()),
  generatedBy: text('generated_by').notNull().references(() => users.id),
});

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
