
// import { defineConfig } from 'drizzle-kit';

// export default defineConfig({
//   out: './drizzle',
//   schema: './drizzle/schema.js',
//   dialect: 'mysql',
//   dbCredentials: {
//     url: process.env.DATABASE_URL,
//   },
// });
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './drizzle/schema.js',       // ✅ ya .ts if you're using TypeScript
  out: './drizzle',
  dialect: 'mysql',                    // ✅ REQUIRED — must be 'mysql'                   // ✅ REQUIRED — must be 'mysql' (not 'mysql2')
  dbCredentials: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});