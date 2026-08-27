import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  entity: text('entity').notNull(),
  entityId: text('entity_id').notNull(),
  action: text('action').notNull(),
  userId: text('user_id').references(() => users.id),
  userName: text('user_name'),
  device: text('device'),
  gps: text('gps'),
  oldValue: text('old_value'),
  newValue: text('new_value'),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
