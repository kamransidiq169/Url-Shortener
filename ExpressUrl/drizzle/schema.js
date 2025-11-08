
import { relations, sql } from 'drizzle-orm';
import { text } from 'drizzle-orm/gel-core';
import { mysqlTable, serial, varchar, timestamp, int, boolean, bigint, mysqlEnum } from 'drizzle-orm/mysql-core';


export const users = mysqlTable('RegisterUsers', {
  id: serial('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  isEmailVerified: boolean('is_email_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull()
});

export const oauthAccountsTable = mysqlTable("oauth_accounts",{
  id:int("id").autoincrement().primaryKey(),
  userId:int('user_id').notNull().references(()=>users.id,{onDelete:"cascade"}),
  password: varchar('password', { length: 255 }).default(sql`NULL`),
  provider:mysqlEnum("provider",["google","github"]).notNull(),
  providerAccountId:varchar("provider_account_id",{length:255}).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
export const passwordResetTokenTable = mysqlTable("password_reset_tokens", {
  id: int().autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at").default(sql`(CURRENT_TIMESTAMP + INTERVAL 1 HOUR)`).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const verifyEmailTokensTable = mysqlTable("is_email_valid", {
  id: int().autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").default(sql`(CURRENT_TIMESTAMP + INTERVAL 1 DAY)`).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const sessionsData = mysqlTable("sessions", {
  id: serial('id').primaryKey().autoincrement(),
  userId: bigint("user_id", {}).notNull().references(() => users.id, { onDelete: "cascade" }),
  valid: boolean().default(true).notNull(),
  userAgent: text("user_agent"), // is sai pata chalega ki user ne kis operating system mai login e.g windows etc
  ip: varchar({ length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export const shortLinks = mysqlTable("ShortLinks", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 500 }).notNull(),
  shortcode: varchar("shortcode", { length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  userId: int("users_id").notNull().references(() => users.id)
});

// A user can have many shortlinks

export const usersRelation = relations(users, ({ many }) => ({
  shortlink: many(shortLinks),
  session: many(sessionsData)
}))

// Shortlink belong to one user

export const shortlinkRelation = relations(shortLinks, ({ one }) => ({
  user: one(users, {
    fields: [shortLinks.userId], //foreign key
    references: [users.id], // primary key
  })
}))

export const sessionRelation = relations(sessionsData, ({ one }) => ({
  user: one(users, {
    fields: [sessionsData.userId],
    references: [users.id]
  })
}))