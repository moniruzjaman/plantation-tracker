import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

export const diagnosisRecords = sqliteTable('diagnosis_records', {
  id: text('id').primaryKey(),
  plantationId: text('plantation_id').notNull().references(() => plantations.id),
  photoUrl: text('photo_url').notNull(),
  symptoms: text('symptoms', { mode: 'json' }).notNull(),
  disease: text('disease').notNull(),
  confidence: real('confidence').notNull(),
  treatment: text('treatment', { mode: 'json' }).notNull(),
  prevention: text('prevention', { mode: 'json' }).notNull(),
  provider: text('provider').notNull(),
  officerId: text('officer_id').notNull().references(() => users.id),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
});

export type DiagnosisRecord = typeof diagnosisRecords.$inferSelect;
export type NewDiagnosisRecord = typeof diagnosisRecords.$inferInsert;
