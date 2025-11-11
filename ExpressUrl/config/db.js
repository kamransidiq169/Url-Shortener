// import { drizzle } from "drizzle-orm/mysql2";
// ExpressUrl/config/db.js
// import { drizzle } from "drizzle-orm/mysql2";
// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// const poolConnection = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// export const db = drizzle(poolConnection);

// import { drizzle } from "drizzle-orm/mysql2";
// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// const connection = await mysql.createConnection(process.env.DATABASE_URL);
// export const db = drizzle(connection);
// ExpressUrl/config/db.js
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// ✅ Create a connection pool instead of a single connection
const pool = mysql.createPool(process.env.DATABASE_URL);

export const db = drizzle(pool);
