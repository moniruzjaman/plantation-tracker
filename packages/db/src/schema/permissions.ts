import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const permissions = sqliteTable('permissions', {
  id: text('id').primaryKey(),
  roleId: text('role_id').notNull().references(() => roles.id),
  resource: text('resource').notNull(),
  action: text('action').notNull(),
});

export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;
