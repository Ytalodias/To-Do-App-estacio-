import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

export const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    await db.connect();
    console.log("✅ Conectado ao PostgreSQL Render!");
  } catch (err) {
    console.error("Erro ao conectar ao banco:", err);
  }
})();
