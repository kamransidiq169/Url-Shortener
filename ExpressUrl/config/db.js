// import { drizzle } from "drizzle-orm/mysql2";
// export const db = drizzle(process.env.DATABASE_URL);
// ExpressUrl/config/db.js
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const db = drizzle(poolConnection);