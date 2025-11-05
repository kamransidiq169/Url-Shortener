
// import { int, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';
// export const usersTable = mysqlTable('users_table', {
//   id: serial().primaryKey(),
//   name: varchar({ length: 255 }).notNull(),
//   age: int().notNull(),
//   email: varchar({ length: 255 }).notNull().unique(),
// });
// import { mysqlTable, serial, varchar,timestamp } from 'drizzle-orm/mysql-core';
// export const users = mysqlTable('RegisterUsers', {
//   id: serial('id').primaryKey(),
//   name: varchar('name', { length: 255 }).notNull(),
//   email: varchar('email', { length: 255 }).notNull().unique(),
//   password: varchar('password', { length: 255 }).notNull(),
//   createdAt: timestamp('created_at').defaultNow().notNull(),
//   updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull()
// });