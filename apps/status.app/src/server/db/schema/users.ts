import {
  boolean,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export const Users = pgTable('users', {
  id: serial('id').primaryKey(),
  contributorId: varchar('contributor_id', { length: 12 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  canManageAdmin: boolean('can_manage_admin').notNull().default(false),
  canEditInsights: boolean('can_edit_insights').notNull().default(false),
  canEditKeycard: boolean('can_edit_keycard').notNull().default(false),
  canViewInsights: boolean('can_view_insights').notNull().default(false),
  canViewKeycard: boolean('can_view_keycard').notNull().default(false),
  canEditReports: boolean('can_edit_reports').notNull().default(false),
})

export type User = typeof Users.$inferSelect
