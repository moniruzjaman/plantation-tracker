import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const speciesCategories = sqliteTable('species_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nameBn: text('name_bn').notNull(),
});

export const species = sqliteTable('species', {
  id: text('id').primaryKey(),
  categoryId: text('category_id').notNull().references(() => speciesCategories.id),
  name: text('name').notNull(),
  nameBn: text('name_bn').notNull(),
  scientificName: text('scientific_name'),
  description: text('description'),
});

export const speciesVarieties = sqliteTable('species_varieties', {
  id: text('id').primaryKey(),
  speciesId: text('species_id').notNull().references(() => species.id),
  name: text('name').notNull(),
  nameBn: text('name_bn').notNull(),
});

export type SpeciesCategory = typeof speciesCategories.$inferSelect;
export type NewSpeciesCategory = typeof speciesCategories.$inferInsert;
export type Species = typeof species.$inferSelect;
export type NewSpecies = typeof species.$inferInsert;
export type SpeciesVariety = typeof speciesVarieties.$inferSelect;
export type NewSpeciesVariety = typeof speciesVarieties.$inferInsert;
